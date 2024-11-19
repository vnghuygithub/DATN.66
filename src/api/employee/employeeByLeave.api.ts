import { convertVietnameseToEnglish } from '@/utils/common';
import { GET_EMPLOYEE_BY_LEAVE } from '../constApi';
import { request } from '../request';
import { IEmployeeByLeave } from '@/interface/leaveManagement';
import moment from 'moment';
import { IEmployeeLog } from '@/interface/employees/employee';
import { message as $message } from 'antd';
import { Item } from '../department/department.api';

export interface IEmployeeByLeaveArgs {
  year: number;
  date_calculate: string;
  employee_id: number;
  employee_code: string;
  department_id: number;
  job_title: string;
  contract_type_id: number;
  page_size: number;
  page: number;
  company_id: number;
  [key: string]: any;
}
export const getClById = async (id: number) => {
  let url = GET_EMPLOYEE_BY_LEAVE.PUT + id;
  try {
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    if (res.note) {
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};
export const putClById = async (id: number, data: any) => {
  let url = GET_EMPLOYEE_BY_LEAVE.PUT + id;
  try {
    const res = await request('post', url, data);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const getEmployeeByLeaveLogs = async (args: IEmployeeLog) => {
  let url =
    GET_EMPLOYEE_BY_LEAVE.LOG +
    `?filter=[["user_id","=",${localStorage.user_id}],["model_model","=","hr.cl.report"]]`;
  try {
    const res = await request('get', url);
    if (res) {
      return res;
    }
  } catch (err) {
    console.log(err);
  }
};
export const getEmployeeByLeave = async (args: IEmployeeByLeaveArgs) => {
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
  let currentYear = new Date().getFullYear();
  currentYear = parseInt(currentYear.toString());
  let url = GET_EMPLOYEE_BY_LEAVE.GETALL;
  let requestBody = {
    params: {
      args: [
        args.year ? moment(args.year).toDate().getFullYear() : '',
        args.date_calculate ?? '',
        args.employee_id ?? '',
        (args.employee_code ?? '').trim(),
        args.department_id ?? '',
        (args.job_title ?? '').trim(),
        args.contract_type_id ?? '',
        args.page_size ?? '',
        args.page ?? '',
        args.company_id ?? '',
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
        data: mapEmployeeByLeave(res?.result?.result),
        total: res?.result?.total_records,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
export const calculateEmployeeByLeave = async () => {
  let url = GET_EMPLOYEE_BY_LEAVE.CALCULATE;
  let requestBody = {
    params: {
      args: [Number(localStorage.company_id)],
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

const mapEmployeeByLeave = (res: IEmployeeByLeave[]) => {
  return (
    res &&
    res.length > 0 &&
    res.map((item: any, index: any) => {
      const employee_id = item?.employee_id ?? [];
      const department_id = item?.department_id ?? [];
      const company_id = item?.company_id ?? [];
      const contract_type_id = item?.contract_type_id ?? [];
      return {
        no: index + 1,
        id: item?.id,
        employee_id: employee_id[0] ?? '',
        employee_code: item?.employee_code ?? '',
        employee_name: item?.employee_id[1] ?? '',
        department_id: department_id[0] ?? '',
        department_name: item?.department_id[1] ?? '',
        company_id: company_id[0] ?? '',
        company_name: item?.company_id[1] ?? '',
        contract_type_id: contract_type_id[0] ?? '',
        contract_type_name: item?.contract_type_id[1] ?? '',
        job_title: item?.job_title ?? '',
        date_calculate: item?.date_calculate
          ? moment(item?.date_calculate).format('DD/MM/YYYY')
          : '',
        year: item?.year ?? '',
        tier: item?.tier ?? '',
        date_sign: item?.date_sign
          ? moment(item?.date_sign).format('DD/MM/YYYY')
          : '',
        workingday: item?.workingday
          ? moment(item?.workingday).format('DD/MM/YYYY')
          : '',
        severance_day: item?.severance_day
          ? moment(item?.severance_day).format('DD/MM/YYYY')
          : '',
        increase_probationary_1: item?.increase_probationary_1 ?? '',
        increase_official_1: item?.increase_official_1 ?? '',
        used_probationary_1: item?.used_probationary_1 ?? '',
        used_official_1: item?.used_official_1 ?? '',
        overtime_probationary_1: item?.overtime_probationary_1 ?? '',
        overtime_official_1: item?.overtime_official_1 ?? '',
        increase_probationary_2: item?.increase_probationary_2 ?? '',
        increase_official_2: item?.increase_official_2 ?? '',
        used_probationary_2: item?.used_probationary_2 ?? '',
        used_official_2: item?.used_official_2 ?? '',
        overtime_probationary_2: item?.overtime_probationary_2 ?? '',
        overtime_official_2: item?.overtime_official_2 ?? '',
        increase_probationary_3: item?.increase_probationary_3 ?? '',
        increase_official_3: item?.increase_official_3 ?? '',
        used_probationary_3: item?.used_probationary_3 ?? '',
        used_official_3: item?.used_official_3 ?? '',
        overtime_probationary_3: item?.overtime_probationary_3 ?? '',
        overtime_official_3: item?.overtime_official_3 ?? '',
        increase_probationary_4: item?.increase_probationary_4 ?? '',
        increase_official_4: item?.increase_official_4 ?? '',
        used_probationary_4: item?.used_probationary_4 ?? '',
        used_official_4: item?.used_official_4 ?? '',
        overtime_probationary_4: item?.overtime_probationary_4 ?? '',
        overtime_official_4: item?.overtime_official_4 ?? '',
        increase_probationary_5: item?.increase_probationary_5 ?? '',
        increase_official_5: item?.increase_official_5 ?? '',
        used_probationary_5: item?.used_probationary_5 ?? '',
        used_official_5: item?.used_official_5 ?? '',
        overtime_probationary_5: item?.overtime_probationary_5 ?? '',
        overtime_official_5: item?.overtime_official_5 ?? '',
        increase_probationary_6: item?.increase_probationary_6 ?? '',
        increase_official_6: item?.increase_official_6 ?? '',
        used_probationary_6: item?.used_probationary_6 ?? '',
        used_official_6: item?.used_official_6 ?? '',
        overtime_probationary_6: item?.overtime_probationary_6 ?? '',
        overtime_official_6: item?.overtime_official_6 ?? '',
        increase_probationary_7: item?.increase_probationary_7 ?? '',
        increase_official_7: item?.increase_official_7 ?? '',
        used_probationary_7: item?.used_probationary_7 ?? '',
        used_official_7: item?.used_official_7 ?? '',
        overtime_probationary_7: item?.overtime_probationary_7 ?? '',
        overtime_official_7: item?.overtime_official_7 ?? '',
        increase_probationary_8: item?.increase_probationary_8 ?? '',
        increase_official_8: item?.increase_official_8 ?? '',
        used_probationary_8: item?.used_probationary_8 ?? '',
        used_official_8: item?.used_official_8 ?? '',
        overtime_probationary_8: item?.overtime_probationary_8 ?? '',
        overtime_official_8: item?.overtime_official_8 ?? '',
        increase_probationary_9: item?.increase_probationary_9 ?? '',
        increase_official_9: item?.increase_official_9 ?? '',
        used_probationary_9: item?.used_probationary_9 ?? '',
        used_official_9: item?.used_official_9 ?? '',
        overtime_probationary_9: item?.overtime_probationary_9 ?? '',
        overtime_official_9: item?.overtime_official_9 ?? '',
        increase_probationary_10: item?.increase_probationary_10 ?? '',
        increase_official_10: item?.increase_official_10 ?? '',
        used_probationary_10: item?.used_probationary_10 ?? '',
        used_official_10: item?.used_official_10 ?? '',
        overtime_probationary_10: item?.overtime_probationary_10 ?? '',
        overtime_official_10: item?.overtime_official_10 ?? '',
        increase_probationary_11: item?.increase_probationary_11 ?? '',
        increase_official_11: item?.increase_official_11 ?? '',
        used_probationary_11: item?.used_probationary_11 ?? '',
        used_official_11: item?.used_official_11 ?? '',
        overtime_probationary_11: item?.overtime_probationary_11 ?? '',
        overtime_official_11: item?.overtime_official_11 ?? '',
        increase_probationary_12: item?.increase_probationary_12 ?? '',
        increase_official_12: item?.increase_official_12 ?? '',
        used_probationary_12: item?.used_probationary_12 ?? '',
        used_official_12: item?.used_official_12 ?? '',
        overtime_probationary_12: item?.overtime_probationary_12 ?? '',
        overtime_official_12: item?.overtime_official_12 ?? '',
        total_increase_probationary: item?.total_increase_probationary ?? '',
        total_increase_official: item?.total_increase_official ?? '',
        total_used_probationary: item?.total_used_probationary ?? '',
        total_used_official: item?.total_used_official ?? '',
        remaining_probationary_minute:
          item?.remaining_probationary_minute ?? '',
        remaining_official_minute: item?.remaining_official_minute ?? '',
        remaining_total_minute: item?.remaining_total_minute ?? '',
        remaining_probationary_day: item?.remaining_probationary_day ?? '',
        remaining_official_day: item?.remaining_official_day ?? '',
        remaining_total_day: item?.remaining_total_day ?? '',
        note: item?.note ?? '',
        total_increase_tv_ovt: item?.total_increase_tv_ovt ?? '',
        total_increase_ct_ovt: item?.total_increase_ct_ovt ?? '',
      };
    })
  );
};
