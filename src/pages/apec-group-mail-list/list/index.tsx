import { deleteApecGroupMailById, getApecGroupMail, IApecGroupMailSearch } from "@/api/apecGroupMail";
import MyPage, { MyPageTableOptions } from "@/components/business/page";
import { useLocale } from "@/locales";
import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, message, Space } from "antd";
import { FC, useEffect, useState } from "react";
import SearchApecGroupMail from "../search";
import ApecGroupMailForm from "../handle";


const ApecGroupMailList: FC = () => {
    const { t } = useLocale();
    const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [forceClearSelection, setForceClearSelection] = useState(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [idGroupMail, setIdGroupMail] = useState<number | string>('');
    const [isView, setIsView] = useState<boolean>(false);
    const _getApecGroupMailList = async (params: IApecGroupMailSearch) => {
        const res = await getApecGroupMail(params);
        if (res) {
            store.dispatch(setGlobalState({ loading: true }));
            return res;
        }
    }
    const tableColumns: MyPageTableOptions<any> = [
        {
            title: 'STT',
            dataIndex: 'no',
            key: 'no',
            align: 'center',
            width: 20,
            render: (text: any, record: any, index: number) => (
                <span>{index + 1}</span>
            ),
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            align: 'center',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 100,
            align: 'center',
        },
        {
            title: t({ id: 'action' }),
            key: 'action',
            fixed: 'right',
            width: 20,
            align: 'center',
            render: (item: any) => (
                <Space size={'middle'}>
                    {
                        (is_administrative === 'true' || it_ho_check === 'true') && (
                            <EditOutlined
                                style={{ fontSize: '14px', color: '#0960bd' }}
                                onClick={() => handleEdit(item.id)}
                            />
                        )
                    }
                    <EyeOutlined
                        style={{ fontSize: '14px', color: '#0960bd' }}
                        onClick={() => handleView(item.id)}
                    />
                </Space>
            ),
        },
    ]
    const handleEdit = (id: number) => {
        setIsCreating(false);
        setIdGroupMail(id);
        showDrawer()
        setIsView(false);
    }
    const showDrawer = () => {
        setOpen(true);
    };

    const handleView = (id: number) => {
        setIsView(true);
        setIdGroupMail(id);
        showDrawer();
        setIsCreating(false);
    }
    const onClose = () => {
        setOpen(false);
        setIsView(false);
        setIsCreating(false);
    }

    const handleCreate = () => {
        form.resetFields();
        showDrawer();
        setIsCreating(true);
        setIsView(false);
    }
    const handleDelete = async () => {
        if (selectedRowArr.length === 0) {
            message.error('Vui lòng chọn dữ liệu cần xóa');
            return;
        }
        const ids = selectedRowArr.map(item => item.id);
        store.dispatch(setGlobalState({ loading: true }));
        await Promise.all(
            ids.map(async id => {
                deleteApecGroupMailById(Number(id))
                    .then((res: any) => {
                        if (res) {
                            message.success('Xóa phòng ban thành công');
                            setForceUpdate(!forceUpdate);
                            setForceClearSelection(!forceClearSelection);
                            setSelectedRowArr([]);
                        }
                    })
                    .catch((err: any) => {
                        console.log(err);
                    })
                    .finally(() => {
                        store.dispatch(setGlobalState({ loading: false }));
                    });
            })
        );
    }
    let is_administrative = localStorage.getItem('is_administrative');
    let it_ho_check = localStorage.getItem('it_ho_check');
    return (
        <>
            <MyPage
                rowkey="id"
                title="Danh sách group mail APEC"
                pageApi={_getApecGroupMailList}
                tableOptions={tableColumns}
                forceUpdate={forceUpdate}
                forceClearSelection={forceClearSelection}
                setSelectedRowData={setSelectedRowArr}
                selectedRowArr={selectedRowArr}
                searchRender={<SearchApecGroupMail />}
                multipleSelection
                slot={
                    <>
                        {
                            (is_administrative === 'true' || it_ho_check === 'true') && (
                                <>
                                    <Button
                                        type="primary"
                                        onClick={handleCreate}
                                    >Tạo mới</Button>
                                    <Button
                                        type="primary" onClick={handleDelete}
                                    >Xóa</Button>
                                </>
                            )
                        }
                    </>
                }
            />
            <ApecGroupMailForm
                idGroupMail={idGroupMail}
                isView={isView}
                isCreating={isCreating}
                open={open}
                onClose={onClose}
                setForceUpdate={setForceUpdate}
                showDrawer={showDrawer}
                form={form}
            />
        </>
    )
}

export default ApecGroupMailList;