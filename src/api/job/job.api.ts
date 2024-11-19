import { GET_JOB_LIST } from '../constApi';
import { IId, Item } from '../department/department.api';
import { request } from '../request';
import { mapJob, mapJobV2 } from './transform';
import { message as $message } from 'antd';
export interface IFilterJobParams {
  id?: number;
  name?: string;
  department_id?: number;
  company_id?: number;
  no_of_employee?: number;
}
export interface IJob {
  id: number;
  name: string;
  department_id: IId;
  company_id: IId;
  no_of_employee: number;
  kpi_config: any;
}
export const getJobWithFilter = async (filter: IFilterJobParams) => {
  let url = GET_JOB_LIST.GETWITHFILTER;
  let filterArr = [];
  url += '&filter=';
  filterArr.push(`["company_id","=",${localStorage.company_id}]`);
  if (filter.name) {
    filterArr.push(`["name","ilike","${filter.name?.trim()}"]`);
  }
  if (filter.department_id) {
    filterArr.push(`["department_id","=",${filter.department_id}]`);
  }
  if (filterArr.length > 0) {
    url += '[' + [filterArr].toString() + ']';
  }
  const res = await request('get', url);
  return {
    results: {
      data: mapJob(res?.result),
      total: res?.count,
    },
  };
};

export const getJobById = async (id: number) => {
  const res = await request(
    'get',
    GET_JOB_LIST.GETBYID +
      id +
      '/?query={id,name,department_id{id,name},company_id{id,name},level,kpi_config,is_hazardous_environment,job_type_id{id,name}}'
  );
  return res;
};

export const getListJob2 = async (params: any) => {
  const res = await request('get', GET_JOB_LIST.GETALL, params);
  return {
    results: {
      data: mapJob(res.result),
      total: res?.count,
    },
  };
};

export const createJob = async (data: any) => {
  const res = await request('post', GET_JOB_LIST.CREATE2, data);

  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const updateJob = async (id: any, data: any) => {
  const res = await request('post', GET_JOB_LIST.PUT + id, {
    params: {
      data: {
        ...data,
      },
    },
  });
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const deleteJob = async (id: any) => {
  const res = await request('delete', GET_JOB_LIST.DELETE + id);
  return res;
};
export interface IJobListArgs {
  company_id?: number | string;
  level?: number | string;
  name?: string;
  department_id?: number | string;
  page_size?: number | string;
  page?: number | string;
  [key: string]: any;
}
export const getListJobs = async (args?: IJobListArgs) => {
  const keys = Object.keys(args!);
  // Biến đổi các object thành mảng
  const transformedData: (string | number | undefined)[][] = keys.reduce(
    (result, key) => {
      if (!isNaN(Number(key))) {
        const item: Item = args![key];
        result.push([item.name, item.fillter, item.valueSearch]);
      }
      return result;
    },
    [] as (string | number | undefined)[][]
  );

  const url = `object/hr.job/get_job`;
  const requestBody = {
    params: {
      args: [
        args?.company_id ?? '',
        args?.level ?? '',
        args?.name ? args?.name.trim() : '',
        args?.department_id ?? '',
        args?.page_size ?? '',
        args?.company_id
          ? 1
          : args?.level
          ? 1
          : args?.name
          ? 1
          : args?.department_id
          ? 1
          : args?.page ?? '',
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
      data: mapJobV2(res?.result?.records),
      total: res?.result?.total_records,
    },
  };
};


export const getListJobs2 = async (args?: IJobListArgs) => {
 
  const url = `object/hr.job/get_job`;
  const requestBody = {
    params: {
      args: [
        args?.company_id ?? '',
        args?.level ?? '',
        args?.name ? args?.name.trim() : '',
        args?.department_id ?? '',
        args?.page_size ?? '',
        args?.company_id
          ? 1
          : args?.level
          ? 1
          : args?.name
          ? 1
          : args?.department_id
          ? 1
          : args?.page ?? '',
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
      data: mapJobV2(res?.result?.records),
      total: res?.result?.total_records,
    },
  };
};

export const newJob = async (data: any) => {
  let url = GET_JOB_LIST.CREATE;
  let requestBody = {
    params: {
      data: {
        ...data,
      },
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};
