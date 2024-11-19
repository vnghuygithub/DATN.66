import { IProjectArgs, IProjectTaskArgs } from "@/interface/project/project";
import { DOMAIN_PROJECT } from "../constApi";
import { request } from "../request";
import { message as $message } from 'antd';
import { mapProject, mapProjectTask } from "./transform";


export const getProjectList = async (args: IProjectArgs) => {
    let url = DOMAIN_PROJECT.GET
    let requestBody = {
        params: {
            args: [
                args.page_size ?? '',
                args.name ? 1 : args.page ?? '',
                args.name ?? '',
            ]
        }
    }
    const res = await request('post', url, requestBody)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message)
        return
    }
    return {
        results: mapProject(res?.result?.result),
        total: res?.result?.total_records,
    }
}

export const getProjectTaskList = async (args: IProjectTaskArgs) => {
    let url = DOMAIN_PROJECT.GET_TASK
    let requestBody = {
        params: {
            args: [
                args.stage_id ?? '',
                args.name ?? '',
                args.page_size ?? '',
                args.name ? 1 : args.stage_id ? 1 : args.page ?? '',
            ]
        }
    }
    const res = await request('post', url, requestBody)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message)
        return
    }
    return {
        results: mapProjectTask(res?.result?.result),
        total: res?.result?.total_records,
    }
}