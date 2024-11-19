import { message as $message, Input } from 'antd';
import MyForm from '@/components/core/form';
import { Button, Col, Drawer, FormInstance, Row, Spin, } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { getEmployeeById, updateAlClAdvanced } from '@/api/employee/employee.api';
import { companyOptionsAll, departmentAllocationSearchOptions, departmentOptionsNewForm } from '@/const/options';
import { min, set } from 'lodash';
import SelectDepartmentEmployeeForm from '@/pages/components/selects/SelectDepartmentEmployeeForm';
import SelectEmployee from '@/pages/components/selects/selectEmployee';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import { exit } from 'process';
interface Props {
    onClose?: () => void;
    showDrawer?: () => void;
    open?: boolean;
    form?: FormInstance<any>;
}

const UpdateAlClAdvancedForm: FC<Props> = ({
    onClose,
    showDrawer,
    open,
    form
}) => {
    const [loading, setLoading] = useState(false);
    const [companyOptionss, setCompanyOptionss] = useState([]) as any;
    const [selectedCompanyz, setSelectedCompanyz] = useState<any>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<any>(null);



    const onFinish = async () => {
        await form?.validateFields();
        const data = form?.getFieldsValue();
        console.log("data on finish", data);
        setLoading(true);
        try {

            let data_array = [data?.company_id?.value ?? data?.company_id?.id ?? data?.company_id ?? "", data.prev_year_al_date, data.prev_year_cl_date, data.advanced_al_date, data?.department_id?.value ?? data?.department_id?.id ?? data?.department_id ?? "", data?.parent_id?.value ?? data?.parent_id?.id ?? data?.parent_id ?? "", data.from_date] as any;
            // if (data.department_id) {
            //     data_array.push(data.department_id);
            // }

            // if (data.parent_id) {
            //     data_array.push(data.parent_id);

            // }
            // if (data.from_date) {
            //     data_array.push(data.from_date);
            // }
            console.log("data_array", data_array);


            const res = await updateAlClAdvanced(data_array);
            if (res) {
                $message.success('Thành Công');
                onClose && onClose();
                setLoading(false);
                form?.resetFields();
            }
            // }
        } catch (error) {
            console.log(error);
        }

    }

    // const is_administrative = localStorage.getItem('is_administrative');

    let is_general_manager = localStorage.getItem('is_general_manager');
    let employee_ho = localStorage.getItem('employee_ho');
    let is_administrative = localStorage.getItem('is_administrative');
    let cannot_edit = true;
    if (is_general_manager === "true") {
        cannot_edit = false
    }
    useEffect(() => {
        form?.resetFields();

    }, [open]);

    useEffect(() => {
        companyOptionsAll().then((res) => {
            if (res) {
                const is_administrative = localStorage.getItem('is_administrative');
                const sub_admin_role = localStorage.getItem('sub_admin_role');
                if (is_administrative === "true" || sub_admin_role !== "none") {
                    setCompanyOptionss(res);
                }
                else {
                    const company_id = localStorage.getItem('company_id');
                    for (const item of res) {
                        console.log(item.value.toString() + " " + company_id);
                        // Do something with each item
                        if (item.value.toString() === company_id) {
                            setCompanyOptionss([item]);
                            form?.setFieldValue("company_id", item);
                            setSelectedCompanyz(item);
                            break;
                        }
                    }

                }
            }
        });
    }, [open]);

    const handleChangeCompany = (value: any) => {
        console.log("comp_selected", value);
        setSelectedCompanyz(value);
    }


    const handleDepartmentChange = (value: any) => {
        console.log("department_changed", value);
        setSelectedDepartment(value);
    }
    const sub_admin_role = localStorage.getItem('sub_admin_role');
    const _getEmployeeById = async (id: any) => {
        const res = await getEmployeeById(id);
        if (res) {
            form?.setFieldsValue({
                prev_year_al_date: res.prev_year_al_date,
                prev_year_cl_date: res.prev_year_cl_date,
                advanced_al_date: res.advanced_al_date,
                from_date: res.from_date,
            });
            return res;
        }
    }
    const handleChangeEmployee = (value: any) => {
        _getEmployeeById(value);
    }
    return (
        <>
            <Drawer
                // key={}
                title="Cập nhật quỹ phép/bù tồn"
                width={530}
                onClose={onClose}
                open={open}
                bodyStyle={{ paddingBottom: 80 }}
                footer={(
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
                )}
            >


                <Spin spinning={loading}>
                    <MyForm<any>
                        onFinish={onFinish}
                        form={form}
                        layout="vertical">

                        <Row gutter={24}>
                            <Col span={12}>
                                {(is_administrative === "true" || sub_admin_role !== "none") ? (
                                    <SelectCompanyAll disabled={false} onChange={handleChangeCompany} />
                                )
                                    : (
                                        <SelectCompanyAll disabled={true} />
                                    )
                                }
                            </Col>
                            <Col span={12}>
                                <SelectDepartmentEmployeeForm disabled={cannot_edit || !selectedCompanyz} requiredOption={false} selectedCompanyId={selectedCompanyz} onChange={handleDepartmentChange} />
                            </Col>
                            <Col span={12}>
                                <SelectEmployee label="Nhân Viên" requiredOption={false} disabled={cannot_edit || !selectedDepartment} selectedDepartmentId={selectedDepartment} onChange={handleChangeEmployee} />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="Thời gian sử dụng phép tồn"
                                    type='select'
                                    options={[
                                        { label: 'Tháng 1', value: 1 },
                                        { label: 'Tháng 2', value: 2 },
                                        { label: 'Tháng 3', value: 3 },
                                        { label: 'Tháng 4', value: 4 },
                                        { label: 'Tháng 5', value: 5 },
                                        { label: 'Tháng 6', value: 6 },
                                        { label: 'Tháng 7', value: 7 },
                                        { label: 'Tháng 8', value: 8 },
                                        { label: 'Tháng 9', value: 9 },
                                        { label: 'Tháng 10', value: 10 },
                                        { label: 'Tháng 11', value: 11 },
                                        { label: 'Tháng 12', value: 12 },
                                    ]}
                                    name='prev_year_al_date'
                                />
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="Thời gian sử dụng quỹ bù tồn"
                                    type='select'
                                    name='prev_year_cl_date'
                                    options={[
                                        { label: 'Tháng 1', value: 1 },
                                        { label: 'Tháng 2', value: 2 },
                                        { label: 'Tháng 3', value: 3 },
                                        { label: 'Tháng 4', value: 4 },
                                        { label: 'Tháng 5', value: 5 },
                                        { label: 'Tháng 6', value: 6 },
                                        { label: 'Tháng 7', value: 7 },
                                        { label: 'Tháng 8', value: 8 },
                                        { label: 'Tháng 9', value: 9 },
                                        { label: 'Tháng 10', value: 10 },
                                        { label: 'Tháng 11', value: 11 },
                                        { label: 'Tháng 12', value: 12 },
                                    ]}
                                />
                            </Col>

                            <Col span={12}>
                                <MyForm.Item
                                    label="Ứng phép"
                                    type='input-number'
                                    name='advanced_al_date'
                                    innerprops={{
                                        min: 0,
                                        max: 12,
                                    }}
                                />

                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="Từ ngày"
                                    type='time-picker-input'
                                    name='from_date'
                                    innerprops={{
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
export default UpdateAlClAdvancedForm;


