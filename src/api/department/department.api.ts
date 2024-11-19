import { GET_DEPARTMENT } from '../constApi';
import { request } from '../request';
import { mapDeparment } from './transform';
import { message as $message } from 'antd';
export interface IFilterDepartmentParams {
  id?: number;
  name?: string;
  total_employee?: number;
  manager_id?: number | boolean;
  parent_id?: number | boolean;
  company_id?: number;
  secretary_id?: number | boolean;
}
export interface IDepartment {
  id: number;
  name: string;
  total_employee: number;
  manager_id: IId;
  parent_id: IId;
  time_keeping_count: number;
  company_id: IId;
  secretary_id: IId;
}
export interface IId {
  id?: number;
  name?: string;
}
export const getDepartmentWithFilter = async (
  filter: IFilterDepartmentParams
) => {
  let is_general_manager = localStorage.getItem('is_general_manager');
  let employee_ho = localStorage.getItem('employee_ho');
  let is_administrative = localStorage.getItem('is_administrative');
  let sub_admin_role = localStorage.getItem('sub_admin_role');
  let url =
    GET_DEPARTMENT.GETALLFILTER +
    '?query={id,name,total_employee,manager_id{id,name},parent_id{id,name},time_keeping_count,company_id{id,name},secretary_id{id,name}}';
  let filterArr = [];
  url += '&filter=';
  filterArr.push(`["active","=",true]`);
  if (is_administrative === 'false' && sub_admin_role == 'none') {
    filterArr.push(`["company_id","=",${localStorage.company_id}]`);
  }
  if (is_general_manager === 'false') {
    filterArr.push(`["id","=",${Number(localStorage.department_id)}]`);
  }
  if (filter.company_id) {
    filterArr.push(`["company_id","=",${filter.company_id}]`);
  }
  if (filter.name) {
    filterArr.push(`["name","ilike","${filter.name?.trim()}"]`);
  }
  if (filter.manager_id) {
    filterArr.push(`["manager_id","=",${filter.manager_id}]`);
  }
  if (filter.secretary_id) {
    filterArr.push(`["secretary_id","=",${filter.secretary_id}]`);
  }
  if (filter.parent_id) {
    filterArr.push(`["parent_id","=",${filter.parent_id}]`);
  }
  if (filterArr.length > 0) {
    url += '[' + [filterArr].toString() + ']';
  }
  const res = await request('get', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return {
    results: {
      data: mapDeparment(res?.result),
      total: res?.count,
    },
  };
};

export interface IDepartmentArgs {
  id?: number;
  company_id?: number;
  name: string;
  manager_id?: number;
  parent_id?: number;
  page_size?: number;
  page?: number;
}
export interface IDepartmentArgs2 {
  id?: string;
  company_id?: string;
  name?: string;
  manager_id?: string;
  parent_id?: string;
  page_size?: number;
  page?: number;
  [key: string]: any;
}

export interface Item {

  name: string;
  fillter: string;
  valueSearch: any;
}
export const getDepartmentListV2 = async (args: IDepartmentArgs2) => {
  const keys = Object.keys(args);
  // Biến đổi các object thành mảng
  const transformedData: (string | number | undefined)[][] = keys.reduce(
    (result, key) => {
      if (!isNaN(Number(key))) {
        const item: Item = args[key];
        result.push([item.name, item.fillter, item.valueSearch]);
      }
      return result;
    },
    [] as (string | number | undefined)[][]
  );


  let url = GET_DEPARTMENT.GETV2;
  const requestBody = {
    params: {
      args: [
        args.id ?? '',
        args.company_id ?? '',
        args.name ?? '',
        args.manager_id ?? '',
        args.parent_id ?? '',
        args.page_size ?? 10,
        args.page ?? 1,
        transformedData,
      ],
    },
  };
  const res = await request('post', url, requestBody);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return {
    results: {
      data: mapDeparment(res?.result.result),
      total: res?.result.total_records,
    },
  };
};

export const getDepartmentListV3 = async (args: IDepartmentArgs) => {
  let url = GET_DEPARTMENT.GETV2;
  const requestBody = {
    params: {
      args: [
        args.id ?? '',
        args.company_id ?? '',
        args.name ?? '',
        args.manager_id ?? '',
        args.parent_id ?? '',
        args.page_size ?? 10,
        args.page ?? 1,
      ],
    },
  };
  const res = await request('post', url, requestBody);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return {
    results: {
      data: mapDeparment(res?.result.result),
      total: res?.result.total_records,
    },
  };
};

export const createDepartment = async (data: IFilterDepartmentParams) => {
  const res = await request('post', GET_DEPARTMENT.CREATE, {
    params: {
      data,
    },
  });
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const updateDepartment = async (
  id: number,
  data: IFilterDepartmentParams
) => {
  if (!data.manager_id) {
    data.manager_id = false;
  }
  const res = await request('post', GET_DEPARTMENT.PUT + id, {
    params: {
      data,
    },
  });
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const getDepartmentById = async (id: number) => {
  const res = await request(
    'get',
    GET_DEPARTMENT.GETBYID +
      id +
      '/?query={id,name,parent_id,manager_id,time_keeping_count,company_id,secretary_id}'
  );
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const deleteDepartment = async (id: number) => {
  const res = await request('delete', GET_DEPARTMENT.DELETE + id);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
