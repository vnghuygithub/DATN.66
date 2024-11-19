export interface IProjectArgs {
    page_size: number;
    page: number;
    name: string;
}
export interface IProject {
    id: number;
    name: string;
}

export interface IProjectTaskArgs {
    stage_id: number;
    name: string;
    page_size: number;
    page: number;
}

export interface IProjectTask {
    id: number;
    name: string;
    stage_id: Array<any>;
    user_ids: Array<any>;
    project_id: Array<any>;
    project_name: string;
    date_assign: string;
    stage_name: string;
    parent_id: Array<any>;
    parent_name: string;
    child_ids: Array<any>;
    date_deadline: string;
    create_date: string;
    date_deadline_proposed: string;
    percentage_of_completion: number;
    explaination: string;
    proposition: string;
    note: string;
}