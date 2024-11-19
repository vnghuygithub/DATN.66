import moment from "moment";

export interface IApprovalChangeRequest {
    id: number;
    name: string;
    company_id: Array<any>;
    apec_common_contact_id: Array<any>;
    approval_assigned_to: Array<any>;
    approval_uid: Array<any>;
    state: string;
    email: string;
    create_date: string;
    create_uid: Array<any>;
    description: string;
    mis_id: string
}


export const mapChangeRequest = (item: IApprovalChangeRequest[]) => {
    return item && item.length > 0 && item.map((item, index) => {
        const companyId = item?.company_id ?? [];
        const apecCommonContactId = item?.apec_common_contact_id ?? [];
        const approvalAssignedTo = item?.approval_assigned_to ?? [];
        const approvalUid = item?.approval_uid ?? [];
        const createUid = item?.create_uid ?? [];
        return {
            no: index + 1,
            id: item?.id,
            name: item?.name ?? '',
            company_id: companyId[0] ?? '',
            company_name: companyId[1] ?? '',
            apec_common_contact_id: apecCommonContactId[0] ?? '',
            apec_common_contact_name: apecCommonContactId[1] ?? '',
            approval_assigned_to: approvalAssignedTo[0] ?? '',
            approval_assigned_to_name: approvalAssignedTo[1] ?? '',
            approval_uid: approvalUid[0] ?? '',
            approval_uid_name: approvalUid[1] ?? '',
            state: item?.state === "1" ? "Chờ duyệt" : item?.state === "2" ? "Đã duyệt" : item?.state === "3" ? "Từ chối" : "",
            email: item?.email ?? '',
            create_date: item?.create_date ? moment(item?.create_date).format('DD/MM/YYYY') : '',
            create_uid: createUid[0] ?? '',
            create_uid_name: createUid[1] ?? '',
            description: item?.description ?? '',
            mis_id: item?.mis_id
        };
    })
}

