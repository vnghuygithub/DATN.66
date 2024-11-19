export interface IRewardContentsResult {
    id: number;
    name: string;
    reward_type: string;
    job_type_name: string;
    reward_content_name: string;
    reward_content_id : number;
    job_type_id : number;
    reward_type_value: string;
}

export const mapRewardContents = (res: IRewardContentsResult[]) => {
    return res && res.length > 0 && res.map((item: any, index: any) => {
        return {
            no: index + 1,
            id: item.id,
            name: item.name,
            reward_content_name: item.reward_content_id.name,
            reward_content_id: item.reward_content_id.id,
            job_type_name: item.job_type_id.name,
            job_type_id: item.job_type_id.id,
            reward_type: item?.reward_content_id?.reward_type === "1" ? "CHẾ ĐỘ ƯU ĐÃI KHI SỬ DỤNG DỊCH VỤ TẠI CÁC KHÁCH SẠN THUỘC TẬP ĐOÀN" : "CHẾ ĐỘ ƯU ĐÃI KHI CÔNG TÁC TẠI TỈNH/THÀNH PHỐ CÓ KHÁCH SẠN CỦA TẬP ĐOÀN",
            reward_type_value: item?.reward_content_id?.reward_type
        }
    });

}