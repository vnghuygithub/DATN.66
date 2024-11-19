import { IProject, IProjectTask } from "@/interface/project/project";
import moment from "moment";

export const mapProject = (res: IProject[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        return {
            no: index + 1,
            id: item?.id,
            name: item?.name,
        }
    })
}

export const mapProjectTask = (res: IProjectTask[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        const stateId = item?.stage_id ?? []
        const projectId = item?.project_id ?? []
        const parentId = item?.parent_id ?? []
        const userIds = item?.user_ids ?? []
        const childIds = item?.child_ids ?? []
        return {
            no: index + 1,
            id: item?.id,
            name: item?.name,
            stage_id: stateId[0],
            stage_name: stateId[1],
            user_ids: userIds.map((item: any) => item[0]).join(', ') ?? '',
            user_names: userIds.map((item: any) => item[1]).join(', ') ?? '',
            project_id: projectId[0],
            project_name: projectId[1],
            date_assign: item?.date_assign ? moment(item?.date_assign).format('DD/MM/YYYY') : '',
            parent_id: parentId[0],
            parent_name: parentId[1],
            child_ids: childIds.map((item: any) => item[0]).join(', ') ?? '',
            child_names: childIds.map((item: any) => item[1]).join(', ') ?? '',
            date_deadline: item?.date_deadline ? moment(item?.date_deadline).format('DD/MM/YYYY') : '',
            create_date: item?.create_date ? moment(item?.create_date).format('DD/MM/YYYY') : '',
            date_deadline_proposed: item?.date_deadline_proposed ? moment(item?.date_deadline_proposed).format('DD/MM/YYYY') : '',
            percentage_of_completion: item?.percentage_of_completion,
            explaination: item?.explaination,
            proposition: item?.proposition,
            note: item?.note,
        }
    })
}