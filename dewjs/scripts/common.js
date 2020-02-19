function trimQuots(value) {
    const [, pureValue] = /^\s*'?(.+?)'?\s*$/.exec(value) || [];
    return pureValue;
}

const styleSheetManager = (() => {
    let prepared = false;

    const _prepareSheets = async () => {
        if (prepared) return;
        prepared = true;

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

    const _findRuleIndices = (styleSheet, selector, { once = true, whole = false }) => {
        const { cssRules } = styleSheet;
        const indices = [];
        let index = -1;

        for (const { selectorText } of cssRules) {
            index++;

            if (!selectorText) continue;
            if (!whole && selectorText.indexOf(selector) < 0) continue;
            if (whole && selectorText !== selector) continue;

            indices.push(index);

            if (once) break;
        }

        return indices;
    }

    const _removeByIndices = (styleSheet, indices) => {
        if (!indices.length) return;
        for (const index of indices) {
            styleSheet.deleteRule(index);
        }
    }

    const _remove = (selector, options) => {
        const { styleSheets } = document;
        let indices;

        for (const styleSheet of styleSheets) {
            indices = _findRuleIndices(styleSheet, selector, options);
            _removeByIndices(styleSheet, indices);
        }
    }

    const remove = async (selectors, options = {}) => {
        await _prepareSheets();

        const selectorsList = [].concat(selectors);
        for (const selector of selectorsList) {
            _remove(selector, options);
        }
    }

    return {
        remove
    }
})();

const markdownRenderer = ((messegaDecorators = {}) => {
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

    const attrRegexp = /=/;
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

    const link = (href, caption, message) => {
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

    const shellStartReg = /\s*\{((?:\w|-|,|=)+)?\:/g;
    const shellEndReg = /^\s*((?:\}|\n)+)\s*$/;

    const text = (message) => {
        console.log(message)
        const shellStart = shellStartReg.test(message);
        const shellEnd = shellEndReg.test(message);

        if (!shellStart && !shellEnd) return message;

        let result = '';
        let shell;

        if (shellStart) {
            shellStartReg.lastIndex = 0;
            while ((shell = shellStartReg.exec(message)) !== null) {
                const [, rawAttrs = ''] = shell;
                const attrs = prepareAttrs(rawAttrs);
                result += `<div ${stringifyAttributes(attrs)}>`;
            }
        }

        if (shellEnd) {
            const [, ends] = shellEndReg.exec(message);
            for (let i = 0; i < ends.length; i++) {
                if (ends[i] === '\n') continue;
                result += '</div>';
            }
        }

        return result;
    }

    return { link, text };
})(messegaDecorators);
