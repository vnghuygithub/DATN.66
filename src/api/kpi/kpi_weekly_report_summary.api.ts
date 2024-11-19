import { mapKpiWeeklyReportSummary } from './transform';
import { data } from './../../mock/applicationlist/list';
import { request } from '../request';
import { message as $message } from 'antd';
import {DOMAIN_KPI_WEEKLY_REPORT_SUMMARY} from "../constApi";
import { result } from 'lodash';


export const getKpiWeeklyReportSummary = async (date: any ) => {
    try {
        const company_name = localStorage.getItem('company_name');
        const encode_company_name = encodeURIComponent(company_name?.toString() || '');
        const encode_date = encodeURIComponent(date?.toString() || '');
        
        const searchDomain = `&filter=[["company_name","=","${encode_company_name}"],["date","=","${encode_date}"]]`
        const newDomain = searchDomain.toString();
        // const searchDomain = `&filter=[["company_name","=","` + string_name + `"]`
        // const res = await request('get',DOMAIN_KPI_WEEKLY_REPORT_SUMMARY.GET);
        const res = await request('get',DOMAIN_KPI_WEEKLY_REPORT_SUMMARY.GET+newDomain);

        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return {
            results: {
                data: mapKpiWeeklyReportSummary(res?.result),
            }
        } 

        
    } catch (error) {
        console.log(error)
    }
}

export const getKpiWeeklyReportSummaryById = async (id: string) => {
    try {
        const search_domain =`?query={id,employee_name,company_name, department_name,employee_code,employee_level, compensation_amount_week_1,compensation_amount_week_2,compensation_amount_week_3,compensation_amount_week_4,compensation_amount_week_5,compensation_status_week_1,compensation_status_week_2,compensation_status_week_3,compensation_status_week_4,compensation_status_week_5,book_review_compensation,book_review_compensation_status,total_compensation`
        const res = await request('get',DOMAIN_KPI_WEEKLY_REPORT_SUMMARY.GET_BY_ID + id + search_domain);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res
    } catch (error) {
        console.log(error)
    }
}