import { request } from '../request';
import { DASHBOARD_LEAVE, GET_LIST_LEAVE } from '../constApi';
import { message as $message } from 'antd';
import { IGetLeaveListArgs } from '../weeklyreport/weeklyreport';
import moment from 'moment';
import { convertVietnameseToEnglish } from '@/utils/common';
import { mapLeaveListView } from '../weeklyreport/transform';

export const getLeaveDashBoard = async () => {
  try {
    let url = DASHBOARD_LEAVE.POST;
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
        data: res?.result,
        total: res?.result.result,
        totalLeave: res?.result?.total_leave_refuse,
        totalLeaveEmployee: res?.result?.result_leave_employee,
        contractResult: res?.result?.contract_result,
        detailsContractEmployee: res?.result?.contract_result_employee,
        employeeResult: res?.result?.employee_result,
        workHistoryResult: res?.result?.WorkHistoryReport,
        invalidTimesheetResult:
          res?.result?.invalidTimesheet_result.total_invalid_timesheet,
        invalidTimesheetResultEmployee:
          res?.result?.invalidTimesheet_result_employee,
        roomMeetingResult: res?.result?.roomMeeting_result,
        roomMeetingResultEmployee: res?.result?.roomMeeting_result_employee,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export const getMissingLeaveInfo = async (args: any) => {

  const requestBody = {
    params: {
      args: [
      
        args.startDate,
        args.endDate,
        args.page_size ?? '',
        args.page ?? '',
      ],
    },
  };
  const res = await request(
    'post',
    GET_LIST_LEAVE.SEARCH_MISSING_INFO,
    requestBody
  );
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return {
    results: {
      data: mapLeaveListView(res.result.result),
      total: res?.result?.total_records,
    },
  };
};



export const getAttendanceDuplicate = async (args: any) => {

  const requestBody = {
    params: {
      args: [
        args.startDate,
        args.endDate,
      ],
    },
  };
  const res = await request(
    'post',
    GET_LIST_LEAVE.SEARCH_ATTENDANCE_DUPLICATE,
    requestBody
  );
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return {
    results: {
      data: mapLeaveListView(res.result.result),
      total: res?.result?.total_records,
    },
  };
};