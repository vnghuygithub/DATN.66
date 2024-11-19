import { Button, Col, Drawer, Form, Row, Space, Spin, Upload } from 'antd';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import store from '@/stores';
import { message as $message } from 'antd';
import { setGlobalState } from '@/stores/global.store';
import { FormInstance } from 'antd/es/form/Form';
import { useLocale } from '@/locales';
import MyForm from '@/components/core/form';
import SelectCurrentCompany from '@/pages/components/selects/SelectCurrentCompany';
import SelectNewCompanyForm from '@/pages/components/selects/SelectNewCompanyForm';
import SelectSearchAllocationDepartmentForm from '@/pages/components/selects/SelectDepartmentAllocationForm';
import SelectMultipleEmployee from '@/pages/components/selects/SelectMultipleEmployee';
import {
    createEmployeeAllocatioV2,
    createEmployeeAllocation,
    getEmployeeAllocationById,
    updateAllocation,
} from '@/api/employee-allocation/employeeAllocation.api';
import moment from 'moment';
import { set } from 'lodash';
import SelectCurrentDepartmentEmployee from '@/pages/components/selects/SelectCurrentDepartment';
import SelectDepartmentEmployeeNew from '@/pages/components/selects/SelectDepartmentEmployeeNew';
import SelectContractType from '@/pages/components/selects/SelectContractType';
import SelectMultipleEmployeeCurrent from '@/pages/components/selects/SelectMultipleEmployeeCurrent';
import SelectDepartmentEmployee from '@/pages/components/selects/SelectDepartmentEmployee';
import SelectCurrentDepartmentAllocation from '@/pages/components/selects/SelectCurrentDepartmentAllocation';
import SelectDepartmentAllocationNew from '@/pages/components/selects/SelectDepartmentAllocationNew';
import { getCompanyByDepartmentId, getListCompany } from '@/api/shift/company';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import SelectNewCompanyAllocation from '@/pages/components/selects/SelectNewCompanyAllocation';
import SelectMultipleEmployeeAllocation from '@/pages/components/selects/SelectMultiEmployeeAllocation';
import { getDepartmentById } from '@/api/department/department.api';
import SelectCompanyAllAllocation from '@/pages/components/selects/SelectCompanyAllAllocation';
import SelectJob from '@/pages/components/selects/SelectJob';
import SelectMultipleEmployeeSearch from '@/pages/components/selects/SelectMultipleEmployeeSearch';
import SelectEmployeeApprovalSearch from '@/pages/components/selects/SelectEmployeeApprovalSearch';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import SelectCurrentJob from '@/pages/components/selects/SelectCurrentJob';
import { getEmployeeById } from '@/api/employee/employee.api';
import { request } from '@/api/request';
interface IProps {
    onClose?: () => void;
    isCreating?: boolean;
    form?: FormInstance<any>;
    open?: boolean;
    forceUpdate?: boolean;
    setForceUpdate?: Dispatch<SetStateAction<boolean>>;
    idAllocation?: number;
    showDrawer?: () => void;
    isView?: boolean;
}

