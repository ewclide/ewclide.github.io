function trimQuots(value) {
    const [, pureValue] = /^\s*'?(.+?)'?\s*$/.exec(value) || [];
    return pureValue;
}

const styleSheetManager = (() => {
    let isInline = false;

    const _makeInlineStyleSheets = async () => {
        if (isInline) return;
        isInline = true;

        const head = document.getElementsByTagName('head')[0];
        const { styleSheets } = document;

        for (const styleSheet of styleSheets) {
            const { href, ownerNode } = styleSheet;
            if (!href || href.indexOf(location.host) >= 0) continue;

            const response = await fetch(href);
            if (!response.ok) {
                console.error(`Couldn't prepare stylesheet "${href}"`);
                continue;
            }

            const body = await response.text();
            const tag = document.createElement('style');
            tag.innerText = body;

            ownerNode.insertAdjacentElement('afterend', tag);
            head.removeChild(ownerNode);
        }
    }

    const _findRuleIndices = (styleSheet, selectors, options, indices = []) => {
        if (Array.isArray(selectors)) {
            let result = [];
            for (const selector of selectors) {
                _findRuleIndices(styleSheet, selector, options, result);
            }

            return result;
        }

        const { once = true, whole = false } = options;
        const { cssRules } = styleSheet;
        let selector = selectors;
        let index = -1;

        for (const { selectorText } of cssRules) {
            index++;

            if (!selectorText) continue;
            if (!whole && selectorText.indexOf(selector) < 0) continue;
            if (whole && selectorText !== selector) continue;

            indices.push(index);

            if (once) break;
        }

        return indices.sort((p, n) => n - p);
    }

    const _removeByIndices = (styleSheet, indices) => {
        if (!indices.length) return;
        for (const index of indices) {
            styleSheet.deleteRule(index);
        }
    }

    const remove = async (selectors, options = {}) => {
        await _makeInlineStyleSheets();

        const { styleSheets } = document;
        let indices;

        for (const styleSheet of styleSheets) {
            indices = _findRuleIndices(styleSheet, selectors, options);
            _removeByIndices(styleSheet, indices);
        }
    }

    const rename = async () => {
        await _makeInlineStyleSheets();

        // code ...
    }

    return { remove, rename }
})();

const markdownRenderer = ((messegaDecorators = {}) => {
    const attrRegexp = /=/;
    const hrefRegexp = /(docsify:)?(.+)/;
    const callOriginal = (name, ...args) => window.$docsify.markdown.renderer.origin[name](...args);
    const stringifyAttribute = ({ name, value }) => typeof value === 'boolean' ? name : `${name}="${value}"`;
    const stringifyAttributes = (attrs) => attrs.map(stringifyAttribute).join(' ');
    const isAnchor = (href) => href[0] === '#';
    const prepareHref = (href) => isAnchor(href) ? `#/?id=${href.slice(1)}` : href;
    const prepareAttrs = (input, result = []) => {
        const attrs = input.split(',');

        for (const attr of attrs) {
            let [name, value] = attr.split('=');
            value = value !== undefined ? trimQuots(value) : true;
            result.push({ name, value });
        }

        return result;
    }

    const prepareMessage = (rawMessage) => {
        const found = /^@(\w+)\((.+?)\)$/.exec(rawMessage);
        if (!found) return rawMessage;

        const [, decoratorName, message] = found;
        const decorator = messegaDecorators[decoratorName];
        if (!decorator) {
            console.error(`Couldn't find decorator "${decoratorName}"`);
            return message;
        }

        return decorator(message);
    }

    const link = (inputHref, caption, message) => {
        const [, docsify, href] = hrefRegexp.exec(inputHref);
        if (docsify) {
            return callOriginal('link', href, caption, message);
        }

        const isAttrs = attrRegexp.test(caption);
        const attrs = [
            { name: 'href', value: prepareHref(href) }
        ];

        if (!isAnchor(href)) {
            attrs.push({ name: 'target', value: '_blank' });
        }

        if (isAttrs) {
            prepareAttrs(caption, attrs);
        } else {
            attrs.push({ name: 'title', value: caption });
        }

        return `<a ${stringifyAttributes(attrs)} rel="noopener">${prepareMessage(message)}</a>`;
    }

    const shellStartReg = /\s*\{(\w+\:)?((?:\w|-|,|=)+)?\}/g;
    const shellEndReg = /\s*\{\/(\w+)?\}/g;
    const whileExec = (regexp, message, handler) => {
        regexp.lastIndex = 0;
        while ((found = regexp.exec(message)) !== null) {
            handler(found.slice(1));
        }
    }

    const text = (message) => {
        const shellStart = shellStartReg.test(message);
        const shellEnd = shellEndReg.test(message);

        if (!shellStart && !shellEnd) return message;

        let result = '';
        if (shellStart) {
            whileExec(shellStartReg, message, (shell) => {
                const [tag = 'div:', rawAttrs = ''] = shell;
                const attrs = prepareAttrs(rawAttrs);
                result += `<${tag.slice(0, -1)} ${stringifyAttributes(attrs)}>`;
            });
        }

        if (shellEnd) {
            whileExec(shellEndReg, message, (shell) => {
                const [tag = 'div'] = shell;
                result += `</${tag}>`;
            });
        }

        return result;
    }

    return { link, text };
})(messegaDecorators);
