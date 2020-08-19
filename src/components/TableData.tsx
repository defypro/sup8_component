import React from 'react';
import {Drawer, message, Divider, Table, Button, Form} from 'antd';
import TableFilter, {IFilterItem} from "./TableFilter";
import {ColumnProps} from "antd/lib/table";
import styles from './table.module.less';
import {get as objGet} from 'lodash';

interface IColumnProps<T = any> extends ColumnProps<T> {
    hidden?: boolean
}

interface ITableDataProps<T> {
    tools?: React.ReactNode,
    loadData: (params?: any) => Promise<ILoadDataResult>,
    customColumns?: (columns: ColumnProps<T>[]) => ColumnProps<T>[],
    onRef?: (ref: TableData<T>) => void,
    isExport?: boolean,
    actionRender?: (value: any, row: T, index: number) => React.ReactNode,
    filterPage?: {
        pageIndexKey?: string,
        pageSizeKey?: string,
        pageIndex?: number,
        pageSize?: number,
    }
}

export interface ILoadDataResult {
    columns: IColumnProps[],
    dataSource: object[],
    filter?: IFilterItem[],
    page?: number,
    pageSize?: number,
    total?: number
}

interface IState {
    loading?: boolean,
    moreVisible: boolean,
}

interface IData {
    dataSource: object[],
    moreRowData: any,
    pageIndex: number,
    pageSize: number,
    pageIndexKey: string,
    pageSizeKey: string,
    total?: number,
    columns: object[],
    filter?: IFilterItem[],
    oriColumns: IColumnProps<any>[],
}

class TableData<T> extends React.PureComponent <ITableDataProps<T>, IState> {
    state: IState = {
        loading: true,
        moreVisible: false,
    };
    private columnOptions: IColumnProps<T> = {
        className: 'table-th',
        // ellipsis: true,
        render: (value: any, row: T, index: number) => <>{value}</>
    };
    private filterParams: { [key: string]: any } = {};
    private data: IData = {
        dataSource: [],
        moreRowData: {},
        pageIndex: 1,
        pageSize: 10,
        pageIndexKey: 'pageIndex',
        pageSizeKey: 'pageSize',
        oriColumns: [],
        filter: [],
        columns: [],
    };

    constructor(props: ITableDataProps<T>) {
        super(props);
        const {filterPage = {}} = props;
        const {pageIndexKey, pageSizeKey, pageIndex, pageSize} = filterPage;
        if (pageIndex) this.data.pageIndex = pageIndex;
        if (pageSize) this.data.pageSize = pageSize;
        if (pageIndexKey) this.data.pageIndexKey = pageIndexKey;
        if (pageSizeKey) this.data.pageSizeKey = pageSizeKey;
        props.onRef && props.onRef(this);
    }

    UNSAFE_componentWillMount(): void {
        this.loadTable();
    }

    private buildParams(): any {
        const {pageIndexKey, pageSizeKey, pageIndex, pageSize} = this.data;
        return {
            [pageIndexKey]: Number(pageIndex),
            [pageSizeKey]: Number(pageSize),
            isExport: false,
            ...this.filterParams
        };
    }

    private loadTable() {
        const {loadData} = this.props;
        this.setState({
            loading: true,
        });
        const loadDataParams = this.buildParams();
        loadData(loadDataParams).then(res => {
            const {total, dataSource, columns, filter} = res;
            if (loadDataParams.isExport) {
                message.success('导出任务已提交');
            } else {
                this.data.dataSource = dataSource;
                this.data.columns = this.buildColumns(columns);
                this.data.filter = filter;
                this.data.total = total;
            }
            this.setState({
                loading: false,
            });
        });
    }

    refresh() {
        this.loadTable();
    }

    private onChange = (page: number | undefined, pageSize?: number | undefined) => {
        if (page) this.data.pageIndex = page;
        if (pageSize) this.data.pageSize = pageSize;
        this.loadTable();
    };
    private onShowSizeChange = (page: number, pageSize: number) => {
        if (page) this.data.pageIndex = page;
        if (pageSize) this.data.pageSize = pageSize;
        this.loadTable();
    };

    /**
     * 处理查询
     * @param params
     */
    private handleFilter = (params: object) => {
        this.data.pageIndex = 1;
        this.filterParams = params;
        this.loadTable();
    };

    /**
     * 显示更多
     * @param moreRowData
     */
    private more = (moreRowData: any): void => {
        const {moreVisible} = this.state;
        this.data.moreRowData = moreRowData;
        this.setState({
            moreVisible: !moreVisible
        });
    };

    /**
     * 根据columns生成列
     * @param columns
     */
    private buildColumns = (columns: IColumnProps<T>[]): IColumnProps<T>[] => {
        columns = columns.map(item => {
            return {...this.columnOptions, ...item}
        });
        this.data.oriColumns = columns;
        const newColumns = columns.filter(item => {
            return item.hidden !== true;
        });
        if (this.props.actionRender) {
            newColumns.push({
                title: '操作',
                key: 'action',
                render: this.props.actionRender,
                align: "center"
            });
        }
        if (columns.some(item => item.hidden)) {
            newColumns.push({
                key: 'more',
                render: (value: any, row: T, index: number) => <>
                    <Button type="primary" size={"small"} htmlType="button" onClick={() => {
                        this.more(row)
                    }}>
                        更多信息
                    </Button>
                </>
            });
        }
        return newColumns;
    };

    render() {
        console.log('table render');
        const {dataSource, moreRowData, pageIndex, pageSize, filter, total, columns, oriColumns} = this.data;
        const {isExport, tools} = this.props;
        const {loading, moreVisible} = this.state;
        return (
            <div>
                {
                    <TableFilter onSubmit={this.handleFilter} filter={filter} isExport={isExport}/>
                }
                <Drawer
                    className={styles.more}
                    title="更多信息"
                    placement="right"
                    visible={moreVisible}
                    onClose={() => {
                        this.more({});
                    }}
                >
                    {
                        oriColumns.map((item: IColumnProps<T>, index) =>
                            <div key={`${item.title}`}>
                                <span style={{fontSize: 14}}>{item.title}：</span>
                                <span>
                                    {
                                        item.render ? item.render(objGet(moreRowData, item.dataIndex || ''), moreRowData, index) : ''
                                    }
                                </span>
                                <Divider/>
                            </div>
                        )
                    }
                </Drawer>
                <div style={{margin: '10px 0'}}>{tools}</div>
                <Table
                    loading={loading}
                    rowKey={(r: any, i: any) => `${i}`}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        current: pageIndex,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                        showTotal: (total: number, range: [number, number]) => `共${total}条，当前${range[0]}-${range[1]}`,
                        onChange: this.onChange,
                        onShowSizeChange: this.onShowSizeChange
                    }}
                />
            </div>
        );
    }
}

export default TableData;
