window.$docsify = {
    name: 'Dew.js',
    logo: './images/logo-inline.svg',
    repo: 'https://github.com/ewclide/dewjs',
    homepage: 'pages/index.md',
    coverpage: 'pages/cover.md',
    loadSidebar: 'pages/sidebar.md',
    auto2top: true,
    maxLevel: 3,
    subMaxLevel: 3,

    /* plugins */
    executeScript: true,
    // disqus: 'dewjs',
    search: {
        depth: 3,
        noData: 'nothing',
        placeholder: 'Search...'
    },

    /* rendering */
    markdown: { renderer: markdownRenderer }
}