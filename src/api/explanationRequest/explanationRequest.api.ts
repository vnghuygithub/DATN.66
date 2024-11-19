import { IExplanationColumn } from "@/interface/explanation/explanation";
import { request } from "../request";
import { mapExplainationLog, mapShift } from "./transform";
import { DOMAIN_AUDIT_LOG_HISTORY, EXPLANATION_REQUEST } from "../constApi";
import { message as $message } from 'antd';
export const getExplainationById = async (id: number) => {
    const url = `api/hr.leave/${id}/?query={id,name,state,holiday_request_url_ids{id,name,url,mime_type},for_reasons,reasons,holiday_status_id,date_from,date_to,minutes,employee_parent_id,multiplier_work_time,multiplier_wage,hr_approval_id,work_trip_location,state,attendance_missing_from,attendance_missing_to}`;
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}
export const putExplainationById = async (id: number, body: any) => {
    const url = `api/hr.leave/${id}`;
    const res = await request('post', url, {
        params: {
            data: {
                ...body
            }
        }
    });
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}
export const getExplainationLog = async () => {
    let url = DOMAIN_AUDIT_LOG_HISTORY.GET + `/?filter=[["user_id","=",${localStorage.user_id}],["model_model","=","hr.invalid.timesheet"],["field_name","!=","validation_data"],["field_name","!=","real_time_attendance_data"],["field_name","!=","row_number"]]`;
    try {
        const res = await request('get', url)
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return {
            results: {
                data: mapExplainationLog(res?.result),
                total: res?.count
            }
        }

    } catch (error) {
        console.log(error)
    }
}
export const getListExplanation = async (params: IExplanationColumn) => {
    let url = EXPLANATION_REQUEST.SEARCH;
    if (
        params.time_keeping_code ||
        params.employee_code ||
        params.employee_name
    ) {
        url += `/?filter=`;
    }
    let filterArr = [];
    if (params.time_keeping_code) {
        filterArr.push(`"|"+ ["time_keeping_code","ilike","${params.time_keeping_code?.trim()}"]`)
    }
    if (params.employee_code) {
        filterArr.push(`"|"+ ["employee_code","ilike","${params.employee_code?.trim()}"]`)
    }
    if (params.employee_name) {
        filterArr.push(`"|"+ ["employee_name","ilike","${params.employee_name?.trim()}"]`)
    }
    if (params.shift_name) {
        filterArr.push(`["shift_name","ilike","${params.shift_name?.trim()}"]`)
    }
    if (filterArr.length > 0) {
        url += '[' + [filterArr].toString() + ']' + '&order="date asc';
    }
    // const url = 'api/hr.apec.attendance.report?filter=["|",["time_keeping_code","like","OFF"],"|",["employee_code","like","OFF"],"|",["employee_name","like","OFF"],["shift_name","like","OFF"]]&order="date asc"'
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return {
        results: {
            data: mapShift(res?.result),
            total: res?.count,
        },
    }
}
