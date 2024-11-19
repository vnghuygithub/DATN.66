import { DOMAIN_CONFIG_LOCK } from '../constApi';
import { request } from '../request';
import { message as $message } from 'antd';
import { IConfigLock, IConfigLockCreate, mapConfigLock } from './transform';
import { Item } from '../department/department.api';

export interface IConfigLockArgs {
  name: string;
  company_id: number;
  model_lock: string;
  page_size: number;
  page_number: number;
  active: boolean;
  [key: string]: any;
}

export const getConfigLock = async (args: IConfigLockArgs) => {
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
  try {
    let url = DOMAIN_CONFIG_LOCK.GET;
    let requestBody = {
      params: {
        args: [
          args.name ?? '',
          args.company_id ?? '',
          args.model_lock ?? '',
          args.page_size ?? 10,
          args.page_number ?? 1,
          args.active ?? '',
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
        data: mapConfigLock(res?.result?.result),
        total: res?.result?.total_records,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export const deleteConfigLockById = async (id: any) => {
  try {
    let url = DOMAIN_CONFIG_LOCK.DELETE + id;

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

export const createConfigLock = async (data: IConfigLockCreate) => {
  try {
    let url = DOMAIN_CONFIG_LOCK.CREATE;
    let requestBody = {
      params: {
        data,
      },
    };
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const updateConfigLock = async (data: IConfigLockCreate, id: any) => {
  try {
    let url = DOMAIN_CONFIG_LOCK.UPDATE + id;
    let requestBody = {
      params: {
        data,
      },
    };
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getConfigLockById = async (id: number) => {
  try {
    let url = DOMAIN_CONFIG_LOCK.GETBYID + id;

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
