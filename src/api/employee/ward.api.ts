import { request } from "../request";
import { GET_LIST_WARD } from "../constApi";
import { message as $message } from 'antd';
export const getListWard = async () => {
    const res = await request("get", GET_LIST_WARD.GETALL);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
      }
    return res;
}