import {  RESIGNATIONLETTER } from "../constApi";
import { request } from "../request";
import { message as $message } from 'antd';
export  const getResignationLetter = async (id: any) => {
    console.log(id)
    let url = RESIGNATIONLETTER.GET
    let requestBody = {
        params: {
            args: [
                 20,
                 1,
                ""
            ]
        }
    }
    try {
        const res = await request("post", url, requestBody)
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        console.log(res)
        return res
    } catch (error) {
        console.log(error)
    }
}