import React from 'react'
import zhCN from 'antd/es/locale/zh_CN';
import {ConfigProvider} from "antd";
import {BrowserRouter} from "react-router-dom";
import {renderRoutes, RouteConfig} from "react-router-config";
import BasicLayout from '../layouts/BasicLayout'
import {asyncComponent} from "../utils/utils";
import NotFound from "../pages/home/not-found";
import EmptyLayout from "../layouts/EmptyLayout";

const Login = asyncComponent(() => import('../pages/login/index'));
const Home = asyncComponent(() => import('../pages/home/index'));

export const routes: RouteConfig[] = [
    {
        path: '/login',
        component: Login,
        exact: true
    },
    {
        path: '/',
        component: BasicLayout,
        routes: [
            {
                key: 'componet',
                path: '/componet',
                component: asyncComponent(() => import('../pages/componet/index')),
                exact: true,
                meta: {
                    title: '组件列表',
                    leftMenu: true,
                    isAuth: false,
                }
            },
            {
                key: 'componet_type',
                path: '/componet/type',
                component: asyncComponent(() => import('../pages/componet/componet-type')),
                exact: true,
                meta: {
                    title: '组件分类',
                    leftMenu: true,
                    isAuth: false,
                }
            },
            {
                key: 'componet_props',
                path: '/componet/props/:componetId',
                component: asyncComponent(() => import('../pages/componet/componet-props')),
                exact: true,
                meta: {
                    title: '属性列表',
                    leftMenu: false,
                    isAuth: false,
                }
            },
            {
                path: '/*',
                component: NotFound,
                exact: true,
                meta: {
                    notFound: true,
                    isAuth: false,
                }
            },
        ]
    },
];

const RouterMap = (props: any) => (
    <BrowserRouter basename="/">
        <ConfigProvider locale={zhCN}>
            {renderRoutes(routes, props)}
        </ConfigProvider>
    </BrowserRouter>
);

export default RouterMap;
