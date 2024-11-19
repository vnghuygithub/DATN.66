import { request } from '../request';
import { DASHBOARD_INVALID } from '../constApi';
import { message as $message } from 'antd';

export const getInvalidDashboard = async () => {
  try {
    let url = DASHBOARD_INVALID.POST;
    let requestBody = {
      params: {
        args: [''],
      },
    };

    const res = await request('post', url, requestBody);

    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }

    return {
      results: {
        total: res?.result,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
