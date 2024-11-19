import { IKpiCtrlReportList , IKpiCtrlUpdateReport , IKpiCtrlCreateReport } from './../../interface/kpictrlreport/type';
import { historyShiftEditBody } from './../../interface/weeklyreport/type';
import { request } from '../request';
import { DOMAIN_KPI_CTRL_REPORT } from "../constApi";
import { ICreateShiftBody, IFilterShiftsParams } from "@/interface/shifts/shifts";
import { mapEmployeeLog } from '../employee/transform';
import { message as $message } from 'antd';
import { mapKpiCtrlReport , groupByProperty } from './transform';

export const deleteKpiCtrlById = async (id: number) => {
    try {
        const res = await request('delete',DOMAIN_KPI_CTRL_REPORT.DELETE  + id);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res;
    } catch (error) {
        console.log(error)
    }
}

export const getKpiCtrlById = async (id: number) => {
    try {
        const res = await request('get',DOMAIN_KPI_CTRL_REPORT.SEARCH + id + '?query={id,employee_name{id,name},company{name} , department{name} , employee_code,violation_level ,violation_type,report_date,report_serial,date_apply,violation_date,attachment}');
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res
    } catch (error) {
        console.log(error)
    }
}

export const getKpiCtrl = async (params: IKpiCtrlReportList) => {
    let url = DOMAIN_KPI_CTRL_REPORT.GET
    let current_user_company_id = localStorage.getItem('company_id')
    let administrative = localStorage.getItem('is_administrative');
    if (administrative == 'true') {
        let ho_company = localStorage.getItem('ho_selected');
        if (ho_company) {
            current_user_company_id = ho_company
    }   
    }
    let company_condition = "[" + current_user_company_id + "]";
    let filterArr = [];
    filterArr.push(`["company","in", ${company_condition} ]`);
    if (params.employee_name) {
        filterArr.push(`["employee_name","like","${params.employee_name}"]`)
    }
    if (params.employee_code){
        filterArr.push(`["employee_code","like","${params.employee_code}"]`)
    }
    if (params.report_serial){
        filterArr.push(`["report_serial","like","${params.report_serial}"]`)
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
            data: groupByProperty(mapKpiCtrlReport(res?.result) , 'company'),
            total: res?.count
        }
    }
    }


   

export const createKpiCtrl = async (body: any) => {
    const res = await request('post', DOMAIN_KPI_CTRL_REPORT.CREATE, body);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
};

export const updateKpiCtrl = async ( id: string | undefined , body: IKpiCtrlUpdateReport,) => {
    const res = await request('post', DOMAIN_KPI_CTRL_REPORT.PUT  + id, 
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
    
};

export const getLinkKpiCtrl = async(id:any) => {
    
    const res = await request('post', DOMAIN_KPI_CTRL_REPORT.GETLINK ,
    {
        params: {
            args: [
                id
            ]
        }
        
    });
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res.result
}




