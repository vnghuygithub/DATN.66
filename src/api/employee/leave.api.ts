import { ILeaveAllocationArgs, ILeaveManagement } from "@/interface/leaveManagement"
import { request } from "../request";
import { CREATE_LEAVE_ALLOCATION, GET_EMPLOYEE_LEAVE } from "../constApi";
import { ILeaveManagementArgs } from "@/interface/leaveManagement";
import { convertVietnameseToEnglish } from "@/utils/common";
import moment from "moment";
import { IEmployeeLog } from "@/interface/employees/employee";
import { message as $message } from 'antd';
import { Item } from "../department/department.api";
export const getLeaveLogs = async (args: IEmployeeLog) => {
    let url = GET_EMPLOYEE_LEAVE.LOG + `?filter=[["user_id","=",${localStorage.user_id}],["model_model","=","hr.al.report"]]`;
    try {
        const res = await request('get', url);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        if (res) {
            return res
        }
    } catch (err) {
        console.log(err)
    }
}
export const getLeaveById = async (id: number) => {
    let url = GET_EMPLOYEE_LEAVE.PUT + id;
    try {
        const res = await request('get', url);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        if (res.note) {
            return res
        }
    }
    catch (error) {
        console.log(error)
    }
}

export const updateEmployeeLeave = async (id: number, data: any) => {
    let url = GET_EMPLOYEE_LEAVE.PUT + id;
    try {
        const res = await request('post', url, data);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res
    }
    catch (error) {
        console.log(error)
    }
}
export const getEmployeeLeaveList = async (args: ILeaveManagementArgs) => {
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
    let url = GET_EMPLOYEE_LEAVE.GETALL;
    let currentYear = new Date().getFullYear();
    currentYear = parseInt(currentYear.toString());
    let year = args.year ? moment(args.year).toDate().getFullYear() : currentYear;
    let requestBody = {
        params: {
            args: [
                args.employee_id ?? '',
                (args.employee_code ?? '').trim(),
                args.department_id ?? '',
                (args.job_title ?? '').trim(),
                args.date_calculate_leave ?? '',
                args.year ? moment(args.year).toDate().getFullYear() : "" ,
                args.page_size ?? '',
                args.page ?? '',
                args.company_id ?? '',
                transformedData
            ]
        }
    }
    try {
        const res = await request('post', url, requestBody);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        if (res) {
            return {
                results: {
                    data: mapLeave(res?.result?.result),
                    total: res?.result?.total_records
                }
            }
        }
    }

    catch (error) {
        console.log(error)
    }
}
export const calculateEmployeeLeave = async () => {
    let url = GET_EMPLOYEE_LEAVE.CALCULATE;
    let requestBody = {
        params: {
            args: [
                Number(localStorage.company_id)
            ]
        }
    }
    try {
        const res = await request('post', url, requestBody);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res
    }
    catch (error) {
        console.log(error)
    }

}
export interface IAl {
    id: number,
    year: number,
    date_calculate_leave: string,
    employee_id: Array<any>,
    employee_name: string,
    employee_code: string,
    department_id: Array<any>,
    department_name: string,
    job_title: string,
    standard_day: number,
    workingday: string,
    company_id: Array<any>,
    company_name: string,
    family_leave: string,
    date_sign: string,
    date_apply_leave: string,
    severance_day: string,
    seniority_leave: number,
    leave_increase_by_seniority_leave: number,
    leave_day: number,
    leave_year: number,
    remaining_leave: number,
    january: number,
    february: number,
    march: number,
    april: number,
    may: number,
    june: number,
    july: number,
    august: number,
    september: number,
    october: number,
    november: number,
    december: number,
    leave_used: number,
    remaining_leave_minute: number,
    remaining_leave_day: number,
    note: string,
    file: any

}
export const mapLeave = (res: IAl[]) => {
    return res && res.length > 0 && res.filter(item => item !== undefined).map((item:any, index:any) => {
    
            const employee_id = item.employee_id ?? []
            const department_id = item.department_id ?? []
            const date_calculate_leave = item.date_calculate_leave ?? moment(item.date_calculate_leave)
            const company_id = item.company_id ?? []
            return {
                no: index + 1,
                id: item.id,
                company_id: company_id[0] ?? '',
                company_name: item.company_id[1] ?? '',
                employee_id: employee_id[0] ?? '',
                employee_code: item.employee_code ?? '',
                employee_name: item.employee_id[1] ?? '',
                family_leave: item.family_leave ?? '',
                department_id: department_id[0] ?? '',
                department_name: item.department_id[1] ?? '',
                job_title: item.job_title ?? '',
                date_calculate_leave: date_calculate_leave,
                standard_day: item.standard_day ?? '',
                workingday: item.workingday ? moment(item.workingday) : '',
                date_sign: item.date_sign ? moment(item.date_sign) : '',
                date_apply_leave: item.date_apply_leave ? moment(item.date_apply_leave) : '',
                severance_day: item.severance_day ? moment(item.severance_day) : '',
                seniority_leave: item.seniority_leave ?? '',
                leave_increase_by_seniority_leave: item.leave_increase_by_seniority_leave ?? '',
                leave_day: item.leave_day ?? '',
                leave_year: item.leave_year ?? '',
                remaining_leave: item.remaining_leave ?? '',
                january: item.january ?? '',
                february: item.february ?? '',
                march: item.march ?? '',
                april: item.april ?? '',
                may: item.may ?? '',
                june: item.june ?? '',
                july: item.july ?? '',
                august: item.august ?? '',
                september: item.september ?? '',
                october: item.october ?? '',
                november: item.november ?? '',
                december: item.december ?? '',
                leave_used: item.leave_used ?? '',
                remaining_leave_minute: item.remaining_leave_minute ?? '',
                remaining_leave_day: item.remaining_leave_day ?? '',
                note: item.note ?? '',
                file: item.file ?? ''
        }
    })
}