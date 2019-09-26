const {
    join,
} = require('path');
const fs = require('fs');

const defaultNo = 999;

String.prototype.trimLeft = function (charlist) {
    if (charlist === undefined)
        charlist = "\s";

    return this.replace(new RegExp("^[" + charlist + "]+"), "");
};

String.prototype.trimRight = function (charlist) {
    if (charlist === undefined)
        charlist = "\s";

    return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

const trimStr = str => {
    return str.trim().trimLeft('"').trimRight('"');
}

const readTitle = file => {
    const file_path = join(__dirname, ...file.path, file.title);
    const file_name = file.title.substring(0, file.title.length - 3)
    var title = ''
    try {
        const lines = fs.readFileSync(file_path, 'utf8').split('\n').map(l => l.trim());
        const headerLine = lines.find(l => /^#[^#].*$/.test(l));
        if (headerLine) {
            const match1 = headerLine.match(/^#(.*)/);
            if (match1)
                title = trimStr(match1[1]);
        }

        const titleLine = lines.find(l => /^title:.*$/.test(l));
        if (titleLine) {
            const match2 = titleLine.match(/^title:(.*)/);
            if (match2 && trimStr(match2[1]) != '')
                title = trimStr(match2[1]);
        }
    } catch (error) {
    }
    file.path.push(file_name)
    return [file.path.join('/'), title];
};

const readNoFromFile = file => {
    const file_path = file.type == 'file' ?
        join(__dirname, ...file.path, file.title) :
        join(__dirname, ...file.path, 'README.md')
    try {
        const lines = fs.readFileSync(file_path, 'utf8').split('\n').map(l => l.trim());
        const headerLine = lines.find(l => /^no:.*$/.test(l));
        const match = headerLine.match(/^no:(.*)/);
        if (!match) return defaultNo;
        return match[1].trim();
    } catch (error) {
        return defaultNo;
    }
}

const generateNode = path => {
    const items = []
    const pwd = join(__dirname, ...path)
    fs.readdirSync(pwd)
        .forEach(dir_name => {
            //file
            if (fs.statSync(join(pwd, dir_name)).isFile()) {
                if (!dir_name.endsWith('.md'))
                    return;
                var item = {
                    no: defaultNo,
                    path: [...path],
                    title: dir_name,
                    type: 'file',
                    children: null
                }
                item.no = readNoFromFile(item);
                items.push(item)

                //folder
            } else {
                const new_path = [...path]
                new_path.push(dir_name)
                const folder = {
                    no: defaultNo,
                    path: new_path,
                    title: dir_name,
                    type: 'folder',
                    children: generateNode(new_path)
                }
                folder.no = readNoFromFile(folder);
                items.push(folder)
            }
        })
    items.sort((a, b) => (a.no > b.no) ? 1 : -1)
    return items;
};

const generateBlogSideBar = nodes => {
    const items = []
    nodes.forEach(node => {
        if (node.type == 'file') {
            if (node.title.toLowerCase() == 'readme.md')
                return;
            items.push(readTitle(node));
        } else {
            const item = {
                title: node.title.trim('/'),
                collapsable: false,
                sidebarDepth: 1,
                children: generateBlogSideBar(node.children)
            };
            items.push(item);
        }
    });
    return items;
}

module.exports = {
    title: 'eureka',
    description: 'I see',
    base: '/',
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        nav: [ // 导航栏配置
            { text: 'post', link: '/post/' },
        ],
        sidebar:
        {
            '/post/': generateBlogSideBar(generateNode(['..', 'post'])),
            '/':[
                '/'
            ]
        },
        sidebarDepth: 1,
    }
};
