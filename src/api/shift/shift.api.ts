import { historyShiftEditBody } from './../../interface/weeklyreport/type';
import { DOMAIN_AUDIT_LOG_HISTORY, HISTORY_SHIFT_EDIT, SHIFTSLIST, SHIFTS } from "../constApi";
import { ICreateShiftBody, IFilterShiftsParams } from "@/interface/shifts/shifts";
import { request } from "../request";
import { mapShift, mapShiftV2 } from "./transform";
import { mapEmployeeLog } from '../employee/transform';
import { message as $message } from 'antd';
export interface IShiftArgs {
    name?: string;
    page_size?: number;
    page?: number;
    company_id?: number;
}
export const getShiftV2 = async (args: IShiftArgs) => {
    let url = SHIFTS.GETV2
    let requestBody = {
        params: {
            args: [
                args.name ?? "",
                args.page_size ?? "",
                args.page ?? "",
                args.company_id ?? ""
            ]
        }
    }
    try {
        const res = await request('post', url, requestBody);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return {
            results: {
                data: mapShiftV2(res?.result.records),
                total: res?.result.total_records,
            }

        }
    } catch (error) {

    }

}
export const deleteShiftById = async (id: number) => {
    try {
        const res = await request('delete', SHIFTSLIST.DELETE + "/" + id);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res;
    } catch (error) {
        console.log(error)
    }
}
export const getShiftLog = async () => {
    let url = DOMAIN_AUDIT_LOG_HISTORY.GET + `/?filter=[["user_id","=",${localStorage.user_id}],["model_model","=","shifts"]]`;
    console.log(url)
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
        console.log(error)
    }
}
export const getNewShift = async (id: number) => {
    let url = SHIFTSLIST.SEARCH
    let filterArr = [];
    filterArr.push(`["company_id","=",${id}]`)
    if (filterArr.length > 0) {
        url += '&filter=' + '[' + [filterArr].toString() + ']';
    }
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}
export const getCurrentShift = async () => {
    let url = SHIFTSLIST.SEARCH
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}


export const getListShifts = async (params: IFilterShiftsParams) => {
    let url = SHIFTSLIST.SEARCH
    let current_user_company_id = localStorage.getItem('company_id');
    let filterArr = [];
    filterArr.push(`["company_id","=",${current_user_company_id}]`);
    if (params.name) {
        filterArr.push(`["name","like","${params.name.trim()}"]`)
    }
    if (params.c_start_work_time) {
        filterArr.push(`["c_start_work_time","like","${params.c_start_work_time}"]`)
    }
    if (params.c_end_work_time) {
        filterArr.push(`["c_end_work_time","like","${params.c_end_work_time}"]`)
    }
    if (params.c_start_rest_time) {
        filterArr.push(`["c_start_rest_time","like","${params.c_start_rest_time}"]`)
    }
    if (params.c_end_rest_time) {
        filterArr.push(`["c_end_rest_time","like","${params.c_end_rest_time}"]`)
    }
    if (filterArr.length > 0) {
        url += '&filter=' + '[' + [filterArr].toString() + ']';
    }


    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return {
        results: {
            data: mapShift(res?.result?.reverse()),
            total: res?.count,
        },
    };
}

export const createShift = async (body: ICreateShiftBody) => {
    const res = await request('post', SHIFTSLIST.CREATE, body);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
};

export const updateShift = async (body: ICreateShiftBody, id: string | undefined) => {
    const res = await request('post', SHIFTSLIST.UPDATE + "/" + id, body);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
};

export const getShiftById = async (id: number) => {
    const res = await request('get', SHIFTSLIST.UPDATE + "/" + id);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}

export const getHistoryEditById = async (body: historyShiftEditBody) => {
    const res = await request('post', HISTORY_SHIFT_EDIT.SEARCH, body)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}

export const getShiftByIds = async (day_shift_array: Array<any>) => {
    let url = SHIFTSLIST.GETBYIDS
    let requestBody = {
        params: {
            args: [day_shift_array]

        }
    }
    try {
        const res = await request('post', url, requestBody);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res.result
    } catch (error) {
        console.log(error)
    }
}

