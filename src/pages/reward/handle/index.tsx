import { createRewardContentSpecific } from "@/api/reward/reward.api";
import MyForm from "@/components/core/form";
import SelectMultipleJobTypes from "@/pages/components/selects/SelectMultipleJobType";
import SelectRewardContent from "@/pages/components/selects/SelectRewardContent";
import { mobileResponsive } from "@/utils/mobileResponsive";
import { Button, Col, Drawer, FormInstance, message, Row, Spin } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface IProps {
    onClose: () => void;
    open: boolean;
    setForceUpdate: Dispatch<SetStateAction<boolean>>;
    forceUpdate: boolean;
    showDrawer: () => void;
    form: FormInstance<any>
}
const ReportContentForm = ({
    onClose,
    open,
    setForceUpdate,
    forceUpdate,
    showDrawer,
    form
}: IProps) => {
    const [loading, setLoading] = useState(false);
    const { isMobile } = mobileResponsive();
    const onFinish = async () => {
        await form?.validateFields();
        const data = form.getFieldsValue();
        if (data) {
            console.log(data);
            setLoading(true);
            const res = await createRewardContentSpecific({
                name: data.name,
                reward_content_id: data.reward_content_id?.id ?? data.reward_content_id?.value ?? data.reward_content_id,
                job_type_ids: data.job_type_ids.map((item: any) => item) ?? data.job_type_ids ?? []
            });
            if (res) {
                setLoading(false);
                setForceUpdate(!forceUpdate);
                onClose && onClose();
                message.success('Tạo mới chế độ ưu đãi thành công');
                return res
            }
            else {
                setLoading(false);
                onClose && onClose();
                message.error('Tạo mới chế độ ưu đãi thất bại');
                return
            }
        }
    }
    useEffect(() => {
        form?.resetFields();
    }, [open,forceUpdate])
    return (
        <>
            <Drawer
                title="Thêm mới chế độ ưu đãi"
                width={isMobile ? '100%' : '900'}
                onClose={onClose}
                open={open}
                destroyOnClose
                footer={
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button key={1} onClick={onClose}>
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
                        onFinish={onFinish}
                        form={form}
                        layout="vertical"
                    >
                        <Row gutter={24}>
                            <Col span={24}>
                                <MyForm.Item
                                    name="name"
                                    type="input-textarea"
                                    label="Chi tiết"
                                    innerprops={{
                                        placeholder: "Nhập nội dung chi tiết chế độ ưu đãi",
                                        allowClear: true,
                                    }}
                                    required
                                />
                            </Col>
                            <Col span={24}>
                                <SelectRewardContent />
                            </Col>
                            <Col span={24}>
                                <SelectMultipleJobTypes />
                            </Col>
                        </Row>
                    </MyForm>
                </Spin>
            </Drawer>
        </>
    )
}

export default ReportContentForm;