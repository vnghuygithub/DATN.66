export interface IViolationList {
    id: number;
    name: string;
    default_violation_type: string;
    default_violation_level: number;
    company: number;
}



export interface IViolationUpdate {
    name: string;
    default_violation_type: string;
    default_violation_level: number;
    // company: number;
}

export interface IViolationCreate {
    name: string;
    default_violation_type: string;
    default_violation_level: number;
    company: any;
}