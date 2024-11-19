import { IInvalidTimesheet } from "@/interface/weeklyreport/type"


export const mapShift = (res: IInvalidTimesheet[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        // const validationData = item?.validation_data?.split(',').map(timeString => {
        //     const [minutes, seconds] = timeString.split(':');
        //     return `${seconds.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        // }).join(',');
        const reviewerId = item?.reviewer ?? [];
        return {
            no: index + 1,
            id: item?.id,
            employee_code: item?.employee_code,
            employee_name: item?.employee_name,
            employee_id: item?.employee_id[0],
            reviewer_id: reviewerId[0],
            reviewer_name: reviewerId[1],
            department: item?.department,
            position: item?.position,
            invalid_date: item?.invalid_date,
            invalid_type: item?.invalid_type,
            reason: item?.reason,
            remarks: item?.remarks,
            shift_from: item?.shift_from,
            shift_to: item?.shift_to,
            shift_break: item?.shift_break,
            validated: item?.validated,
            real_time_attendance_data: item?.real_time_attendance_data,
            validation_data: item?.invalid_type === "1" ? item?.shift_to : item?.invalid_type === "2" ? item?.shift_from : "",
            attendance_missing_from: item?.attendance_missing_from,
            attendance_missing_to: item?.attendance_missing_to,
        }
    })
} 