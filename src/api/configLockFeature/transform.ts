import moment from "moment";

export interface IConfigLock {
    id?: number;
    name: string;
    start_lock_date: string;
    end_lock_date: string;
    company_id: Array<any>
    active: boolean;
    model_lock: string;
    scheduled_run: boolean;
    scheduled_run_mode: string;
    is_locked: boolean;
    create_date: string;
    write_date: string;
    mis_id:string
}
export interface IConfigLockCreate {
    id?: number;
    name: string;
    start_lock_date: string;
    end_lock_date: string;
    company_id: number
    active: boolean;
    model_lock: string;
    scheduled_run: boolean;
    scheduled_run_mode: string;
    is_locked?: boolean;
    lock_create?: boolean;
    lock_edit?: boolean;
    lock_delete?: boolean;
}

export const mapConfigLock = (res: IConfigLock[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        let companyId = item.company_id ?? []
        return {
            no: index + 1,
            id: item?.id ?? '',
            name: item?.name ?? '',
            start_lock_date: item?.start_lock_date ? moment(item?.start_lock_date).format('DD/MM/YYYY HH:mm') : '',
            end_lock_date: item?.end_lock_date ? moment(item?.end_lock_date).format('DD/MM/YYYY HH:mm') : '',
            company_id: companyId[0] ?? '',
            company_name: companyId[1] ?? '',
            active: item?.active ?? '',
            model_lock: item?.model_lock === "hr.apec.attendance.report" ? "Báo cáo chấm công theo tuần, tháng" : item?.model_lock === "hr.al.cl.report" ? "Quản lý phép,bù" : item?.model_lock === "hr.leave" ? "Quản lý đơn yêu cầu" : item?.model_lock === "hr.invalid.timesheet" ? "Quản lý giải trình" : item?.model_lock === "hr.upload.attendance" ? "File báo cáo" :"",
            scheduled_run: item?.scheduled_run ?? '',
            scheduled_run_mode: item?.scheduled_run_mode === "minutes" ? "Phút" : item?.scheduled_run_mode === "hours" ? "Giờ" : item?.scheduled_run_mode === "days" ? "Ngày" : item?.scheduled_run_mode === "weeks" ? "Tuần" : item?.scheduled_run_mode === "months" ? "Tháng" : item?.scheduled_run_mode === "years" ? "Năm" : "",
            is_locked: item?.is_locked ?? '',
            create_date: item?.create_date ? moment(item?.create_date).add(7, 'hours').format('DD/MM/YYYY HH:mm') : '',
            write_date: item?.write_date ? moment(item?.write_date).add(7, 'hours').format('DD/MM/YYYY HH:mm') : '',
            mis_id: item?.mis_id
        }
    })
}