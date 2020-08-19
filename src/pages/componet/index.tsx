import React from 'react';
import TableData, {ILoadDataResult} from "../../components/TableData";
import {Button, Modal} from "antd";
import ComponentForm from "./ComponentForm";
import {RouteConfigComponentProps} from "react-router-config";
import api from "../../api";

class Component extends React.PureComponent<RouteConfigComponentProps> {
    $refs = {
        table: {} as TableData<any>
    };

    state = {
        isShowForm: false,
        row: {},
        componentTypeList: []
    };

    private loadData = async (params: any): Promise<ILoadDataResult> => {
        await this.getComponentTypeList();
        const {componentTypeList} = this.state;
        return new Promise((resolve) => {
            api.ComponentList(params).then(({result}) => {
                resolve({
                    columns: [
                        {
                            dataIndex: 'id',
                            title: '组件id'
                        },
                        {
                            dataIndex: ['ComponentTypeModel', 'title'],
                            title: '分类'
                        },
                        {
                            dataIndex: 'name',
                            title: '组件名称'
                        },
                        {
                            dataIndex: 'componentviewname',
                            title: '组件视图'
                        },
                        {
                            dataIndex: 'componentpropviewname',
                            title: '属性编辑器视图'
                        },
                        {
                            dataIndex: 'SrcPath',
                            title: '组件源代码位置'
                        },
                    ],
                    filter: [
                        {
                            title: '组件名称',
                            name: 'name',
                            type: 'text',
                        },
                        {
                            title: '组件分类',
                            name: 'typeid',
                            type: "select",
                            selectKey: 'Id',
                            selectName: 'title',
                            value: componentTypeList,
                        },
                    ],
                    dataSource: result.items,
                    total: result.total,
                });
            });
        });
    }

    private showForm = (row = {}) => {
        this.setState({
            isShowForm: !this.state.isShowForm,
            row
        }, () => {
            if (!this.state.isShowForm) this.$refs.table.refresh();
        });
    };

    private cancel = () => {
        this.setState({
            isShowForm: false,
        });
    }

    private actionRender(): (value: any, row: any, index: number) => React.ReactNode {
        return (value: any, row: any, index: number) => <>
            <Button onClick={() => {
                this.showForm(row);
            }} type="link">编辑</Button>
            <Button onClick={() => {
                this.props.history.push({pathname: `/componet/props/${row.id}`});
            }} type="link">属性列表</Button>
        </>;
    }

    componentDidMount() {
    }

    private getComponentTypeList = () => {
        const {componentTypeList} = this.state;
        if (componentTypeList.length === 0) {
            return api.ComponentTypeList({pageSize: 100}).then(({result}) => {
                this.setState({
                    componentTypeList: result.items,
                });
            });
        }
    };

    render() {
        const {state, loadData, showForm, cancel} = this;
        const {componentTypeList} = state;
        const tools = <>
            <Button type="primary" htmlType="button" onClick={() => showForm()}>添加组件</Button>
        </>;
        const {isShowForm, row} = this.state;
        return <>
            <ComponentForm formData={row} visible={isShowForm} componentTypeList={componentTypeList} onOk={showForm} onCancel={cancel}/>
            <TableData
                tools={tools}
                onRef={(ref: TableData<any>) => this.$refs.table = ref}
                loadData={loadData}
                actionRender={this.actionRender()}
            />
        </>;
    }
}

export default Component;
