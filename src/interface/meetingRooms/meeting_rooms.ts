export interface ICreateRoomsArgs {
  room: string;
  room_name: string;
  room_id: number;
  employee_id: number;
  employee: string;
  req_date: string;
  date_from: string;
  date_to: string;
  purpose: string;
  state?: string;
  page?: number;
  page_size?: number;
}

export interface ICreatBookingRooms {
  room: string;
  employee: number;
  // employee: string;
  req_date: string;
  date_from: string;
  date_to: string;
  purpose: string;
}

export interface ICreatEquipmentrequest {
  room: string;
  employee: number;
  // employee: string;
  req_date: string;
  purpose: string;
}
export interface IRooms {
  name: any;
  company_id: any;
}

export interface IBookingRooms {
  id: number;
  employee_code: string;
  employee: Array<any>;
  employee_name: string;
  room: Array<any>;
  room_name: string;
  req_date: string;
  date_from: string;
  date_to: string;
  purpose: string;
  state: string;
  page: number;
  page_size: number;
}
export interface IMeetingRooms {
  id: number | string;
  name: string;
  check_availability: string;
  page?: number | string;
  page_size?: number | string;
}

export interface IEmployee {
  value: number;
  label: string;
}
export interface IRoom {
  value: number;
  label: string;
}

export interface IUpdateBookingRoomArgs {
  id: number;
  room: number | IRoom;
  req_date: string;
  date_from: string;
  date_to: string;
  purpose: string;
  employee: number | IEmployee; 
}

export interface IUpdateRooms {
  id: number | string;
  name: any;
}

export interface IHandleUpdateBookingRoomArgs {
  id: number;
  room: number | IRoom;
  req_date: string;
  date_from: string;
  date_to: string;
  purpose: string;
  employee: number | IEmployee; 
  state: string;
}
