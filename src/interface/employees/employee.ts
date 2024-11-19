export interface IEmployeeListColumn {
  id: string;
  name: string;
  work_phone: string;
  work_email: string;
  activities: string;
  activity_deadline: string;
  department_id: string;
  time_keeping_code: string;
  job: string;
  manager: string;
  company_id: ICompany_id;
}
export interface ICompany_id {
  id: number;
  name: string;
}
export interface IEmployeeLog {
  id: number;
  res_id: number;
  old_value_text: string;
  new_value_text: string;
  field_description: string;
  field_name: string;
  model_model: string;
  user_id: number
  create_date: string;
  name: string;
  model_name: string;
  method: string
}

export interface IFilterEmployeesParams {
  name: string;
  code: string;
  mobile_phone: string;
  work_email: string;
  activities: string;
  activity_deadline: string;
  department_id: string;
  job: string;
  manager: string;
  severance_day: string;
  page_size: number;
  page: number
}
export interface IFilterEmployeesArgs {
  name?: string;
  code?: string;
  mobile_phone?: string;
  department_id?: number | null;
  time_keeping_code?: string;
  job_title?: string;
  work_email?: string;
  severance_day?: string;
  is_servered?: boolean;
  user_id?: string;
  page_size?: number;
  page?: number
  company_id?: number;
  employee_ho?: boolean;
  work_location?: string;
  gender?: string;
  workingday?: string;
  resource_calendar_id?: string;
  level?: string;
  time_keeping_count?: string;
  marital?: string;
  identification_id?: string;
  birthday?: string;
  [key: string]: any;
}

export interface IFilterShiftsParams {
  name: string;
  work_phone: string;
  work_email: string;
  activities: string;
  activity_deadline: string;
  department_id: string;
  job: string;
  manager: string;
}

export interface IEmployeeeDtoResponse {
  count: number;
  prev: any;
  current: number;
  next: any;
  total_pages: number;
  result: IEmployeeeDtoResult[];
}
export interface IEmployeeeList {
  code?: string
  work_phone?: string
  name?: string
  time_keeping_code?: string
  work_email?: string
  company_id?: number
  department_id?:  number
  job_id?:  number
  city_id?:  number
  place_of_birth?: string
  district_id?:  number
  ward_id?:  number
  country_id?:  number
  mobile_phone?: string
  private_email?: string
  gender?: string
  certificate?: string
  study_field?: boolean
  resource_calendar_id?:  number
  workingday?: string
  severance_day?: string
  bank?: string
  bank_branch?: string
  bank_account_number?: boolean
  job_title?: string
  tax_id?: string
  head_of_department_check?: boolean
  general_management_check?: boolean
  department_secretary_check?: boolean
  resource_calendar_type?: string
  union_day?: string
  part_time_company_id?:  number
  part_time_department_id?:  number
  part_time_job_title?: string
  annual_leave_fund?: number
  birthday?: string
  nation_id?:  number
  marital?: string
  identification_id?: string
  issued_by_identification?:  number
  issued_by_identification_day?: string
  issued_by_identification_text?: string
  current_place_of_residence?: string
  highest_degree?: string
  study_school?: string
  car_registration?: string
  license_plates?: string
  range_of_vehicle?: string
  user_id?: number
  car_color?: string,
  district_vietnam_id?:  number,
  ward_vietnam_id?:  number,
  state_id?:  number,
  parent_id?:  number,
  coach_id?:  number,
  religion_id?:  number,
  probationary_contract_termination_date?: string,
  probationary_salary_rate?: number,
  date_sign?: string,
  social_insurance_number?: string,
  time_keeping_count?: number,
  employee_type?: string,
  user_ids?: any[],
  is_accountant?: boolean,
  work_location?: number | null,
  working_status?: string,
  bank_id?: number,
  sub_admin_role?: string,
  mis_id?:string
  email_ccs?: any[];
}

