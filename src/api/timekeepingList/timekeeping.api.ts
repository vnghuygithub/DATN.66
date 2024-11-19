import {
  IGetAttendanceParams,
} from '@/interface/weeklyreport/type';
import {
  DOMAIN_AUDIT_LOG_HISTORY,
  GET_ATTENDANCE,
} from '../constApi';
import { request } from '../request';
import { mapTimeKeeping, mapTimeKeepingLog } from './transform';
import { mapEmployeeLog } from '../employee/transform';
import { message as $message } from 'antd';
export const getTimeKeepingList = async (data: IGetAttendanceParams) => {
  const res = await request('post', GET_ATTENDANCE.SEARCH_PAGE, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return {
    results: {
      data: mapTimeKeeping(res?.result?.result),
      total: res?.result?.count,
    },
  }
};
export const getTimeKeepingLog = async () => {
  let url = DOMAIN_AUDIT_LOG_HISTORY.GET + `/?filter=[["user_id","=",${localStorage.user_id}],["model_model","=","hr.leave"],["field_name","!=","number_of_days"],["field_name","!=","duration_display"],["field_name","!=","activity_ids"],["field_name","!=","request_date_from_period"],["field_name","!=","message_ids"],["field_name","!=","browsing_object"],["field_name","!=","request_date_from"],["field_name","!=","request_date_to"],["field_name","!=","website_message_ids"],["field_name","!=","converted_time"],["field_name","!=","active"]]`;
  try {
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return {
      results: {
        data: mapTimeKeepingLog(res?.result),
        total: res?.count
      }
    }
  } catch (error) {
    console.log(error);
  }
}