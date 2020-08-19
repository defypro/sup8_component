let host: any = {
    'pro': 'http://localhost:3901',
    'uat': 'http://localhost:3001',
    'dev': 'http://localhost:3001',
};

let _apiUrl: any = {
    'pro': `${host['pro']}/`,
    'uat': `${host['uat']}/`,
    'dev': `${host['dev']}/`,
};

const {REACT_APP_ENV = 'dev'} = process.env;

export interface Store {
    [key: string]: any
}

export default {
    siteName: 'Sup8 Component',
    env: REACT_APP_ENV,
    apiURL: _apiUrl[REACT_APP_ENV],
    componentPropsType: {
        TEXT: {
            name: '文本',
            value: 'text'
        },
        UPLOAD_IMG: {
            name: '图片上传',
            value: 'uploadimg'
        },
        LINK: {
            name: '链接',
            value: 'link'
        },
        COLOR: {
            name: '颜色选择',
            value: 'color'
        },
        RICH_TEXT: {
            name: '富文本',
            value: 'richtext'
        },
        SELECT: {
            name: '下拉框',
            value: 'select'
        },
    },
}