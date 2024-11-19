import React from "react";
export interface IKpiHrReportList {
    key: React.Key;
    id: string | number;
    report_serial: string;
    employee_name: IemployeeName;
    employee_code: string;
    company: objectName | null;
    department: objectName | null;
    report_date: string;
    // attachment: string;
    violation:Iviolation;
    violation_level: string;
    violation_type: string;
    apply_date: string;
    violation_date: string;
  
    // ...
  }

  interface Iviolation {
    name: string;
    id: number;
    default_violation_level: number;
    default_violation_type: string;
  }
  
  interface objectName{
    name: string;
    id : number;
  }


  interface IemployeeName{
    name: string;
    id: number;
  }

  export interface IKpiHrUpdateReport {
    report_serial: string,
    report_date: string,
    violation_level: number,
    violation: number,
    violation_type: string,
    apply_date: string,
    violation_date: string,
  }

  export interface IKpiHrCreateReport {
    employee_name: number,
    report_serial: string,
    report_date: string,
    violation_level: number, 
    violation: number,
    violation_type: string,
    apply_date: string,
    violation_date: string,
  }