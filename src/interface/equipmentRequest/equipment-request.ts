export interface IGetEquipmentRequest {
  employee_name_id: any;
  department_name_id: any;
  product_id: any;
  create_date: string;
  equipment_request_ids: string;
  purpose: string;
  status?: string;
  page?: number;
  page_size?: number;
}

export interface IEquipmentRequest {
  id: number;
  employee_name_id: Array<any>;
  department_name_id: Array<any>;
  product_id: any;
  create_date: string;
  equipment_request_ids: string;
  purpose: string;
  status?: string;
  page?: number;
  page_size?: number;
}

export interface IUpdateEquipmentRequestArgs {
  id: number;
  employee_name_id: any;
  department_name_id: any;
  create_date: string;
  purpose: string;
}

export interface IEquipments {
  id: number | string;
  name: string;
  page?: number | string;
  page_size?: number | string;
}

export interface IUpdateEquipments {
  id: number | string;
  name: any;
}

export interface IUpdateStateEquipmentRequestArgs {
  id: number;
  employee_name_id: any;
  department_name_id: any;
  equipment_request_ids: string;
  create_date: string;
  purpose: string;
  status: string;
}