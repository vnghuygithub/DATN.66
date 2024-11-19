import { IContractArgs, IUpdateContractArgs, ICreateContractArgs } from "@/interface/contract/contract"
import { request } from "../request"
import { DOMAIN_AUDIT_LOG_HISTORY, DOMAIN_GET_CONTRACT, DOMAIN_IMPORT_CONTRACT_API } from "../constApi";
import { mapContract } from "./transform";
import { mapEmployeeLog } from "../employee/transform";
import { message as $message } from 'antd';
import { Item } from "../department/department.api";
export const activeContract = async (id: number) => {
    let url = DOMAIN_GET_CONTRACT.ACTIVE;
    let requestBody = {
        params: {
            args: [
                id
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
    } catch (error) {
        console.log(error)
    }
}

export const getContractLog = async () => {
    let url = DOMAIN_AUDIT_LOG_HISTORY.GET + `/?filter=[["user_id","=",${localStorage.user_id}],["model_model","=","hr.contract"],["field_name","!=","kpi_bonus"],["field_name","!=","kanban_state"],["field_name","!=","message_follower_ids"],["field_name","!=","message_ids"],["field_name","!=","website_message_ids"],["field_name","!=","structure_type_id"],["field_name","!=","Other rewards"],["field_name","!=","job_id"]]`
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
export const updateContractState = async () => {
    let url = DOMAIN_GET_CONTRACT.UPDATE;
    try {
        const res = await request('post', url);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res
    } catch (error) {
        console.log(error)
    }
}
export const createContractByArgs = async (args: ICreateContractArgs) => {
    let url = DOMAIN_GET_CONTRACT.CREATE;
    let requestBody = {
        params: {
            args: [
                (args.name ?? '').trim(),
                args.employee_id ?? '',
                args.salary_rate ?? 0,
                args.date_sign ?? '',
                args.date_start ?? '',
                args.date_end ?? '',
                args.contract_type_id ?? '',
                args.resource_calendar_id ?? '',
                args.wage ?? 0,
                args.minutes_per_day ?? '',
                args.start_end_attendance ?? "",
                args.depend_on_shift_time ?? "",
                args.by_hue_shift ?? "",
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
    } catch (error) {
        console.log(error)
    }
}
export const getContractById = async (id: number) => {
    let url = DOMAIN_GET_CONTRACT.GETALL + `/${id}` + '/?query={id,name,employee_code,employee_id{id,name},job_title,department_id{id,name},resource_calendar_id{id,name},contract_type_id{id,name},date_start,date_end,date_sign,salary_rate,state,wage,indefinite_contract,minutes_per_day,start_end_attendance,depend_on_shift_time,by_hue_shift}';
    try {
        const res = await request('get', url);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res
    } catch (error) {
        console.log(error)
    }
}
export const deleteContractById = async (id: number) => {
    let url = DOMAIN_GET_CONTRACT.GETALL + `/${id}`;
    try {
        const res = await request('delete', url);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res
    } catch (error) {
        console.log(error)
    }
}
export const updateContract = async (args: IUpdateContractArgs) => {
    let url = DOMAIN_GET_CONTRACT.PUT;
    let requestBody = {
        params: {
            args: [
                args.id ?? '',
                (args.name ?? '').trim(),
                args.salary_rate ?? '',
                args.date_sign ?? '',
                args.date_start ?? '',
                args.date_end ?? '',
                args.contract_type_id ?? '',
                args.resource_calendar_id ?? '',
                args.wage ?? '',
                args.indefinite_contract ?? false,
                args.minutes_per_day ?? "480",
                args.start_end_attendance ?? "",
                args.depend_on_shift_time ?? "",
                args.by_hue_shift ?? "",
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
    } catch (error) {
        console.log(error)
    }
}
export const getContractByArgs = async (args: IContractArgs) => {
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
    let url = DOMAIN_GET_CONTRACT.GET;
    let requestBody = {
        params: {
            args: [
                (args.name ?? '').trim(),
                (args.employee_code ?? '').trim(),
                args.employee_id ?? '',
                args.department_id ?? '',
                (args.job_title ?? '').trim(),
                args.page ?? '',
                args.page_size ?? '',
                args.contract_type_id ?? '',
                (args.state ?? '').trim(),
                args.company_id ?? '',
                transformedData
            ],
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
                data: mapContract(res?.result?.result),
                total: res?.result.total_records,
            }
        }

    } catch (error) {
        console.log(error)
    }
}