import {Button, Form, Input, Select, DatePicker} from "antd";
import {SearchOutlined, ReloadOutlined, DownloadOutlined} from '@ant-design/icons';
import React from "react";
import styles from './table.module.less';
import {set as objSet} from 'lodash';
import {IStore} from "../utils/interface";
import moment from 'moment';

const {Option} = Select;
const {RangePicker} = DatePicker;

export interface IFilterItem {
    title: string,
    name: string,
    type?: 'text' | 'select' | 'datePicker' | 'dateTimePicker' | 'rangeTimePicker' | 'rangePicker',
    value?: any
    selectKey?: string,
    selectName?: string,
    rangeKey?: string[],
    component?: any
}

export interface ISearchForm {
    onSubmit: Function,
    filter?: IFilterItem[],
    isExport?: boolean
}

const getFilterItem = (item: IFilterItem): React.ReactNode => {
    let node: React.ReactNode = <></>;
    const quickRanges: IStore = {
        '今天': [moment({hours: 0, minutes: 0, seconds: 0, milliseconds: 0}), moment().endOf('day')],
        '最近7天': [moment({hours: 0, minutes: 0, seconds: 0, milliseconds: 0}).subtract(7, 'days'), moment().endOf('day')],
        '最近14天': [moment({hours: 0, minutes: 0, seconds: 0, milliseconds: 0}).subtract(14, 'days'), moment().endOf('day')],
        '本月': [moment().startOf('month'), moment().endOf('month')],
        '本年': [moment().startOf('year'), moment().endOf('year')],
    };
    if (item.component) return item.component;
    switch (item.type) {
        case "select":
            const selectKey: string = item.selectKey ? item.selectKey : 'value';
            const selectName: string = item.selectName ? item.selectName : 'name';
            const options = (item.value as []).map((d: any) => <Option value={d[selectKey]} key={d[selectKey]}>{d[selectName]}</Option>);
            node = (
                <Select
                    showSearch
                    filterOption={(input: any, option: any) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    allowClear
                    style={{width: 170}}
                    placeholder={`请选择${item.title}`}
                >
                    {options}
                </Select>
            );
            break;
        case "dateTimePicker":
            node = (
                <DatePicker showToday showTime format="YYYY-MM-DD HH:mm:ss"/>
            );
            break;
        case "datePicker":
            node = (
                <DatePicker showToday format="YYYY-MM-DD HH:mm:ss"/>
            );
            break;
        case "rangePicker":
            node = (
                <RangePicker ranges={quickRanges} format="YYYY-MM-DD"/>
            );
            break;
        case "rangeTimePicker":
            node = (
                <RangePicker ranges={quickRanges} showTime format="YYYY-MM-DD HH:mm:ss"/>
            );
            break;
        default:
            node = <Input autoComplete="off" placeholder={`请输入${item.title}`}/>;
    }
    return node;
};

const TableFilter: React.FC<ISearchForm> = (props: ISearchForm) => {
    const [form] = Form.useForm();
    const {onSubmit, filter = [], isExport} = props;
    const formatVlues = () => {
        const fieldsValue = form.getFieldsValue();
        const values: IStore = {};
        filter.forEach(item => {
            const {rangeKey = [], name, type} = item;
            const value = fieldsValue[name];
            switch (type) {
                case 'datePicker':
                case 'dateTimePicker':
                    if (value) {
                        const formatText = type === 'dateTimePicker' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
                        objSet(values, name, fieldsValue[name].format(formatText));
                    }
                    break;
                case 'rangeTimePicker':
                case 'rangePicker':
                    if (value) {
                        const formatText = type === 'rangeTimePicker' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
                        objSet(values, rangeKey[0], value[0].format(formatText));
                        objSet(values, rangeKey[1], value[1].format(formatText));
                    }
                    break;
                default:
                    objSet(values, name, value);
            }
        });
        return values;
    };

    const handleSubmit = () => {
        onSubmit(formatVlues());
    };
    const handleReset = () => {
        onSubmit({});
        form.resetFields();
    };
    const download = () => {
        onSubmit({
            ...formatVlues(),
            isExport: true
        });
    };

    const filterItems = <>
        {
            filter.map((item: IFilterItem) => (
                <Form.Item getValueFromEvent={e => {
                    if (item.type === 'text') {
                        return e.target.value.trim();
                    }
                    return e;
                }} name={item.name} style={{marginBottom: 10}} label={item.title} key={item.name}>
                    {
                        getFilterItem(item)
                    }
                </Form.Item>
            ))
        }
    </>;

    const filterButtons = <Form.Item>
        {
            filter.length > 0 &&
            <>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>查询</Button>
                <Button type="default" htmlType="reset" icon={<ReloadOutlined/>}>重置</Button>
            </>
        }
        {isExport && <Button onClick={download} type="default" icon={DownloadOutlined}>导出</Button>}
    </Form.Item>;

    return (isExport || filter.length > 0) ? (
        <div className={styles.filterForm} style={{backgroundColor: '#FAFAFA', padding: 10}}>
            <Form form={form} layout="inline" onFinish={handleSubmit} onReset={handleReset} style={{}}>
                {/*<div style={{display: "inline-flex", width: "calc(100% - 270px)", flexWrap: "wrap"}}>*/}
                {/*</div>*/}
                {filterItems}
                {filterButtons}
            </Form>
        </div>
    ) : <></>;
};

export default TableFilter;