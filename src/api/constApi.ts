const DOMAIN_EMPLOYEE = 'api/hr.employee';
const DOMAIN_SHIFTS = 'api/shifts';
const DOMAIN_EXPLANATION_REQUEST = 'api/hr.apec.attendance.report';
const DOMAIN_GET_ATTENDANCE = 'object/hr.apec.attendance.report';
const DOMAIN_GET_ATTENDANCE_TRANS = 'object/hr.attendance.trans';
const DOMAIN_GET_ATTENDANCE_PAGE = 'page/get_attendance_reportv4';
const DOMAIN_LIST_SHIFTS = 'api';
const DOMAIN_SCHEDULING = 'object';
const DOMAIN_IMPORT_CONTRACT = 'object/hr.contract_import';
const DOMAIN_LIST_LEAVE = 'object/hr.leave';
const DOMAIN_GET_ATTENDANCE_BY_ID = 'object/hr.attendance';
const DOMAIN_EXPORT = 'object/hr.upload.attendance';
const DOMAIN_INVALID_TIMESHEET = 'object/hr.invalid.timesheet';
const Domain_GET_COMPANY = 'api/res.company';
const DOMAIN_GET_HR_LEAVE_TYPE = 'api/hr.leave.type';
const DOMAIN_HISTORY_SHIFT_EDIT =
  '/object/shift.edit.history/get_shift_edit_history_by_shift_id/';
const DOMAIN_GET_DEPARTMENT = 'api/hr.department';
const DOMAIN_HR_LEAVE_TYPE_LIST = 'api/hr.leave.type';
const DOMAIN_GET_JOB_LIST = 'api/hr.job';
const DOMAIN_GET_LIST_WORK_HOUR = 'api/resource.calendar';
const DOMAIN_GET_COUNTRY_LIST = 'api/res.country';
const DOMAIN_GET_CITY_LIST = 'api/res.city';
const DOMAIN_GET_RELIGION_LIST = 'api/religion';
const DOMAIN_GET_NATION_LIST = 'api/nation';
const DOMAIN_GET_STATE_LIST = 'api/res.country.state';
const DOMAIN_GET_DISTRICT_LIST = 'api/res.country.district';
const DOMAIN_GET_WARD_LIST = 'api/res.country.ward';
const DOMAIN_GET_EMPLOYEE_LEAVE = 'object/hr.al.report';
const DOMAIN_CREATE_LEAVE_ALLOCATION =
  'object/hr.leave.allocation/create_leave_allocation';
const DOMAIN_GET_EMPLOYEE_BY_LEAVE = 'object/hr.cl.report/get_cl_report';
const DOMAIN_CONTRACT = 'object/hr.contract';
const DOMAIN_BOOKING_ROOM = 'object/employee.fleets';
const DOMAIN_LOG_HISTORY = 'api/auditlog.log.line.view';
const DOMAIN_EMPLOYEE_ALLOCATION = 'object/hr.employee.allocation.v2';
const DOMAIN_WEEKLY_REPORT = 'object/hr.weekly.report';
const DOMAIN_PROJECT_MANAGMENT = 'object/project.project';
const DOMAIN_PROJECT_TASK = 'object/project.task';
const DOMAIN_PROJECT_TASK_TYPE = 'api/project.task.type';
const DOMAIN_PROJECT_STAGE = 'api/project.project.stage';
const DOMAIN_SHIFT_V2 = 'object/shifts/get_shifts';
const DOMAIN_SHIFT_REQUEST = 'object/hr.shift.request/get_shift_request';
const DOMAIN_MEETING_ROOM = 'object/meeting.room';
const DOMAIN_TIME_RECORDER_STATES = `object/time.recorder.state.v2`;
const DOMAIN_EQUIPMENT_REQUEST = 'object/equipment.request';
const DOMAIN_DASHBOARD = 'https://hrm-test.mandalahotel.com.vn';
const DOMAIN_BANK = 'api/res.partner.bank';

