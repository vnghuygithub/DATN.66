import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import SelectCompany from '@/pages/components/selects/SelectCompany';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import SelectDepartmentManager from '@/pages/components/selects/SelectDepartmentManager';
import SelectParentDepartment from '@/pages/components/selects/SelectParentDepartment';
import SelectSecretary from '@/pages/components/selects/SelectSecretary';
import { Col, Row, Select } from 'antd';

const DepartmentForm = () => {
    const { t } = useLocale();
    let employee_ho = localStorage.getItem('employee_ho');
    let is_administrative = localStorage.getItem('is_administrative');
    let sub_admin_role = localStorage.getItem('sub_admin_role');
    return (
        <>
            <Row gutter={24}>
                <Col span={12}>
                    <MyForm.Item
                        label={'Tên phòng ban'}
                        name="name"
                        type="input"
                        innerprops={{
                            allowClear: true,
                            placeholder: "Tên phòng ban",
                        }}
                        required
                    />
                </Col>
                {
                    (is_administrative === "true" || sub_admin_role !==  "none") && (
                        <Col span={12}>
                            <SelectCompanyAll />
                        </Col>
                    )
                }
                <Col span={12}>
                    <MyForm.Item
                        label="Số lần chấm công"
                        name="time_keeping_count"
                        type="input"
                        innerprops={{
                            allowClear: true,
                            placeholder: "Số lần chấm công",
                        }}
                        required
                    />
                </Col>
                <Col span={12}>
                    <SelectDepartmentManager />
                </Col>
                <Col span={12}>
                    <SelectSecretary />
                </Col>
                <Col span={12}>
                    <SelectParentDepartment />
                </Col>
            </Row>
        </>
    )
}
export default DepartmentForm;