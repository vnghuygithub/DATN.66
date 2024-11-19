import { createRewardContent, deleteRewardContent, getListRewardContent, getRewardContentById, updateRewardContent } from "@/api/reward/reward.api";
import MyForm from "@/components/core/form";
import MyTable from "@/components/core/table";
import { useLocale } from "@/locales";
import { mobileResponsive } from "@/utils/mobileResponsive";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Form, message, Modal, Row, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { render } from "react-dom";

interface Props {
    onClose: () => void;
    showDrawer: () => void;
    open: boolean;
}


const RewardContentGeneralList = ({ onClose, showDrawer, open }: Props) => {
    const { isMobile } = mobileResponsive();
    const { t } = useLocale()
    const [loading, setLoading] = useState(false)
    const [forceUpdate, setForceUpdate] = useState(false);
    const [form] = Form.useForm();
    const [openForm, setOpenForm] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [rewardContentList, setRewardContentList] = useState([] as any[]);
    const [idRewardContent, setIdRewardContent] = useState(null);
    const _getRewardContentList = async () => {
        const res = await getListRewardContent()
        setLoading(true);
        if (res) {
            setLoading(false);
            setRewardContentList(res.result);
            return res.result;
        }
    }
    useEffect(() => {
        _getRewardContentList();
    }, [open, forceUpdate])
    const handleCreate = () => {
        setOpenForm(true);
        setIsCreating(true);
        setIdRewardContent(null);
    }
    const tableColumns: any = [
        {
            title: "#",
            dataIndex: "index",
            key: "index",
            align: 'center',
            width: 10,
            render: (value: any, item: any, index: number) => {
                return index + 1;
            }
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            align: 'center',
            width: 10,
        },
        {
            title: "Loại ưu đãi",
            dataIndex: "reward_type",
            key: "reward_type",
            align: 'center',
            width: 50,
            render: (item: any) => (
                item.name === "1" ? <div>CHẾ ĐỘ ƯU ĐÃI KHI SỬ DỤNG DỊCH VỤ TẠI CÁC KHÁCH SẠN THUỘC TẬP ĐOÀN </div> : <div>CHẾ ĐỘ ƯU ĐÃI KHI CÔNG TÁC TẠI TỈNH/THÀNH PHỐ CÓ KHÁCH SẠN CỦA TẬP ĐOÀN</div>
            )
        },
        {
            title: "Nội dung",
            dataIndex: "name",
            key: "name",
            align: 'center',
            width: 50,
        },
        {
            title: t({ id: 'action' }),
            key: 'action',
            fixed: 'right',
            width: 20,
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
    const handleEdit = async (id: any) => {
        setIdRewardContent(id);
        setIsCreating(false);
        setOpenForm(true);
    }
    const handleDelete = async (id: any) => {
        const res = await deleteRewardContent(id)
        if (res) {
            setForceUpdate(!forceUpdate);
            message.success("Xóa nội dung thành công");
            return res
        } else {
            message.error("Xóa nội dung thất bại");
            return
        }
    }
    const onFinish = async () => {
        await form?.validateFields();
        const data = form?.getFieldsValue();
        setLoading(true);
        if (isCreating) {
            const res = await createRewardContent({
                name: data.name,
                reward_type: data.reward_type
            })
            if (res) {
                setLoading(false);
                setOpenForm(false);
                form.resetFields();
                setForceUpdate(!forceUpdate);
                message.success("Thêm mới nội dung thành công");
                return res
            } else {
                setLoading(false);
                message.error("Thêm mới nội dung thất bại");
                return
            }
        }
        const res = await updateRewardContent({
            name: data.name,
            reward_type: data.reward_type
        }, idRewardContent)
        if (res) {
            setLoading(false);
            setOpenForm(false);
            form.resetFields();
            setForceUpdate(!forceUpdate);
            message.success("Chỉnh sửa nội dung thành công");
            return res
        } else {
            setLoading(false);
            message.error("Chỉnh sửa nội dung thất bại");
            return
        }
    }
    const fetchRewardContent = async (id: any) => {
        const res = await getRewardContentById(id)
        if (res) {
            form.setFieldsValue({
                name: res.name,
                reward_type: res.reward_type
            })
        }
    }
    useEffect(() => {
        form?.resetFields();
        if (idRewardContent) {
            fetchRewardContent(idRewardContent);
        }
    }, [openForm, idRewardContent])
    return (
        <>
            <Drawer
                title="Danh sách nội dung ưu đãi"
                width={1200}
                destroyOnClose
                onClose={onClose}
                open={open}
                footer={
                    <Button key={1} onClick={onClose}>
                        Đóng
                    </Button>
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
                    dataSource={rewardContentList}
                    size="large"
                />
            </Drawer>
            <Modal
                width={700}
                open={openForm}
                title={isCreating ? "Thêm mới nội dung" : "Chỉnh sửa nội dung"}
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
                        <Row gutter={24}>
                            <Col span={24}>
                                <MyForm.Item
                                    name="name"
                                    label="Nội dung"
                                    type="input-textarea"
                                    innerprops={{
                                        placeholder: "Nhập nội dung ưu đãi",
                                        allowClear: true,
                                    }}
                                    required
                                />
                            </Col>
                            <Col span={24}>
                                <MyForm.Item
                                    name="reward_type"
                                    label="Loại ưu đãi"
                                    type="select"
                                    innerprops={{
                                        placeholder: "Nhập loại ưu đãi",
                                        allowClear: true,
                                    }}
                                    options={[
                                        { label: "CHẾ ĐỘ ƯU ĐÃI KHI SỬ DỤNG DỊCH VỤ TẠI CÁC KHÁCH SẠN THUỘC TẬP ĐOÀN", value: "1" },
                                        { label: "CHẾ ĐỘ ƯU ĐÃI KHI CÔNG TÁC TẠI TỈNH/THÀNH PHỐ CÓ KHÁCH SẠN CỦA TẬP ĐOÀN", value: "2" }
                                    ]}
                                    required
                                />
                            </Col>
                        </Row>
                    </MyForm>
                </Spin>
            </Modal>
        </>
    )
}

export default RewardContentGeneralList;