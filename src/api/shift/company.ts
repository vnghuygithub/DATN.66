import { request } from "../request";
import { DOMAIN_GET_CONTRACT, GET_COMPANY } from "../constApi";
import { message as $message } from 'antd';
export const getListCompany: any = async () => {
  const res = await request('get', GET_COMPANY.GETALL);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res
};

export const getCompanyByEmployeeId = async (id: number) => {
  let url = GET_COMPANY.GETBYID
  let requestBody = {
    params: {
      args: [
        id,
        50,
        1
      ]
    }
  }
  const res = await request('post', url, requestBody)
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res
}
export const getListCurrentCompany = async () => {
  const res = await request('get', GET_COMPANY.GETALL + `&filter=[["id","=",${localStorage.company_id}]]`)
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res
}

export const getListNewCompany = async () => {
  const res = await request('get', GET_COMPANY.GETALL + `&filter=[["id","!=",${localStorage.company_id}]]`)
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res
}
export const getCompanyByDepartmentId = async (id: number) => {
  const res = await request('get', GET_COMPANY.GETALL + `&filter=[["department_id","=",${id}]]`)
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res
}

export const getListNewCompanyAllocation = async (id: number) => {
  const res = await request('get', GET_COMPANY.GETALL + `&filter=[["id","!=",${id}]]`)
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res
}

export const getListCompaniesHo = async () => {
  const requestBody = {
    params: {
      args: [""]
    }
  }
  const res = await request('post', GET_COMPANY.GETCOMPANIESHO, requestBody)
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res
}

export const getListCompaniesBypass = async () => {
  const res = await request('get', GET_COMPANY.GETALLNORIGHT)
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res
}