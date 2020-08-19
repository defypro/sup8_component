import React from 'react';
import TableData, {ILoadDataResult} from "../../components/TableData";
import {Button} from "antd";
import ComponetPropsForm from "./ComponetPropsForm";
import api from '../../api'
import {RouteConfigComponentProps} from "react-router-config";
import {Store} from "../../config";

class ComponetProps extends React.PureComponent<RouteConfigComponentProps> {
    $refs = {
        table: {} as TableData<any>
    };

    state = {
        isShowForm: false,
        row: {}
    };

    componetId = '';

    constructor(props: RouteConfigComponentProps) {
        super(props);
        const {componetId} = props.match.params as any;
        this.componetId = componetId;
    }


    public getComponetPropsData = (params: any): Promise<ILoadDataResult> => {
        return new Promise(resolve => {
            api.ComponentPropsList({
                ...params,
                componentId: this.componetId
            }).then(({result}) => {
                resolve({
                    columns: [
                        {
                            dataIndex: ['ComponentModel', 'name'],
                            title: '所属组件'
                        },
                        {
                            dataIndex: 'title',
                            title: '属性名称'
                        },
                        {
                            dataIndex: 'Propkey',
                            title: '属性Key'
                        },
                    ],
                    dataSource: result.items,
                    total: result.total,
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
        const {getComponetPropsData, showForm, componetId} = this;
        const tools = <>
            <Button type="primary" htmlType="button" onClick={() => showForm()}>添加属性</Button>
        </>;
        const {isShowForm, row} = this.state;
        return <>
            <ComponetPropsForm componetId={componetId} visible={isShowForm} formData={row} onOk={showForm} onCancel={showForm}/>
            <TableData
                tools={tools}
                onRef={(ref: TableData<any>) => this.$refs.table = ref}
                loadData={getComponetPropsData}
                actionRender={this.actionRender()}
            />
        </>;
    }
}

export default ComponetProps;
