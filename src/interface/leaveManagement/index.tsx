export interface IEmployeeByLeave {
  id: number;
  code: string;
  year: number;
  employee_id: Array<any>;
  employee_code: string;
  employee_name: string;
  department_name: string;
  department_id: Array<any>;
  job_title: string;
  company_id: Array<any>;
  company_name: string;
  tier: string;
  date_sign: string;
  date_calculate: string;
  workingday: string;
  severance_day: string;
  contract_type_id: Array<any>;
  contract_type_name: string;
  increase_probationary_1: number;
  increase_official_1: number;
  used_probationary_1: number;
  used_official_1: number;
  overtime_probationary_1: number;
  overtime_official_1: number;
  increase_probationary_2: number;
  increase_official_2: number;
  used_probationary_2: number;
  used_official_2: number;
  overtime_probationary_2: number;
  overtime_official_2: number;
  increase_probationary_3: number;
  increase_official_3: number;
  used_probationary_3: number;
  used_official_3: number;
  overtime_probationary_3: number;
  overtime_official_3: number;
  increase_probationary_4: number;
  increase_official_4: number;
  used_probationary_4: number;
  used_official_4: number;
  overtime_probationary_4: number;
  overtime_official_4: number;
  increase_probationary_5: number;
  increase_official_5: number;
  used_probationary_5: number;
  used_official_5: number;
  overtime_probationary_5: number;
  overtime_official_5: number;
  increase_probationary_6: number;
  increase_official_6: number;
  used_probationary_6: number;
  used_official_6: number;
  overtime_probationary_6: number;
  overtime_official_6: number;
  increase_probationary_7: number;
  increase_official_7: number;
  used_probationary_7: number;
  used_official_7: number;
  overtime_probationary_7: number;
  overtime_official_7: number;
  increase_probationary_8: number;
  increase_official_8: number;
  used_probationary_8: number;
  used_official_8: number;
  overtime_probationary_8: number;
  overtime_official_8: number;
  increase_probationary_9: number;
  increase_official_9: number;
  used_probationary_9: number;
  used_official_9: number;
  overtime_probationary_9: number;
  overtime_official_9: number;
  increase_probationary_10: number;
  increase_official_10: number;
  used_probationary_10: number;
  used_official_10: number;
  overtime_probationary_10: number;
  overtime_official_10: number;
  increase_probationary_11: number;
  increase_official_11: number;
  used_probationary_11: number;
  used_official_11: number;
  overtime_probationary_11: number;
  overtime_official_11: number;
  increase_probationary_12: number;
  increase_official_12: number;
  used_probationary_12: number;
  used_official_12: number;
  overtime_probationary_12: number;
  overtime_official_12: number;
  total_increase_probationary: number;
  total_increase_official: number;
  total_increase_tv_ovt: number;
  total_increase_ct_ovt: number;
  total_used_probationary: number;
  total_used_official: number;
  remaining_probationary_minute: number;
  remaining_official_minute: number;
  remaining_total_minute: number;
  remaining_probationary_day: number;
  remaining_official_day: number;
  remaining_total_day: number;
  note: string;
  file: any;
}
export interface ILeaveManagementArgs {
  employee_id: number;
  employee_code: string;
  department_id: number;
  job_title: string;
  date_calculate_leave: string;
  year: any;
  page_size: number;
  page: number;
  company_id: number;
  [key: string]: any;
}
export interface ILeaveManagement {
  id: number;
  code: string;
  name: string;
  department_name: string;
  workingday: string;
  severance_day: string;
  position: string;
  date_start: string;
  leave_date: string;
  tham_nien: string;
  tong_phep: string;
  phep_1: number;
  phep_2: number;
  phep_3: number;
  phep_4: number;
  phep_5: number;
  phep_6: number;
  phep_7: number;
  phep_8: number;
  phep_9: number;
  phep_10: number;
  phep_11: number;
  phep_12: number;
  tong_tham_nien: number;
  tong_phep_nam: number;
}
export interface ILeaveAllocationArgs {
  type: string;
  code: string;
  date: string;
  minutes: number;
  annual_leave_fund: number;
}