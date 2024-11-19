import { DOMAIN_SHIFT_REQUESTS } from '../constApi';
import { request } from '../request';
import { message as $message } from 'antd';
import { mapShiftRequest } from './transform';
import moment from 'moment';
import { Item } from '../department/department.api';

export interface IShiftRequestArgs {
  employee_id: number;
  employee_code: string;
  department_id: number;
  create_date: string;
  job_title: string;
  state: string;
  page_size: number;
  page: number;
  company_id: number;
  [key: string]: any;
}
export interface IScheduleShiftArgs {
  from_date: string;
  to_date: string;
  employee_ids?: number[];
}
export const scheduleShift = async (args: IScheduleShiftArgs) => {
  let url = DOMAIN_SHIFT_REQUESTS.SCHEDULE;
  let requestBody = {
    params: {
      args: [
        args.from_date
          ? moment(args.from_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
          : '',
        args.to_date
          ? moment(args.to_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
          : '',
        args.employee_ids ?? [],
      ],
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
export const createShiftRequest = async (body: any) => {
  let url = DOMAIN_SHIFT_REQUESTS.CREATE;
  let requestBody = {
    params: {
      data: body,
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
export const approveRequest = async (id: number) => {
  let url = DOMAIN_SHIFT_REQUESTS.APPROVE;
  let requestBody = {
    params: {
      args: [id],
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    $message.success('Duyệt thành công !');
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const updateRequest = async (id: number, body: any) => {
  let url = DOMAIN_SHIFT_REQUESTS.PUT + id;
  let requestBody = {
    params: {
      data: body,
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
export const deleteRequest = async (id: number) => {
  let url = DOMAIN_SHIFT_REQUESTS.DELETE + id;

  try {
    const res = await request('delete', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const getShiftRequestById = async (id: number) => {
  let url = DOMAIN_SHIFT_REQUESTS.GETBYID + id;
  try {
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getShiftRequests = async (args: IShiftRequestArgs) => {
  const keys = Object.keys(args);
  const transformedData2: (string | number | undefined)[][] = [];
  keys.forEach(key => {
    if (!isNaN(Number(key))) {
      const item: Item = args[key];
      if (item.valueSearch.length === 2) {
        const startDate = moment(item.valueSearch[0]).format('YYYY-MM-DD');
        const endDate = moment(item.valueSearch[1]).format('YYYY-MM-DD');
        transformedData2.push(['from_date', '>=', startDate]);
        transformedData2.push(['to_date', '<=', endDate]);
      } else {
        transformedData2.push([item.name, item.fillter, item.valueSearch]);
      }
    }
  });
  let url = DOMAIN_SHIFT_REQUESTS.GET;
  let requestBody = {
    params: {
      args: [
        args.employee_id ?? '',
        args.employee_code ?? '',
        args.department_id ?? '',
        args.job_title ?? '',
        args.state ?? '',
        args.create_date ?? '',
        args.page_size ?? '',
        args.page ?? '',
        args.company_id ?? '',
        transformedData2,
      ],
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return {
      results: {
        data: mapShiftRequest(res?.result.records),
        total: res?.result.total_records,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export const updateShiftRequest = async (id: any, body: any) => {
  let url = DOMAIN_SHIFT_REQUESTS.PUT + id;
  let requestBody = {
    params: {
      data: body,
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
