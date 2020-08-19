import React from 'react';
import TableData, {ILoadDataResult} from "../../components/TableData";
import {Button} from "antd";
import ComponetTypeForm from "./ComponetTypeForm";
import api from "../../api";

class ComponetType extends React.PureComponent {
    $refs = {
        table: {} as TableData<any>
    };

    state = {
        isShowForm: false,
        row: {}
    };

    private getComponentTypeData(params: any): Promise<ILoadDataResult> {
        return new Promise(resolve => {
            api.ComponentTypeList(params).then(({result}) => {
                resolve({
                    columns: [
                        {
                            dataIndex: 'Id',
                            title: '分类ID'
                        },
                        {
                            dataIndex: 'title',
                            title: '分类名称'
                        },
                    ],
                    dataSource: result.items,
                    total: result.total
                });
            })
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

    private actionRender(): (value: any, row: any, index: number) => React.ReactNode {
        return (value: any, row: any, index: number) => <>
            <Button onClick={() => {
                this.showForm(row);
            }} type="link">编辑</Button>
        </>;
    }

    render() {
        const {getComponentTypeData, showForm} = this;
        const tools = <>
            <Button type="primary" htmlType="button" onClick={() => showForm()}>添加组件分类</Button>
        </>;
        const {isShowForm, row} = this.state;
        return <>
            <ComponetTypeForm formData={row} visible={isShowForm} onOk={showForm} onCancel={showForm}/>
            <TableData
                tools={tools}
                onRef={(ref: TableData<any>) => this.$refs.table = ref}
                loadData={getComponentTypeData}
                actionRender={this.actionRender()}
            />
        </>;
    }
}

export default ComponetType;
