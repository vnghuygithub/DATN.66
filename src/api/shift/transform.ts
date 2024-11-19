import { IShiftIdDtoResult, IShiftIdDtoResultV2 } from "@/interface/shifts/shifts";

export const mapShift = (res: IShiftIdDtoResult[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        return {
            no: index + 1,
            id: item?.id,
            name: item?.name,
            company: item?.company_id,
            c_start_work_time: item?.c_start_work_time,
            c_end_work_time: item?.c_end_work_time,
            c_start_rest_time: item?.c_start_rest_time,
            c_end_rest_time: item?.c_end_rest_time,
            total_work_time: item?.total_work_time,
            total_rest_time: item?.total_rest_time,
            breakfast: item?.breakfast,
            lunch: item?.lunch,
            dinner: item?.dinner,
            night: item?.night,
            shifts_eat: item?.shifts_eat,
            fix_rest_time: item?.fix_rest_time,
            rest_shifts: item?.rest_shifts,
            display_name: item?.display_name,
            rest_shift_id: item?.rest_shift_id,
            number_of_attendance: item?.number_of_attendance,
            day_work_value: item?.day_work_value,
            create_date: item?.create_date,
            write_date: item?.write_date,
            __last_update: item?.__last_update,
        }
    })
}
export const mapShiftV2 = (res: IShiftIdDtoResultV2[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        const companyId = item?.company_id ?? []
        const restShiftId = item?.rest_shift_id ?? []
        return {
            no: index + 1,
            id: item?.id,
            name: item?.name,
            company_id: companyId[0] ?? '',
            company_name: companyId[1] ?? '',
            c_start_work_time: item?.c_start_work_time,
            c_end_work_time: item?.c_end_work_time,
            c_start_rest_time: item?.c_start_rest_time,
            c_end_rest_time: item?.c_end_rest_time,
            total_work_time: item?.total_work_time,
            total_rest_time: item?.total_rest_time,
            breakfast: item?.breakfast,
            lunch: item?.lunch,
            dinner: item?.dinner,
            night: item?.night,
            shifts_eat: item?.shifts_eat,
            fix_rest_time: item?.fix_rest_time,
            rest_shifts: item?.rest_shifts,
            is_ho_shift:item?.is_ho_shift,
            display_name: item?.display_name,
            rest_shift_id: restShiftId[0] ?? '',
            rest_shift_name: restShiftId[1] ?? '',
            number_of_attendance: item?.number_of_attendance,
            day_work_value: item?.day_work_value,
            create_date: item?.create_date,
            write_date: item?.write_date,
            __last_update: item?.__last_update,
            minutes_working_not_reduced: item?.minutes_working_not_reduced,
            mis_id: item?.mis_id
        }
    })
}