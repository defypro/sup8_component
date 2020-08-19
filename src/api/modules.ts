import {POST, GET, IParams} from "./http";
import {exportExcel} from "../utils/utils";

export default {
    //搜索企业
    EnterpriseSearch(params: { name: string }) {
        return POST<any[]>('enterprise/search', params);
    },

    //组件列表
    ComponentList(params: { page: number, pageSize: number }) {
        return POST('component/list', params);
    },
    //组件修改
    ComponentUpdate(params: any) {
        return POST('component/update', params);
    },
    //组件创建
    ComponentCreate(params: any) {
        return POST('component/create', params);
    },

    //组件分类列表
    ComponentTypeList(params: { page?: number, pageSize: number }) {
        return POST('component-type/list', params);
    },
    //组件分类修改
    ComponentTypeUpdate(params: any) {
        return POST('component-type/update', params);
    },
    //组件分类创建
    ComponentTypeCreate(params: any) {
        return POST('component-type/create', params);
    },


    //组件属性列表
    ComponentPropsList(params: { page?: number, pageSize: number, componentid: string }) {
        return POST('component-props/list', params);
    },
    //组件属性修改
    ComponentPropsUpdate(params: any) {
        return POST('component-props/update', params);
    },
    //组件属性创建
    ComponentPropsCreate(params: any) {
        return POST('component-props/create', params);
    },

}