import { APEC_GROUP_MAIL } from "../constApi";
import { request } from "../request";
import { message as $message } from 'antd';


export interface IApecGroupMailSearch {
    name: string;
    email: string;
}


export const getApecGroupMail = async (params: IApecGroupMailSearch) => {
    let filter = [];
    let url = APEC_GROUP_MAIL.GET
    if (params.name) {
        filter.push(`["name","like","${params.name}"]`)
    }
    if (params.email) {
        filter.push(`["email","like","${params.email}"]`)
    }
    if (filter.length > 0) {
        url += `?filter=[${filter.join(",")}]`
    }

    try {
        const res = await request('get', url);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return {
            results: {
                data: res.result,
                total: res.count
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateApecGroupMail = async (id: any, data: any) => {
    let url = APEC_GROUP_MAIL.PUT + `${id}`
    let requestBody = {
        params: {
            data: data
        }
    }
    try {
        const res = await request('post', url, requestBody);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        $message.success('Cập nhật nhóm mail thành công');
        return res
    } catch (error) {
        console.log(error)
    }
}

export const getApecGroupMailById = async (id: number) => {
    let url = APEC_GROUP_MAIL.GET + `/${id}`
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

export const deleteApecGroupMailById = async (id: number) => {
    let url = APEC_GROUP_MAIL.GET + `/${id}`
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

export const createApecGroupMail = async (data: any) => {
    let url = APEC_GROUP_MAIL.POST
    let requestBody = {
        params: {
            data: data
        }
    }
    try {
        const res = await request('post', url, requestBody);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        $message.success('Tạo mới nhóm mail thành công');
        return res
    } catch (error) {
        console.log(error)
    }
}