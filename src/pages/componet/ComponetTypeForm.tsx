import React from "react";
import {Form, Input, Modal, message} from "antd";
import api from "../../api";

interface IProps {
    onOk: Function
    onCancel: Function
    visible: boolean
    formData?: any
}

class ComponetTypeForm extends React.PureComponent<IProps> {

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
            this.setState({
                confirmLoading: true,
            });
            if (Id) {
                await this.ComponentTypeUpdate();
                message.success('修改成功!');
            } else {
                await this.ComponentTypeCreate();
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

    private ComponentTypeUpdate = () => {
        const form = this.formRef.current;
        return api.ComponentTypeUpdate({
            Id: this.props.formData.Id,
            ...form.getFieldsValue()
        });
    };

    private ComponentTypeCreate = () => {
        const form = this.formRef.current;
        return api.ComponentTypeCreate({
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
                <Form ref={formRef} initialValues={formData}>
                    <Form.Item label="分类名称" name={'title'} hasFeedback={true} rules={[{required: true, message: '请输入分类名称！'}]}>
                        <Input
                            disabled={confirmLoading}

                            placeholder="请输入分类名称"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}


export default ComponetTypeForm;