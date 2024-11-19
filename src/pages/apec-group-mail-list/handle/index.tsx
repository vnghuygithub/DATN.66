import { createApecGroupMail, getApecGroupMailById, updateApecGroupMail } from "@/api/apecGroupMail";
import MyForm from "@/components/core/form";
import { useLocale } from "@/locales";
import { mobileResponsive } from "@/utils/mobileResponsive";
import { Button, Col, Drawer, FormInstance, Row, Spin } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface ApecGroupMailFormProps {
    onClose?: () => void;
    showDrawer?: () => void;
    open?: boolean;
    isView?: boolean;
    idGroupMail?: string | number;
    setForceUpdate?: Dispatch<SetStateAction<boolean>>;
    forceUpdate?: boolean;
    form?: FormInstance<any>;
    isCreating: boolean;
}

const ApecGroupMailForm = ({
    onClose,
    showDrawer,
    open,
    idGroupMail,
    setForceUpdate,
    forceUpdate,
    form,
    isCreating,
    isView
}: ApecGroupMailFormProps) => {
    const { t } = useLocale();
    const [loading, setLoading] = useState(false);
    const { isMobile } = mobileResponsive();
    const onFinish = async () => {
        await form?.validateFields();
        const data = await form?.getFieldsValue();
        setLoading(true);
        if (data) {
            if (isCreating) {
                const res = await createApecGroupMail(data);
                if (res) {
                    setLoading(false);
                    setForceUpdate && setForceUpdate(!forceUpdate);
                    onClose && onClose();
                    return res
                }
            }
            else {
                const res = await updateApecGroupMail(idGroupMail, data);
                if (res) {
                    setLoading(false);
                    setForceUpdate && setForceUpdate(!forceUpdate);
                    onClose && onClose();
                    return res
                }
            }
        }
    }
    const fetchGroupMail = async (id: any) => {
        setLoading(true);
        const res = await getApecGroupMailById(id);
        if (res) {
            form?.setFieldsValue(res);
            setLoading(false);
            return res
        }
    }
    useEffect(() => {
        form?.resetFields();
        if (idGroupMail) {
            fetchGroupMail(idGroupMail);
        }
    }, [idGroupMail, open, forceUpdate]);
    return (
        <>
            <Drawer
                key={idGroupMail}
                title={idGroupMail ? 'Thông tin chi tiết' : t({ id: 'create' })}
                width={isMobile ? '100%' : '720'}
                onClose={onClose}
                open={open}
                destroyOnClose
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    !isView && (
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button key={1} onClick={onClose}>
                                Hủy
                            </Button>
                            <Button
                                key={2}
                                onClick={onFinish}
                                type="primary"
                                loading={loading}>
                                Lưu
                            </Button>
                        </div>
                    )
                }
            >
                <Spin spinning={loading} >
                    <MyForm<any>
                        disabled={isView}
                        onFinish={onFinish}
                        form={form}
                        layout="vertical"
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <MyForm.Item
                                    label={'Tên'}
                                    name="name"
                                    type="input"
                                    innerprops={{
                                        disabled: isView,
                                        placeholder: 'Vui lòng nhập',
                                        allowClear: true,
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label={'Email'}
                                    name="email"
                                    type="input"
                                    innerprops={{
                                        disabled: isView,
                                        placeholder: 'Vui lòng nhập',
                                        allowClear: true,
                                    }}
                                />
                            </Col>
                        </Row>
                    </MyForm>
                </Spin>
            </Drawer>
        </>
    )
}

export default ApecGroupMailForm;