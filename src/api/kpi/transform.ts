import { IKpiCtrlReportList } from './../../interface/kpictrlreport/type';
import { IKpiHrReportList } from '@/interface/kpihrreport/type';
import {IViolationList} from '@/interface/violation/type';
import {IEmpKpiConfigList} from '@/interface/employeeKpiConfig/type';

export const mapKpiCtrlReport = (item: IKpiCtrlReportList[])  => {
    return item && item.length > 0 && item.map((item, index) => {
        return {
            id: item?.id,
            employee_name: item?.employee_name.name ?? '',
            employee_code: item?.employee_code ?? '',
            company: item?.company?.name ?? '',
            department : item?.department?.name ?? '',
            report_serial: item?.report_serial ?? '',
            report_date: item?.report_date ?? '',
            violation_level: item?.violation_level ?? '',
            violation_type: item?.violation_type ?? '',
            date_apply: item?.date_apply ?? '',
            violation_date: item?.violation_date ?? '',
        };
    });
};

export const groupByProperty = (array : any, propertyName : any) => {
    let keyCounter = 1;
    return array.reduce((acc: any, item: any) => {
        
        const existingItem = acc.find((groupedItem:any) => groupedItem[propertyName] === item[propertyName]);

        if (existingItem) {
            item.key = keyCounter++;
            item.company = '';
            
            existingItem.children.push(item);
        } else {
            acc.push({
                key: keyCounter++,
                [propertyName]: item[propertyName],
                children: [{ key: keyCounter++ ,...item, company: '' }]
            });
        }
        
        return acc;
    }, []);
};


export const mapKpiHrReport = (item: IKpiHrReportList[])  => {
    return item && item.length > 0 && item.map((item, index) => {
        return {
            id: item?.id,
            employee_name: item?.employee_name.name ?? '',
            employee_code: item?.employee_code ?? '',
            violation: item?.violation.name ?? '',
            company: item?.company?.name ?? '',
            department : item?.department?.name ?? '',
            report_serial: item?.report_serial ?? '',
            report_date: item?.report_date ?? '',
            violation_level: item?.violation_level ?? '',
            violation_type: item?.violation_type ?? '',
            apply_date: item?.apply_date ?? '',
            violation_date: item?.violation_date ?? '',
        };
    });
}


export const mapViolationConfig = (item: IViolationList[])  => {
    return item && item.length > 0 && item.map((item, index) => {
        return {
            no: index + 1,
            id: item?.id,
            name: item?.name ?? '',
            default_violation_type: item?.default_violation_type ?? '',
            default_violation_level: item?.default_violation_level ?? '',

        };
    });
}


export const mapEmpKpiConfig = (item: IEmpKpiConfigList[])  => {
    return item && item.length > 0 && item.map((item, index) => {
        return {
            key: item?.id,
            no: index + 1,
            id: item?.id,
            name: item?.name ?? '',
            employee_level: item?.employee_level ?? '',
            late_compensation_under: item?.late_compensation_under ?? '',
            late_compensation_over: item?.late_compensation_over ?? '',
            base_weekly_report_compensation: item?.base_weekly_report_compensation ?? '',
            missing_review_book_compensation: item?.missing_review_book_compensation ?? '',
            use_percentage_weekly_report: item?.use_percentage_weekly_report ?? '',
        };
    });
}


export const mapKpiWeeklyReportSummary = (item: any)  => {
    return item && item.length > 0 && item.map((item: any, index: number) => {
        return {
            key: index,
            stt: index + 1,
            id: item?.id,
            employee_name: item?.employee_name ?? '',
            employee_code: item?.employee_code ?? '',
            company_name: item?.company_name ?? '',
            department_name : item?.department_name ?? '',
            employee_level: item?.employee_level ?? '',
            compensation_amount_week_1: item?.compensation_amount_week_1 ?? '',
            compensation_amount_week_2: item?.compensation_amount_week_2 ?? '',
            compensation_amount_week_3: item?.compensation_amount_week_3 ?? '',
            compensation_amount_week_4: item?.compensation_amount_week_4 ?? '',
            compensation_amount_week_5: item?.compensation_amount_week_5 ?? '',
            compensation_status_week_1: item?.compensation_status_week_1 ?? '',
            compensation_status_week_2: item?.compensation_status_week_2 ?? '',
            compensation_status_week_3: item?.compensation_status_week_3 ?? '',
            compensation_status_week_4: item?.compensation_status_week_4 ?? '',
            compensation_status_week_5: item?.compensation_status_week_5 ?? '',
            book_review_compensation: item?.book_review_compensation ?? '',
            book_review_compensation_status: item?.book_review_compensation_status ?? '',
            total_compensation: item?.total_compensation ?? '',
            use_percentage: item?.use_percentage ?? '',
        };
    });
}