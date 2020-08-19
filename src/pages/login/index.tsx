import React from 'react';
import styles from './style.module.less';
import {Form, Button, Select, Spin} from 'antd';
import {RouteConfigComponentProps} from "react-router-config";
import config from "../../config";
import debounce from 'lodash/debounce';
import api from '../../api'
import {setComponent} from '../../utils/auth'

const {Option} = Select;

class HorizontalLoginForm extends React.PureComponent<RouteConfigComponentProps> {
    constructor(props: RouteConfigComponentProps) {
        super(props);
        this.componentSearch = debounce(this.componentSearch, 800);
    }

    state: {
        loading: boolean,
        data: any[]
    } = {
        loading: false,
        data: []
    };
    formRef = React.createRef<any>();

    UNSAFE_componentWillMount(): void {
    }

    handleSubmit = (data: any) => {
        setComponent(data.enterprise);
        this.props.history.push('/componet');
    };

    componentSearch = (value: string) => {
        api.EnterpriseSearch({
            name: value
        }).then(({result}) => {
            this.setState({data: result, loading: false});
        });
    };

    onSearch = (value: string) => {
        if (!value) return;
        this.setState({data: [], loading: true});
        this.componentSearch(value);
    };

    render() {
        const {loading, data} = this.state;
        return (
            <div className={styles.form}>
                <p className={styles.loginTitle}>{config.siteName}</p>
                <Form ref={this.formRef} onFinish={this.handleSubmit}>
                    <Form.Item name="enterprise" rules={[{required: true, message: '请选择企业！'}]} hasFeedback={true}>
                        <Select
                            labelInValue
                            placeholder="请选择企业"
                            notFoundContent={loading ? <Spin size="small"/> : null}
                            filterOption={false}
                            onSearch={this.onSearch}
                            showSearch
                            // onChange={this.handleChange}
                        >
                            {
                                data.map(d => (
                                    <Option key={d.enterpriseno} value={d.enterpriseno}>{d.name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">进入</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default HorizontalLoginForm
