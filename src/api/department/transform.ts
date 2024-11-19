import { IDepartment, IFilterDepartmentParams } from "./department.api";
export interface IDepartmentList {
    no: number;
    id: number;
    name: string;
    total_employee: number;
    manager_id: Array<any>;
    manager_name: string;
    parent_id:  Array<any>;
    parent_name: string;
    time_keeping_count: number;
    company_id:  Array<any>;
    company_name: string;
    secretary_id: Array<any>;
    secretary_name: string;
    mis_id:string
}
export const mapDeparment = (res: IDepartmentList[]) => {
    return res && res.length >0 && res.map((item,index) => {
        const managerId = item?.manager_id ?? [];
        const companyId = item?.company_id ?? [];
        const parentId = item?.parent_id ?? [];
        const secretaryId = item?.secretary_id ?? [];
        return {
            no: index +1,
            id: item?.id,
            name: item?.name,
            total_employee: item?.total_employee,
            manager_id: managerId[0],
            manager_name: managerId[1],
            parent_id: parentId[0],
            parent_name: parentId[1],
            time_keeping_count: item?.time_keeping_count,
            company_id: companyId[0],
            company_name: companyId[1],
            secretary_id: secretaryId[0],
            secretary_name: secretaryId[1],
            mis_id: item?.mis_id
        }
    })
}