import { mapViolationConfig } from './transform';
import { IKpiCtrlReportList } from './../../interface/kpictrlreport/type';
import { historyShiftEditBody } from './../../interface/weeklyreport/type';
import { request } from '../request';
import { DOMAIN_VIOLATION_REPORT } from "../constApi";
import { ICreateShiftBody, IFilterShiftsParams } from "@/interface/shifts/shifts";
import { message as $message } from 'antd';
import { IViolationList , IViolationUpdate , IViolationCreate } from '@/interface/violation/type';
export const deleteViolationById = async (id: number) => {
    try {
        const res = await request('delete',DOMAIN_VIOLATION_REPORT.DELETE + "/" + id);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res;
    } catch (error) {
        console.log(error)
    }
}


export const getViolation = async () => {
    let url = DOMAIN_VIOLATION_REPORT.SEARCH
    let current_user_company_id = localStorage.getItem('company_id');
    let filterArr = [];
    
   
    const res = await request('get', DOMAIN_VIOLATION_REPORT.GET);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
      }
      return res
    }


   

export const createViolation = async (body: IViolationCreate) => {
    const res = await request('post', DOMAIN_VIOLATION_REPORT.CREATE, {
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
};

export const updateViolation = async ( id: string | undefined , body: IViolationUpdate ) => {
    const res = await request('post', DOMAIN_VIOLATION_REPORT.PUT  + id, {
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
};

export const getViolationList = async (params:IViolationList ) => {
    let url = DOMAIN_VIOLATION_REPORT.GET
    let current_user_company_id = localStorage.getItem('company_id');
    let filterArr = [];
    filterArr.push(`["company","=",${current_user_company_id}]`);
    if (params.name) {
        filterArr.push(`["name","like","${params.name}"]`)
    }
    if (params.default_violation_type){
        filterArr.push(`["default_violation_type","=","${params.default_violation_type}"]`)
    }
    if (params.default_violation_level){
        filterArr.push(`["default_violation_level","=","${params.default_violation_level}"]`)
    }
    if (filterArr.length > 0) {
        url += '&filter=' + '[' + [filterArr].toString() + ']';
    }
    const res = await request('get', url);
   
    
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
      }
      return {
        results: {
            data: mapViolationConfig(res?.result),
            total: res?.count
        }
    }
}

export const getViolationById = async (id: number) => {
    const res = await request('get', DOMAIN_VIOLATION_REPORT.SEARCH + id);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
      }
      return res
}