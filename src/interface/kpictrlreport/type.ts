import  React  from 'react';
export interface IKpiCtrlReportList {
    key: React.Key;
    id: string | number;
    employee_name: IemployeeName;
    employee_code: string | number;
    company: objectName | null;
    department: objectName | null;
    report_serial: string;
    report_date: string;
    attachment: string;
    violation_level: number;
    violation_type: string;
    date_apply: string;
    violation_date: string;


  
    // ...
  }


  interface IemployeeName{
    name: string;
    id: number;
  }
  interface objectName{
    name: string;
    id: number;
  }

  export interface IKpiCtrlUpdateReport {
    // employee_name: number,
    report_serial: string,
    report_date: string,
    violation_level: number,
    violation_type: number,
    date_apply: string,
    violation_date: string,
  }

  export interface IKpiCtrlCreateReport {
    employee_name: number,
    report_serial: string,
    report_date: string,
    violation_level: number,
    violation_type: string,
    date_apply: string,
    violation_date: string,
  }