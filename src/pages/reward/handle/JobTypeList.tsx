import { createJobType, deleteJobType, getJobTypeById, getJobTypes, updateJobType } from "@/api/reward/reward.api";
import MyForm from "@/components/core/form";
import MyTable from "@/components/core/table";
import { useLocale } from "@/locales";
import { mobileResponsive } from "@/utils/mobileResponsive";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, FormInstance, message, Modal, Space, Spin } from "antd";
import { title } from "process";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
    onClose: () => void;
    showDrawer: () => void;
    open: boolean;
}

const JobTypeList = ({
    onClose,
    showDrawer,
    open,
}: Props) => {
    const { t } = useLocale()
    const [loading, setLoading] = useState(false)
    const [jobTypeList, setJobTypeList] = useState<any[]>([]);
    const { isMobile } = mobileResponsive();
    const [forceUpdate, setForceUpdate] = useState(false);
    const [form] = Form.useForm();
    const [openForm, setOpenForm] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [idJobType, setIdJobType] = useState(null);
    const _getJobTypeList = async () => {
        const res = await getJobTypes();
        setLoading(true);
        if (res) {
            setLoading(false);
            setJobTypeList(res.result);
            return res.result;
        }
    }
    useEffect(() => {
        _getJobTypeList();
    }, [open, forceUpdate])
    const tableColumns: any = [
        {
            title: "#",
            dataIndex: "index",
            key: "index",
            align: 'center',
            width: 50,
            render: (value: any, item: any, index: number) => {
                return index + 1;
            }
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            align: 'center',
            width: 50,
        },
        {
            title: 'Cấp nhân sự',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: t({ id: 'action' }),
            key: 'action',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (item: any) => (
                <Space size="middle">
                    <Space size="middle" direction="horizontal">
                        <EditOutlined style={{ fontSize: '14px', color: '#0960bd' }}
                            onClick={() => handleEdit(item.id)}
                        />

                        <DeleteOutlined
                            style={{ fontSize: '14px', color: 'red' }}
                            onClick={() => handleDelete(item.id)}
                        />
                    </Space>


                </Space>
            ),
        },
    ]
    const handleDelete = async (id: number) => {
        if (id) {
            setLoading(true);
            const res = await deleteJobType(id);
            if (res) {
                setLoading(false);
                setForceUpdate(!forceUpdate);
                message.success("Xóa cấp nhân sự thành công");
                return res
            } else {
                setLoading(false);
                message.error("Xóa cấp nhân sự thất bại");
                return
            }
        }
    }
    const handleEdit = async (id: any) => {
        if (id) {
            setIdJobType(id);
            setIsCreating(false);
            setOpenForm(true);
        }
    }
    const handleCreate = async () => {
        setIsCreating(true);
        setIdJobType(null);
        setOpenForm(true);
    }
    const onFinish = async () => {
        await form?.validateFields();
        const data = form.getFieldsValue();
        if (data) {
            if (isCreating) {
                setLoading(true);
                const res = await createJobType({
                    name: data.name,
                });
                if (res) {
                    setLoading(false);
                    setOpenForm(false);
                    form.resetFields();
                    setForceUpdate(!forceUpdate);
                    message.success("Thêm mới cấp nhân sự thành công");
                    return res
                } else {
                    setLoading(false);
                    message.error("Thêm mới cấp nhân sự thất bại");
                    return
                }
            }
            else {
                setLoading(true);
                const res = await updateJobType({
                    name: data.name,
                }, idJobType);
                if (res) {
                    setLoading(false);
                    setOpenForm(false);
                    form.resetFields();
                    setForceUpdate(!forceUpdate);
                    message.success("Chỉnh sửa cấp nhân sự thành công");
                    return res
                }
                else {
                    message.error("Chỉnh sửa cấp nhân sự thất bại");
                }
            }
        }
    }
    const fetchJobById = async (id: number) => {
        const res = await getJobTypeById(id);
        if (res) {
            form.setFieldsValue({
                name: res.name,
            });
        }
    }
    useEffect(() => { 
        form?.resetFields();
        if (idJobType) {
            fetchJobById(idJobType);
        }
    }, [openForm, idJobType])
    return (
        <>
            <Drawer
                title="Danh sách cấp nhân sự"
                width={isMobile ? '100%' : '900'}
                destroyOnClose
                onClose={onClose}
                open={open}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button key={1} onClick={onClose}>
                            Đóng
                        </Button>
                    </div>
                }
            >
                <Button type="primary" onClick={handleCreate} style={{ marginBottom: 5 }}>
                    Thêm mới
                </Button>
                <MyTable
                    rowKey={"id"}
                    columns={tableColumns}
                    loading={loading}
                    bordered
                    dataSource={jobTypeList}
                    size="large"
                />
            </Drawer>
            <Modal
                open={openForm}
                title={isCreating ? "Thêm mới cấp nhân sự" : "Chỉnh sửa cấp nhân sự"}
                destroyOnClose
                onCancel={() => setOpenForm(false)}
                footer={
                    <div>
                        <Button key={1} onClick={() => setOpenForm(false)}>
                            Hủy
                        </Button>
                        <Button
                            key={2}
                            onClick={onFinish}
                            type="primary"
                        >
                            Lưu
                        </Button>
                    </div>
                }
            >
                <Spin spinning={loading}>
                    <MyForm<any>
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <MyForm.Item
                            name={"name"}
                            type="input"
                            label="Cấp nhân sự"
                            innerprops={{
                                placeholder: "Nhập cấp nhân sự",
                                allowClear: true,
                            }}
                            required
                        />
                    </MyForm>
                </Spin>
            </Modal>
        </>
    )
}

export default JobTypeList;