const FormAllocation = ({
    isCreating,
    form,
    open,
    forceUpdate,
    setForceUpdate,
    idAllocation,
    onClose,
    showDrawer,
    isView,
}: IProps) => {
    const [fileAttachments, setFileAttachments] = useState<any>();
    const [fileAttachmentsList, setFileAttachmentsList] = useState<any[]>([]);
    const [responseAttachments, setResponseAttachments] = useState<any[]>([]);
    const { t } = useLocale();
    const [loading, setLoading] = useState(false);
    let sub_admin_role = localStorage.getItem('sub_admin_role');
    const onFinish = async () => {
        await form?.validateFields();
        const data = await form?.getFieldsValue();
        if (data) {
            let current_department_id = false;
            let current_company_id = false;


            setLoading(true);

            if (isCreating) {
                const employee_data = await getEmployeeById(data.employee_id);
                if (employee_data) {
                    current_department_id = employee_data.department_id.id;
                    current_company_id = employee_data.company_id.id;
                }
                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('current_company_id', current_company_id as any);
                formData.append('employee_ids', [data.employee_id] as any);
                formData.append('allocation_type', 'chức vụ');
                formData.append('current_department_id', current_department_id as any);
                formData.append('job_id', data.job_id);
                formData.append('new_job_id_date', data.new_job_id_date);
                fileAttachmentsList.forEach((file: any, index: any) => {
                    formData.append(`attachment_ids[${index}]`, file);
                });
                const res = await request('post', '/create_employee_allocation',
                    formData
                )

                if (res?.error?.code && res.error.code == 400) {
                    $message.error(res.error.message);
                    setLoading(false);
                    setFileAttachmentsList([]);
                    setResponseAttachments([]);
                    setFileAttachments(undefined);
                    onClose && onClose();
                    return;
                } else {
                    setLoading(false);
                    $message.success('Tạo phiếu bổ nhiệm thành công');
                    setForceUpdate && setForceUpdate(!forceUpdate);
                    setFileAttachmentsList([]);
                    setResponseAttachments([]);
                    setFileAttachments(undefined);
                    onClose && onClose();
                    return true;
                }
            }
            else {
                console.log('data', data);
                const employee_data = await getEmployeeById(data.employee_id.value);
                if (employee_data) {
                    current_department_id = employee_data.department_id.id;
                    current_company_id = employee_data.company_id.id;
                }
                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('employee_ids', [data.employee_id.value] as any);
                formData.append('job_id', data.job_id.value);
                formData.append('new_job_id_date', data.new_job_id_date);
                fileAttachmentsList.forEach((file: any, index: any) => {
                    formData.append(`attachment_ids[${index}]`, file);
                });
                formData.append('current_company_id', current_company_id as any);
                formData.append('current_department_id', current_department_id as any);
                formData.append('allocation_type', 'chức vụ');
                formData.append('id', idAllocation as any);
                const res = await request('post', '/update_allocation', formData)
                if (res?.error?.code && res.error.code == 400) {
                    $message.error(res.error.message);
                    setLoading(false);
                    setFileAttachmentsList([]);
                    setResponseAttachments([]);
                    setFileAttachments(undefined);
                    onClose && onClose();
                    return;
                } else {
                    setLoading(false);
                    $message.success('Cập nhật phiếu bổ nhiệm thành công');
                    setForceUpdate && setForceUpdate(!forceUpdate);
                    setFileAttachmentsList([]);
                    setResponseAttachments([]);
                    setFileAttachments(undefined);
                    onClose && onClose();
                    return true;
                }
            };
        }
    }
    const fetchAllocationById = async (id?: number) => {
        if (!id) {
            return;
        }
        try {
            setLoading(true);
            const res = await getEmployeeAllocationById(id);
            if (res) {
                setFileAttachmentsList([]);
                setResponseAttachments([]);
                setFileAttachments(undefined);
                if (res.hr_employee_allocation_v2_url_ids && res.hr_employee_allocation_v2_url_ids.length > 0) {
                    let updatedResponseAttachments: any[] = [];
                    res?.hr_employee_allocation_v2_url_ids?.forEach((item: any) => {
                        const itemExists = updatedResponseAttachments.some(
                            existingItem => existingItem.name === item.name
                        );
                        if (!itemExists) {
                            updatedResponseAttachments.push(item);
                        }
                    });
                    setResponseAttachments(updatedResponseAttachments);
                }
                form?.setFieldsValue({
                    new_job_id_date: res.new_job_id_date,
                });
                form &&
                    form.setFieldsValue({
                        key: res.id,
                        name: res.name ?? '',
                        current_job_id: {
                            value: res.current_job_id.id ?? '',
                            label: res.current_job_id.name ?? '',
                        },
                        current_company_id: {
                            value: res.current_company_id.id ?? '',
                            label: res.current_company_id.name ?? '',
                        },
                        current_department_id: {
                            value: res.current_department_id.id ?? '',
                            label: res.current_department_id.name ?? '',
                        },
                        employee_id:
                        {
                            value: res.employee_ids[0].id ?? '',
                            label: res.employee_ids[0].name + ' - ' + res.employee_ids[0].code,
                        },
                        job_id: {
                            value: res.job_id.id ?? '',
                            label: res.job_id.name ?? '',
                        },
                    });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        form?.resetFields();
        setResponseAttachments([]);
        setFileAttachmentsList([]);
        setFileAttachments(undefined);
        if (idAllocation) {
            fetchAllocationById(idAllocation);
        }
    }, [idAllocation, open]);
    const is_administrative = localStorage.getItem('is_administrative');

    const customRequest = async ({
        file,
        onSuccess,
        onError,
        onProgress,
        recordId,
    }: any) => {
        if (file) {
            const totalSize = fileAttachmentsList.reduce(
                (acc, currentFile) => acc + currentFile.size,
                0
            ) + file.size;
            if (totalSize > 10 * 1024 * 1024) {
                $message.error('Tổng dung lượng upload không được quá 10mb.');
                onError('error');
                return;
            }
            setFileAttachments(file);
            setFileAttachmentsList([...fileAttachmentsList, file]);
            onSuccess('ok');
        } else {
            onError('error');
        }
    };
    const handleDownloadFile = (url: string, name: string) => {
        console.log('download detail is', url, name);
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = name;
                link.click();
            })
            .catch(console.error);
    };
    return (
        <>
            <Drawer
                key={idAllocation}
                title={isCreating ? 'Tạo phiếu mới' : idAllocation && !isView ? 'Sửa thông tin phiếu': 'Xem thông tin phiếu'}
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
                }>
                <Spin spinning={loading}>
                    <MyForm<any>
                        onFinish={onFinish}
                        form={form}
                        layout="vertical">
                        <Row gutter={24}>
                            <Col span={12}>
                                <MyForm.Item
                                    innerprops={{
                                        disabled: isView,
                                        placeholder: t(
                                            { id: 'placeholder_input' },
                                            { msg: 'Tên phiếu' }
                                        ),
                                    }}
                                    label={'Tên phiếu'}
                                    name="name"
                                    type="input"
                                    initialValue={''}
                                />
                            </Col>
                            <Col span={12}>
                                <SelectEmployeeApprovalSearch  disabled={isView}/>
                            </Col>
                            {
                                idAllocation && (
                                    <Col span={12}>
                                        <SelectCurrentJob />
                                    </Col>
                                )
                            }
                            <Col span={12}>
                                <SelectJob required={"true"} disabled={isView}/>
                            </Col>
                            <Col span={12}>
                                <MyForm.Item
                                    label="Ngày bổ nhiệm"
                                    name="new_job_id_date"
                                    type="time-picker-input"
                                    required
                                    innerprops={{
                                        format: 'DD/MM/YYYY',
                                        disabled: isView,
                                    }}
                                />
                            </Col>
                            {
                                (isCreating || (idAllocation && !isView)) && (
                                    <>
                                        <Col span={12}>
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                <MyForm.Item
                                                    label="File quyết định"
                                                    required={isCreating ? true : false}
                                                    name="attachment_ids">
                                                    <Upload
                                                        className="upload"
                                                        customRequest={customRequest}>
                                                        <Button
                                                            style={{ width: '100%' }}
                                                            icon={<UploadOutlined />}>
                                                            Upload
                                                        </Button>
                                                    </Upload>
                                                </MyForm.Item>
                                            </Space>
                                        </Col>
                                    </>
                                )
                            }
                            {
                                idAllocation && responseAttachments?.length > 0 && (
                                    <Col span={12}>
                                        <span>File quyết định</span>
                                        <Space
                                            direction="vertical"
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}>
                                            {responseAttachments?.map((item: any) => {
                                                return (
                                                    <Button
                                                        style={{ marginTop: 8, width: '100%' }}
                                                        type="primary"
                                                        disabled={false}
                                                        onClick={() => {
                                                            handleDownloadFile(item.url, item.name);
                                                        }}
                                                        icon={<DownloadOutlined />}>
                                                        {item.name}
                                                    </Button>
                                                );
                                            })}
                                        </Space>
                                    </Col>
                                )}

                        </Row>
                    </MyForm>
                </Spin>
            </Drawer>
        </>
    );
};
export default FormAllocation;
