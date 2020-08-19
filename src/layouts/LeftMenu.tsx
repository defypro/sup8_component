import {RouteConfig, RouteConfigComponentProps} from "react-router-config";
import styles from "./basicLayoutStyles.module.less";
import config from "../config";
import {Layout, Menu} from "antd";
import {Link} from "react-router-dom";
import React, {useEffect, useState, useRef} from "react";

const {Sider} = Layout;

const createMenuItem = (routes: RouteConfig[]): React.ReactNode => {
    return routes.map((item: RouteConfig) => {
        if (!item.key || !item.meta.leftMenu) return;
        if (item.routes) {
            return <Menu.SubMenu title={item.meta.title} key={`${item.key}`}>
                {createMenuItem(item.routes)}
            </Menu.SubMenu>;
        }
        return <Menu.Item key={`${item.key}`}>
            <Link to={`${item.path}`} replace={true}>
                <span>{item.meta.title}</span>
            </Link>
        </Menu.Item>
    });
};

const getOpenKeys = (pathname: string, routes: RouteConfig[]): string[] => {
    let openKeys: string[] = [];
    routes.forEach((item: RouteConfig) => {
        if (item.routes) {
            const _openKeys = getOpenKeys(pathname, item.routes);
            if (_openKeys.length) {
                openKeys = [String(item.key), ..._openKeys]
            }
        } else {
            if (item.path === pathname && item.meta.leftMenu) {
                openKeys.push(String(item.key));
            }
        }
    });
    return openKeys;
};

const LeftMenu: React.FC<RouteConfigComponentProps> = (props) => {
    const {route = {}, location} = props;
    const routes = route.routes || [];
    const {pathname} = location;
    const [openKeys, setOpenKeys] = useState(getOpenKeys(pathname, routes));
    return (
        <Sider
            breakpoint="lg"
            collapsedWidth="0"
            style={{
                height: '100vh',
                position: 'fixed',
                left: 0,
                zIndex: 2
            }}
        >
            <div className={styles.logo}>
                <h1>{config.siteName}</h1>
            </div>
            <Menu theme="dark" mode="inline"
                  selectedKeys={openKeys}
                  openKeys={openKeys}
                  onOpenChange={(v) => {
                      setOpenKeys(v);
                  }}
                  onClick={(e) => {
                      setOpenKeys(e.keyPath);
                  }}
            >
                {createMenuItem(routes)}
            </Menu>
        </Sider>
    );
};

export default LeftMenu;