import { historyShiftEditBody } from './../../interface/weeklyreport/type';
import { GET_ATTENDANCE_TRANS } from '../constApi';

import { request } from '../request';
import { mapShift, mapShiftV2 } from './transform';
import { mapEmployeeLog } from '../employee/transform';
import { message as $message } from 'antd';
import * as moment from 'moment';
export interface IAttendanceTransArgs {
  name?: string;
  start?: moment.Moment | string;
  end?: moment.Moment | string;
  page_size?: number;
  page?: number;
}
export const getAttendanceTrans = async (args: IAttendanceTransArgs) => {
  let url = GET_ATTENDANCE_TRANS.SEARCH;
  let requestBody = {
    params: {
      args: [args.name, args.start, args.end, args.page_size, args.page],
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res?.result?.result;
  } catch (error) {}
};
