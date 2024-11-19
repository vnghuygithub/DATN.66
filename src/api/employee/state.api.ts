import { request } from "../request";
import { GET_STATE_LIST } from "../constApi";
import { message as $message } from 'antd';
export const getListState = async () => {
    const res = await request("get", GET_STATE_LIST.GETALL);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
      }
    return res;
}