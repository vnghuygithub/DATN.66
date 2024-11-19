import { IEmpKpiConfig } from './../../interface/kpiconfig/type';


// import { historyShiftEditBody } from './../../interface/weeklyreport/type';
import { request } from '../request';
import { DOMAIN_EMPLOYEEE_KPI_CONFIG} from "../constApi";
import { message as $message } from 'antd';
import { mapEmpKpiConfig } from './transform';



export const getKpiEmpConfig = async() => {
    try {
        const res = await request('get',DOMAIN_EMPLOYEEE_KPI_CONFIG.GET);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res
    } catch (error) {
        console.log(error)
    }
}


export const getKpiEmpConfigById = async (id: number) => {
    try {
        const res = await request('get',DOMAIN_EMPLOYEEE_KPI_CONFIG.GET_BY_ID + id );
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res
    } catch (error) {
        console.log(error)
    }
}

export const getKpiEmpConfigList = async (id: number) => {
    try {
        const res = await request('get',DOMAIN_EMPLOYEEE_KPI_CONFIG.GET);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return {
            results: {
                data: mapEmpKpiConfig(res?.result) ,
                total: res?.count
            }
        }
    } catch (error) {
        console.log(error)
    }
}


export const updateKpiEmpConfig = async(id : any , body:any) =>{
    const res = await request('post', DOMAIN_EMPLOYEEE_KPI_CONFIG.PUT  + id, 
    {
        params: {
            data: {
                ...body
            }
        }
        
    });
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}

export const deleteKpiEmpConfig = async(id : any) =>{
    const res = await request('delete', DOMAIN_EMPLOYEEE_KPI_CONFIG.DELETE  + id);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}

export const createKpiEmpConfig = async (body: any) => {
    const res = await request('post', DOMAIN_EMPLOYEEE_KPI_CONFIG.CREATE, body);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}