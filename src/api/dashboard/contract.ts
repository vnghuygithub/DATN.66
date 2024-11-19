import { request } from '../request';
import { DASHBOARD_CONTRACT } from '../constApi';
import { message as $message } from 'antd';

interface IContractDashboard {
  total_contract_almost: number;
  total_contract_draft: number;
}

export const getContractDashBoard = async (arg: IContractDashboard) => {
  try {
    let url = DASHBOARD_CONTRACT.POST;
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
        data: res?.result.details,
        total: res?.result?.total_contract_almost,
        draft: res?.result?.total_contract_draft,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
