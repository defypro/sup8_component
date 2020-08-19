import React from 'react';
import {Menu, Layout, Dropdown, Avatar} from 'antd';
import {LockOutlined, LogoutOutlined, UserOutlined} from '@ant-design/icons';
import {RouteConfigComponentProps} from "react-router-config";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import styles from './basicLayoutStyles.module.less';
import LeftMenu from "./LeftMenu";
import RightContent from "./RightContent";
import auth from "../utils/auth";


NProgress.configure({showSpinner: false});
const {Header, Content} = Layout;

class BasicLayout extends React.PureComponent<RouteConfigComponentProps> {
    UNSAFE_componentWillMount() {
        NProgress.start();
    }

    UNSAFE_componentWillUpdate() {
        NProgress.start();
    }

    componentDidMount(): void {
        NProgress.done();
    }

    componentDidUpdate() {
        NProgress.done();
    }

    logout = () => {
        this.props.history.push('/login');
    };

    render() {
        const settingsMenu = <Menu>
            <Menu.Item className={styles.settingsMenu} onClick={this.logout}>
                <LogoutOutlined/>退出登录
            </Menu.Item>
        </Menu>;
        return (
            <Layout>
                <LeftMenu {...this.props} {...this.state}/>
                <Layout className={styles.mainContainer}>
                    <Header className={styles.header}>
                        <div className={styles.rightHeader}>
                            <Dropdown overlay={settingsMenu}>
                                <span className={styles.rightHeaderMenu}>
                                    {auth.getComponent().label}
                                </span>
                            </Dropdown>
                        </div>
                    </Header>
                    <Content style={{margin: "84px 16px 0", overflow: "hidden"}}>
                        <RightContent {...this.props} />
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default BasicLayout;
