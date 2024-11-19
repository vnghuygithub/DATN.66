import { createChangeRequest, getChangeRequestById, updateChangeResquest } from "@/api/approvalChangeRequest";
import MyForm from "@/components/core/form";
import SelectAssigned from "@/pages/components/selects/SelectAssigned";
import SelectCC from "@/pages/components/selects/SelectCC";
import SelectCCV2 from "@/pages/components/selects/SelectCCV2";
import SelectEmployeeContract from "@/pages/components/selects/SelectEmployeeContract";
import { mobileResponsive } from "@/utils/mobileResponsive";
import { Button, Col, Drawer, FormInstance, message, Row, Select, Spin } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface IProps {
    onClose?: () => void;
    showDrawer?: () => void;
    open?: boolean;
    idApproval?: number;
    setForceUpdate?: Dispatch<SetStateAction<boolean>>;
    forceUpdate?: boolean;
    form?: FormInstance<any>;
    isView?: boolean;
    isCreating?: boolean;
}

const ApprovalChangeRequestForm = ({
    onClose,
    showDrawer,
    open,
    idApproval,
    setForceUpdate,
    forceUpdate,
    form,
    isView,
    isCreating,
}: IProps
) => {
    const { isMobile } = mobileResponsive();
    const [loading, setLoading] = useState(false);

    const onFinish = async () => {
        await form?.validateFields();
        const data = await form?.getFieldsValue();
        if (data) {
            setLoading(true);
            if (data?.email) {
                if (
                    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
                        data?.email?.trim()
                    )
                ) {
                    message.error('Email không hợp lệ!');
                    setLoading(false);
                    return;
                }
            }

            if (isCreating) {
                if (!data.apec_common_contact_id && !data.email) {
                    message.error("Vui lòng điền một trong hai trường thông tin email hoặc người quản lý")
                    setLoading(false);
                    return;
                }
                let apec_common_contact_id = false;
                if (data.apec_common_contact_id) {
                    apec_common_contact_id = data.apec_common_contact_id.id ?? data.apec_common_contact_id.value ?? data.apec_common_contact_id;
                }
                const res = await createChangeRequest({
                    email: data.email ? data.email.replace(/\s+/g, '') : "",
                    apec_common_contact_id: apec_common_contact_id,
                    description: data.description ? data.description.trim() : "",
                    approval_assigned_to: data.approval_assigned_to.id ?? data.approval_assigned_to.value ?? data.approval_assigned_to,
                })
                if (res) {
                    setLoading(false);
                    setForceUpdate && setForceUpdate(!forceUpdate);
                    onClose && onClose();
                    message.success("Tạo mới thành công")
                    return res
                }
            }
            else {
                if (!data.apec_common_contact_id && !data.email) {
                    message.error("Vui lòng chọn người quản lý hoặc điền email")
                    setLoading(false);
                    return;
                }
                let apec_common_contact_id = false;
                if (data.apec_common_contact_id) {
                    apec_common_contact_id = data.apec_common_contact_id.id ?? data.apec_common_contact_id.value ?? data.apec_common_contact_id;
                }
                const res = await updateChangeResquest({
                    id: idApproval,
                    email: data.email ? data.email.replace(/\s+/g, '') : "",
                    apec_common_contact_id: apec_common_contact_id ?? "",
                    description: data.description ? data.description.trim() : "",
                    approval_assigned_to: data.approval_assigned_to.id ?? data.approval_assigned_to.value ?? data.approval_assigned_to,
                }, idApproval)
                if (res) {
                    setLoading(false);
                    setForceUpdate && setForceUpdate(!forceUpdate);
                    onClose && onClose();
                    message.success("Sửa thành công")
                    return res
                }
            }
        }
    }

    const fetchChangeRequest = async (id: number) => {
        const res = await getChangeRequestById(id);
        if (res) {
            let email = ""
            let description = ""
            if (res.description !== null && res.description !== undefined && res.description !== "" && res.description !== "null" && res.description !== "undefined" && res.description !== "false" && res.description !== false) {
                description = res.description;
            }
            if (res.email !== null && res.email !== undefined && res.email !== "" && res.email !== "null" && res.email !== "undefined" && res.email !== "false" && res.email !== false) {
                email = res.email;
            }
            form && form?.setFieldsValue({
                key: res.id,
                email: email ?? "",
                apec_common_contact_id: { value: res.apec_common_contact_id ? res.apec_common_contact_id.id : "", label: res.apec_common_contact_id ? res.apec_common_contact_id.name : "" },
                description: description ?? "",
                approval_assigned_to: { value: res.approval_assigned_to ? res.approval_assigned_to.id : "", label: res.approval_assigned_to ? res.approval_assigned_to.name : "" },
            });
        }
    }
    useEffect(() => {
        form?.resetFields();
        if (idApproval) {
            fetchChangeRequest(idApproval);
        }
    }, [idApproval, forceUpdate, open])
    return (
        <>
            <Drawer
                key={idApproval}
                title={idApproval ? 'Thông tin chi tiết' : 'Tạo mới'}
                width={isMobile ? '100%' : 1000}
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
                            <Button key={2} onClick={onFinish} type="primary" loading={loading}>
                                Lưu
                            </Button>
                        </div>
                    )
                }
            >
                <Spin spinning={loading}>
                    <MyForm<any>
                        disabled={isView}
                        onFinish={onFinish}
                        form={form}
                        layout="vertical">
                        <Row gutter={24}>
                            <Col span={12}>
                                <SelectAssigned isCreating={isCreating} />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label={'Email quản lý mới'}
                                    name="email"
                                    type="input"
                                    innerprops={{
                                        placeholder: 'Vui lòng nhập email quản lý mới',
                                        allowClear: true,
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <SelectCCV2 />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label={'Lý do thay đổi'}
                                    name="description"
                                    type="input-textarea"
                                    innerprops={{
                                        placeholder: 'Vui lòng nhập lý do thay đổi',
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

export default ApprovalChangeRequestForm;