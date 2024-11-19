import { IEmployeeWeeklyReportArgs } from '@/interface/employeeWeeklyReport/employeeWeeklyReport';
import { request } from '../request';
import { message as $message } from 'antd';
import { DOMIAN_HR_WEEKLY_REPORT, DOMAIN_USER_FUNCTION } from '../constApi';
import { mapEmployeeWeeklyReport } from './transform';
import { mapEmployeeLog } from '../employee/transform';
import moment from 'moment';
import { Item } from '../department/department.api';
import dayjs from 'dayjs';

export const getEmployeeWeeklyReport = async (
  args: IEmployeeWeeklyReportArgs
) => {
  const currentDate = dayjs()
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
        transformedData.push(['from_date', '<=', `${endDate}`]);
        transformedData.push(['to_date', '>=', `${startDate}`]);
      } else {
        transformedData.push([item.name, item.fillter, item.valueSearch]);
      }
    }
  });
  try {
    let url = DOMIAN_HR_WEEKLY_REPORT.GET;
    let requestBody = {
      params: {
        args: [
          args.employee_id ?? '',
          args.department_id ?? '',
          args.date ?? '',
          args.state ?? '',
          args.job_title ?? '',
          args.month ? moment(args.month).format('YYYY-MM-DD') : '',
          args.page_size ?? '',
          args.page ?? '',
          args.company_id ?? '',
          transformedData.length > 0
            ? transformedData
            : [
                ['from_date', '<=', `${lastDayOfMonth}`],
                ['to_date', '>=', `${firstDayOfMonth}`],
              ],
        ],
      },
    };
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return {
      results: {
        data: mapEmployeeWeeklyReport(res?.result?.result),
        total: res?.result?.total_records,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export const getEmployeeWeeklyReportLog = async () => {
  try {
    let url = DOMIAN_HR_WEEKLY_REPORT.LOG;
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return {
      results: {
        data: mapEmployeeLog(res?.result),
        total: res?.count,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export const getEmployeeWeeklyReportById = async (id: number) => {
  try {
    let url =
      DOMIAN_HR_WEEKLY_REPORT.GETBYID +
      id +
      `/?query={id,name,book_name,cc{id,name,work_email},attachment_ids{id,name,local_url},employee_id{id,name},department_id{id,name},reviewer{id,name,work_email},review_content,report_content,company_id{id,name},employee_code,from_date,to_date,send_to,cc_email,state,date,hr_weekly_report_url_ids{id,url,name},cc_email_text}`;
    const res = await request('get', url);
    if (res?.error?.code && res.error.code == 400) {
      $message.error(res.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateEmployeeWeeklyReport = async (id: number, data: any) => {
  try {
    let url = DOMIAN_HR_WEEKLY_REPORT.PUT + id;
    let requestBody = {
      params: {
        data: data,
      },
    };
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

export const updateUserSummary = async (data: any) => {
  try {
    const res = await request('post', DOMAIN_USER_FUNCTION.UPDATE, data);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getOneEmployeeWeeklyReport = async () => {
  try {
    let order = JSON.stringify('id DESC');
    let url =
      DOMIAN_HR_WEEKLY_REPORT.GETONE +
      `?query={id,name,cc{id,name,work_email}}&filter=[["employee_id","=",${Number(
        localStorage.getItem('employee_id')
      )}]]&limit=1&order=${order}`;
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