export const DOMAIN_BANKS = {
  GET: `api/res.bank`,
};
export const DOMAIN_AUDITLOG = {
  GET: `object/auditlog.log.line.view/get_log_lines`,
};

export const DOMAIN_USER_FUNCTION = {
  UPDATE: `object/res.users/update_summary_report`,
};

export const DOMAIN_HOLIDAYS_LEAVES = {
  GET: `object/resource.calendar.leaves/get_holidays`,
  CREATE: `api/resource.calendar.leaves/create`,
  UPDATE: `api/resource.calendar.leaves/`,
  DELETE: `api/resource.calendar.leaves/`,
  GETBYID: `api/resource.calendar.leaves/`,
};

export const DOMAIN_SHIFT_REQUESTS = {
  CREATE: `api/hr.shift.request/create`,
  GET: `${DOMAIN_SHIFT_REQUEST}`,
  GETBYID: `api/hr.shift.request/`,
  PUT: `api/hr.shift.request/`,
  DELETE: `api/hr.shift.request/`,
  APPROVE: `object/hr.shift.request/approve`,
  SCHEDULE: `object/hr.shift.request/schedule_shift`,
};
export const DOMAIN_PROJECT = {
  GET: `${DOMAIN_PROJECT_MANAGMENT}/get_project`,
  GET_TASK: `${DOMAIN_PROJECT_TASK}/get_task`,
  GETBYID: `${DOMAIN_PROJECT_MANAGMENT}/`,
  GET_TASK_BY_ID: `${DOMAIN_PROJECT_TASK}/`,
};

export const DOMAIN_KPI_HR_REPORT = {
  GET: 'api/kpi.hr.report/?query={id,employee_name{id,name},company{id , name}, department{id , name},employee_code,violation{id,name,default_violation_type,default_violation_level},violation_level ,violation_type,report_date,report_serial,apply_date,violation_date}',
  PUT: 'api/kpi.hr.report/',
  DELETE: 'api/kpi.hr.report/',
  CREATE: 'create_kpihr',
  SEARCH: 'api/kpi.hr.report/',
  GETLINK: 'object/kpi.hr.report/get_kpi',
};
export const DOMAIN_KPI_CTRL_REPORT = {
  GET: 'api/kpi.ctrl.report/?query={id,employee_name{id,name } ,company{id , name}, department{id , name} ,employee_code,violation_level,violation_type,report_date,report_serial,date_apply,violation_date}',
  PUT: 'api/kpi.ctrl.report/',
  DELETE: 'api/kpi.ctrl.report/',
  CREATE: 'create_kpictrl',
  SEARCH: 'api/kpi.ctrl.report/',
  GETLINK: 'object/kpi.ctrl.report/get_kpi',
};
export const DOMAIN_VIOLATION_REPORT = {
  GET: 'api/apec.violation/?query={id,name, default_violation_type, default_violation_level}',
  PUT: 'api/apec.violation/',
  DELETE: 'api/apec.violation/',
  CREATE: 'api/apec.violation/create',
  SEARCH: 'api/apec.violation/',
};
export const DOMIAN_HR_WEEKLY_REPORT = {
  GETONE: `api/hr.weekly.report/`,
  GET: `${DOMAIN_WEEKLY_REPORT}/get_weekly_report`,
  GETBYID: `api/hr.weekly.report/`,
  PUT: `api/hr.weekly.report/`,
  DELETE: `api/hr.weekly.report/`,
  CREATE: `api/hr.weekly.report/`,
  LOG: `${DOMAIN_LOG_HISTORY}/?filter=[["model_model","=","hr.weekly.report"],["user_id","=",${localStorage?.user_id}]]`,
};

