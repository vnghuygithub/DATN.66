import { DOMAIN_HOLIDAYS_LEAVES } from '../constApi';
import { request } from '../request';
import { message as $message } from 'antd';
import { mapHolidayLeaves } from './transform';
export interface holidayLeavesArgs {
  name: string;
  company_id: any;
  page_size: number;
  page: number;
  month: number;
}

export const getHolidayLeaves = async (args: holidayLeavesArgs) => {
  let url = DOMAIN_HOLIDAYS_LEAVES.GET;
  let requestBody = {
    params: {
      args: [
        args.name ?? '',
        args.company_id ?? '',
        args.page_size ?? '',
        args.page ?? '',
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
      data: mapHolidayLeaves(res?.result?.result),
      total: res?.result?.total_records,
    },
  };
};
export const getHolidayLeavesDashboard = async (args: holidayLeavesArgs) => {
  let url = DOMAIN_HOLIDAYS_LEAVES.GET;
  let requestBody = {
    params: {
      args: [
        args.name ?? '',
        args.company_id ?? '',
        args.page_size ?? '',
        args.page ?? '',
        args.month > 0 ? args.month : '',
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
      data: mapHolidayLeaves(res?.result?.result),
      total: res?.result?.total_records,
    },
  };
};

export const createHolidayLeaves = async (data: any) => {
  let url = DOMAIN_HOLIDAYS_LEAVES.CREATE;
  let requestBody = {
    params: {
      data: data,
    },
  };
  const res = await request('post', url, requestBody);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const updateHolidayLeaves = async (data: any, id: number) => {
  let url = DOMAIN_HOLIDAYS_LEAVES.UPDATE + id;
  let requestBody = {
    params: {
      data: data,
    },
  };
  const res = await request('post', url, requestBody);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const getHolidayLeavesById = async (id: number) => {
  let url = DOMAIN_HOLIDAYS_LEAVES.GETBYID + id;
  const res = await request('get', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const deleteHolidayLeaves = async (id: number) => {
  let url = DOMAIN_HOLIDAYS_LEAVES.DELETE + id;
  const res = await request('delete', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
