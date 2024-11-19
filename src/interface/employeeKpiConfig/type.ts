import  React  from 'react';
export interface IEmpKpiConfigList  {
    key: React.Key;
    id: number;
    name : string,
    employee_level : number,
    late_compensation_under : number,
    late_compensation_over : number,
    base_weekly_report_compensation : number,
    missing_review_book_compensation : number,
    use_percentage_weekly_report : boolean,
}