export const DOMAIN_EMPLOYEEE_KPI_CONFIG = {
  GET: `api/employee.kpi.config/?query={id,name,employee_level,late_compensation_under,late_compensation_over,base_weekly_report_compensation,missing_review_book_compensation,use_percentage_weekly_report}`,
  CREATE: 'create_kpi_configuration',
  PUT: 'api/employee.kpi.config/',
  DELETE: 'api/employee.kpi.config/',
  GET_BY_ID: 'api/employee.kpi.config/',
};

export const DOMAIN_KPI_WEEKLY_REPORT_SUMMARY = {
  GET: `api/kpi.weekly.report.summary?query={id,employee_name,company_name,department_name,employee_code,employee_level,compensation_amount_week_1,compensation_amount_week_2,compensation_amount_week_3,compensation_amount_week_4,compensation_amount_week_5,compensation_status_week_1,compensation_status_week_2,compensation_status_week_3,compensation_status_week_4,compensation_status_week_5,book_review_compensation,book_review_compensation_status,total_compensation,use_percentage}`,
  GET_BY_ID: `api/kpi.weekly.report.summary/`,
};

export const DOMAIN_EMPLOYEE_COMPANY_ALLOCATION = {
  GET: `${DOMAIN_EMPLOYEE_ALLOCATION}/get_employee_allocation`,
  GETJOB: `${DOMAIN_EMPLOYEE_ALLOCATION}/get_employee_job_allocation`,
  GETBYID: `api/hr.employee.allocation.v2/`,
  DENY: `${DOMAIN_EMPLOYEE_ALLOCATION}/action_denied`,
  APPROVE: `${DOMAIN_EMPLOYEE_ALLOCATION}/action_approved`,
  PUT: `api/hr.employee.allocation.v2/`,
  DELETE: `api/hr.employee.allocation.v2`,
  CREATE: `api/hr.employee.allocation.v2/create`,
  LOG: `${DOMAIN_LOG_HISTORY}/?filter=[["model_model","=","hr.employee.allocation"],["user_id","=",${localStorage?.user_id}]]`,
  CREATEV2: `object/hr.employee.allocation.v2/create_employee_allocation`,
};
export const DOMAIN_RELATIVE = {
  CREATE: 'api/hr.employee.relative/create',
  PUT: 'api/hr.employee.relative/',
};
export const DOMAIN_RELATIVE_PARENT = {
  CREATE: 'api/hr.employee.relative.register/create',
  CREATEByCode: 'create_relative_by_code',
  PUT: 'api/hr.employee.relative.register/',
};
export const DOMAIN_AUDIT_LOG_HISTORY = {
  GET: DOMAIN_LOG_HISTORY,
};
export const DOMAIN_IMPORT_CONTRACT_API = {
  IMPORT: `upload_contract_file`,
};

export const DOMAIN_IMPORT_LEAVE_API = {
  IMPORT: `upload_import_al_cl`,
};

export const DOMAIN_IMPORT_ATTENDANCE_TRANS_API = {
  IMPORT: `upload_import_attendance_trans`,
};

export const DOMAIN_IMPORT_REPORT_SHIFT = {
  IMPORT: `upload_import_shift`,
};

const DOMAIN_CONTRACT_TYPE = 'api/hr.contract.type';
export const DOMAIN_GET_CONTRACT_TYPE = {
  GETALL: `${DOMAIN_CONTRACT_TYPE}/?query={id,name}`,
};
export const DOMAIN_GET_CONTRACT = {
  GET: `${DOMAIN_CONTRACT}/get_contracts`,
  PUT: `${DOMAIN_CONTRACT}/update_contract_by_args`,
  GETALL: `api/hr.contract`,
  CREATE: `${DOMAIN_CONTRACT}/create_contract_by_args`,
  UPDATE: `${DOMAIN_CONTRACT}/update_contract`,
  ACTIVE: `${DOMAIN_CONTRACT}/active_contract`,
};
export const DOMAIN_BOOKING_ROOMS = {
  GET: `${DOMAIN_BOOKING_ROOM}/get_booking_rooms`,
  PUT: `${DOMAIN_BOOKING_ROOM}/update_booking_room_by_args`,
  UPDATE_STATE: `${DOMAIN_BOOKING_ROOM}/update_state_booking_room`,
  GETALL: `api/employee.fleets`,
  CREATE: `create_booking_room`,
};

