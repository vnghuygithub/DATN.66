export interface IShiftsListColumn{
    id: number;
    name: string;
    company_name: string;
    c_start_work_time: string;
    c_end_work_time: string;
    c_start_rest_time: string;
    c_end_rest_time: string;
    total_work_time: string;
    total_rest_time: string;
    shifts_eat: boolean;
    fix_rest_time: boolean;
    lunch: boolean;
    breakfast: boolean;
    dinner: boolean;
    rest_shift_name: string;
    night: boolean;
    rest_shifts: boolean;
    is_ho_shift:boolean;
    display_name: string;
    number_of_attendance: number;
    day_work_value: string;
}

export interface IFilterShiftsParams {
  id: number;
  name: string;
  company_id: boolean;
  c_start_work_time: string;
  c_end_work_time: string;
  c_start_rest_time: string;
  c_end_rest_time: string;
  total_work_time: string;
  total_rest_time: string;
  shifts_eat: string;
  fix_rest_time: boolean;
  rest_shifts: boolean;
  display_name: string;
  rest_shift_id: number;
  number_of_attendance: number;
  day_work_value: string;
  create_date: string;
  write_date: string;
  __last_update: string;
  is_ho_shift:boolean;
}
export interface IShiftDtoResponse {
    count: number;
    prev: any;
    current: number;
    next: any;
    total_pages: number;
    result: IShiftIdDtoResult[];
  }

  export interface IShiftIdDtoResult {
    id: number;
    name: string;
    company_id: boolean;
    c_start_work_time: string;
    c_end_work_time: string;
    c_start_rest_time: string;
    c_end_rest_time: string;
    total_work_time: string;
    total_rest_time: string;
    shifts_eat: string;
    fix_rest_time: boolean;
    rest_shifts: boolean;
    display_name: string;
    rest_shift_id: number;
    number_of_attendance: number;
    day_work_value: string;
    create_date: string;
    write_date: string;
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    night: boolean;
    __last_update: string;
    is_ho_shift:boolean;
  }
  export interface IShiftIdDtoResultV2 {
    id: number;
    name: string;
    company_id: Array<any>;
    company_name: string;
    c_start_work_time: string;
    c_end_work_time: string;
    c_start_rest_time: string;
    c_end_rest_time: string;
    total_work_time: string;
    total_rest_time: string;
    shifts_eat: string;
    fix_rest_time: boolean;
    rest_shifts: boolean;
    is_ho_shift:boolean;
    display_name: string;
    rest_shift_id: Array<any>;
    rest_shift_name: string;
    number_of_attendance: number;
    day_work_value: string;
    create_date: string;
    write_date: string;
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    night: boolean;
    minutes_working_not_reduced: number;
    __last_update: string;
    mis_id: string;
  }
  export interface ICreateShiftBody {
    params: ICreateShiftParams
  }

  export interface ICreateShiftParams {
    data: ICreateShiftData
  }

  export interface ICreateShiftData {
    name: string
    start_work_time: number
    end_work_time: number
    start_rest_time: number
    end_rest_time: number
    fix_rest_time: boolean
    rest_shifts: boolean
    night: boolean
    breakfast: boolean
    lunch: boolean
    dinner: boolean
    rest_shift_id: number | null
    number_of_attendance: number
    day_work_value: number

  }


