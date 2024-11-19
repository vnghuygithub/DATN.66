import { request } from '../request';
import { DOMAIN_BOOKING_ROOMS, DOMAIN_EQUIPMENT_REQUESTS, DOMAIN_MEETING_ROOMS, EQUIPMENTLIST, ROOMLIST } from '../constApi';
import { message as $message } from 'antd';
import {
  ICreatBookingRooms,
  ICreatEquipmentrequest,
  ICreateRoomsArgs,
  IHandleUpdateBookingRoomArgs,
  IMeetingRooms,
  IUpdateBookingRoomArgs,
  IUpdateRooms,
} from '@/interface/meetingRooms/meeting_rooms';
import { mapBookingRooms, mapEquipments } from './transform';
import moment from 'moment';
import { IEquipments, IGetEquipmentRequest, IUpdateEquipmentRequestArgs, IUpdateEquipments, IUpdateStateEquipmentRequestArgs } from '@/interface/equipmentRequest/equipment-request';

export const getEquipmentRequestByArgs = async (args: IGetEquipmentRequest) => {
  let url = DOMAIN_EQUIPMENT_REQUESTS.GET;
  let requestBody = {
    params: {
      args: [
        (args.employee_name_id ?? ''),
        (args.department_name_id ?? ''),
        (args.product_id ?? ''),
        (args.create_date ?? ''),
        (args.equipment_request_ids ?? ''),
        (args.purpose ?? '').trim(),
        (args.status ?? '').trim(),
        args.page ?? '',
        args.page_size ?? '',
      ],
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return {
      results: {
        data: mapBookingRooms(res?.result?.result),
        total: res?.result.total_records,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export const createEquipmentrequest = async (args: ICreatEquipmentrequest) => {
  const formData = new FormData();
  const employeeId = Number(args.employee);
  // const formattedDate = (args.req_date as any).format('YYYY-MM-DD');
  const reqDate = new Date(args.req_date); 

  // const formattedDateFrom = (args.date_from as any).format(
  //   'YYYY-MM-DD HH:mm:ss'
  // );
  // const formattedDateTo = (args.date_to as any).format('YYYY-MM-DD HH:mm:ss');
  formData.append('room', args.room ?? '');
  formData.append('employee', employeeId as any);
  formData.append('req_date', reqDate as any);
  // formData.append('date_from', formattedDateFrom as any);
  // formData.append('date_to', formattedDateTo as any);
  formData.append('purpose', args.purpose ?? '');
  let url = DOMAIN_BOOKING_ROOMS.CREATE;
  try {
    const res = await request('post', url, formData);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createEquipment = async (name: any) => {
  const formData = new FormData();
  formData.append('name', name.name ?? '');
  console.log(formData);
  
  let url = EQUIPMENTLIST.CREATE;
  try {
    const res = await request('post', url, formData);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const getListRoom = async () => {
  let url = ROOMLIST.GETALL;
  const res = await request('post', url, {
    params: {
      args: ['', '', '', ''],
    },
  });
  return res
    
};

export const getEquipmentsByArgs = async (args?: IEquipments) => {
  let url = EQUIPMENTLIST.GETALL;
  let requestBody = {
    params: {
      args: [
        (args?.name ?? '').trim(),
        args?.page ?? '',
        args?.page_size ?? '',
      ],
    },
  };

  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }

    return {
      results: {
        data: mapEquipments(res?.result?.result),
        total: res?.result.total_records,
      },
    };
  } catch (error) {
    console.error(error);
  }
};

export const updateEquipmentRequest = async (args: IUpdateEquipmentRequestArgs) => {
  // const formattedReqDate = moment(args.req_date).format('YYYY-MM-DD HH:mm:ss');
  // const formattedDateFrom = moment(args.date_from).format(
  //   'YYYY-MM-DD HH:mm:ss'
  // );
  // const formattedDateTo = moment(args.date_to).format('YYYY-MM-DD HH:mm:ss');

  let url = DOMAIN_EQUIPMENT_REQUESTS.PUT;
  let requestBody = {
    params: {
      args: [
        args.id ?? '',
        args.employee_name_id ?? '',
        args.department_name_id ?? '',
        args.create_date ?? '',
        (args.purpose ?? '').trim(),
      ],
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateStateEquipmentRequest = async (args: IUpdateStateEquipmentRequestArgs) => {

  let url = DOMAIN_EQUIPMENT_REQUESTS.UPDATE_STATE;
  let requestBody = {
    params: {
      args: [
        args.id ?? '',
        args.employee_name_id ?? '',
        args.department_name_id ?? '',
        args.equipment_request_ids ?? '',
        args.create_date ?? '',
        (args.purpose ?? '').trim(),
        (args.status ?? '').trim(),
      ],
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getEquipmentRequestById = async (id: number) => {
  let url =
  DOMAIN_EQUIPMENT_REQUESTS.GETALL +
    `/${id}` +
    '/?query={id,employee_name_id{id,name},department_name_id{id,name},equipment_request_ids,create_date,purpose}';
  try {
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteEquipmentRequestById = async (id: number) => {
  let url = DOMAIN_EQUIPMENT_REQUESTS.GETALL + `/${id}`;
  try {
      const res = await request('delete', url);
      if (res?.result?.error?.code && res.result.error.code == 400) {
          $message.error(res.result.error.message);
          return;
      }
      return res
  } catch (error) {
      console.log(error)
  }
}

export const deleteEquipmentById = async (id: number) => {
  let url = `api/product.product/${id}`;
  const res = await request('delete', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
}

export const updateEquipment = async (args: IUpdateEquipments) => {

  let url = EQUIPMENTLIST.UPDATE;
  let requestBody = {
    params: {
      args: [
        args.id ?? '',
        args.name ?? '',
      ],
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};