export const GET_EMPLOYEE_BY_LEAVE = {
  GETALL: `${DOMAIN_GET_EMPLOYEE_BY_LEAVE}`,
  LOG: `${DOMAIN_LOG_HISTORY}`,
  PUT: 'api/hr.cl.report/',
  CALCULATE: 'object/hr.cl.report/calculate_cl',
};
export const CREATE_LEAVE_ALLOCATION = {
  CREATE: `${DOMAIN_CREATE_LEAVE_ALLOCATION}`,
};
export const GET_EMPLOYEE_LEAVE = {
  GETALL: `${DOMAIN_GET_EMPLOYEE_LEAVE}/get_al_report`,
  PUT: `api/hr.al.report/`,
  CALCULATE: `${DOMAIN_GET_EMPLOYEE_LEAVE}/calculate_leave_month`,
  LOG: `${DOMAIN_LOG_HISTORY}`,
};
export const GET_LIST_WARD = {
  GETALL: `${DOMAIN_GET_WARD_LIST}/?query={id,name,district_id{id,name}}`,
};
export const GET_DISTRICT_LIST = {
  GETALL: `${DOMAIN_GET_DISTRICT_LIST}/?query={id,name,state_id{id,name}}`,
};
export const GET_STATE_LIST = {
  GETALL: `${DOMAIN_GET_STATE_LIST}/?query={id,name,country_id{id,name}}`,
};
export const GET_NATION_LIST = {
  GETALL: `${DOMAIN_GET_NATION_LIST}/?query={id,name}`,
};

export const GET_RELIGION_LIST = {
  GETALL: `${DOMAIN_GET_RELIGION_LIST}/?query={id,name}`,
};
export const GET_CITY_LIST = {
  GETALL: `${DOMAIN_GET_CITY_LIST}/?query={id,name}`,
};
export const GET_COUNTRY_LIST = {
  GETALL: `${DOMAIN_GET_COUNTRY_LIST}/?query={id,name}`,
};
export const GET_LIST_WORK_HOUR = {
  GETALL: `${DOMAIN_GET_LIST_WORK_HOUR}/?query={id,name}`,
};
export const GET_JOB_LIST = {
  GETALL: `${DOMAIN_GET_JOB_LIST}/?query={id,name,kpi_config{id,name},department_id{id,name},company_id{id,name},no_of_employee}&filter=[["company_id","=",${localStorage.company_id}]]`,
  GETWITHFILTER: `${DOMAIN_GET_JOB_LIST}/?query={id,name,kpi_config{id,name},department_id{id,name},company_id{id,name},no_of_employee}`,
  GETBYID: `api/hr.job/`,
  CREATE: `${DOMAIN_GET_JOB_LIST}/create`,
  DELETE: `api/hr.job/`,
  PUT: `api/hr.job/`,
  CREATE2: `create_hr_job`,
  GETALLNORIGHT: `/job_list_no_right`,
};
export const GET_INVALID_TIMESHEET_BY_ARGS = {
  GETALL: `${DOMAIN_INVALID_TIMESHEET}/get_invalid_timesheets`,
  DELETE: `${DOMAIN_INVALID_TIMESHEET}/delete_invalid_timesheet_by_id`,
  CREATE: `${DOMAIN_INVALID_TIMESHEET}/create_invalid_timesheet`,
  GETBYID: `api/hr.invalid.timesheet/`,
};

export const GET_HR_LEAVE_TYPE = {
  GETALL: `${DOMAIN_GET_HR_LEAVE_TYPE}/?query={id,name}`,
};

