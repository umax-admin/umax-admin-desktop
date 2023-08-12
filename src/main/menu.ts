import {
    app,
    Menu,
    shell,
    BrowserWindow,
    MenuItemConstructorOptions,
} from 'electron';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
    selector?: string;
    submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

// 构建菜单
export default class MenuBuilder {
    mainWindow: BrowserWindow;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    // 判断是否是开发者模式还是 正式模式
    buildMenu(): Menu {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG_PROD === 'true'
        ) {
            this.setupDevelopmentEnvironment();
        }

        // 判断构建版本模式
        const template =
            process.platform === 'darwin'
                ? this.buildDarwinTemplate()
                : this.buildDefaultTemplate();
        // 通过模板构建
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
        return menu;
    }

    // 设置开发环境模式
    setupDevelopmentEnvironment(): void {
        this.mainWindow.webContents.on('context-menu', (_, props) => {
            const { x, y } = props;

            Menu.buildFromTemplate([
                {
                    label: 'Inspect element',
                    click: () => {
                        this.mainWindow.webContents.inspectElement(x, y);
                    },
                },
            ]).popup({ window: this.mainWindow });
        });
    }

    // 构建 mac 菜单
    buildDarwinTemplate(): MenuItemConstructorOptions[] {
        const subMenuAbout: DarwinMenuItemConstructorOptions = {
            label: 'Electron',
            submenu: [
                {
                    label: '关于',
                    selector: 'orderFrontStandardAboutPanel:',
                },
                { type: 'separator' },
                { label: '服务', submenu: [] },
                { type: 'separator' },
                {
                    label: '隐藏',
                    accelerator: 'Command+H',
                    selector: 'hide:',
                },
                {
                    label: '隐藏其他',
                    accelerator: 'Command+Shift+H',
                    selector: 'hideOtherApplications:',
                },
                { label: '显示所有', selector: 'unhideAllApplications:' },
                { type: 'separator' },
                {
                    label: '退出',
                    accelerator: 'Command+Q',
                    click: () => {
                        app.quit();
                    },
                },
            ],
        };
        const subMenuEdit: DarwinMenuItemConstructorOptions = {
            label: '编辑',
            submenu: [
                { label: '撤销', accelerator: 'Command+Z', selector: 'undo:' },
                { label: '重新开始', accelerator: 'Shift+Command+Z', selector: 'redo:' },
                { type: 'separator' },
                { label: '剪切', accelerator: 'Command+X', selector: 'cut:' },
                { label: '复制', accelerator: 'Command+C', selector: 'copy:' },
                { label: '粘贴', accelerator: 'Command+V', selector: 'paste:' },
                {
                    label: '选择所有',
                    accelerator: 'Command+A',
                    selector: 'selectAll:',
                },
            ],
        };
        //  调试模式构建
        const subMenuViewDev: MenuItemConstructorOptions = {
            label: 'View',
            submenu: [
                {
                    label: '重载',
                    accelerator: 'Command+R',
                    click: () => {
                        this.mainWindow.webContents.reload();
                    },
                },
                {
                    label: '全屏',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                    },
                },
                {
                    label: '打开调试模式',
                    accelerator: 'Alt+Command+I',
                    click: () => {
                        this.mainWindow.webContents.toggleDevTools();
                    },
                },
            ],
        };
        // 生产环境
        const subMenuViewProd: MenuItemConstructorOptions = {
            label: '视图',
            submenu: [
                {
                    label: '全屏',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                    },
                },
            ],
        };
        //  窗口模块
        const subMenuWindow: DarwinMenuItemConstructorOptions = {
            label: '窗口',
            submenu: [
                {
                    label: '最小化',
                    accelerator: 'Command+M',
                    selector: 'performMiniaturize:',
                },
                { label: '关闭', accelerator: 'Command+W', selector: 'performClose:' },
                { type: 'separator' },
                { label: 'Bring All to Front', selector: 'arrangeInFront:' },
            ],
        };
        // 帮助菜单
        const subMenuHelp: MenuItemConstructorOptions = {
            label: '帮助',
            submenu: [
                {
                    label: '学习更多',
                    click() {
                        shell.openExternal('https://umax-admin.github.io/umax-admin/');
                    },
                },


                {
                    label: '检查更新',
                    click() {
                        shell.openExternal('https://umax-admin.github.io/umax-admin/');
                    },
                },
            ],
        };

        const subMenuView =
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG_PROD === 'true'
                ? subMenuViewDev
                : subMenuViewProd;

        return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
    }

    // 构建默认菜单模板
    buildDefaultTemplate() {
        const templateDefault = [
            {
                label: '&File',
                submenu: [
                    {
                        label: '&Open',
                        accelerator: 'Ctrl+O',
                    },
                    {
                        label: '&Close',
                        accelerator: 'Ctrl+W',
                        click: () => {
                            this.mainWindow.close();
                        },
                    },
                ],
            },
            {
                label: '&View',
                submenu:
                    process.env.NODE_ENV === 'development' ||
                    process.env.DEBUG_PROD === 'true'
                        ? [
                            {
                                label: '&Reload',
                                accelerator: 'Ctrl+R',
                                click: () => {
                                    this.mainWindow.webContents.reload();
                                },
                            },
                            {
                                label: 'Toggle &Full Screen',
                                accelerator: 'F11',
                                click: () => {
                                    this.mainWindow.setFullScreen(
                                        !this.mainWindow.isFullScreen()
                                    );
                                },
                            },
                            {
                                label: 'Toggle &Developer Tools',
                                accelerator: 'Alt+Ctrl+I',
                                click: () => {
                                    this.mainWindow.webContents.toggleDevTools();
                                },
                            },
                        ]
                        : [
                            {
                                label: 'Toggle &Full Screen',
                                accelerator: 'F11',
                                click: () => {
                                    this.mainWindow.setFullScreen(
                                        !this.mainWindow.isFullScreen()
                                    );
                                },
                            },
                        ],
            },
            {
                label: '帮助',
                submenu: [
                    {
                        label: '学习更多',
                        click() {
                            shell.openExternal('https://umax-admin.github.io/umax-admin/');
                        },
                    },
                    {
                        label: '文档',
                        click() {
                            shell.openExternal(
                                'https://umax-admin.github.io/umax-admin/'
                            );
                        },
                    },
                    {
                        label: '讨论',
                        click() {
                            shell.openExternal('https://umax-admin.github.io/umax-admin/');
                        },
                    },
                    {
                        label: '查找问题点',
                        click() {
                            shell.openExternal('https://umax-admin.github.io/umax-admin/');
                        },
                    },
                ],
            },
        ];

        return templateDefault;
    }
}