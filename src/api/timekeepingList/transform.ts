import { IEmployeeLog } from "@/interface/employees/employee"
import moment from "moment"

export const mapTimeKeeping = (res: any[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        return {
            no: index + 1,
            ...item
        }
    })
}
export const mapTimeKeepingLog = (res: IEmployeeLog[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        let field_name = item?.field_name
        let old_value_text = item?.old_value_text
        let new_value_text = item?.new_value_text
        let field_description = item?.field_description
        if (field_name === "holiday_status_id") {
            field_description = "Loại đơn"
        }
        if (field_name === "date_from") {
            field_description = "Từ ngày"
        }
        if (field_name === "date_to") {
            field_description = "Đến ngày"
        }
        if (field_name === "for_reasons") {
            if (old_value_text === "1") {
                old_value_text = "Cá nhân"
            }
            if (old_value_text === "2") {
                old_value_text = "Công việc"
            }
            if (new_value_text === "1") {
                new_value_text = "Cá nhân"
            }
            if (new_value_text === "2") {
                new_value_text = "Công việc"
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