export const GET_COMPANY = {
  GETALL: `${Domain_GET_COMPANY}/?query={id,name,mis_id}&filter=[["name","not in",["My Company (San Francisco)","PE Company","My Company (Chicago"]]]`,
  GETBYID: `object/res.company/get_company_by_employee_id`,
  GETCOMPANIESHO: `object/res.company/get_companies_in_allowed_company_ids`,
  GETALLNORIGHT: `company_list_no_right`,
};

export const GET_DEPARTMENT = {
  GETALL: `${DOMAIN_GET_DEPARTMENT}/?query={id,name}`,
  GETALLFILTER: `${DOMAIN_GET_DEPARTMENT}/`,
  CREATE: `${DOMAIN_GET_DEPARTMENT}/create`,
  PUT: `${DOMAIN_GET_DEPARTMENT}/`,
  GETBYID: `${DOMAIN_GET_DEPARTMENT}/`,
  DELETE: `${DOMAIN_GET_DEPARTMENT}/`,
  GETV2: `object/hr.department/get_department_list`,
  GETNORIGHT: `/department_list_no_right`,
};

export const ROOMLIST = {
  GETALL: `/object/meeting.room/get_meeting_rooms`,
};

export const EMPLOYEELIST = {
  SEARCH: `${DOMAIN_EMPLOYEE}/?query={id,religion_id{id,name},employee_type,work_phone,coach_id{id,name},parent_id{id,name},code,name,time_keeping_code,work_email,company_id{id,name},department_id{id,name},job_id{id,name},city_id{id,name},place_of_birth,district_id{id,name},ward_id{id,name},country_id{id,name},mobile_phone,private_email,work_email,gender,certificate,study_field,resource_calendar_id{id,name},workingday,severance_day,bank,bank_branch,bank_account_number,tax_id,head_of_department_check,general_management_check,department_secretary_check,resource_calendar_type,union_day,part_time_company_id{id,name},part_time_department_id{id,name},part_time_job_title,annual_leave_fund,birthday,gender,nation_id{id,name},marital,identification_id,issued_by_identification{id,name},current_place_of_residence,certificate,highest_degree,study_school,study_field,car_registration,license_plates,range_of_vehicle,car_color,district_vietnam_id{id,name,state_id},state_id{id,name,country_id},ward_vietnam_id{id,name,district_id},probationary_contract_termination_date,job_title,probationary_salary_rate,date_sign}`,
  GETBYID: `${DOMAIN_EMPLOYEE}/`,

  GETBYIDEMPLOYEE: '/employee_list_noright',
  GETALL: `/object/hr.employee/get_employee_list`,
  CREATEUSER: `/object/hr.employee/create_user_from_employee`,
  CHANGEPASSWORD: `/object/hr.employee/change_user_password_general_manager`,
  CREATE: `${DOMAIN_EMPLOYEE}/create`,
  DELETE: `/object/hr.employee/deactivate_employee`,
  GETCC: `/api/apec.common.contact`,
  PARENT: `${DOMAIN_EMPLOYEE}/?query={id,name,parent_id,code,company_id{id,name,mis_id}}`,
  GETFORKPI: `/object/hr.employee/get_employee_list/?query={id,name,department_id{id,name},company_id{id,name}`,
  GETHEADOFDEPARTMENT: `object/hr.employee/get_head_of_department`,
  GETGENERALMANAGER: `object/hr.employee/get_general_manager`,
  UPDATEALCLADVANCED: `object/hr.employee/set_advanced_al_cl_info`,
};
export const SHIFTSLIST = {
  SEARCH: `${DOMAIN_SHIFTS}/?query={id,name,company_id,c_start_work_time,c_end_work_time,c_start_rest_time,c_end_rest_time,total_work_time,total_rest_time,shifts_eat,fix_rest_time,rest_shifts,display_name,create_date, breakfast , lunch , dinner , night , rest_shift_id,is_ho_shift,number_of_attendance,day_work_value,create_date,write_date,__last_update,minutes_working_not_reduced}`,
  CREATE: `${DOMAIN_SHIFTS}/create`,
  UPDATE: `${DOMAIN_SHIFTS}`,
  DELETE: `${DOMAIN_SHIFTS}`,
  GETBYIDS: `/object/shifts/get_shifts_by_ids`,
};
export const EXPLANATION_REQUEST = {
  SEARCH: `${DOMAIN_EXPLANATION_REQUEST}`,
};
export const GET_ATTENDANCE = {
  SEARCH: `${DOMAIN_GET_ATTENDANCE}/get_attendance_reportv3`,
  SEARCHSELF: `${DOMAIN_GET_ATTENDANCE}/get_attendance_report_self`,
  SEARCH_PAGE: `${DOMAIN_GET_ATTENDANCE_PAGE}`,
  CALCULATE: `${DOMAIN_GET_ATTENDANCE}/calculate_attendance_reportv2`,
  FILL_DATA: `${DOMAIN_GET_ATTENDANCE}/fill_data_reportv2`,
  RECALCULATE: `${DOMAIN_GET_ATTENDANCE}/calculate_report_data`,
  GETMARK: `${DOMAIN_GET_ATTENDANCE}/get_distinct_attendance_mark`,
};
export const SHIFTS = {
  GETV2: `${DOMAIN_SHIFT_V2}`,
  GETALL: `${DOMAIN_LIST_SHIFTS}/shifts/`,
  SEARCH: `${DOMAIN_LIST_SHIFTS}/shifts/?query={id,name,company_id,c_start_work_time,c_end_work_time,c_start_rest_time,c_end_rest_time,total_work_time,total_rest_time,shifts_eat,fix_rest_time,rest_shifts,is_ho_shift,display_name,create_date, number_of_attendance,day_work_value,create_date,write_date,__last_update}`,
};
export const HISTORY_SHIFT_EDIT = {
  SEARCH: `${DOMAIN_HISTORY_SHIFT_EDIT}?query={user_id{id,name},old_value_text,new_value_text,shift_id,create_date}`,
};
export const UPDATE_SCHEDULING = {
  SEARCH: `${DOMAIN_SCHEDULING}/update_employees_scheduling`,
  UPDATE_ARR: `${DOMAIN_SCHEDULING}/hr.apec.attendance.report/update_multiple_report `,
};

