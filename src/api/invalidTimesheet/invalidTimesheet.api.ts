import { request } from '../request';
import {
  ICreateInvalidTimesheetArgs,
  IInvalidTimesheet,
} from '@/interface/weeklyreport/type';
import { mapShift } from './transform';
import { GET_INVALID_TIMESHEET_BY_ARGS, INVALID_TIMESHEET } from '../constApi';
import { convertVietnameseToEnglish } from '@/utils/common';
import { message as $message } from 'antd';
import { Item } from '../department/department.api';
import moment from 'moment';
import dayjs from 'dayjs';
export const createInvalidTimeSheet = async (
  args: ICreateInvalidTimesheetArgs
) => {
  let url = GET_INVALID_TIMESHEET_BY_ARGS.CREATE;
  let requestBody = {
    params: {
      args: [
        args.employee_code ?? '',
        args.invalid_date ?? '',
        args.invalid_type ?? '',
        args.shift_from ?? '',
        args.shift_to ?? '',
        args.shift_break ?? '',
        args.real_time_attendance_data ?? '',
        args.validation_data ?? '',
        args.reason ?? '',
        args.remarks ?? '',
        args.owner ?? '',
        args.reviewer ?? '',
        args.validated ?? '',
        args.keep_in_time ?? '',
        args.attendance_missing_from ?? '',
        args.attendance_missing_to ?? '',
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
      results: res?.result,
    };
  } catch (error) {
    console.log(error);
  }
};
export const putInvalidTimeSheetById = async (id: number, data: any) => {
  let url = GET_INVALID_TIMESHEET_BY_ARGS.GETBYID + id;
  const res = await request('post', url, {
    params: {
      data: data,
    },
  });
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const getInvalidTimeSheetById = async (id: number) => {
  let url = GET_INVALID_TIMESHEET_BY_ARGS.GETBYID + id;
  const res = await request('get', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const deleteInvalidTimeeSheetById = async (id: number) => {
  let url = GET_INVALID_TIMESHEET_BY_ARGS.DELETE;
  let requestBody = {
    params: {
      args: [id ?? ''],
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    $message.success('Xóa thành công');
    return {
      results: res?.result,
    };
  } catch (error) {
    console.log(error);
  }
};
export const getInvalidTimeeSheetByArgs = async (args: IInvalidTimesheet) => {
  const currentDate = dayjs().subtract(10, 'day');
  const firstDayOfMonth = currentDate.startOf('month').format('YYYY-MM-DD');
  const lastDayOfMonth = currentDate.endOf('month').format('YYYY-MM-DD');
  const keys = Object.keys(args);
  // Biến đổi các object thành mảng
  const transformedData: (string | number | undefined)[][] = [];

  keys.forEach(key => {
    if (!isNaN(Number(key))) {
      const item: Item = args[key];

      if (item.valueSearch.length === 2) {
        const month = item.valueSearch;
        const year = new Date().getFullYear(); // Lấy năm hiện tại

        // Tính toán ngày đầu và ngày cuối của tháng
        const startDate = moment(`${year}-${month}-01`).format('YYYY-MM-DD');
        const endDate = moment(`${year}-${month}-01`)
          .endOf('month')
          .format('YYYY-MM-DD');

        // Đẩy thông tin vào transformedData
        transformedData.push(['invalid_date', '>=', startDate]);
        transformedData.push(['invalid_date', '<=', endDate]);
      } else {
        transformedData.push([item.name, item.fillter, item.valueSearch]);
      }
    }
  });

  let url = GET_INVALID_TIMESHEET_BY_ARGS.GETALL;
  let requestBody = {
    params: {
      args: [
        (args.employee_id ?? '').trim(),
        (args.employee_code ?? '').trim(),
        convertVietnameseToEnglish(
          args.employee_name
            ?.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
        )?.trim() ?? '',
        (args.department ?? '').trim(),
        (args.position ?? '').trim(),
        (args.invalid_type ?? '').trim(),
        (args.reason ?? '').trim(),
        (args.reviewer ?? '').trim(),
        args.invalid_date ?? '',
        args.real_time_attendance_data ?? '',
        args.validation_data ?? '',
        args.shift_from ?? '',
        args.shift_to ?? '',
        args.shift_break ?? '',
        args.validated ?? '',
        args.remarks ?? '',
        args.date_from ?? '',
        args.date_to ?? '',
        args.page_size ?? '',
        args.page ?? '',
        args.company_id ?? '',
        '',
        transformedData.length > 0
          ? transformedData
          : [
              ['invalid_date', '>=', `${firstDayOfMonth}`],
              ['invalid_date', '<=', `${lastDayOfMonth}`],
            ],
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
        data: mapShift(res?.result.result),
        total: res?.result.total_records,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
export interface IUpdateInvalidTimesheetArgs {
  id: number;
  reason: string;
  remarks: string;
  validated: string;
  invalid_type: string;
  keep_in_time: boolean;
}
export const updateInvalidTimeeSheet = async (args: any) => {
  let url = INVALID_TIMESHEET.CREATE;
  let requestBody = {
    params: {
      args: [
        args.id ?? '',
        args.reason ?? '',
        args.remarks ?? '',
        args.validated ?? '',
        args.invalid_type ?? '',
        args.keep_in_time ?? '',
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
      results: res?.result,
    };
  } catch (error) {}
};

export const updateInvalidTimeeSheet2 = async (args: string[]) => {
  let url = INVALID_TIMESHEET.CREATE2;
  let requestBody = {
    params: {
      args: [args],
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return {
      results: res?.result,
    };
  } catch (error) {}
};
