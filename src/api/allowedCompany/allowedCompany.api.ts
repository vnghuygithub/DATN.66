import { DOMAIN_ALLOWED_COMPANY } from "../constApi"
import { request } from "../request";
import { message as $message } from 'antd';
export const updateAllowedCompany = async (companyIds: Array<number>) => {
    let url = DOMAIN_ALLOWED_COMPANY.UPDATE
    let requestBody = {
        params: {
            args: [
                companyIds
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

export const getAllowedCompany = async () => {
    let url = DOMAIN_ALLOWED_COMPANY.GET + `?query={company_ids{id,name}}&filter=[["user_id","=",${Number(localStorage.getItem('user_id'))}]]`
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