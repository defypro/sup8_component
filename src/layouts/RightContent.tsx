import React from "react";
import {Redirect} from "react-router";
import {matchRoutes, renderRoutes, RouteConfigComponentProps} from "react-router-config";
import {Breadcrumb} from "antd";
import styles from "./basicLayoutStyles.module.less";
import auth from '../utils/auth'

// class RightContent extends React.PureComponent<RouteConfigComponentProps> {
//     render() {
//         const {route = {routes: []}, location} = this.props;
//         const routes = route.routes || [];
//         const {route: matchRoute = {}} = matchRoutes(routes, location.pathname)[0] || {};
//         const {meta = {}} = matchRoute;
//         const isAuth = (meta.isAuth === undefined || meta.isAuth === true);
//         return (
//             (auth.isLogin() && isAuth) ? (
//                 <div style={meta.notFound ? {} : {padding: 24, background: '#fff'}}>
//                     <Breadcrumb>
//                         <Breadcrumb.Item>
//                             <span className={styles.pageTitle}>{meta.title}</span>
//                         </Breadcrumb.Item>
//                     </Breadcrumb>
//                     <div style={{marginTop: 20}}>
//                         {renderRoutes(routes)}
//                     </div>
//                 </div>
//             ) : <Redirect to={'/login'}/>
//         )
//     }
// }

const RightContent: React.FC<RouteConfigComponentProps> = (props) => {
    const {route = {routes: []}, location} = props;
    const routes = route.routes || [];
    const {route: matchRoute = {}} = matchRoutes(routes, location.pathname)[0] || {};
    const {meta = {}} = matchRoute;
    const isAuth = (meta.isAuth === undefined || meta.isAuth === true);
    return (
        <>
            {
                (!auth.isLogin() && isAuth) ?
                    <Redirect to={'/login'}/>
                    : (
                        <div style={meta.notFound ? {} : {padding: 24, background: '#fff'}}>
                            <Breadcrumb>
                                <Breadcrumb.Item>
                                    <span className={styles.pageTitle}>{meta.title}</span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{marginTop: 20}}>
                                {renderRoutes(routes)}
                            </div>
                        </div>
                    )
            }
        </>
    );
};

export default RightContent;