import MyForm from "@/components/core/form";
import { Button, Col, Form, message, Row, Spin } from "antd";
import { FC, useState } from "react";
import SelectCompanyCopySource from "./SelectCompanyCopySource";
import SelectCompanyCopyDest from "./SelectCompanyCopyDest";
import { request } from "@/api/request";


const CopyCompanyData: FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const onFinish = async () => {
        await form.validateFields();
        const data = form?.getFieldsValue();
        if (data) {
            setLoading(true);
            if (data.company_source_id == data.company_dest_id) {
                message.error("Công ty nguồn và công ty đích không được trùng nhau");
                setLoading(false);
                return;
            }
            const res = await request('post', '/api/copy_company_jobs', {
                params: {
                    data: data
                }
            });
            if (res?.result?.error?.code && res.result.error.code == 400) {
                setLoading(false);
                message.error(res.result.error.message);
                return;
            }
            message.success("Sao chép dữ liệu thành công");
            setLoading(false);
            return res;
        }
        else {
            setLoading(false);
            message.error("Vui lòng chọn công ty nguồn và công ty đích và dữ liệu cần sao chép");
            return;
        }
    }
    return (
        <>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <h1 style={{ fontSize: 30 }}>Sao chép dữ liệu công ty</h1>
            </div>
            <Spin spinning={loading}>
                <MyForm<any>
                    onFinish={onFinish}
                    form={form}
                    layout="vertical"
                >
                    <Row gutter={24}>
                        <Col span={8}>
                            <SelectCompanyCopySource />
                        </Col>
                        <Col span={8}>
                            <SelectCompanyCopyDest />
                        </Col>
                        <Col span={8}>
                            <MyForm.Item
                                label="Chọn dữ liệu cần sao chép"
                                name="table"
                                type="select"
                                required
                                innerprops={{
                                    allowClear: true,
                                    placeholder: "Chọn dữ liệu",
                                }}
                                options={[
                                    { value: "hr.job", label: "Chức vụ" },
                                    { value: "hr.department", label: "Phòng ban" },
                                    { value: "shifts", label: "Cấu hình ca" },
                                ]}
                            />
                        </Col>
                    </Row>
                <MyForm.Item style={{ display: "flex", justifyContent: "center" }}>
                    <Button type="primary" loading={loading}  onClick={onFinish}>Sao chép</Button>
                </MyForm.Item >
                </MyForm>
            </Spin>
        </>
    );
}

export default CopyCompanyData;