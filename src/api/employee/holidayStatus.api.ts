import { GET_LEAVE_TYPE } from "../constApi"
import { request } from "../request"
import { message as $message } from 'antd';
export const getListHolidayStatus = async () => {
    let url = GET_LEAVE_TYPE.GETALL
    const res = await request('get', url)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res;
}

export const getHolidayStatusById = async (id: number) => {
    let url = GET_LEAVE_TYPE.GETBYID + id
    const res = await request('get', url)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res;
}
