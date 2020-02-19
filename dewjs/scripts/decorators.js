const messegaDecorators = {
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
    }
};