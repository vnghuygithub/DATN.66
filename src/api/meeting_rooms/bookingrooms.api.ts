import { format } from 'date-fns';
import { request } from '../request';
import {
  DOMAIN_BOOKING_ROOMS,
  DOMAIN_MEETING_ROOMS,
  ROOMLIST,
} from '../constApi';
import { message as $message } from 'antd';
import {
  ICreatBookingRooms,
  ICreateRoomsArgs,
  IHandleUpdateBookingRoomArgs,
  IMeetingRooms,
  IRooms,
  IUpdateBookingRoomArgs,
  IUpdateRooms,
} from '@/interface/meetingRooms/meeting_rooms';
import { mapBookingRooms, mapRooms } from './transform';
import moment from 'moment';
export const createMeetingRoomsByArgs = async (args: ICreatBookingRooms) => {
  console.log(args, "-------------");
  const formData = new FormData();
  const employeeId = Number(args.employee);

  const reqDate = new Date(args.req_date); 
  const dateFrom = new Date(args.date_from);
  const dateTo = new Date(args.date_to);

  // Format the dates as 'YYYY-MM-DD HH:mm:ss'
  const formattedReqDate = reqDate.toISOString().slice(0, 10); 
  // convert lại time cho đúng múi giờ và đúng thời gian đã chọn
  const formattedDateFrom = dateFrom
  .toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false })
  .replace('T', ' '); // 'YYYY-MM-DD HH:mm:ss'


// convert lại time cho đúng múi giờ và đúng thời gian đã chọn
const formattedDateTo = dateTo
  .toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false })
  .replace('T', ' '); 

  formData.append('room', args.room ?? '');
  formData.append('employee', employeeId as any);
  formData.append('req_date', formattedReqDate);
  formData.append('date_from', formattedDateFrom);
  formData.append('date_to', formattedDateTo);
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



export const createRoom = async (args: IRooms) => {
  const formData = new FormData();
  formData.append('name', args.name ?? '');
  formData.append('company_id', args.company_id ?? '');
  

  let url = DOMAIN_MEETING_ROOMS.CREATE;
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

export const getListRoom = async () => {
  let url = ROOMLIST.GETALL;
  const res = await request('post', url, {
    params: {
      args: ['', '', '', ''],
    },
  });
  return res;
};

export const getRoomsByArgs = async (args: IMeetingRooms) => {
  let url = ROOMLIST.GETALL;
  let requestBody = {
    params: {
      args: [
        (args.name ?? '').trim(),
        '',
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
        data: mapRooms(res?.result?.result),
        total: res?.result.total_records,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export const getBookingRoomsByArgs = async (args: ICreateRoomsArgs) => {
  let url = DOMAIN_BOOKING_ROOMS.GET;
  let requestBody = {
    params: {
      args: [
        args.room ?? '',
        args.employee ?? '',
        args.req_date ?? '',
        args.date_from ?? '',
        args.date_to ?? '',
        (args.purpose ?? '').trim(),
        (args.state ?? '').trim(),
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

export const updateBookingRoom = async (args: IUpdateBookingRoomArgs) => {
  const formattedReqDate = moment(args.req_date).format('YYYY-MM-DD HH:mm:ss');
  const formattedDateFrom = moment(args.date_from).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  const formattedDateTo = moment(args.date_to).format('YYYY-MM-DD HH:mm:ss');

  let url = DOMAIN_BOOKING_ROOMS.PUT;
  let requestBody = {
    params: {
      args: [
        args.id ?? '',
        args.room ?? '',
        args.employee ?? '',
        formattedReqDate,
        formattedDateFrom,
        formattedDateTo,
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

export const updateHandleBookingRoom = async (
  args: IHandleUpdateBookingRoomArgs
) => {
  const formattedReqDate = moment(args.req_date).format('YYYY-MM-DD HH:mm:ss');
  const formattedDateFrom = moment(args.date_from).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  const formattedDateTo = moment(args.date_to).format('YYYY-MM-DD HH:mm:ss');

  let url = DOMAIN_BOOKING_ROOMS.UPDATE_STATE;
  let requestBody = {
    params: {
      args: [
        args.id ?? '',
        args.room ?? '',
        args.employee ?? '',
        formattedReqDate,
        formattedDateFrom,
        formattedDateTo,
        (args.purpose ?? '').trim(),
        (args.state ?? '').trim(),
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

export const getBookingRoomById = async (id: number) => {
  let url =
    DOMAIN_BOOKING_ROOMS.GETALL +
    `/${id}` +
    '/?query={id,room{id,name},employee{id,name},req_date,date_from,date_to,purpose,state}';
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

export const deleteBookingRoomById = async (id: number) => {
  let url = DOMAIN_BOOKING_ROOMS.GETALL + `/${id}`;
  try {
    const res = await request('delete', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteRoomById = async (id: number) => {
  let url = `api/meeting.room/${id}`;
  const res = await request('delete', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
// export interface UpdateRoom {
//   name: string;
// }
// export const updateRoom = async (id: number,data: UpdateRoom) => {
//   let url = DOMAIN_RELATIVE.PUT + id;
//   let requestBody = {
//       params: {
//           data: {
//               ...data
//           }
//       }
//   }
//   try {
//       const res = await request("post", url, requestBody);
//       if (res?.result?.error?.code && res.result.error.code == 400) {
//           $message.error(res.result.error.message);
//           return;
//       }
//       return res;
//   } catch(error) {
//       console.log(error)
//   }
// }

export const updateMeetingRoom = async (args: IUpdateRooms) => {
  let url = DOMAIN_MEETING_ROOMS.UPDATE;
  let requestBody = {
    params: {
      args: [args.id ?? '', args.name ?? ''],
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