export const GET_LIST_LEAVE = {
  GETALL: `${DOMAIN_LIST_LEAVE}/get_list_leave`,
  CREATE: `${DOMAIN_LIST_LEAVE}/created_leave_by_employee_id`,
  SEARCH: `page/${DOMAIN_LIST_LEAVE}/get_leave_list`,
  UPDATE: `${DOMAIN_LIST_LEAVE}/update_sate_leave`,
  DELETE: `api/hr.leave/`,
  calculate: `object/hr.leave/calculate_leave`,
  GETREMAININGLEAVE: `object/hr.leave/get_remaining_al_cl`,
  GETLEAVEAPPROVALONLY: `object/hr.leave/get_leave_list_approval_only_and_hr_approval_only`,
  CREATEAPI: '/create_leave_request',
  SEARCHV2: 'object/hr.leave/get_leave_list_v2',
  SEARCH_MISSING_INFO: '/object/hr.leave/get_leave_list_missing_info',
  SEARCH_ATTENDANCE_DUPLICATE:
    '/object/trigger.calculate.report/check_duplicate_attendance',
};
export const GET_ATTENDANCE_DETAIL_BY_ID = {
  SEARCH: `${DOMAIN_GET_ATTENDANCE_BY_ID}/get_attendance_detail_by_id`,
};

export const EXPORT_EXCEL = {
  GETALL: `${DOMAIN_EXPORT}/json_hr_upload_attendance`,
  GET: `object/document.final/get_document_final`,
 // GET_INFO_DOCUMENT:`api/document.final`,
  CREATE:`/api/document.final/create`,
  UPDATE: `/api/document.final/`,
  GETById: `/api/document.final/`,
  DELETE:`api/document.final/`
};
export const INVALID_TIMESHEET = {
  CREATE: `${DOMAIN_INVALID_TIMESHEET}/update_invalid`,
  CREATE2: `${DOMAIN_INVALID_TIMESHEET}/approve_timesheets`,
};

