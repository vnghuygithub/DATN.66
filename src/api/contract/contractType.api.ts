import { request } from "../request";
import { DOMAIN_GET_CONTRACT_TYPE } from "../constApi";
import { message as $message } from 'antd';
export const getListContractType = async () => {
    try {
        const res = await request("get", DOMAIN_GET_CONTRACT_TYPE.GETALL);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res;
    } catch (error) {
        console.log(error)
    }
}