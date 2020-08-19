import cache from '../utils/cache'

enum Enum {
    authorization = 'AUTHORIZATION',
    componentInfo = 'COMPONENT_INFO'
}

export const isLogin = function () {
    return !!cache.getItem(Enum.componentInfo);
};

export const setComponent = function (data: {}) {
    cache.setItem(Enum.componentInfo, data, 0);
};

export const getComponent = function () {
    return cache.getItem(Enum.componentInfo, {});
};

export default {
    isLogin,
    setComponent,
    getComponent
}