import { request } from "../request";
import { GET_JOB_LIST } from "../constApi";

export const getListJob = async () => {
    const res = await request("get", GET_JOB_LIST.GETALL);
    return res;
}

export const getListJobNoRight = async (department_id :any) => {
    const res = await request("get", GET_JOB_LIST.GETALLNORIGHT + `/${department_id}`);
    return res;
}


