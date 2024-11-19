import { IBookingRooms, IMeetingRooms } from '@/interface/meetingRooms/meeting_rooms';

export const mapBookingRooms = (item: IBookingRooms[]) => {
  return (
    item &&
    item.length > 0 &&
    item.map((item, index) => {
      const employeeId = item?.employee ?? [];
      const room = item?.room ?? [];

      return {
        no: index + 1,
        id: item?.id,
        room: item?.room ?? '',
        room_name: room[1] ?? '',
        employee_code: item?.employee_code ?? '',
        employee_id: employeeId[0] ?? '',
        employee_name: employeeId[1] ?? '',
        state: item?.state ?? '',
        purpose: item?.purpose ?? '',
        date_from: item?.date_from ?? '',
        date_to: item?.date_to ?? '',
        req_date: item?.req_date ?? '',
      };
    })
  );
};
export const mapRooms = (item: IMeetingRooms[]) => {
  return (
    item &&
    item.length > 0 &&
    item.map((item, index) => {
      const name = item?.name ?? [];
      const check_availability = item?.check_availability ?? [];

      return {
        no: index + 1,
        id: item?.id ?? '',
        name: item?.name ?? '',
        check_availability: item?.check_availability ?? '',
      };
    })
  );
};
