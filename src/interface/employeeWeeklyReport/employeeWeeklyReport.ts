export interface IEmployeeWeeklyReport {
    no: string;
    id: number
    name: string;
    employee_id: Array<any>;
    employee_code: string;
    reviewer_name: string;
    reviewer_id: Array<any>;
    department_id: Array<any>;
    department_name: string;
    job_title: string;
    date: string;
    company_id: Array<any>;
    company_name: string;
    state: string;
    report_file: any;
    book_name: string;
    review_content: string;
    attachment_ids: Array<any>;
    reviewer: Array<any>;
    send_to: string;
    from_date: string;
    to_date: string;
    cc: Array<any>;
    report_content: string;
    cc_email: string;
    attachment_names: string;
    attachment_urls: string;
    create_date: string;
}
export interface IEmployeeWeeklyReportArgs {
    employee_id: any;
    department_id: any;
    date: string;
    state: string;
    job_title: string;
    month: string;
    page_size: number;
    page: number;
    company_id: any;
    [key: string]: any;
}