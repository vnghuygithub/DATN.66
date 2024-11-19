import moment from "moment";

export interface IShiftRequest {
    id: number;
    name: string;
    employee_id: Array<any>;
    employee_name: string;
    employee_code: string;
    current_shift_id: Array<any>;
    current_shift_name: string;
    new_shift_id: Array<any>;
    new_shift_name: string;
    from_date: string;
    to_date: string;
    company_id: Array<any>;
    company_name: string;
    part_time_company_id: Array<any>;
    part_time_company_name: string;
    new_company_id: Array<any>;
    new_company_name: string;
    department_id: Array<any>;
    department_name: string;
    job_title: string;
    state: string
    create_date: string;
    mis_id:string
}

export const mapShiftRequest = (res: IShiftRequest[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        const employeeId = item.employee_id ?? []
        const currentShiftId = item.current_shift_id ?? []
        const newShiftId = item.new_shift_id ?? []
        const companyId = item.company_id ?? []
        const partTimeCompanyId = item.part_time_company_id ?? []
        const newCompanyId = item.new_company_id ?? []
        const departmentId = item.department_id ?? []
        return {
            no: index + 1,
            id: item.id,
            name: item.name ?? '',
            employee_id: employeeId[0] ?? '',
            employee_code: item.employee_code ?? '',
            employee_name: employeeId[1] ?? '',
            current_shift_id: currentShiftId[0] ?? '',
            current_shift_name: currentShiftId[1] ?? '',
            new_shift_id: newShiftId[0] ?? '',
            new_shift_name: newShiftId[1] ?? '',
            from_date: item.from_date ? moment(item.from_date).format('DD-MM-YYYY') : '',
            to_date: item.to_date ? moment(item.to_date).format('DD-MM-YYYY') : '',
            company_id: companyId[0] ?? '',
            company_name: companyId[1] ?? '',
            part_time_company_id: partTimeCompanyId[0] ?? '',
            part_time_company_name: partTimeCompanyId[1] ?? '',
            new_company_id: newCompanyId[0] ?? '',
            new_company_name: newCompanyId[1] ?? '',
            department_id: departmentId[0] ?? '',
            department_name: departmentId[1] ?? '',
            job_title: item.job_title ?? '',
            state: item.state ?? '',
            create_date: item.create_date ? moment(item.create_date).format('DD-MM-YYYY') : '',
            mis_id:item?.mis_id
        }
    })
}
