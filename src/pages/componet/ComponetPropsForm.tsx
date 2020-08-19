import React from "react";
import {Form, Input, message, Modal, Select} from "antd";
import config from "../../config"
import api from "../../api";

const {Option} = Select;

interface IProps {
    onOk: Function
    onCancel: Function
    visible: boolean
    formData?: any,
    componetId: string
}

class ComponetPropsForm extends React.PureComponent<IProps> {

    formRef = React.createRef<any>();

    state = {
        confirmLoading: false,
    };


    private onOk = () => {
        const form = this.formRef.current;
        const {Id} = this.props.formData;
        form.validateFields().then(async () => {
            this.setState({
                confirmLoading: true,
            });
            if (Id) {
                await this.ComponentPropsUpdate();
                message.success('修改成功!');
            } else {
                await this.ComponentPropsCreate();
                message.success('创建成功!');
            }
            this.setState({
                confirmLoading: false
            });
            this.props.onOk();
        });
    };
    private onCancel = () => {
        this.props.onCancel();
    };

    private ComponentPropsUpdate = () => {
        const form = this.formRef.current;
        return api.ComponentPropsUpdate({
            Id: this.props.formData.Id,
            ...form.getFieldsValue()
        });
    };

    private ComponentPropsCreate = () => {
        const form = this.formRef.current;
        return api.ComponentPropsCreate({
            componentid: this.props.componetId,
            ...form.getFieldsValue()
        });
    };

    render() {
        const {formRef, props, onOk, onCancel} = this;
        const {confirmLoading} = this.state;
        const {formData = {}} = this.props;
        return (
            <Modal title={formData.id ? '添加组件分类' : '修改组件分类'}
                   confirmLoading={confirmLoading}
                   visible={props.visible}
                   onOk={onOk}
                   onCancel={onCancel}
                   maskClosable={false}
                   destroyOnClose={true}
            >
                <Form ref={formRef} initialValues={formData} labelCol={{span: 4}}>
                    <Form.Item label="属性名称" name={'title'} hasFeedback={true} rules={[{required: true, message: '请输入属性名称！'}]}>
                        <Input
                            disabled={confirmLoading}
                            placeholder="请输入属性名称"
                        />
                    </Form.Item>
                    <Form.Item label="属性Key" name={'Propkey'} hasFeedback={true} rules={[{required: true, message: '请输入属性Key！'}]}>
                        <Input
                            disabled={confirmLoading}
                            placeholder="请输入属性Key"
                        />
                    </Form.Item>
                    <Form.Item label="属性类型" name={'inputtype'} hasFeedback={true} rules={[{required: true, message: '请选择属性类型！'}]}>
                        <Select placeholder="请选择属性类型" disabled={confirmLoading}>
                            {
                                Object.values(config.componentPropsType).map((item) => (
                                    <Option value={item.value} key={item.value}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}


export default ComponetPropsForm;