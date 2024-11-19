import { request } from '../request';
import { WORK_LOCATION } from "../constApi";
import { message as $message } from 'antd';
import { mapWorkLocation } from './transform';



export const getWorkLocation = async (params:any) => {
    try {
        // const data = {
        //     "params": {
        //         "args": [        
        //         ]
        //     }
        // }

        let url = WORK_LOCATION.GET + '?query={id,name,work_location_code,company_id{id,name}}';
        let filterArr = [];
        if (params.name) {
            filterArr.push(`["name","like","${params.name}"]`)
        }
        if (params.work_location_code){
            filterArr.push(`["work_location_code","like","${params.work_location_code}"]`)
        }
        if (params.company_id){
            filterArr.push(`["company_id","=","${params.company_id}"]`)
        }
        url += '&filter=' + '[' + [filterArr].toString() + ']';
        const res = await request('get',url);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return{
            results: {
                data: mapWorkLocation(res?.result),
            }
        } 
    } catch (error) {
        console.log(error)
    }
}
export const getWorkLocationNoRight = async () => {
    try {

        let url = WORK_LOCATION.GETNORIGHT;
        const res = await request('get',url);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res
    } catch (error) {
        console.log(error)
    }
}


export const createWorkLocation = async(data: any) =>{
    try{
        const res = await request('post' , WORK_LOCATION.POST , data)
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return "error";
        }
        return "success"
    } catch(error){
        console.log(error)
    }
}

export const deleteWorkLocation = async(data:any) =>{
    try{
        const res = await request('post' , WORK_LOCATION.DELETE , data)
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return "success"
    } catch(error){
        console.log(error)
    }
}

export const updateWorkLocation = async(data:any) =>{
    try{
        const res = await request('post' , WORK_LOCATION.UPDATE , data)
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return "success"
    } catch(error){
        console.log(error)
    }
}
export const updateWorkLocation2 = async(id:any,data:any) =>{
    try{
        const res = await request('post' , WORK_LOCATION.UPDATE2 + id  , data)
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return "success"
    } catch(error){
        console.log(error)
    }
}
