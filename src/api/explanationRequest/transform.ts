import { IEmployeeLog } from "@/interface/employees/employee"
import { IExplanationColumn } from "@/interface/explanation/explanation"
import moment from "moment"

export const mapShift = (res: IExplanationColumn[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        return {
            no: index + 1,
            key: item?.id,
            time_keeping_code: item?.time_keeping_code,
            employee_code: item?.employee_code,
            employee_name: item?.employee_name,
            department: item?.department,
            job_title: item?.job_title,
            date: item?.date,
            shift_name: item?.shift_name,
            attendance_attempt_1: item?.attendance_attempt_1,
            attendance_attempt_2: item?.attendance_attempt_2,
            attendance_attempt_3: item?.attendance_attempt_3,
            attendance_attempt_4: item?.attendance_attempt_4,
            attendance_attempt_5: item?.attendance_attempt_5,
            attendance_attempt_6: item?.attendance_attempt_6,
            attendance_attempt_7: item?.attendance_attempt_7,
            attendance_attempt_8: item?.attendance_attempt_8,
            attendance_attempt_9: item?.attendance_attempt_9,
            attendance_attempt_10: item?.attendance_attempt_10,
            attendance_attempt_11: item?.attendance_attempt_11,
            attendance_attempt_12: item?.attendance_attempt_12,
            attendance_attempt_13: item?.attendance_attempt_13,
            attendance_attempt_14: item?.attendance_attempt_14,
            attendance_attempt_15: item?.attendance_attempt_15,
            last_attendance_attempt: item?.last_attendance_attempt,
            attendance_late: item?.attendance_late,
            leave_early: item?.leave_early,
            total_work_time: item?.total_work_time

        }
    })
}

export const mapExplainationLog = (res: IEmployeeLog[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        let field_name = item?.field_name
        let old_value_text = item?.old_value_text
        let new_value_text = item?.new_value_text
        let field_description = item?.field_description
        if (field_name === "validated") {
            if (old_value_text === "1") {
                old_value_text = "Chưa duyệt"
            } if (old_value_text === "2") {
                old_value_text = "Đã duyệt"
            } if (old_value_text === "3") {
                old_value_text = "Từ chối"
            } if (new_value_text === "1") {
                new_value_text = "Chưa duyệt"
            } if (new_value_text === "2") {
                new_value_text = "Đã duyệt"
            } if (new_value_text === "3") {
                new_value_text = "Từ chối"
            }
        }
        if (field_name === "invalid_type") {
            field_description = "Loại giải trình"
            if (old_value_text === "1") {
                old_value_text = "Về sớm"
            }
            if (old_value_text === "2") {
                old_value_text = "Đi muộn"
            }
            if (old_value_text === "3") {
                old_value_text = "Thiếu chấm công"
            }
            if (new_value_text === "1") {
                new_value_text = "Về sớm"
            }
            if (new_value_text === "2") {
                new_value_text = "Đi muộn"
            }
            if (new_value_text === "3") {
                new_value_text = "Thiếu chấm công"
            }
        }
        return {
            no: index + 1,
            res_id: item?.res_id,
            key: item?.id,
            old_value_text: old_value_text,
            new_value_text: new_value_text,
            field_description: field_description,
            field_name: item?.field_name,
            model_model: item?.model_model,
            user_id: item?.user_id,
            create_date: item?.create_date ? moment(item?.create_date) : '',
            model_name: item?.model_name,
            name: item?.name,
            method: item?.method === "unlink" ? "Xoá" : item?.method === "create" ? "Tạo" : "Sửa"
        }
    })
}