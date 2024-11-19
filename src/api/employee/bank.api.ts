import { DOMAIN_BANKS } from "../constApi";
import { request } from "../request"
import { message as $message } from 'antd';
export const getBankList = async () => {
    const res = await request("get", DOMAIN_BANKS.GET);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res;
}