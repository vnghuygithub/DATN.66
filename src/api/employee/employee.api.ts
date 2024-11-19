import {
  IEmployeeeList,
  IFilterEmployeesArgs,
  IFilterEmployeesParams,
  IFilterShiftsParams,
} from '@/interface/employees/employee';
import {
  DOMAIN_AUDIT_LOG_HISTORY,
  EMPLOYEELIST,
  SHIFTSLIST,
} from '../constApi';
import { request } from '../request';
import {
  mapEmployee,
  mapEmployeeDtoToEmployeee,
  mapEmployeeLog,
} from './transform';
import { convertVietnameseToEnglish } from '@/utils/common';
import moment, { Moment } from 'moment';
import exp from 'constants';
import { message as $message } from 'antd';
import { Item } from '../department/department.api';
import { useLocation } from 'react-router-dom';

export const getEmployeeLogs = async () => {
  let url =
    DOMAIN_AUDIT_LOG_HISTORY.GET +
    `/?filter=[["user_id","=",${localStorage.user_id}],["model_model","=","hr.employee"],["field_name","!=","leave_manager_id"],["field_name","!=","child_ids"],["field_name","!=","message_ids"],["field_name","!=","work_contact_id"],["field_name","!=","pin"],["field_name","!=","barcode"],["field_name","!=","id_card"],["field_name","!=","has_work_permit"],["field_name","!=","image_256"],["field_name","!=","children"],["field_name","!=","image_128"],["field_name","!=","job_id"]]`;
  try {
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
export const getEmployeeParent = async (id: any) => {
  let url =
    EMPLOYEELIST.PARENT +
    `&filter=[["id","=",${id}],["company_id","=",${Number(
      localStorage.getItem('company_id')
    )}]]`;
  try {
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
export const getEmployeeByCompanyId = async (id: number) => {
  let url = `api/hr.employee/?query={id,name,code}&filter=[["company_id","=",${id}]]`;
  try {
    const res = await request('get', url);
    return res;
  } catch (error) {
    console.log(error);
  }
};
const getEmployeeForParentId = async () => {
  let url = EMPLOYEELIST.PARENT;
  try {
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

export const getEmployeeParentNoArgs = async (employeeId: any) => {
  const employeeParent = await getEmployeeForParentId();
  if (employeeParent) {
    let employeeParentId = employeeParent?.result?.filter(
      (item: any) => item.id == employeeId
    )?.parent_id;
    let url = EMPLOYEELIST.PARENT;
    if (employeeParentId) {
      url = EMPLOYEELIST.PARENT;
    }
    try {
      const res = await request('get', url);
      if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  }
};
export const getEmployeeParentNoArgsV2 = async () => {
  let url =
    EMPLOYEELIST.PARENT +
    `&filter=[["company_id","=",${Number(
      localStorage.getItem('company_id')
    )}]]`;
  try {
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

export const getListEmployeeV2 = async (id?: number, domain_search?:any) => {
  let url = EMPLOYEELIST.GETALL;
  const res = await request('post', url, {
    params: {
      args: [
        '', 
        '', 
        '', 
        id ?? '', 
        '', 
        '', 
        '', 
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        domain_search ?? '',
      ],
    },
  });
  return res;
};

export const getListEmployeeKPI = async () => {
  let url = EMPLOYEELIST.GETFORKPI;
  const res = await request('post', url, {
    params: {
      args: ['', '', '', '', '', '', '', ''],
    },
  });
  return res;
};

export const getListEmployeCC = async () => {
  let url = EMPLOYEELIST.GETCC;
  const res = await request('get', url);
  return res;
};
export const getListEmployeeV2Allocation = async (id: number | boolean) => {
  let url = EMPLOYEELIST.GETALL;
  const res = await request('post', url, {
    params: {
      args: ['', '', '', id, '', '', '', ''],
    },
  });
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const getListEmployeeV2AllocationCurrent = async () => {
  let url = EMPLOYEELIST.GETALL;
  const res = await request('post', url, {
    params: {
      args: ['', '', '', '', '', '', '', ''],
    },
  });
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const deleteEmployee = async (id: number) => {
  let url = EMPLOYEELIST.DELETE;
  let requestBody = {
    params: {
      args: [id],
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
export const createNewEmployee = async (data: IEmployeeeList) => {
  let url = EMPLOYEELIST.CREATE;
  let requestBody = {
    params: {
      data: {
        ...data,
      },
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

export const changeUserPassword = async (id: number, password: string) => {
  let url = EMPLOYEELIST.CHANGEPASSWORD;
  let requestBody = {
    params: {
      args: [id, password],
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

export const updateAlClAdvanced = async (data: any) => {
  let url = EMPLOYEELIST.UPDATEALCLADVANCED;
  let requestBody = {
    params: {
      args: data,
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

export const createUserFromEmployee = async (id: number) => {
  let url = EMPLOYEELIST.CREATEUSER;
  let requestBody = {
    params: {
      args: [id],
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

export const getEmployeeByArgs = async (args: IFilterEmployeesArgs) => {
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
  let url = EMPLOYEELIST.GETALL;
  let requestBody = {
    params: {
      args: [
        args.name
          ? convertVietnameseToEnglish(
              args.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
            )
              .toLowerCase()
              .trim()
          : '',
        (args.code ?? '').trim(),
        (args.mobile_phone ?? '').trim(),
        args.department_id ?? '',
        (args.job_title ?? '').trim(),
        (args.work_email ?? '').trim(),
        (args.severance_day ?? '').trim(),
        (args.time_keeping_code ?? '').trim(),
        (args.user_id ?? '').trim(),
        args.page_size ?? '',
        args.page ?? '',
        args.company_id ?? '',
        args.employee_ho ?? '',
        args.is_servered ?? '',
        args.work_location ?? '',
        args.gender ?? '',
        args.workingday ?? '',
        args.resource_calendar_id ?? '',
        args.level ?? '',
        args.time_keeping_count ?? '',
        args.marital ?? '',
        (args.identification_id ?? '').trim(),
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
        data: mapEmployee(res?.result.result),
        total: res?.result.total_records,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export const getListShifts = async (filters: IFilterShiftsParams) => {
  let url =
    SHIFTSLIST.SEARCH +
    `&filter=[["name","like",{{${filters.name}}}],["company","like",{{${filters.job}}}],["department_id","like",{{${filters.department_id}}}],["manager","like",{{${filters.manager}}}]]`;
  const res = await request('get', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const getEmployeeById = async (id: any) => {
  let listquery =
    '/?query={id,probationary_salary_rate,employee_ho,religion_id{id,name},work_phone,personal_email,social_insurance_number,coach_id{id,name},parent_id{id,name,work_email},part_time_job_title,employee_type,code,name,time_keeping_code,work_email,company_id{id,name},department_id{id,name},job_id{id,name},city_id{id,name},place_of_birth,district_id{id,name},ward_id{id,name},country_id{id,name},mobile_phone,private_email,work_email,gender,certificate,study_field,resource_calendar_id{id,name},workingday,severance_day,bank,bank_branch,bank_account_number,tax_id,head_of_department_check,general_management_check,department_secretary_check,resource_calendar_type,union_day,part_time_company_id{id,name},part_time_department_id{id,name},annual_leave_fund,birthday,gender,nation_id{id,name},marital,identification_id,issued_by_identification{id,name},current_place_of_residence,certificate,highest_degree,study_school,study_field,car_registration,license_plates,range_of_vehicle,car_color,district_vietnam_id{id,name,state_id},state_id{id,name,country_id},ward_vietnam_id{id,name,district_id},probationary_contract_termination_date,job_title,permanent_address,issued_by_identification_text,issued_by_identification_day,user_id{id},time_keeping_count,hr_employee_relative_ids{id,name,relationship,birthday,phone,family_allowances,note,job},date_sign,user_id{id,name},level,weekly_report_is_mandatory,user_ids{id,name},is_accountant,work_location{id,name},working_status,sub_admin_role,prev_year_al_date,prev_year_cl_date,advanced_al_date,bank_id{id,name},hr_employee_url_ids{id,name,url},it_ho_check,it_branch_check,current_shift_name,from_date}';

  let url = `${EMPLOYEELIST.GETBYID}${id}${listquery}`;
  const res = await request('get', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const getEmployeeProfile = async (code: any) => {
  let url = `${EMPLOYEELIST.GETBYIDEMPLOYEE}/${code}`;
  const res = await request('post', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const putEmployeeById = async (id: number, data: any) => {
  let url = `${EMPLOYEELIST.GETBYID}${id}`;
  const res = await request('post', url, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const deleteEmployeeRelativeById = async (id: number) => {
  let url = `api/hr.employee.relative/${id}`;
  const res = await request('delete', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const deleteEmployeeRelativeByIdParent = async (id: number) => {
  let url = `api/hr.employee.relative.register/${id}`;
  const res = await request('delete', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const getEmployeeRelativeByEmployeeId = async (id: any) => {
  let url = `api/hr.employee.relative/?filter=[["employee_id","=",${id}]]`;
  const res = await request('get', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const getEmployeeRelativeByEmployeeIds = async (id: any) => {
  let url = `api/hr.employee.relative.register/?filter=[["apec_register_employee_id","=",${id}]]`;
  const res = await request('get', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const getEmployeeRelativeByEmployeeCode = async (code: any) => {
  let url = `/employee_relative_list_by_code/` + code;
  const res = await request('get', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const geEmployeeHeadOfDepartment = async () => {
  let url = EMPLOYEELIST.GETHEADOFDEPARTMENT;
  let requestBody = {
    params: {
      args: ['', ''],
    },
  };
  const res = await request('post', url, requestBody);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const getEmployeeGeneralManager = async () => {
  let url = EMPLOYEELIST.GETGENERALMANAGER;
  let requestBody = {
    params: {
      args: ['', ''],
    },
  };
  const res = await request('post', url, requestBody);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
