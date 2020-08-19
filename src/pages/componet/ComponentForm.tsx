import React from "react";
import {Form, Input, message, Modal, Select} from "antd";
import api from "../../api";

interface IProps {
    onOk: Function
    onCancel: Function
    visible: boolean,
    formData?: any,
    componentTypeList: any[]
}

class ComponentForm extends React.PureComponent<IProps> {

    formRef = React.createRef<any>();

    state: {
        confirmLoading: boolean,
    } = {
        confirmLoading: false,
    };

    private onOk = () => {
        const form = this.formRef.current;
        const {id} = this.props.formData;
        form.validateFields().then(async () => {
            this.setState({
                confirmLoading: true,
            });
            if (id) {
                await this.ComponentUpdate();
                message.success('修改成功!');
            } else {
                await this.ComponentCreate();
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

    private ComponentUpdate = () => {
        const form = this.formRef.current;
        return api.ComponentUpdate({
            id: this.props.formData.id,
            ...form.getFieldsValue()
        });
    };

    private ComponentCreate = () => {
        const form = this.formRef.current;
        return api.ComponentCreate({
            ...form.getFieldsValue()
        });
    };

    render() {
        const {formRef, props, onOk, onCancel} = this;
        const {confirmLoading,} = this.state;
        const {componentTypeList} = props;
        const {
            formData = {
                componentviewname: 'Comp',
            }
        } = this.props;
        return (
            <Modal
                title={formData.id ? '修改组件' : '添加组件'}
                confirmLoading={confirmLoading}
                visible={props.visible}
                onOk={onOk}
                onCancel={onCancel}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Form ref={formRef} labelCol={{span: 6}}
                      initialValues={formData}
                >
                    <Form.Item label="组件分类" name={'typeid'} hasFeedback={true} rules={[{required: true, message: '请选择组件分类！'}]}>
                        <Select disabled={confirmLoading}
                                showSearch
                                filterOption={(input: any, option: any) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                placeholder={`请选择组件分类`}>
                            {
                                componentTypeList.map(item => (
                                    <Select.Option disabled={confirmLoading} key={item.Id} value={item.Id}>{item.title}</Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="组件名称" name={'name'}
                               hasFeedback={true}
                               rules={[{required: true, message: '请输入组件名称！'}]}
                    >
                        <Input
                            disabled={confirmLoading}
                            placeholder="请输入组件名称"
                        />
                    </Form.Item>
                    <Form.Item label="组件视图" name={'componentviewname'} hasFeedback={true} rules={[{required: true, message: '请输入组件视图！'}]}>
                        <Input
                            disabled={confirmLoading}
                            placeholder="请输入组件视图"
                        />
                    </Form.Item>
                    <Form.Item label="属性编辑器视图" name={'componentpropviewname'} hasFeedback={true}>
                        <Input
                            disabled={confirmLoading}
                            placeholder="请输入属性编辑器视图(选填)"
                        />
                    </Form.Item>
                    <Form.Item label="组件源代码位置" name={'SrcPath'} hasFeedback={true} rules={[{required: true, message: '请输入组件源代码位置！'}]}>
                        <Input
                            disabled={confirmLoading}
                            placeholder="请输入组件源代码位置"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}


export default ComponentForm;