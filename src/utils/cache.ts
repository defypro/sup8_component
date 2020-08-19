const _storage = window.localStorage;

class Cache {
    static setItem(k: string, v: any, t: number) {
        let seconds = t;
        let expire = 0;
        if (seconds > 0) {
            expire = new Date().getTime() + seconds * 1000;
        }
        _storage.setItem(k, JSON.stringify({
                value: v,
                expire
            })
        );
    }

    static getItem(k: string, _default: any = null) {
        const time = new Date().getTime();
        const valueItem = _storage.getItem(k);
        if (!valueItem) return _default;
        const {value, expire} = JSON.parse(valueItem);
        if (expire === 0 || expire > time) return value || _default;
        _storage.removeItem(k);
        return _default;
    }

    static removeItem(k: string) {
        _storage.removeItem(k);
    }
}


export default Cache;
