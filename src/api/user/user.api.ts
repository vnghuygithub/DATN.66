import { DOMAIN_USER } from '../constApi';
import { request } from '../request';
import { message as $message } from 'antd';
import { mapUser } from './transform';
import { Item } from '../department/department.api';
export interface userArgs {
  name?: string;
  company_id?: number;
  page_size?: number;
  page?: number;
  [key: string]: any;
}
export const deleteUser = async (id: number) => {
  let url = DOMAIN_USER.GETBYID + id;
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

export const changePassword = async (id: any, data: any) => {
  let url = DOMAIN_USER.CHANGEPASSWORD;
  let requestBody = {
    params: {
      args: [id, data.password],
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
export const createUser = async (data: any) => {
  let url = DOMAIN_USER.CREATE;
  let requestBody = {
    params: {
      data: data,
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

export const updateUser = async (data: any, id: any) => {
  let url = DOMAIN_USER.UPDATE + id;
  let requestBody = {
    params: {
      data: data,
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

export const getUserById = async (id: number) => {
  let url =
    DOMAIN_USER.GETBYID +
    id +
    '/?query={id,name,login,company_id{id,name},email,password,is_administrative}';
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
export const getUsersSelect = async () => {
  let url = DOMAIN_USER.GET + '?query={id,name,login}';
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
export const getUsers = async (args: userArgs) => {
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

  let url = DOMAIN_USER.GETALL;
  let requestBody = {
    params: {
      args: [
        args.name ?? '',
        args.company_id ?? '',
        args.page_size ?? '',
        args.page ?? '',
        transformedData,
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
        data: mapUser(res?.result?.result),
        total: res?.result?.total_records,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
