import { IKpiHrReportList , IKpiHrUpdateReport , IKpiHrCreateReport } from './../../interface/kpihrreport/type';
import { historyShiftEditBody } from './../../interface/weeklyreport/type';
import { request } from '../request';
import { DOMAIN_KPI_HR_REPORT } from "../constApi";
import { message as $message } from 'antd';
import { mapKpiHrReport , groupByProperty } from './transform';

export const deleteKpiHrById = async (id: number) => {
    try {
        const res = await request('delete',DOMAIN_KPI_HR_REPORT.DELETE  + id);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res;
    } catch (error) {
        console.log(error)
    }
}

export const getKpiHrById = async (id: number) => {
    try {
        const res = await request('get',DOMAIN_KPI_HR_REPORT.SEARCH + id + '?query={id,employee_name{id,name} ,department{name} ,company{name} ,employee_code,violation_level ,violation_type,report_date,report_serial,violation_date,apply_date,violation{id,name}}');
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res
    } catch (error) {
        console.log(error)
    }
}

export const getKpiHr = async (params: IKpiHrReportList) => {
    let url = DOMAIN_KPI_HR_REPORT.GET
    
    let current_user_company_id = localStorage.getItem('company_id')
    let administrative = localStorage.getItem('is_administrative');
    let sub_admin_role = localStorage.getItem("sub_admin_role")
    if (administrative == 'true' && sub_admin_role !== 'none') {
        let ho_company = localStorage.getItem('ho_selected');

        if (ho_company) {
            current_user_company_id = ho_company
    }   
        
    
    }
    let company_condition = "[" + current_user_company_id + "]";
    let filterArr = [];
    filterArr.push(`["company","in", ${company_condition} ]`);
    // filterArr.push(`["company","in",${[8,]}]`);
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
            data: groupByProperty(mapKpiHrReport(res?.result) , 'company'),
            total: res?.count
        }
    }
    }


   

export const createKpiHr = async (body: any) => {
    const res = await request('post', DOMAIN_KPI_HR_REPORT.CREATE, body );
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
};

export const updateKpiHr = async ( id: string | undefined , body: IKpiHrUpdateReport,) => {
    const res = await request('post', DOMAIN_KPI_HR_REPORT.PUT  + id, 
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

export const getLinkKpiHr = async(id:number) => {
    const res = await request('post', DOMAIN_KPI_HR_REPORT.GETLINK ,
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


