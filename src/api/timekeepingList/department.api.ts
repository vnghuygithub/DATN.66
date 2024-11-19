import { request } from "../request";
import { DOMAIN_AUDIT_LOG_HISTORY, GET_DEPARTMENT } from "../constApi";
import { mapEmployeeLog } from '../employee/transform';
import { message as $message } from 'antd';
export const getListDepartment = async () => {
  const res = await request("get", GET_DEPARTMENT.GETALL + '&filter=[["company_id" , "=" , ' + localStorage.company_id + "]]");
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const getListSubDepartment = async (id?:number) => {
  const res = await request("get", GET_DEPARTMENT.GETALL + `&filter=[["company_id" , "=" , ${id ?? Number(localStorage.getItem('company_id'))}]]`);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;

};
export const getListNewDepartment = async () => {
  const res = await request("get", GET_DEPARTMENT.GETALL + '&filter=[["company_id" , "!=" , ' + localStorage.company_id + "]");
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const getListNewDepartmentForm = async (id: number) => {
  if (id) {
    const res = await request("get", GET_DEPARTMENT.GETALL + `&filter=[["company_id" , "=" , ${localStorage.company_id}],["id","!=","${id}"]]`);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  }
  else {
    const res = await request("get", GET_DEPARTMENT.GETALL + '&filter=[["company_id" , "=" , ' + localStorage.company_id + "]]");
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  }
};

export const getListAllocationDepartment = async (company_id: number) => {
  if (company_id) {
    const res = await request("get", GET_DEPARTMENT.GETALL + '&filter=[["company_id" , "=" , ' + company_id + "]]");
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } else {
    const res = await request("get", GET_DEPARTMENT.GETALL + '&filter=[["company_id" , "=" , ' + 0 + "]]");
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  }
}

export const getDepartmentLog = async () => {
  let url = DOMAIN_AUDIT_LOG_HISTORY.GET + `/?filter=[["user_id","=",${localStorage.user_id}],["model_model","=","hr.department"],["field_name","!=","message_follower_ids"],["field_name","!=","complete_name"],["field_name","!=","parent_path"],["field_name","!=","master_department_id"]]`;
  try {
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return {
      results: {
        data: mapEmployeeLog(res?.result),
        total: res?.count
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export const getListDepartmentHO = async (department_id?: number, company_id?: number) => {
  let url = `object/hr.department/get_department_list`
  let requestBody = {
    params: {
      args: [
        department_id ?? '',
        company_id ?? '',
        "",
        "",
        "",
        "",
        ""
      ]
    }
  }
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res?.result;
  } catch (error) {
    console.log(error)
  }
}


export const getListDepartmentHO2 = async (company_id?: number,department_id?: number) => {
  let url = `object/hr.department/get_department_list`
  let requestBody = {
    params: {
      args: [
        department_id ?? '',
        company_id ?? '',
        "",
        "",
        "",
        "",
        ""
      ]
    }
  }
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res?.result;
  } catch (error) {
    console.log(error)
  }
}
export const getListDepartmentNoRight = async (company_id?: number) => {
  const res = await request("get", GET_DEPARTMENT.GETNORIGHT + `/${company_id}`);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;

}