import { IJob } from "./job.api";

export const mapJob = (res: IJob[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        return {
            no: index + 1,
            id: item?.id,
            name: item?.name,
            department_name: item?.department_id?.name,
            department_id: item?.department_id?.id,
            company_name: item?.company_id?.name,
            company_id: item?.company_id?.id,
            no_of_employee: item?.no_of_employee,
            kpi_config : item?.kpi_config.name,
        }
    })
}
export interface IJobV2 {
    no: number;
    id: number;
    name: string;
    department_id: Array<any>
    department_name: string;
    company_name: string;
    company_id: Array<any>;
    job_type_id: Array<any>;
    kpi_config : Array<any>;
    level: number;
    is_hazardous_environment: boolean;
    job_type_name: string;
    mis_id:string
}
export const mapJobV2 = (res: IJobV2[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        const department = item?.department_id ?? []
        const company = item?.company_id ?? []
        const kpiConfig = item?.kpi_config ?? []
        const jobTypeId = item?.job_type_id ?? []
        return {
            no: index + 1,
            id: item?.id,
            name: item?.name,
            department_name: department[1],
            department_id: department[0],
            company_name: company[1],
            company_id: company[0],
            kpi_config : kpiConfig[1],
            level: item?.level,
            is_hazardous_environment: item?.is_hazardous_environment,
            job_type_name: jobTypeId[1],
            mis_id: item?.mis_id
        }
    })
}