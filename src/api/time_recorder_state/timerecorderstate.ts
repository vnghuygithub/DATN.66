import { request } from '../request';
import { DOMAIN_TIME_RECORDER_STATE} from '../constApi';
import { message as $message } from 'antd';
import { mapTRStates } from './transform';
import { ITRStateArgs } from '@/interface/timerecorderstate/time_recorder_state';

export const getTRStateByArgs = async (args: ITRStateArgs) => {
  let url = DOMAIN_TIME_RECORDER_STATE.GET;
  let requestBody = {
    params: {
      args: [
        args.time_recorder_id ?? '',
        args.work_address ?? '',
        args.address_ip ?? '',
        args.connection ?? '',
        args.date ?? '',
        args.state ?? '',
        '',
        '',
        '',
        args.page ?? '',
        args.page_size ?? '',
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
        data: mapTRStates(res?.result?.result),
        total: res?.result.total_records,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