export const GET_LEAVE_TYPE = {
  GETALL: `${DOMAIN_HR_LEAVE_TYPE_LIST}/?query={id,name,type,display_or_not}`,
  GETBYID: `api/hr.leave.type/`,
};

export const DOMAIN_USER = {
  GET: `api/res.users/`,
  GETALL: `object/res.users/get_user_list`,
  GETBYID: `api/res.users/`,
  CREATE: `api/res.users/create`,
  UPDATE: `api/res.users/`,
  CHANGEPASSWORD: `object/res.users/change_user_password`,
  LOG: `${DOMAIN_LOG_HISTORY}/?filter=[["model_model","=","res.users"],["user_id","=",${localStorage?.user_id}]]`,
};

export const DOMAIN_ALLOWED_COMPANY = {
  UPDATE: `object/res.allowed.company/update_allowed_company`,
  GET: `api/res.allowed.company/`,
};

export const GET_ATTENDANCE_TRANS = {
  SEARCH: `${DOMAIN_GET_ATTENDANCE_TRANS}/get_AttendanceTrans_list`,
};

export const DOMAIN_MEETING_ROOMS = {
  CREATE: `/create_meeting_room`,
  UPDATE: `${DOMAIN_MEETING_ROOM}/update_room_by_args`,
};

export const DOMAIN_CONFIG_LOCK = {
  GET: `object/config.lock.features/get_config_lock_features`,
  CREATE: `api/config.lock.features/create`,
  UPDATE: `api/config.lock.features/`,
  DELETE: `api/config.lock.features/`,
  GETBYID: `api/config.lock.features/`,
};

export const DOMAIN_TIME_RECORDER_STATE = {
  GET: `${DOMAIN_TIME_RECORDER_STATES}/get_time_recorder_state`,
};

export const DOMAIN_EQUIPMENT_REQUESTS = {
  GET: `${DOMAIN_EQUIPMENT_REQUEST}/get_equipment_request`,
  PUT: `${DOMAIN_EQUIPMENT_REQUEST}/update_equipment_request_by_args`,
  UPDATE_STATE: `${DOMAIN_EQUIPMENT_REQUEST}/update_state_equipment_request`,
  GETALL: `api/equipment.request`,
};

export const EQUIPMENTLIST = {
  GETALL: `/object/product.product/get_equipments`,
  UPDATE: `/object/product.product/update_equipment_by_args`,
  CREATE: `/create_equipment`,
};
export const DASHBOARD_EMPLOYEE = {
  POST: `/object/hrm.employee.report/generate_report_employee`,
};
export const DASHBOARD_EMPLOYEE_MIS = {
  POST: '/object/hr.employee/check_employee_missing_info',
  GET:'/object/hr.weekly.report/get_employee_not_have_report_current_week'
};

export const DASHBOARD_CONTRACT = {
  POST: `/object/hrm.contract.report/generate_report_contract`,
};

export const DASHBOARD_LEAVE = {
  POST: `/object/hrm.leave.report/generate_report_leave`,
};

export const DASHBOARD_INVALID = {
  POST: `/object/hrm.invalid.timesheet.report/generate_report_invalid_timesheet`,
};

export const INSURANCE = {
  GET: `/object/hr.insurance/get_insurance`,
  POST: `api/hr.insurance/create`,
  PUT: `api/hr.insurance/`,
  DELETE: `api/hr.insurance/`,
  GETBYID: `api/hr.insurance/`,
  IMPORT: `import_insurance_salary`,
};

