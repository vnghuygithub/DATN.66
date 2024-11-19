import { IEmployeeWeeklyReport } from "@/interface/employeeWeeklyReport/employeeWeeklyReport";
import moment from "moment";

export const mapEmployeeWeeklyReport = (res: IEmployeeWeeklyReport[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        const employee_id = item.employee_id ?? []
        const department_id = item.department_id ?? []
        const company_id = item.company_id ?? []
        const reviewer = item.reviewer ?? []
        const attachment_ids = item.attachment_ids ?? []
        return {
            no: index + 1,
            id: item.id,
            name: item.name,
            employee_id: employee_id[0],
            employee_name: employee_id[1],
            employee_code: item.employee_code,
            department_id: department_id[0],
            department_name: department_id[1],
            job_title: item.job_title,
            date: item.date ? moment(item.date).format('DD-MM-YYYY') : '',
            company_id: company_id[0],
            company_name: company_id[1],
            state: item.state,
            report_file: item.report_file,
            book_name: item.book_name,
            review_content: item.review_content,
            attachment_ids: attachment_ids.map((item: any) => item[0]).join(', '),
            attachment_names: attachment_ids.map((item: any) => item[1]).join(', '),
            attachment_urls: attachment_ids.map((item: any) => item[2]).join(', '),
            reviewer_name: reviewer[1],
            reviewer_id: reviewer[0],
            send_to: item.send_to,
            from_date: item.from_date ? moment(item.from_date).format('DD-MM-YYYY') : '',
            to_date: item.to_date ? moment(item.to_date).format('DD-MM-YYYY') : '',
            cc_email: item.cc_email,
            report_content: item.report_content,
            create_date: item.create_date ? moment(item.create_date).add(7, 'hours').format('DD-MM-YYYY HH:mm:ss') : '',
        }
    })
}