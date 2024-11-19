import { message } from 'antd';
import { APPROVAL_CHANGE_REQUEST } from '../constApi';
import { request } from '../request';
import { mapChangeRequest } from './transform';
import { Item } from '../department/department.api';
export interface IChangeRequestArgs {
  company_id: number;
  state: string;
  approval_assigned_to: number;
  page_size: number;
  page: number;
  [key: string]: any;
}
export const getChangeRequest = async (args: IChangeRequestArgs) => {
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
  let url = APPROVAL_CHANGE_REQUEST.GET;

  let requestBody = {
    params: {
      args: [
        args.company_id ?? '',
        args.state ?? '',
        args.approval_assigned_to ?? '',
        args.page_size ?? '',
        args.page ?? '',
        transformedData
      ],
    },
  };
  const res = await request('post', url, requestBody);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    message.error(res.result.error.message);
    return;
  }
  return {
    results: {
      data: mapChangeRequest(res.result.result),
      total: res.result.total_records,
    },
  };
};
// if (args.approval_assigned_to || args.state || args.company_id) {
//     args.page = 1;
// }

export const getChangeRequestById = async (id: number) => {
  let url =
    APPROVAL_CHANGE_REQUEST.GET_BY_ID +
    id +
    '/?query={id,name,apec_common_contact_id{id,name,employee_id{name}},approval_assigned_to{id,name},email,description,state}';
  const res = await request('get', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    message.error(res.result.error.message);
    return;
  }
  return res;
};

export const updateChangeResquest = async (data: any, id: any) => {
  let url = APPROVAL_CHANGE_REQUEST.PUT + id;
  let requestBody = {
    params: {
      data: data,
    },
  };
  const res = await request('post', url, requestBody);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    message.error(res.result.error.message);
    return;
  }
  return res;
};

export const approveChangeRequest = async (id: number) => {
  let url = APPROVAL_CHANGE_REQUEST.APPROVE;
  let requestBody = {
    params: {
      args: [id],
    },
  };
  const res = await request('post', url, requestBody);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    message.error(res.result.error.message);
    return;
  }
  return res;
};

export const deleteChangeRequest = async (id: number) => {
  let url = APPROVAL_CHANGE_REQUEST.DELETE + id;
  const res = await request('delete', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    message.error(res.result.error.message);
    return;
  }
  return res;
};

export const createChangeRequest = async (data: any) => {
  let url = APPROVAL_CHANGE_REQUEST.POST;
  let requestBody = {
    params: {
      data: data,
    },
  };
  const res = await request('post', url, requestBody);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    message.error(res.result.error.message);
    return;
  }
  return res;
};

export const getContactById = async (id: number) => {
  let url = `api/apec.common.contact/${id}/?query={id,name,employee_id{id,name}}`;
  const res = await request('get', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    message.error(res.result.error.message);
    return;
  }
  return res;
};
