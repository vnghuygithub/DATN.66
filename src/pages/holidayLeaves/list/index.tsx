import { deleteHolidayLeaves, getHolidayLeaves, holidayLeavesArgs } from "@/api/holidayLeaves/holiday.leave.api";
import { IHolidayLeaves } from "@/api/holidayLeaves/transform";
import MyPage, { MyPageTableOptions } from "@/components/business/page";
import { useLocale } from "@/locales";
import { Button, Form, Space, message } from "antd";
import { FC, useState } from "react";
import SearchHolidayLeaves from "../search";
import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { formatDate } from "@/utils/formatDate";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import HolidayLeavesForm from "../handle";


const HolidayLeaves: FC = () => {
    const { t } = useLocale();
    const [form] = Form.useForm();
    const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
    const [forceClearSelection, setForceClearSelection] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [idHolidayLeaves, setIdHolidayLeaves] = useState<number | undefined>(undefined);
    const [isView, setIsView] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const _getHolidayLeaves = async (args: holidayLeavesArgs) => {
        store.dispatch(setGlobalState({ loading: true }))
        const res = await getHolidayLeaves(args);
        if (res) {
            store.dispatch(setGlobalState({ loading: false }));
            return res;
        }
    }
    const handleCreate = () => {
        setIsCreating(true);
        setIsView(false);
        setOpen(true);
    }
    const handleDelete = async () => {
        if (selectedRowArr.length === 0) {
            message.error("Vui lòng chọn dữ liệu để xóa");
            return;
        }
        const ids = selectedRowArr.map((item: any) => item.id);
        try {
            store.dispatch(setGlobalState({ loading: true }));
            await Promise.all(ids.map((id: number) => deleteHolidayLeaves(id)));
        } catch (error) {
            console.log(error);
        } finally {
            store.dispatch(setGlobalState({ loading: false }));
            setForceUpdate(!forceUpdate);
            setForceClearSelection(!forceClearSelection);
            setSelectedRowArr([]);
            message.success("Xóa thành công");
        }
    }
    const tableColumns: MyPageTableOptions<IHolidayLeaves> = [
        {
            title: "STT",
            dataIndex: "no",
            key: "no",
            width: 50,
            align: "center",
        },
        // {
        //     title: "ID",
        //     dataIndex: "id",
        //     key: "id",
        //     width: 50,
        //     align: "center",
        // },
        {
            title: "Tên ngày lễ",
            dataIndex: "name",
            key: "name",
            width: 250,
            align: "center",
        },
        {
            title: "Từ ngày",
            dataIndex: "date_from",
            key: "date_from",
            width: 100,
            align: "center",
            render: (date: string) => {
                return (
                    <span>{date && formatDate(date)}</span>
                )
            }
        },
        {
            title: "Đến ngày",
            dataIndex: "date_to",
            key: "date_to",
            width: 100,
            align: "center",
            render: (date: string) => {
                return (
                    <span>{date && formatDate(date)}</span>
                )
            }
        },
        {
            title: "Công ty",
            dataIndex: "mis_id",
            key: "mis_id",
            width: 100,
            align: "center",
            // render: (item) => {
            //     return item?.mis_id?? '-';
            // }
        },
        {
            title: "Ngày tạo",
            dataIndex: "create_date",
            key: "create_date",
            width: 100,
            align: "center",
            render: (date: string) => {
                return (
                    <span>{date && formatDate(date)}</span>
                )
            }
        },
        {
            title: t({ id: 'action' }),
            key: 'id',
            dataIndex: 'id',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (item: any) => (
                <Space size="middle">
                    <>
                        <EditOutlined
                            style={{ fontSize: '14px', color: '#0960bd' }}
                            onClick={() => handleEdit(item)}
                        />
                    </>
                    <EyeOutlined
                        style={{ fontSize: '14px', color: '#0960bd' }}
                        onClick={() => handleView(item)}
                    />
                </Space>
            )
        },
    ]
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
        setIsCreating(false);
        setIsView(false);
        setIdHolidayLeaves(undefined);
    };
    const handleEdit = (item: number) => {
        setIdHolidayLeaves(item);
        setIsCreating(false);
        setIsView(false);
        setOpen(true);
    }
    const handleView = (item: number) => {
        setOpen(true);
        setIdHolidayLeaves(item);
        setIsCreating(false);
        setIsView(true);
    }
    return (
        <>
            <MyPage
                rowkey="id"
                pageApi={_getHolidayLeaves}
                title="Cấu hình ngày lễ"
                tableOptions={tableColumns}
                forceUpdate={forceUpdate}
                searchRender={<SearchHolidayLeaves />}
                multipleSelection
                setSelectedRowData={setSelectedRowArr}
                forceClearSelection={forceClearSelection}
        selectedRowArr={selectedRowArr}

                slot={
                    <>
                        <Button type="primary" onClick={handleCreate}>
                            Thêm mới
                        </Button>
                        <Button type="primary" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </>
                }
            />
            <HolidayLeavesForm
                onClose={onClose}
                showDrawer={showDrawer}
                isView={isView}
                open={open}
                idHolidayLeaves={idHolidayLeaves}
                setForceUpdate={setForceUpdate}
                forceUpdate={forceUpdate}
                form={form}
                isCreating={isCreating}
            />
        </>
    )

}

export default HolidayLeaves;