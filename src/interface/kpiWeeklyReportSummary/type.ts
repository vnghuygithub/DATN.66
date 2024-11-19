export interface IApiKpiWeeklyReportSummaryList {
    id: number;
    employee_name: string;
    employee_code: string;
    company_name: string;
    department_name: string;
    employee_level: number;
    compensation_amount_week_1: number;
    compensation_amount_week_2: number;
    compensation_amount_week_3: number;
    compensation_amount_week_4: number;
    compensation_amount_week_5: number;
    compensation_status_week_1: string | null;
    compensation_status_week_2: string | null;
    compensation_status_week_3: string | null;
    compensation_status_week_4: string | null;
    compensation_status_week_5: string | null;
    book_review_compensation: number;
    book_review_compensation_status: string | null;
    total_compensation: number;
    use_percentage: boolean;




}