import MyPage, { MyPageTableOptions } from "@/components/business/page";
import { Button, Form } from "antd";
import { FC, useEffect, useState } from "react";
import { title } from 'process';
import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { deleteJobTypeFromReward, getRewardContents } from "@/api/reward/reward.api";
import { IRewardContentsResult } from "@/api/reward/transform";
import SearchRewardContent from "../search";
import { groupBy } from 'lodash';
import { message as $message } from 'antd';
import ReportContentForm from "../handle";
import JobTypeList from "../handle/JobTypeList";
import RewardContentGeneralList from "../handle/RewardContentGeneralList";
const RewardContentList: FC = () => {
    const [open, setOpen] = useState(false);
    const [openJobType, setOpenJobType] = useState(false);
    const [openRewardContentGeneral, setOpenRewardContentGeneral] = useState(false);
    const [form] = Form.useForm();
    const [forceUpdate, setForceUpdate] = useState(false);
    const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
    const [forceClearSelection, setForceClearSelection] = useState(false);
    const _getRewardContentList = async () => {
        store.dispatch(setGlobalState({ loading: true }));
        const res = await getRewardContents();
        if (res) {
            setSelectedRowArr([]);
            setForceClearSelection(!forceClearSelection);
            store.dispatch(setGlobalState({ loading: false }));
            return res;
        }
    }
    const sharedOnCell = (data: any, index: any) => {
        if (data.job_type_name) {
            return { colSpan: 0 };
        }
        return {};
    }
    const tableColums: MyPageTableOptions<IRewardContentsResult> = [
        {
            title: "Cấp nhân sự",
            dataIndex: "job_type_name",
            key: "job_type_name",
            align: 'center',
            onCell: (item, rowindex) => ({
                colSpan: item.job_type_name ? 1 : 1
            }),
            render: (item: any) => {
                return (
                    <div>
                        {item}
                    </div>
                )
            }
        },
        {
            title: "Nội dung",
            dataIndex: "reward_content_name",
            key: "reward_content_name",
            align: 'center',
            onCell: (item, rowindex) => (
                sharedOnCell(item, rowindex)
            ),
        },
        {
            title: "Chi tiết",
            dataIndex: "name",
            key: "name",
            align: 'center',
            onCell: (item, rowindex) => (
                sharedOnCell(item, rowindex)
            ),
        },
        {
            title: "Loại",
            dataIndex: "reward_type",
            key: "reward_type",
            align: 'center',
            onCell: (item, rowindex) => (
                sharedOnCell(item, rowindex)
            ),
            render: (item: any) => {
                return (
                    <div>
                        {item}
                    </div>
                )
            }
        },
    ]
    const handleCreate = () => {
        showDrawer();
    };
    const handleDelete = async () => {
        store.dispatch(setGlobalState({ loading: true }));
        if (selectedRowArr.length === 0) {
            $message.error('Vui lòng chọn bản ghi cần xóa !');
            store.dispatch(setGlobalState({ loading: false }));
            return;
        }
        const objectId = selectedRowArr.map((item) => {
            return {
                id: Number(item.id),
                job_type_id: Number(item.job_type_id),
            }
        });
        await Promise.all(objectId.map((item) => deleteJobTypeFromReward(item.id, item.job_type_id))).then((res) => {
            if (res) {
                $message.success('Xóa thành công !');
                setForceUpdate(!forceUpdate);
                setSelectedRowArr([]);
                setForceClearSelection(!forceClearSelection);
                store.dispatch(setGlobalState({ loading: false }));
            }
        }).catch((err) => {
            $message.error('Xóa thất bại !');
            store.dispatch(setGlobalState({ loading: false }));
            console.log(err);
        }
        );
    };
    const onClose = () => {
        setOpen(false);
    }
    const onCloseJobType = () => {
        setOpenJobType(false);
    }
    const showDrawerJobType = () => {
        setOpenJobType(true);
    }
    const showDrawer = () => {
        setOpen(true);
    }
    const handleShowJobTypes = () => {
        showDrawerJobType();
    }
    const onCloseRewardContentGeneral = () => {
        setOpenRewardContentGeneral(false);
    }
    const showDrawerRewardContentGeneral = () => {
        setOpenRewardContentGeneral(true);
    }
    const handleShowContent = () => {
        showDrawerRewardContentGeneral();
    }
    return (
        <>
            <MyPage
                rowkey="key"
                title="CHẾ ĐỘ ƯU ĐÃI DỊCH VỤ NỘI BỘ"
                pageApi={_getRewardContentList}
                // searchRender={<SearchRewardContent />}
                tableOptions={tableColums}
                forceUpdate={forceUpdate}
                setSelectedRowData={setSelectedRowArr}
        selectedRowArr={selectedRowArr}

                forceClearSelection={forceClearSelection}
                multipleSelection
                disabledPagination={true}
                slot={
                    <>
                        <Button type="primary" onClick={handleCreate}>
                            Tạo mới
                        </Button>
                        <Button type="primary" onClick={handleShowJobTypes}>
                            Danh sách cấp nhân sự
                        </Button>
                        <Button type="primary" onClick={handleShowContent}>
                            Danh sách nội dung 
                        </Button>
                        <Button type="primary" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </>
                }
            />
            <ReportContentForm
                onClose={onClose}
                open={open}
                setForceUpdate={setForceUpdate}
                forceUpdate={forceUpdate}
                form={form}
                showDrawer={showDrawer}
            />
            <JobTypeList 
                onClose={onCloseJobType}
                open={openJobType}
                showDrawer={showDrawerJobType}
            />
            <RewardContentGeneralList 
                open={openRewardContentGeneral}
                onClose={onCloseRewardContentGeneral}
                showDrawer={showDrawerRewardContentGeneral}
            />
        </>
    )
}

export default RewardContentList;