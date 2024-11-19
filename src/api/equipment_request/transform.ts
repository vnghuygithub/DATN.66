import { IEquipmentRequest, IEquipments } from '@/interface/equipmentRequest/equipment-request';
import { IMeetingRooms } from '@/interface/meetingRooms/meeting_rooms';

export const mapBookingRooms = (item: IEquipmentRequest[]) => {
  return (
    item &&
    item.length > 0 &&
    item.map((item, index) => {
      const employeeId = item?.employee_name_id ?? [];
      const department_name_id = item?.department_name_id ?? [];
      return {
        no: index + 1,
        id: item?.id,
        department_id: department_name_id[0] ?? '',
        department_name: department_name_id[1] ?? '',
        employee_id: employeeId[0] ?? '',
        employee_name: employeeId[1] ?? '',
        equipment_request_ids: item?.equipment_request_ids ?? '',
        status: item?.status ?? '',
        purpose: item?.purpose ?? '',
        create_date: item?.create_date ?? '',
      };
    })
  );
};
export const mapEquipments = (item: IEquipments[]) => {
  return (
    item &&
    item.length > 0 &&
    item.map((item, index) => {
      const name = item?.name ?? [];

      return {
        no: index + 1,
        id: item?.id ?? '',
        name: item?.name ?? '',
      };
    })
  );
};