export const INSURANCE_CONFIG = {
  GET: `/object/hr.insurance.config/get_insurance_config`,
  POST: `api/hr.insurance.config/create`,
  PUT: `api/hr.insurance.config/`,
  PUTV2: `object/hr.insurance.config/update_insurance_config`,
  DELETE: `api/hr.insurance.config/`,
  GETBYID: `api/hr.insurance.config/`,
};
 
export const WORK_LOCATION = {
  GET: `/api/apec.work.location/`,
  GETNORIGHT: `/work_location_noright`,
  POST: `/object/apec.work.location/create_work_location`,
  UPDATE: `/object/apec.work.location/update_work_location`,
  UPDATE2: `/api/apec.work.location/`,
  DELETE: `/object/apec.work.location/delete_work_location`,
};

export const REGISTER_NEW_EMPLOYEE = {
  UPDATE: `/object/apec.register.employee/update_register_employee`,
  POST: `/object_noright/register_new_employee`,
  POST2: `/create_relative_register_noright`,
  GET: `/api/apec.register.employee/?query={id,name,company_id{id,name,mis_id},department_id{id,name},job_id{id,name},start_work_date,date_of_birth,citizen_id,verified_citizen_id_date,verified_citizen_id_by,tax_number,social_insurance_number,original_address,current_address,license_plate,vehicle_info,bidv_info,status,gender,register_employee_url_ids{id,name,url,image_type},employee_code,employee_ids}`,
  VERIFY: `/object/apec.register.employee/verify_register_employee`,
  DECLINE: `/object/apec.register.employee/decline_register_employee`,
  GETById: `/api/apec.register.employee/`,
  GETBYCOMPANY: '/object/apec.register.employee/get_register_employee',

  MAILIT: `/object/apec.register.employee/it_received_register_employee`,
  MAILEMPLOYEE: `/object/apec.register.employee/employee_received_register_employee`,
};

export const RESIGNATIONLETTER = {
  UPDATE: `/object/severance.application.request.employee/update_request`,
  VERIFY: `/object/severance.application.request.employee/handle_approve_request`,
  VERIFY2: `/object/severance.application.request.employee/handle_reject_request`,
  POST: `/object/severance.application.request.employee/create_request`,
  GET: `/object/severance.application.request.employee/get_severance_application_request`,
  GETById: `/api/severance.application.request.employee/`,
  MAILIT: `/object/apec.register.employee/it_received_register_employee`,
};

export const REWARD_CONTENT = {
  GET: `/api/hr.reward.specific/`,
  POST: `/api/hr.reward.specific/create`,
  PUT: `/api/hr.reward.specific/`,
  DELETE: `/api/hr.reward.specific/`,
  DELETEJOBTYPE: `/object/hr.reward.specific/delete_job_type_ids_from_reward_specific`,
  GETREWARD: `/api/hr.reward.content/`,
  GETJOBTYPE: `/api/hr.job.type/`,
  CREATEJOB: `/api/hr.job.type/create`,
  UPDATEJOB: `/api/hr.job.type/`,
  GETJOBTYPEBYID: `/api/hr.job.type/`,
  POSTREWARD: `/api/hr.reward.content/create`,
  UPDATEREWARD: `/api/hr.reward.content/`,
};

export const APPROVAL_CHANGE_REQUEST = {
  GET: `object/hr.approval.change.request/get_change_request`,
  GET_BY_ID: `api/hr.approval.change.request/`,
  POST: `api/hr.approval.change.request/create`,
  PUT: `api/hr.approval.change.request/`,
  APPROVE: `object/hr.approval.change.request/action_approve`,
  DELETE: `api/hr.approval.change.request/`,
};

export const APEC_GROUP_MAIL = {
  GET: `api/apec.group.mail`,
  POST: `api/apec.group.mail/create`,
  PUT: `api/apec.group.mail/`,
  DELETE: `api/apec.group.mail/`,
  GETBYID: `api/apec.group.mail/`,
};

export const EMPLOYEEWORKHISTORY = {
  GET: `object/hr.employee.work.history/get_employee_work_history`,
};

