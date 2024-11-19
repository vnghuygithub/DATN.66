import moment from "moment"
import { INSURANCE, INSURANCE_CONFIG } from "../constApi"
import { request } from "../request"
import { message as $message } from 'antd';
import { mapInsurance, mapInsuranceConfig } from "./transform";
export interface IInsuranceArgs {
    employee_id: number
    company_id: number
    month: number
    year: number
    page_size: number
    page: number
    date_start_insurance: string
    have_insurance: boolean
    employee_code: string
    job_id: number
    department_id: number
    date: string
}

export const getInsurance = async (args: IInsuranceArgs) => {
    let url = INSURANCE.GET
    const date = args.date ? moment(args.date).format('YYYY-MM') : ''
    if (date) {
        args.month = moment(date).month() + 1
        args.year = moment(date).year()
    }
    let requestBody = {
        params: {
            args: [
                args.employee_id ?? '',
                args.company_id ?? '',
                args.month ?? '',
                args.year ?? '',
                args.page_size ?? '',
                args.page ?? '',
                args.date_start_insurance ? moment(args.date_start_insurance).format('YYYY-MM-DD') : '',
                args.have_insurance ?? '',
                args.employee_code ?? '',
                args.job_id ?? '',
                args.department_id ?? ''
            ]
        }
    }
    const res = await request('post', url, requestBody)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return {
        results: {
            data: mapInsurance(res?.result?.result),
            total: res?.result?.total_records,
        }
    }
}

export const createInsurance = async (data: any) => {
    let requestBody = {
        params: {
            data: {
                data
            }
        }
    }
    let url = INSURANCE.POST
    const res = await request('post', url, requestBody)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}

export const updateInsurance = async (data: any, id: number) => {
    let requestBody = {
        params: {
            data: {
                data
            }
        }
    }
    let url = INSURANCE.PUT + id
    const res = await request('post', url, requestBody)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}

export const deleteInsurance = async (data: any) => {
    let requestBody = {
        params: {
            data: {
                data
            }
        }
    }
    let url = INSURANCE.DELETE
    const res = await request('post', url, requestBody)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}

export const getInsuranceDetail = async (id: number) => {
    let url = INSURANCE.GETBYID + id
    const res = await request('get', url)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}

export interface IInsuranceConfigArgs {
    company_id: number;
    page_size: number;
    page: number;
    year: number;
    month: number;
    code: number;
    date: string;
}

export const getInsuranceConfig = async (args: IInsuranceConfigArgs) => {
    let url = INSURANCE_CONFIG.GET
    const date = args.date ? moment(args.date).format('YYYY-MM') : ''
    if (date) {
        args.month = moment(date).month() + 1
        args.year = moment(date).year()
    }
    let requestBody = {
        params: {
            args: [
                args.company_id ?? '',
                args.page_size ?? '',
                args.page ?? '',
                args.year ?? '',
                args.month ?? '',
                args.code ?? ''
            ]
        }
    }
    const res = await request('post', url, requestBody)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return {
        results: {
            data: mapInsuranceConfig(res?.result?.result),
            total: res?.result?.total_records,
        }
    }
}

export const createInsuranceConfig = async (data: any) => {
    let requestBody = {
        params: {
            data
        }
    }
    let url = INSURANCE_CONFIG.POST
    const res = await request('post', url, requestBody)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}

export const updateInsuranceConfig = async (data: any, id: number) => {
    let requestBody = {
        params: {
            args: [
                id,
                data
            ]
        }
    }
    let url = INSURANCE_CONFIG.PUTV2
    const res = await request('post', url, requestBody)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}

export const deleteInsuranceConfig = async (id: any) => {
    let url = INSURANCE_CONFIG.DELETE + id
    const res = await request('delete', url)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}

export const getInsuranceConfigDetail = async (id: number) => {
    let url = INSURANCE_CONFIG.GETBYID + id
    const res = await request('get', url)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}

export const importInsurance = async (file: any) => {
    let url = INSURANCE.IMPORT
    var formData = new FormData();
    formData.append("file", file);
    if (!file) {
        $message.error("Vui lòng chọn file");
        return;
    }
    const res = await request("post", url, formData)
    if (res) {
        return "success"
    }
}

