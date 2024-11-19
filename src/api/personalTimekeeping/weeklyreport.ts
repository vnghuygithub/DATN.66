import {
  IGetAttendanceDetails,
  IGetAttendanceParams,
  IUpdateAttendanceMoreParams,
  IUpdateScheduleParams,
} from '@/interface/weeklyreport/type';
import {
  GET_ATTENDANCE,
  GET_ATTENDANCE_DETAIL_BY_ID,
  SHIFTS,
  UPDATE_SCHEDULING,
  GET_LIST_LEAVE,
  INVALID_TIMESHEET,
} from '../constApi';
import { request } from '../request';
import { mapLeaveListView } from './transform';
import { message as $message } from 'antd';
import moment from 'moment';
import { convertVietnameseToEnglish } from '../../utils/common-antd';
export const deleteLeave = async (id: number) => {
  const res = await request('delete', GET_LIST_LEAVE.DELETE + id);
  if (res?.error?.code && res.error.code == 400) {
    $message.error(res.error.message);
    return;
  }
  $message.success('Xóa đơn thành công');
  return res;
};
export const getAttendanceReport = async (data: IGetAttendanceParams) => {
  const res = await request('post', GET_ATTENDANCE.SEARCH, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const calculateAttendanceReport = async (data: IGetAttendanceParams) => {
  const res = await request('post', GET_ATTENDANCE.CALCULATE, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const reCalculateData = async (data: IGetAttendanceParams) => {
  const res = await request('post', GET_ATTENDANCE.RECALCULATE, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const fillReportData = async (data: IGetAttendanceParams) => {
  const res = await request('post', GET_ATTENDANCE.FILL_DATA, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const getListShifts = async () => {
  const res = await request('get', SHIFTS.GETALL);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const updateEmployeeScheduling = async (data: IUpdateScheduleParams) => {
  const res = await request('post', UPDATE_SCHEDULING.SEARCH, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const updateEmployeeSchedulingMore = async (
  data: IUpdateAttendanceMoreParams
) => {
  const res = await request('post', UPDATE_SCHEDULING.UPDATE_ARR, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const getAttendanceDetailById = async (data: IGetAttendanceDetails) => {
  const res = await request('post', GET_ATTENDANCE_DETAIL_BY_ID.SEARCH, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const getListLeave = async (data: any) => {
  const res = await request('post', GET_LIST_LEAVE.GETALL, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const searchListLeave = async (data: any) => {
  const res = await request('post', GET_LIST_LEAVE.SEARCH, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return {
    results: {
      data: mapLeaveListView(res.result.result),
      total: res?.result.count,
    },
  };
};
export interface IGetLeaveListArgs {
  create_date: string;
  holiday_status_id: number;
  state: string;
  employee_code: string;
  employee_name: string
  department_id: number;
  start_date: string;
  end_date: string;
  company_id: number;
  page_size: number;
  page: number;
  dateRange: Array<any>
}
export const searchListLeaveV2 = async (args: IGetLeaveListArgs) => {
  if (args.dateRange && args.dateRange.length === 2) {
    args.start_date = moment(args.dateRange[0]).format("YYYY-MM-DD");
    args.end_date = moment(args.dateRange[1]).format("YYYY-MM-DD");
  }
  const start_date = args.start_date;
  const end_date = args.end_date;
  const requestBody = {
    params: {
      args: [
        args.create_date ? moment(args.create_date).format("YYYY-MM-DD") : "",
        args.holiday_status_id ?? "",
        args.state ?? "",
        args?.employee_code?.trim() ?? "",
        args.employee_name ? convertVietnameseToEnglish(args.employee_name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")).toLowerCase().trim() :  "",
        args.department_id ?? "",
        args.dateRange ? moment(start_date).format("YYYY-MM-DD") : "",
        args.dateRange ? moment(end_date).format("YYYY-MM-DD") : "",
        args.company_id ?? "",
        args.page_size ?? "",
        args.page ?? "",
      ]
    }
  }
  const res = await request('post', GET_LIST_LEAVE.SEARCHV2, requestBody);
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
export const createLeaveByEmployeeId = async (data: any) => {
  const res = await request('post', GET_LIST_LEAVE.CREATE, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};



export const createExplainLeave = async (data: any) => {
  const res = await request('post', INVALID_TIMESHEET.CREATE, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export interface IUpdateSummaryArgs {
  company_name: string;
  start: string;
  end: string;
  page_size: number;
  page_number: number;
  is_update_contract: boolean;
  is_compute_worktime: boolean;
  department: string | boolean;
  employee_code: string;
}
export const updateSummaryReport = async (data: IUpdateSummaryArgs) => {
  let url = "object/res.users/update_summary_report";
  let requestBody = {
    params: {
      args: [
        data.company_name ?? "",
        data.start ?? "",
        data.end ?? "",
        data.page_size ?? 10,
        data.page_number ?? 1,
        data.is_update_contract ?? false,
        data.is_compute_worktime ?? false,
        data.department ?? "",
        data.employee_code ?? "",
      ]
    }
  }
  const res = await request('post', url, requestBody);
  if (res?.error?.code && res.error.code == 400) {
    $message.error(res.error.message);
    return;
  }
  return res;
}
export interface ILeaveListApprovalArgs {
  create_date: string;
  holiday_status_id: number;
  state: string;
  employee_code: string;
  employee_name: string;
  department_id: number;
  start_date: string;
  end_date: string;
  page_size: number;
  page: number;
  is_approval: boolean;
  dateRange: Array<any>
}
export const getLeaveListApprovalOnly = async (args: ILeaveListApprovalArgs) => {
  let url = GET_LIST_LEAVE.GETLEAVEAPPROVALONLY;
  let requestBody = {
    params: {
      args: [
        args.create_date ? moment(args.create_date).format("YYYY-MM-DD") : "",
        args.holiday_status_id ?? "",
        args.state ?? "",
        args?.employee_code?.trim() ?? "",
        args.employee_name ? convertVietnameseToEnglish(args.employee_name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")).toLowerCase().trim() :  "",
        args.department_id ?? "",
        args.dateRange ? moment(args.dateRange[0]).format("YYYY-MM-DD") : "",
        args.dateRange ? moment(args.dateRange[1]).format("YYYY-MM-DD") : "",
        args.page_size ?? "",
        args.page ?? "",
        true,
      ]
    }
  }
  const res = await request('post', url, requestBody);
  if (res?.error?.code && res.error.code == 400) {
    $message.error(res.error.message);
    return;
  }
  return {
    results: {
      data: mapLeaveListView(res?.result?.result),
      total: res?.result?.total_records,
    }
  }
}
export const getLeaveListApprovalHrOnly = async (args: ILeaveListApprovalArgs) => {
  let url = GET_LIST_LEAVE.GETLEAVEAPPROVALONLY;
  let requestBody = {
    params: {
      args: [
        args.create_date ? moment(args.create_date).format("YYYY-MM-DD") : "",
        args.holiday_status_id ?? "",
        args.state ?? "",
        args?.employee_code?.trim() ?? "",
        args.employee_name ? convertVietnameseToEnglish(args.employee_name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")).toLowerCase().trim() :  "",
        args.department_id ?? "",
        args.dateRange ? moment(args.dateRange[0]).format("YYYY-MM-DD") : "",
        args.dateRange ? moment(args.dateRange[1]).format("YYYY-MM-DD") : "",
        args.page_size ?? "",
        args.page ?? "",
        false,
      ]
    }
  }
  const res = await request('post', url, requestBody);
  if (res?.error?.code && res.error.code == 400) {
    $message.error(res.error.message);
    return;
  }
  return {
    results: {
      data: mapLeaveListView(res?.result?.result),
      total: res?.result?.total_records,
    }
  }

   
}

export const getAttendanceMark = async (code:any , date:any) => {
  let url= GET_ATTENDANCE.GETMARK;
  let requestBody = {
    params: {
      args: [
        code,
        date
      ]
    }
  }
  const res = await request('post', url, requestBody);
  if (res?.error?.code && res.error.code == 400) {
    $message.error(res.error.message);
    return;
  }
  return res.result;

}