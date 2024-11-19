export interface IRegisterNewEmployee  {
    key: React.Key;
    id: number;
    name : string,
    company_id : ICompanyId,
    department_id : IDepartmentId,
    job_id : IJobId,
    start_work_date : string,
    date_of_birth : string,
    citizen_id : string,
    verified_citizen_id_date: string,
    verified_citizen_id_by: string,
    tax_number: string,
    social_insurance_number: string,
    original_address: string,
    current_address: string,
    license_plate: string,
    vehicle_info: string,
    bidv_info: string,
    status: string,
    gender: string,
    mis_id:string
}

interface ICompanyId {
    id: number;
    name: string;
}

interface IDepartmentId {
    id: number;
    name: string;
}

interface IJobId {
    id: number;
    name: string;
}


