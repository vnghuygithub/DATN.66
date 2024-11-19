import { IEmployeeAllocation } from "@/interface/employeeAllocation/employeeAllocation";


export const mapEmployeeAllocation = (item: IEmployeeAllocation[]) => {
    return item && item.length > 0 && item.map((item, index) => {
        const companyId = item?.company_id ?? [];
        const employeeIds = item?.employee_ids ?? [];
        const departmentId = item?.department_id ?? [];
        const approvedBy = item?.approved_by ?? [];
        const currentCompanyId = item?.current_company_id ?? [];
        const currentDepartmentId = item?.current_department_id ?? [];
        const jobId = item?.job_id ?? [];
        const currentJobId = item?.current_job_id ?? [];
        return {
            no: index + 1,
            id: item?.id,
            name: item?.name ?? '',
            employee_ids: employeeIds.map((item: any) => item.id).join(', ') ?? '',
            employee_names: employeeIds.map((item: any) => item.name).join(', ') ?? '',
            company_id: companyId[0] ?? '',
            company_name: companyId[1] ?? '',
            department_id: departmentId[0] ?? '',
            department_name: departmentId[1] ?? '',
            state: item?.state ?? '',
            approved_date: item?.approved_date ?? '',
            create_date: item?.create_date ?? '',
            approved_by_name: approvedBy[1] ?? '',
            approved_by: approvedBy[0] ?? '',
            current_company_id: currentCompanyId[0] ?? '',
            current_company_name: currentCompanyId[1] ?? '',
            new_company_working_date: item?.new_company_working_date ?? '',
            severance_day_old_company: item?.severance_day_old_company ?? '',
            allocation_type: item?.allocation_type ?? '',
            new_department_working_date: item?.new_department_working_date ?? '',
            severance_day_old_department: item?.severance_day_old_department ?? '',
            current_department_id: currentDepartmentId[0] ?? '',
            current_department_name: currentDepartmentId[1] ?? '',
            job_name: jobId[1] ?? '',
            job_id: jobId[0] ?? '',
            current_job_name: currentJobId[1] ?? '',
            current_job_id: currentJobId[0] ?? '',
            new_job_id_date: item?.new_job_id_date ?? '',
        };
    });
};



