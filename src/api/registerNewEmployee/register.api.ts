import { request } from '@/api/request';
import { REGISTER_NEW_EMPLOYEE } from '../constApi';
import { message as $message } from 'antd';

export const registerNewEmployee = async (data: any) => {
  let url = REGISTER_NEW_EMPLOYEE.POST;
  const res = await request('post', url, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const registerNewEmployeeParent = async (data: any) => {
  let url = REGISTER_NEW_EMPLOYEE.POST2;
  const res = await request('post', url, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const sendMailIT = async (data: any) => {
  const requestBody = {
    params: {
      args: [data],
    },
  };
  let url = REGISTER_NEW_EMPLOYEE.MAILIT;
  const res = await request('post', url, requestBody);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const sendMailEmployee = async (data: any) => {
  const requestBody = {
    params: {
      args: [data],
    },
  };
  let url = REGISTER_NEW_EMPLOYEE.MAILEMPLOYEE;
  const res = await request('post', url, requestBody);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
const is_general_manager = localStorage.getItem('is_general_manager');
const is_general_managerCheck = is_general_manager === 'true';

export const getRegisterNewEmployee = async () => {
  if (is_general_managerCheck) {
    const body = {
      params: {
        args: ['', '', '', '', '', '', '', '', ''],
      },
    };

    let url = REGISTER_NEW_EMPLOYEE.GETBYCOMPANY;
    const res = await request('post', url, body);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return {
      results: {
        data: res?.result?.records?.reverse(),
        total: res?.total_records,
      },
    };
  } else {
    let url =
      REGISTER_NEW_EMPLOYEE.GET + `&filter=[["employee_code","=",false]]`;
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return {
      results: {
        data: res?.result?.reverse(),
        total: res?.count,
      },
    };
  }
};

const is_administrative = localStorage.getItem('is_administrative');
const checkAdministrative = is_administrative === 'true';
export const getRegisterNewEmployeeVer2 = async () => {
  if (checkAdministrative) {
    let url =
      REGISTER_NEW_EMPLOYEE.GET + `&filter=[["employee_code","!=",false]]`;
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return {
      results: {
        data: res?.result?.reverse(),
        total: res?.count,
      },
    };
  } else {
    let url =
      REGISTER_NEW_EMPLOYEE.GET +
      `&filter=[["employee_code","=","${localStorage.getItem(
        'employeeCode'
      )}"]]`;
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return {
      results: {
        data: res?.result?.reverse(),
        total: res?.count,
      },
    };
  }
};

export const getRegisterNewEmployeeDetail = async (id: number) => {
  let url =
    REGISTER_NEW_EMPLOYEE.GETById +
    id +
    '/?query={id,parent_id{id,name},number_of_children,name,company_id{id,name,mis_id},department_id{id,name},job_id{id,name},start_work_date,date_of_birth,citizen_id,verified_citizen_id_date,verified_citizen_id_by,tax_number,social_insurance_number,original_address,current_address,license_plate,vehicle_info,bidv_info,status,gender,register_employee_url_ids{id,name,url,image_type},weekly_report_is_mandatory,employee_ids{id,company_id{mis_id}},employee_code,apec_group_mail_ids{id,name,email},work_location{id,name},work_email,personal_email,time_keeping_code,resource_calendar_id{id,name},mobile_phone}';
  const res = await request('get', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const registerNewEmployeeUpdate = async (data: any) => {
  let url = REGISTER_NEW_EMPLOYEE.UPDATE;
  const res = await request('post', url, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
  }
  return res;
};
export const verifyRegisterNewEmployee = async (id: any) => {
  let url = REGISTER_NEW_EMPLOYEE.VERIFY;
  const body = {
    params: {
      args: [id],
    },
  };
  const res = await request('post', url, body);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const verifyRegisterNewEmployee2 = async (id: any) => {
  let url = REGISTER_NEW_EMPLOYEE.VERIFY;
  const body = {
    params: {
      args: [id],
    },
  };
  const res = await request('post', url, body);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const declineRegisterNewEmployee = async (id: any) => {
  let url = REGISTER_NEW_EMPLOYEE.DECLINE;
  const body = {
    params: {
      args: [id],
    },
  };
  const res = await request('post', url, body);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
