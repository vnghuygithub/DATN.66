import { IEmployeeAllocationArgs } from '@/interface/employeeAllocation/employeeAllocation';
import { request } from '../request';
import { DOMAIN_EMPLOYEE_COMPANY_ALLOCATION } from '../constApi';
import { mapEmployeeAllocation } from './transform';
import { mapEmployeeLog } from '../employee/transform';
import { message as $message } from 'antd';
import { Item } from '../department/department.api';
export const getEmployeeAllocationLog = async () => {
  let url = DOMAIN_EMPLOYEE_COMPANY_ALLOCATION.LOG;
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
export const createEmployeeAllocation = async (
  args: IEmployeeAllocationArgs
) => {
  let url = DOMAIN_EMPLOYEE_COMPANY_ALLOCATION.CREATE;
  let requestBody = {
    params: {
      data: {
        ...args,
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
export const createEmployeeAllocatioV2 = async (data: any) => {
  let url = DOMAIN_EMPLOYEE_COMPANY_ALLOCATION.CREATEV2;
  let requestBody = {
    params: {
      args: [data],
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
export const getEmployeeAllocationById = async (id: number) => {
  let url =
    DOMAIN_EMPLOYEE_COMPANY_ALLOCATION.GETBYID +
    id +
    '/?query={id,name,hr_employee_allocation_v2_url_ids{id,name,url},current_job_id{id,name},new_job_id_date,company_id{id,name},department_id{id,name},employee_ids{id,name,code},state,current_company_id{id,name},approved_date,approved_by,new_company_working_date,severance_day_old_company,create_date,allocation_type,new_department_working_date,severance_day_old_department,current_department_id{id,name},contract_type_id{id,name},date_end,date_sign,contract_name,job_id{id,name}}';
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

export const getListEmployeeAllocation = async (
  args: IEmployeeAllocationArgs
) => {
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
  let url = DOMAIN_EMPLOYEE_COMPANY_ALLOCATION.GET;
  let requestBody = {
    params: {
      args: [
        args.current_department_id ?? '',
        args.allocation_type ?? '',
        args.department_id ?? '',
        args.state ?? '',
        args.employee_ids ?? '',
        (args.name ?? '').trim(),
        args.approved_date ?? '',
        args.create_date ?? '',
        args.contract_name ?? '',
        args.page_size ?? '',
        args.create_date
          ? 1
          : args.company_id
          ? 1
          : args.department_id
          ? 1
          : args.state
          ? 1
          : args.employee_ids
          ? 1
          : args.name
          ? 1
          : args.approved_date
          ? 1
          : args.page_size
          ? 1
          : args.page_number ?? '',
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
        data: mapEmployeeAllocation(res?.result?.result),
        total: res?.result?.total_records,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
export const getListJobEmployeeAllocation = async (
  args: IEmployeeAllocationArgs
) => {
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
  let url = DOMAIN_EMPLOYEE_COMPANY_ALLOCATION.GETJOB;
  let requestBody = {
    params: {
      args: [
        args.current_department_id ?? '',
        args.allocation_type ?? '',
        args.department_id ?? '',
        args.state ?? '',
        args.employee_ids ?? '',
        (args.name ?? '').trim(),
        args.approved_date ?? '',
        args.create_date ?? '',
        args.contract_name ?? '',
        args.page_size ?? '',
        args.create_date
          ? 1
          : args.company_id
          ? 1
          : args.department_id
          ? 1
          : args.state
          ? 1
          : args.employee_ids
          ? 1
          : args.name
          ? 1
          : args.approved_date
          ? 1
          : args.page_size
          ? 1
          : args.page_number ?? '',
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
        data: mapEmployeeAllocation(res?.result?.result),
        total: res?.result?.total_records,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export const denyAllocation = async (id: number) => {
  let url = DOMAIN_EMPLOYEE_COMPANY_ALLOCATION.DENY;
  let requestBody = {
    params: {
      args: [id],
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error);
      return;
    } else {
      $message.success('Hủy phiếu điều chuyển nhân viên thành công');
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const approveAllocation = async (id: number) => {
  let url = DOMAIN_EMPLOYEE_COMPANY_ALLOCATION.APPROVE;
  let requestBody = {
    params: {
      args: [id],
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error);
      return;
    } else {
      $message.success('Duyệt phiếu điều chuyển nhân viên thành công');
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllocation = async (id: number) => {
  let url = DOMAIN_EMPLOYEE_COMPANY_ALLOCATION.DELETE + '/' + id;

  try {
    const res = await request('delete', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    } else {
      $message.success('Xóa phiếu điều chuyển nhân viên thành công');
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateAllocation = async (
  args: IEmployeeAllocationArgs,
  id: number
) => {
  let url = DOMAIN_EMPLOYEE_COMPANY_ALLOCATION.PUT + id;
  let requestBody = {
    params: {
      data: {
        ...args,
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
