import { REWARD_CONTENT } from "../constApi";
import { request } from "../request";
import { mapRewardContents } from "./transform";
import { message as $messase } from 'antd';
import { groupByProperty } from '../kpi/transform';
import { updateJob } from '../job/job.api';
export const getRewardContents = async () => {
    let url = REWARD_CONTENT.GET + "?query={id,name,reward_content_id{id,name,reward_type},job_type_ids{id,name}}";
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $messase.error(res.result.error.message);
        return;
    }
    const transformedData = res?.result.map((item: any) => {
        return item.job_type_ids.reduce((acc: any, job: any) => {
            acc.push({
                id: item.id,
                name: item.name,
                reward_content_id: item.reward_content_id,
                job_type_id: job
            });
            return acc;
        }, []);
    }).flat().sort((a: any, b: any) => {
        if (a.job_type_id.id !== b.job_type_id.id) {
            return a.job_type_id.id - b.job_type_id.id;
        } else {
            return a.reward_content_id - b.reward_content_id;
        }
    });
    return {
        results: {
            data: groupByJob(mapRewardContents(transformedData), "job_type_name"),
            total: res?.count,
        }
    }
}

export const groupByJob = (array: any, propertyName: any) => {
    let keyCounter = 1;
    return array.reduce((acc: any, item: any) => {
        const existingItem = acc.find((groupedItem: any) => groupedItem[propertyName] === item[propertyName]);
        if (existingItem) {
            item.key = keyCounter++;
            item.job_type_name = '';

            existingItem.children.push(item);
        } else {
            acc.push({
                key: keyCounter++,
                [propertyName]: item[propertyName],
                children: [{ key: keyCounter++, ...item, job_type_name: '' }]
            });
        }
        return acc;
    }, []);
};

export const deleteJobTypeFromReward = async (id: number, job_type_id: number) => {
    let url = REWARD_CONTENT.DELETEJOBTYPE;
    let requestBody = {
        params: {
            args: [
                id,
                job_type_id
            ]
        }
    }
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $messase.error(res.result.error.message);
        return;
    }
    return res;
}

export const getListRewardContent = async () => {
    let url = REWARD_CONTENT.GETREWARD + "?query={id,name,reward_type}";
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $messase.error(res.result.error.message);
        return;
    }
    return res
}

export const getJobTypes = async () => {
    let url = REWARD_CONTENT.GETJOBTYPE + "?query={id,name}";
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $messase.error(res.result.error.message);
        return;
    }
    return res
}

export const createRewardContentSpecific = async (data: any) => {
    let url = REWARD_CONTENT.POST;
    let requestBody = {
        params: {
            data: data
        }
    }
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $messase.error(res.result.error.message);
        return;
    }
    return res
}

export const createJobType = async (data: any) => {
    let url = REWARD_CONTENT.CREATEJOB
    let requestBody = {
        params: {
            data: data
        }
    }
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $messase.error(res.result.error.message);
        return;
    }
    return res
}

export const updateJobType = async (data: any,id:any) => {
    let url = REWARD_CONTENT.UPDATEJOB + id;
    let requestBody = {
        params: {
            data: data
        }
    }
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $messase.error(res.result.error.message);
        return;
    }
    return res
}

export const getJobTypeById = async (id: any) => {
    let url = REWARD_CONTENT.GETJOBTYPEBYID + id;
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $messase.error(res.result.error.message);
        return;
    }
    return res
}

export const deleteJobType = async (id: any) => {
    let url = REWARD_CONTENT.GETJOBTYPEBYID + id;
    const res = await request('delete', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $messase.error(res.result.error.message);
        return;
    }
    return res
}


export const createRewardContent = async (data: any) => {
    let url = REWARD_CONTENT.POSTREWARD;
    const requestBody = {
        params: {
            data: data
        }
    }
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $messase.error(res.result.error.message);
        return;
    }
    return res
}
export const updateRewardContent = async (data: any, id: any) => {
    let url = REWARD_CONTENT.UPDATEREWARD + id;
    const requestBody = {
        params: {
            data: data
        }
    }
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $messase.error(res.result.error.message);
        return;
    }
    return res
}

export const getRewardContentById = async (id: any) => {
    let url = REWARD_CONTENT.GETREWARD + id;
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $messase.error(res.result.error.message);
        return;
    }
    return res
}

export const deleteRewardContent = async (id: any) => {
    let url = REWARD_CONTENT.GETREWARD + id;
    const res = await request('delete', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $messase.error(res.result.error.message);
        return;
    }
    return res
}
