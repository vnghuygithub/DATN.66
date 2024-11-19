import { request } from "../request";
import { GET_DISTRICT_LIST } from "../constApi";
import { message as $message } from 'antd';
export const getListDistrict = async () => {
    const res = await request("get", GET_DISTRICT_LIST.GETALL);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
      }
    return res;
}