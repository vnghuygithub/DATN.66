import { request } from '../request';
import {
  DASHBOARD_EMPLOYEE,
  DASHBOARD_EMPLOYEE_MIS,
  GET_LIST_LEAVE,
} from '../constApi';
import { message as $message } from 'antd';

interface IEmployeeDashBoard {
  total_employee: number;
  total_employee_male: number;
  total_employee_female: number;
}

export const getEmployeeDashBoard = async (arg: IEmployeeDashBoard) => {
  const employeeId = '6226';
  const token = localStorage.getItem('token');
  try {
    let url = DASHBOARD_EMPLOYEE.POST;
    let requestBody = {
      params: {
        args: [employeeId],
      },
    };

    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }

    return {
      results: {
        data: res?.result?.result,
        total: res?.result?.total_employee,
        female: res?.result?.total_employee_female,
        male: res?.result?.total_employee_male,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export const getEmployeeDashBoard_mis = async (
  pageSize: number,
  pageNumber: number
) => {
  try {
    let url = DASHBOARD_EMPLOYEE_MIS.POST;
    let requestBody = {
      params: {
        args: [pageSize, pageNumber],
      },
    };

    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }

    return {
      results: {
        data: res?.result?.result,
        total: res?.result?.total_records,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export const getEmployeeweeklyreport_mis = async (

) => {
  try {
    let url = DASHBOARD_EMPLOYEE_MIS.GET;
  

    const res = await request('post', url, {});
    console.log(res,"===-------")
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }

    return {
      results: {
        data: res?.result,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
interface IRemainingAlClDashBoard {
  remaining_cl: number;
  remaining_leave: number;
}

export const getRemainingAlClDashBoard = async (
  arg: IRemainingAlClDashBoard,
  companyName: string,
  employeeCode: string
) => {
  try {
    const token = localStorage.getItem('token');
    let url = GET_LIST_LEAVE.GETREMAININGLEAVE;
    let requestBody = {
      params: {
        args: [companyName, employeeCode],
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
      },
    };
  } catch (error) {
    console.log(error);
  }
};
