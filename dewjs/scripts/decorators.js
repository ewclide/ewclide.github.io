const messegaDecorators = {
    simpleButton: (message) => `<span>${message}<span>`,

    blobButton: (message) => {
        const blobs = [];
        for (let i = 0; i < 4; i++) {
            blobs.push('<span class="blob-btn__blob"></span>')
        }

        return message +
        '<span class="blob-btn__inner">'+
            '<span class="blob-btn__blobs">'+
                blobs.join('\n')+
            '</span>'+
        '</span>'
    },

    arrowButton: (message) => {
        return ''+
        '<svg class="icon-arrow before">'+
            '<use xlink:href="#arrow"></use>'+
        '</svg>'+
        `<span class="label">${message}</span>`+
        '<svg class="icon-arrow after">'+
            '<use xlink:href="#arrow"></use>'+
        '</svg>';
    }
};