export interface IEmployeeeArgsResult {
  key:any;
  id: number
  code: string
  work_phone: string
  name: string
  current_employee_code: string
  time_keeping_code: string
  work_email: string
  social_insurance_number: string
  company_id: Array<any>
  department_id:  Array<any>
  job_id:  Array<any>
  city_id:  Array<any>
  place_of_birth: string
  district_id:  Array<any>
  ward_id:  Array<any>
  country_id:  Array<any>
  mobile_phone: string
  private_email: string
  gender: string
  certificate: string
  study_field: boolean
  resource_calendar_id:  Array<any>
  workingday: string
  severance_day: string
  bank: string
  bank_branch: string
  bank_account_number: boolean
  job_title: string
  tax_id: string
  head_of_department_check: boolean
  general_management_check: boolean
  department_secretary_check: boolean
  resource_calendar_type: string
  union_day: string
  part_time_company_id:  Array<any>
  part_time_department_id:  Array<any>
  part_time_job_title: string
  annual_leave_fund: number
  birthday: string
  nation_id:  Array<any>
  marital: string
  identification_id: string
  issued_by_identification:  Array<any>
  current_place_of_residence: string
  highest_degree: string
  study_school: string
  car_registration: string
  license_plates: string
  range_of_vehicle: string
  car_color: string,
  district_vietnam_id:  Array<any>,
  ward_vietnam_id:  Array<any>,
  state_id:  Array<any>,
  parent_id:  Array<any>,
  coach_id:  Array<any>,
  religion_id:  Array<any>,
  probationary_contract_termination_date: string,
  probationary_salary_rate: number,
  date_sign: string,
  user_id: Array<any>,
  time_keeping_count: number,
  hr_employee_relative_ids: Array<any>,
  permanent_address: string,
  issued_by_identification_text: string,
  issued_by_identification_day: string,
  level: number,
  weekly_report_is_mandatory: boolean,
  is_accountant: boolean,
  bank_id: Array<any>,
  bank_name: string,
  mis_id:string,
  work_location: Array<any>,
  working_status: string,
  official_contract_end_date: string,
  current_shift_name: string,
}
export interface IEmployeeeDtoResult {
  id: number
  code: string
  work_phone: string
  name: string
  time_keeping_code: string
  work_email: string
  company_id: CompanyId
  department_id: DepartmentId
  job_id: JobId
  city_id: CityId
  place_of_birth: string
  district_id: DistrictId
  ward_id: WardId
  country_id: CountryId
  mobile_phone: string
  private_email: string
  gender: string
  certificate: string
  study_field: boolean
  resource_calendar_id: ResourceCalendarId
  workingday: string
  severance_day: string
  bank: string
  bank_branch: string
  bank_account_number: boolean
  job_title: string
  tax_id: string
  head_of_department_check: boolean
  general_management_check: boolean
  department_secretary_check: boolean
  resource_calendar_type: string
  union_day: string
  part_time_company_id: PartTimeCompanyId
  part_time_department_id: PartTimeDepartmentId
  part_time_job_title: string
  annual_leave_fund: number
  birthday: string
  nation_id: NationId
  marital: string
  identification_id: string
  issued_by_identification: IssuedByIdentification
  current_place_of_residence: string
  highest_degree: string
  study_school: string
  car_registration: string
  license_plates: string
  range_of_vehicle: string
  car_color: string,
  district_vietnam_id: IDistrictVietnamId,
  ward_vietnam_id: IWardVietnamId,
  state_id: IStateId,
  parent_id: IParentId,
  coach_id: ICoachId,
  religion_id: ReligionId,
  probationary_contract_termination_date: string,
  probationary_salary_rate: number,
  date_sign: string,
  mis_id:string
}
export interface IWardVietnamId {
  id: number
  name: string
}
export interface IStateId {
  id: number
  name: string
}

export interface IDistrictVietnamId {
  id: number
  name: string
}
export interface ReligionId {
  id: number
  name: string
}
export interface ICoachId {
  id: number
  name: string
}
export interface CompanyId {
  id: number
  name: string
}

export interface DepartmentId {
  id: number
  name: string
}
export interface IParentId {
  id: number
  name: string
}
export interface JobId {
  id: number
  name: string
}

export interface CityId {
  id: number
  name: string
}

export interface DistrictId {
  id: number
  name: string
}

export interface WardId {
  id: number
  name: string
}

export interface CountryId {
  id: number
  name: string
}

export interface ResourceCalendarId {
  id: number
  name: string
}

export interface PartTimeCompanyId {
  id: number
  name: string
}

export interface PartTimeDepartmentId {
  id: number
  name: string
}
export interface PartTineCompanyId {
  id: number
  name: string
}
export interface NationId {
  id: number
  name: string
}

export interface IssuedByIdentification {
  id: number
  name: string
}

export interface IsDocumentList {
  id: any;
  name: string;
  from_date:any;
  to_date:any;
  url:any;
  company_id:any;
  file:any;
}