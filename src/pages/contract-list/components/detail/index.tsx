import { getEmployeeById } from '@/api/employee/employee.api';
import MyForm from '@/components/core/form';
import { contractTypeOptions } from '@/const/options';
import { useLocale } from '@/locales';
import RadioIndefiniteContract from '@/pages/components/selects/RadioIndefiniteContract';
import SelectDepartmentContract from '@/pages/components/selects/SelectContractDepartment';
import SelectContractType from '@/pages/components/selects/SelectContractType';
import SelectEmployeeContract from '@/pages/components/selects/SelectEmployeeContract';
import SelectWorkHour from '@/pages/components/selects/SelectWorkHour';
import SelectDepartment from '@/pages/components/selects/selectDepartment';
import { Col, Row } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
interface Props {
    isCreatingForm: boolean;
    indefinite: boolean;
    form?: FormInstance<any>;
}
const Detail = ({ isCreatingForm, indefinite, form }: Props) => {
    const { t } = useLocale();
    const [isIndefiniteContract, setIsIndefiniteContract] = useState(false);
    const handleEmployeeChange = async (value: any) => {
        const res = await getEmployeeById(value);
        if (res) {
            form && form.setFieldsValue({
                employee_code: res.code,
                department_id: {
                    value: res.department_id?.id ?? '',
                    label: res.department_id?.name ?? '',
                },
                job_title: res.job_title,
                depend_on_shift_time:res.depend_on_shift_time,
            })
            return res
        }
    }
    useEffect(() => {
        form?.resetFields();
        if (!isCreatingForm) {
            if (indefinite) {
             setIsIndefiniteContract(true)
            }
        }
    }, [indefinite, isCreatingForm])
    const handleRadioChange = (value: boolean) => {
        setIsIndefiniteContract(value);
    };
    return (
        <Row gutter={24}>
            <Col span={12}>
                <MyForm.Item
                    label={'Tên hợp đồng'}
                    name="name"
                    type="input"
                    initialValue={''}
                    required
                    innerprops={{
                        placeholder: t(
                            { id: 'placeholder_input' },
                            { msg: 'Tên hợp đồng' }
                        ),
                    }}
                />
            </Col>
            <Col span={12}>
                <MyForm.Item
                    label={'Mã nhân viên'}
                    name="employee_code"
                    type="input"
                    initialValue={''}
                    innerprops={{
                        disabled: true
                    }}

                />
            </Col>
            <Col span={12}>
                <SelectEmployeeContract isCreatingForm={isCreatingForm} onChange={handleEmployeeChange} />
            </Col>
            <Col span={12}>
                <SelectDepartmentContract />
            </Col>
            <Col span={12}>
                <MyForm.Item
                    label={'Chức vụ'}
                    name="job_title"
                    type="input"
                    initialValue={''}
                    innerprops={{
                        disabled: true
                    }}
                />
            </Col>
            <Col span={12}>
                <MyForm.Item
                    label={'Ngày ký'}
                    name="date_sign"
                    type="time-picker-input"
                    initialValue={''}
                    innerprops={{
                        placeholder: t(
                            { id: 'placeholder_input' },
                            { msg: 'Ngày ký' }
                        ),
                        format: 'DD/MM/YYYY',
                    }}
                />
            </Col>
            <Col span={12}>
                <MyForm.Item
                    label={'Ngày bắt đầu'}
                    name="date_start"
                    type="time-picker-input"
                    initialValue={''}
                    innerprops={{
                        placeholder: t(
                            { id: 'placeholder_input' },
                            { msg: 'Ngày bắt đầu' }
                        ),
                        format: 'DD/MM/YYYY',
                    }}
                    required
                />
            </Col>
            {isIndefiniteContract ? (<Col span={12}>
                Ngày kết thúc không xác định
            </Col>) : (
                <Col span={12}>
                    <MyForm.Item
                        label={'Ngày kết thúc'}
                        name="date_end"
                        type="time-picker-input"
                        initialValue={''}
                        innerprops={{
                            placeholder: t(
                                { id: 'placeholder_input' },
                                { msg: 'Ngày kết thúc' }
                            ),
                            format: 'DD/MM/YYYY',
                        }}
                        required
                    />
                </Col>
            )}
            <Col span={12}>
                <SelectContractType />
            </Col>
            <Col span={12}>
                <MyForm.Item
                    label={'Tỷ lệ hưởng lương'}
                    name="salary_rate"
                    type="input"
                    initialValue={0}
                    innerprops={{
                        placeholder: t(
                            { id: 'placeholder_input' },
                            { msg: 'Tỷ lệ hưởng lương' }
                        ),

                    }}
                />
            </Col>
            <Col span={12}>
                <SelectWorkHour />
            </Col>
            <Col span={12}>
                <MyForm.Item
                    label={'Tiền công,lương tháng'}
                    name="wage"
                    type="input"
                    initialValue={0}
                    innerprops={{
                        placeholder: t(
                            { id: 'placeholder_input' },
                            { msg: 'Tiền công,lương tháng' }
                        ),
                    }}
                />
            </Col>
            <Col span={12}>
                <MyForm.Item
                    label={'Số phút làm/ngày'}
                    name="minutes_per_day"
                    type="select"
                    innerprops={{
                        placeholder: t(
                            { id: 'placeholder_input' },
                            { msg: 'Số phút làm/ngày' }
                        ),
                        options: [
                            { value: '480', label: '480' },
                            { value: '530', label: '530' },
                        ]
                    }}
                />
            </Col>
            <Col span={12}>
                <RadioIndefiniteContract value={isIndefiniteContract}
                    onChange={handleRadioChange} />
            </Col>
            {/* <Col span={12}>
                <MyForm.Item
                    label={'Chấm công đầu cuối'}
                    name="start_end_attendance"
                    type="radio"
                    innerprops={{
                        placeholder: t(
                            { id: 'placeholder_input' },
                            { msg: 'Chấm công đầu cuối' }
                        ),
                    }}
                    options={[
                        {
                            label: 'True',
                            value: true,
                        },
                        {
                            label: 'False',
                            value: false,
                        },
                    ]}
                />
            </Col>
            <Col span={12}>
                <MyForm.Item
                    label={'Dựa vào thời gian ca'}
                    name="depend_on_shift_time"
                    type="radio"
                    innerprops={{
                        placeholder: t(
                            { id: 'placeholder_input' },
                            { msg: 'Dựa vào thời gian ca' }
                        ),
                    }}
                    options={[
                        {
                            label: 'True',
                            value: true,
                        },
                        {
                            label: 'False',
                            value: false,
                        },
                    ]}
                />
            </Col>
            <Col span={12}>
                <MyForm.Item
                    label={'Theo ca của Huế'}
                    name="by_hue_shift"
                    type="radio"
                    innerprops={{
                        placeholder: t(
                            { id: 'placeholder_input' },
                            { msg: 'Theo ca của Huế' }
                        ),
                    }}
                    options={[
                        {
                            label: 'True',
                            value: true,
                        },
                        {
                            label: 'False',
                            value: false,
                        },
                    ]}
                />
            </Col> */}
        </Row>
    )
}

export default Detail;