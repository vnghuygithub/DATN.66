import moment from "moment";

export interface IIsurance {
    id: number;
    no: number;
    employee_id: Array<any>
    name: string;
    company_id: Array<any>
    part_time_company_id: Array<any>
    employee_ho: boolean
    employee_code: string
    work_location: string
    location: string
    job_id: Array<any>
    department_id: Array<any>
    insurance_wage: number
    date_start_insurance: string
    have_insurance: string
    month: number
    year: number
    social_insurance_company: number
    health_insurance_company: number
    unemployed_insurance_company: number
    unemployed_insurance_working_company: number
    total_insurance_company: number
    social_insurance_employee: number
    health_insurance_employee: number
    unemployed_insurance_employee: number
    total_insurance_employee: number
    total_social_insurance: number
    total_unemployed_insurance: number
    total_unemployed_working: number
    total_health_insurance: number
    total_insurance: number
    bonus_company_paid: number
    total_taken_from_employee: number
    total_final: number
    note: string
}

export const mapInsurance = (data: IIsurance[]) => {
    return data && data.length > 0 && data.map((item, index) => {
        const employeeId = item?.employee_id ?? [];
        const companyId = item?.company_id ?? [];
        const partTimeCompanyId = item?.part_time_company_id ?? [];
        const jobId = item?.job_id ?? [];
        const departmentId = item?.department_id ?? [];
        return {
            no: index + 1,
            id: item?.id,
            employee_name: employeeId[1],
            name: item?.name,
            company_name: companyId[1],
            part_time_company_name: partTimeCompanyId[1],
            employee_ho: item?.employee_ho,
            employee_code: item?.employee_code,
            work_location: item?.work_location,
            location: item?.location,
            job_name: jobId[1],
            department_name: departmentId[1],
            insurance_wage: item?.insurance_wage,
            date_start_insurance: item?.date_start_insurance ? moment(item?.date_start_insurance).format('DD/MM/YYYY') : '',
            have_insurance: item?.have_insurance,
            month: item?.month,
            year: item?.year,
            social_insurance_company: item?.social_insurance_company,
            health_insurance_company: item?.health_insurance_company,
            unemployed_insurance_company: item?.unemployed_insurance_company,
            unemployed_insurance_working_company: item?.unemployed_insurance_working_company,
            total_insurance_company: item?.total_insurance_company,
            social_insurance_employee: item?.social_insurance_employee,
            health_insurance_employee: item?.health_insurance_employee,
            unemployed_insurance_employee: item?.unemployed_insurance_employee,
            total_insurance_employee: item?.total_insurance_employee,
            total_social_insurance: item?.total_social_insurance,
            total_unemployed_insurance: item?.total_unemployed_insurance,
            total_unemployed_working: item?.total_unemployed_working,
            total_health_insurance: item?.total_health_insurance,
            total_insurance: item?.total_insurance,
            bonus_company_paid: item?.bonus_company_paid,
            total_taken_from_employee: item?.total_taken_from_employee,
            total_final: item?.total_final,
        }
    })

}
export interface IIsuranceConfig {
    id: number
    no: number;
    name: string
    company_id: Array<any>
    code: string
    minimum_wage: number
    year: number;
    month: number;
    bhxh_company: number;
    bhyt_company: number;
    bhtn_company: number;
    bhtnld_company: number;
    total_insurance_company: number;
    bhxh_employee: number;
    bhyt_employee: number;
    bhtn_employee: number;
    total_insurance_employee: number;
    total_social_insurance: number;
    total_unemployed_insurance: number;
    total_unemployed_working: number;
    total_health_insurance: number;
    total_insurance: number;
    bonus_company_paid: number;
    total_taken_from_employee: number;
    total_final: number;
    note: string;
    mis_id:string
}
export const mapInsuranceConfig = (data: IIsuranceConfig[]) => {
    return data && data.length > 0 && data.map((item, index) => {
        const companyId = item?.company_id ?? [];
        return {
            no: index + 1,
            id: item?.id,
            name: item?.name,
            company_name: companyId[1],
            code: item?.code,
            minimum_wage: item?.minimum_wage,
            year: item?.year,
            month: item?.month,
            bhxh_company: item?.bhxh_company,
            bhyt_company: item?.bhyt_company,
            bhtn_company: item?.bhtn_company,
            bhtnld_company: item?.bhtnld_company,
            total_insurance_company: item?.total_insurance_company,
            bhxh_employee: item?.bhxh_employee,
            bhyt_employee: item?.bhyt_employee,
            bhtn_employee: item?.bhtn_employee,
            total_insurance_employee: item?.total_insurance_employee,
            total_social_insurance: item?.total_social_insurance,
            total_unemployed_insurance: item?.total_unemployed_insurance,
            total_unemployed_working: item?.total_unemployed_working,
            total_health_insurance: item?.total_health_insurance,
            total_insurance: item?.total_insurance,
            bonus_company_paid: item?.bonus_company_paid,
            total_taken_from_employee: item?.total_taken_from_employee,
            total_final: item?.total_final,
            note: item?.note,
            mis_id: item?.mis_id,
        }
    })
}