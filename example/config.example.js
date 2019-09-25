module.exports = {
        title: 'eureka',
        description: 'EUREKA',
        themeConfig: {
                nav: [{
                                text: 'Algorithms',
                                link: '/algorithms/'
                        },
                        {
                                text: 'Nihongo',
                                link: '/nihongo/'
                        },
                        {
                                text: 'About',
                                link: '/about'
                        },
                        {
                                text: 'Github',
                                link: 'https://www.github.com/keaising'
                        },
                ],
                sidebar: {
                        '/algorithms/': [
                                {
                                        title: 'ALGS',
                                        collapsable: false,
                                        children: [
                                                '/algorithms/algs4-Eclipse',
                                                '/algorithms/algs4-windows',
                                        ]
                                }
                        ],
                        '/nihongo/': [
                                {
                                        title: "NIHONGO",
                                        collapsable: false,
                                        children: [
                                                ['/nihongo/algs4-windows','algs4'],
                                                ['/nihongo/WAS-error','error'],
                                        ]
                                }

                        ]
                }
        }
}