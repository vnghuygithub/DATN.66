import { request } from "../request";
import { GET_NATION_LIST } from "../constApi";
import { message as $message } from 'antd';
export const getListNation = async () => {
    const res = await request("get", GET_NATION_LIST.GETALL);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
      }
    return res;
}