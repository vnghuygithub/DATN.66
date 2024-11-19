import { IContract } from "@/interface/contract/contract";

export const mapContract = (item: IContract[]) => {
    return item && item.length > 0 && item.map((item, index) => {
        const employeeId = item?.employee_id ?? []; 
        const departmentId = item?.department_id ?? [];
        const contractTypeId = item?.contract_type_id ?? [];
        const resourceCalendarId = item?.resource_calendar_id ?? [];

        return {
            no: index + 1,
            id: item?.id,
            name: item?.name ?? '',
            employee_code: item?.employee_code ?? '',
            employee_id: employeeId[0] ?? '',
            employee_name: employeeId[1] ?? '',
            department_id: departmentId[0] ?? '',
            department_name: departmentId[1] ?? '',
            job_title: item?.job_title ?? '',
            contract_type_id: contractTypeId[0] ?? '',
            contract_type_name: contractTypeId[1] ?? '',
            state: item?.state === "draft" ? "Mới" : item?.state === "open" ? "Đang chạy" : item?.state === "almost" ? "Sắp hết hạn" : item?.state === "close" ? "Hết hạn" : item?.state === "cancel" ? "Đã Hủy" : "",
            date_start: item?.date_start ?? '',
            date_end: item?.date_end ?? '',
            resource_caldendar_id: resourceCalendarId[0] ?? '',
            resource_caldendar_name: resourceCalendarId[1] ?? '',
            date_sign: item?.date_sign ?? '',
            salary_rate: item?.salary_rate ?? '',
            minutes_per_day: item?.minutes_per_day ?? '',
            start_end_attendance: item?.start_end_attendance ?? '',
           depend_on_shift_time: item?.depend_on_shift_time ?? '',
           by_hue_shift:item?.by_hue_shift ?? '',

        };
    });
};



