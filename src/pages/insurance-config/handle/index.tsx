import { createInsuranceConfig, getInsuranceConfigDetail, updateInsuranceConfig } from "@/api/insurance/insurance.api";
import MyForm from "@/components/core/form";
import { useLocale } from "@/locales";
import SelectCompanyHO from "@/pages/components/selects/SelectCompanyHO";
import { Button, Col, Drawer, FormInstance, Row, Spin, message as $message } from 'antd';
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
interface IProps {
    onClose?: () => void;
    isCreating?: boolean;
    form?: FormInstance<any>;
    open?: boolean;
    forceUpdate?: boolean;
    setForceUpdate?: Dispatch<SetStateAction<boolean>>;
    idInsuranceConfig?: number;
    showDrawer?: () => void;
    isView?: boolean;
}

const InsuranceConfigForm = ({
    onClose,
    isCreating,
    form,
    open,
    forceUpdate,
    setForceUpdate,
    idInsuranceConfig,
    showDrawer,
    isView
}: IProps) => {
    const { t } = useLocale();
    const [loading, setLoading] = useState(false);
    const onFinish = async () => {
        await form?.validateFields();
        const data = await form?.getFieldsValue();
        if (isCreating) {
            console.log("data", data);
            setLoading(true);
            const res = await createInsuranceConfig({
                "company_id": data.company_id,
                "code": data.code,
                "minimum_wage": data.minimum_wage,
                "month": data.date ? moment(data.date).month() + 1 : null,
                "year": data.date ? moment(data.date).year() : null,
                "bhxh_company": data.bhxh_company,
                "bhyt_company": data.bhyt_company,
                "bhtn_company": data.bhtn_company,
                "bhtnld_company": data.bhtnld_company,
                "bhxh_employee": data.bhxh_employee,
                "bhyt_employee": data.bhyt_employee,
                "bhtn_employee": data.bhtn_employee,
                "total_social_insurance": data.total_social_insurance,
                "total_health_insurance": data.total_health_insurance,
                "total_unemployed_insurance": data.total_unemployed_insurance,
                "total_unemployed_working": data.total_unemployed_working,
                "total_insurance": data.total_insurance,
                "total_insurance_company": data.total_insurance_company,
                "total_insurance_employee": data.total_insurance_employee,
                "note": data.note
            });
            if (res) {
                setLoading(false);
                $message.success('Tạo mới thành công');
                setForceUpdate && setForceUpdate(!forceUpdate);
                onClose && onClose();
                form?.resetFields();
                return res
            }
        }
        else {
            if (idInsuranceConfig) {
                const res = await updateInsuranceConfig({
                    "company_id": data.company_id,
                    "code": data.code,
                    "minimum_wage": data.minimum_wage,
                    "month": data.date ? moment(data.date).month() + 1 : null,
                    "year": data.date ? moment(data.date).year() : null,
                    "bhxh_company": data.bhxh_company,
                    "bhyt_company": data.bhyt_company,
                    "bhtn_company": data.bhtn_company,
                    "bhtnld_company": data.bhtnld_company,
                    "bhxh_employee": data.bhxh_employee,
                    "bhyt_employee": data.bhyt_employee,
                    "bhtn_employee": data.bhtn_employee,
                    "total_social_insurance": data.total_social_insurance,
                    "total_health_insurance": data.total_health_insurance,
                    "total_unemployed_insurance": data.total_unemployed_insurance,
                    "total_unemployed_working": data.total_unemployed_working,
                    
                    "total_insurance": data.total_insurance,
                    "total_insurance_company": data.total_insurance_company,
                    "total_insurance_employee": data.total_insurance_employee,
                    "note": data.note
                }, idInsuranceConfig)
                if (res) {
                    setLoading(false);
                    $message.success('Cập nhật thành công');
                    setForceUpdate && setForceUpdate(!forceUpdate);
                    onClose && onClose();
                    form?.resetFields();
                    return res
                }
            }
        }
    }
    const onValuesChange = (changedValues: any) => {
        const companyFields = ['bhxh_company', 'bhyt_company', 'bhtn_company', 'bhtnld_company'];
        const employeeFields = ['bhxh_employee', 'bhyt_employee', 'bhtn_employee'];
        const socialInsuranceFields = ['bhxh_employee', 'bhxh_company'];
        const healthInsuranceFields = ['bhyt_employee', 'bhyt_company'];
        const unemployedInsuranceFields = ['bhtn_employee', 'bhtn_company'];
        const unemployedWorkingField = 'bhtnld_company';
        const changedField = Object.keys(changedValues)[0];

        if (companyFields.includes(changedField)) {
            const total_insurance_company = companyFields.reduce((total, field) => {
                return total + (form?.getFieldValue(field) || 0);
            }, 0);

            form?.setFieldsValue({ total_insurance_company });
        }

        if (employeeFields.includes(changedField)) {
            const total_insurance_employee = employeeFields.reduce((total, field) => {
                return total + (form?.getFieldValue(field) || 0);
            }, 0);

            form?.setFieldsValue({ total_insurance_employee });
        }

        if (socialInsuranceFields.includes(changedField)) {
            const total_social_insurance = socialInsuranceFields.reduce((total, field) => {
                return total + (form?.getFieldValue(field) || 0);
            }, 0);

            form?.setFieldsValue({ total_social_insurance });
        }

        if (healthInsuranceFields.includes(changedField)) {
            const total_health_insurance = healthInsuranceFields.reduce((total, field) => {
                return total + (form?.getFieldValue(field) || 0);
            }, 0);

            form?.setFieldsValue({ total_health_insurance });
        }

        if (unemployedInsuranceFields.includes(changedField)) {
            const total_unemployed_insurance = unemployedInsuranceFields.reduce((total, field) => {
                return total + (form?.getFieldValue(field) || 0);
            }, 0);

            form?.setFieldsValue({ total_unemployed_insurance });
        }

        if (changedField === unemployedWorkingField) {
            const total_unemployed_working = form?.getFieldValue(unemployedWorkingField) || 0;

            form?.setFieldsValue({ total_unemployed_working });
        }

        const totalFields = ['total_social_insurance', 'total_health_insurance', 'total_unemployed_insurance', 'total_unemployed_working'];
        const total_insurance = totalFields.reduce((total, field) => {
            return total + (form?.getFieldValue(field) || 0);
        }, 0);

        form?.setFieldsValue({ total_insurance });
    };
    const fetchInsuranceConfigById = async (id: number) => {
        setLoading(true);
        const res = await getInsuranceConfigDetail(id);
        if (res) {

            form?.setFieldsValue({
                "code": res.code,
                "minimum_wage": res.minimum_wage,
                "date": moment({ year: res.year, month: res.month - 1, day: 1 }),
                "bhxh_company": res.bhxh_company,
                "bhyt_company": res.bhyt_company,
                "bhtn_company": res.bhtn_company,
                "bhtnld_company": res.bhtnld_company,
                "bhxh_employee": res.bhxh_employee,
                "bhyt_employee": res.bhyt_employee,
                "bhtn_employee": res.bhtn_employee,
                "total_social_insurance": res.total_social_insurance,
                "total_health_insurance": res.total_health_insurance,
                "total_unemployed_insurance": res.total_unemployed_insurance,
                "total_unemployed_working": res.total_unemployed_working,
                "total_insurance": res.total_insurance,
                "total_insurance_company": res.total_insurance_company,
                "total_insurance_employee": res.total_insurance_employee,
                "note": res.note,
                "company_id": res.company_id,
            })
            setLoading(false);
            return res
        }
    }
    useEffect(() => {
        form?.resetFields();
        if (idInsuranceConfig) {
            fetchInsuranceConfigById(idInsuranceConfig);
        }
    }, [idInsuranceConfig, open])
    return (
        <>
            <Drawer
                key={idInsuranceConfig}
                title={isCreating ? 'Tạo mới' : 'Sửa thông tin'}
                width={720}
                open={open}
                onClose={onClose}
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
                <Spin spinning={loading}>
                    <MyForm<any>
                        onFinish={onFinish}
                        form={form}
                        disabled={isView}
                        layout="vertical"
                        onValuesChange={onValuesChange}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <SelectCompanyHO />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="Mã đơn vị"
                                    name="code"
                                    type="input"
                                    innerprops={{
                                        placeholder: 'Mã đơn vị',
                                        allowClear: true
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="Lương tối thiểu vùng"
                                    name="minimum_wage"
                                    type="input"
                                    innerprops={{
                                        placeholder: 'Lương tối thiểu vùng',
                                        allowClear: true
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="Tháng"
                                    name="date"
                                    type="date-picker"
                                    innerprops={{
                                        format: 'MM/YYYY',
                                        picker: 'month',
                                        allowClear: true,
                                        placeholder: 'Tháng'
                                    }}
                                />
                            </Col>

                            <Col span={12}>
                                <MyForm.Item
                                    label="BHXH"
                                    name="bhxh_company"
                                    initialValue={0}
                                    type="input-number"
                                    innerprops={{
                                        placeholder: 'BHXH',
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                        min: 0
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="BHYT"
                                    name="bhyt_company"
                                    type="input-number"
                                    initialValue={0}
                                    innerprops={{
                                        placeholder: 'BHYT',
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                        min: 0
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="BHTN"
                                    name="bhtn_company"
                                    type="input-number"
                                    initialValue={0}
                                    innerprops={{
                                        placeholder: 'BHTN',
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                        min: 0
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="BHTNLĐ"
                                    name="bhtnld_company"
                                    type="input-number"
                                    initialValue={0}
                                    innerprops={{
                                        placeholder: 'BHTNLĐ',
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                        min: 0
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <MyForm.Item
                                    label="Tổng BHBB do DN đóng"
                                    name="total_insurance_company"
                                    type="input-number"
                                    innerprops={{
                                        disabled: true,
                                        placeholder: 'Tổng BHBB do DN đóng',
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <MyForm.Item
                                    label="BHXH"
                                    name="bhxh_employee"
                                    type="input-number"
                                    initialValue={0}
                                    innerprops={{
                                        placeholder: 'BHXH',
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                        min: 0
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="BHYT"
                                    name="bhyt_employee"
                                    type="input-number"
                                    initialValue={0}
                                    innerprops={{
                                        placeholder: "BHYT",
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                        min: 0
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="BHTN"
                                    name="bhtn_employee"
                                    type="input-number"
                                    initialValue={0}
                                    innerprops={{
                                        placeholder: "BHTN",
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                        min: 0
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="Tổng BHBB do người lao động đóng"
                                    name="total_insurance_employee"
                                    type="input-number"
                                    initialValue={0}
                                    innerprops={{
                                        disabled: true,
                                        placeholder: "Tổng BHBB do người lao động đóng",
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                        min: 0
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="Tổng tiền BHXH"
                                    name="total_social_insurance"
                                    type="input-number"
                                    initialValue={0}
                                    innerprops={{
                                        disabled: true,
                                        placeholder: "Tổng tiền BHXH",
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                        min: 0
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="Tổng tiền BHYT"
                                    name="total_health_insurance"
                                    type="input-number"
                                    initialValue={0}
                                    innerprops={{
                                        disabled: true,
                                        placeholder: "Tổng tiền BHYT",
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                        min: 0
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="Tổng tiền BHTN"
                                    name="total_unemployed_insurance"
                                    type="input-number"
                                    initialValue={0}
                                    innerprops={{
                                        disabled: true,
                                        placeholder: "Tổng tiền BHTN",
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                        min: 0
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="Tổng tiền BHTNLĐ"
                                    name="total_unemployed_working"
                                    type="input-number"
                                    initialValue={0}
                                    innerprops={{
                                        disabled: true,
                                        placeholder: "Tổng tiền BHTNLĐ",
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                        min: 0
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <MyForm.Item
                                    label="Tổng tiền phải nộp"
                                    name="total_insurance"
                                    type="input-number"
                                    initialValue={0}
                                    innerprops={{
                                        disabled: true,
                                        placeholder: "Tổng tiền phải nộp",
                                        allowClear: true,
                                        formatter: (value: any) => `${value}%`,
                                        parser: (value: any) => value!.replace('%', ''),
                                        min: 0
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <MyForm.Item
                                    label="Ghi chú"
                                    name="note"
                                    type="input-textarea"
                                    innerprops={{
                                        placeholder: 'Ghi chú',
                                        allowClear: true
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

export default InsuranceConfigForm;