import { changePassword } from "@/api/user/user.api";
import MyForm from "@/components/core/form";
import { Button, Col, Drawer, FormInstance, Row, Spin, message } from "antd";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
    onClose?: () => void;
    showDrawer?: () => void;
    open?: boolean;
    idUser?: number;
    setForceUpdate?: Dispatch<SetStateAction<boolean>>;
    forceUpdate?: boolean;
    form?: FormInstance<any>;
}
const PasswordForm = ({
    onClose,
    showDrawer,
    open,
    idUser,
    setForceUpdate,
    forceUpdate,
    form,
}: Props) => {
    const [loading, setLoading] = useState(false);
    const onFinish = async () => {
        await form?.validateFields();
        const data = await form?.getFieldsValue();
        if (data) {
            setLoading(true);
            const res = await changePassword(idUser,data); 
            if (res) {
                message.success("Đổi mật khẩu thành công");
                setLoading(false);
                onClose?.();
                setForceUpdate?.(!forceUpdate);
                return res
            }
            else {
                setLoading(false);
            }
        }
    }
    return (
        <>
            <Drawer
                key={idUser}
                title={idUser ? "Thông tin người dùng" : "Thêm người dùng"}
                width={320}
                onClose={onClose}
                open={open}
                destroyOnClose
                bodyStyle={{ paddingBottom: 80 }}
                footer={
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
                                    name="password"
                                    label="Mật khẩu mới"
                                    type="input"
                                    innerprops={{
                                        placeholder: "Nhập mật khẩu mới",
                                        allowClear: true,
                                    }}
                                    required
                                />
                            </Col>
                        </Row>
                    </MyForm>
                </Spin>
            </Drawer>
        </>
    )
}

export default PasswordForm;
