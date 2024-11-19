import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import RadioLoaiGioLamViec from '@/pages/components/radios/RadioLoaiGioLamViec';
import SelectApecCommonContactIds from '@/pages/components/selects/SelectApecCommonContactIds';
import SelectSubCompany from '@/pages/components/selects/SelectSubCompany';
import SelectSubDepartment from '@/pages/components/selects/SelectSubDepartment';
import SelectSubJob from '@/pages/components/selects/SelectSubJob';
import SelectTypeEmployee from '@/pages/components/selects/SelectTypeEmployee';
import SelectWorkHour from '@/pages/components/selects/SelectWorkHour';
import { Checkbox, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const index = ({ isCreatingEmployee }: any) => {
  const { t } = useLocale();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSubCompany, setSelectedSubCompany] = useState<any>(null);
  const handleSubCompanyChange = (value: any) => {
    setSelectedSubCompany(value);
  }
  let is_general_manager = localStorage.getItem('is_general_manager');
  let cannot_edit = true
  if (is_general_manager === "true" || isCreatingEmployee === true) {
    cannot_edit = false
  }
  let is_administrative = localStorage.getItem('is_administrative');
  let sub_admin_role = localStorage.getItem('sub_admin_role');
  let employee_ho = localStorage.getItem('employee_ho');
  return (
    <div>
      <Row gutter={24}>

        <Col span={12}>
          <SelectTypeEmployee disabled={cannot_edit} />
        </Col>
        {/*  Công ty kiêm nhiệm */}
        <Col span={12}>
          <SelectSubCompany onChange={handleSubCompanyChange} disabled={cannot_edit} />
        </Col>
        {/*  Phòng ban kiêm nhiệm */}
        <Col span={12}>
          <SelectSubDepartment disabled={cannot_edit || !selectedSubCompany} selectedSubCompany={selectedSubCompany} />
        </Col>
        {/*  Chúc vụ kiêm nhiệm */}
        <Col span={12}>
          <MyForm.Item
            label={'Chức vụ kiêm nhiệm'}
            name="part_time_job_title"
            type="input"
            innerprops={{
              disabled: cannot_edit,
              placeholder: 'Vui lòng chọn',
              allowClear: true,
            }}
          />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              disabled: cannot_edit,
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'ngày thôi việc' }
              ),
              format: 'DD/MM/YYYY',
            }}
            label={'Ngày thôi việc'}
            name="severance_day"
            type="time-picker-input"
          />
        </Col>
      </Row>
      <Row gutter={24}>

        <Col span={6}>
          <Form.Item
            label={''}
            name="head_of_department_check"
            valuePropName="checked">
            <Checkbox disabled={cannot_edit}>Trưởng bộ phận</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label={''}
            name="general_management_check"
            valuePropName="checked">
            <Checkbox disabled={cannot_edit}>Quản lý chung</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label={''}
            name="department_secretary_check"
            valuePropName="checked">
            <Checkbox disabled={cannot_edit}>Thư ký bộ phận</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label={''}
            name="is_accountant"
            valuePropName="checked">
            <Checkbox disabled={cannot_edit}>Kế toán trưởng</Checkbox>
          </Form.Item>
        </Col>
        {
          (is_administrative === "true" || sub_admin_role === "administration" || employee_ho === "true") && (
            <Col span={6}>
              <Form.Item
                label={''}
                name="it_ho_check"
                valuePropName="checked">
                <Checkbox disabled={cannot_edit}>IT Hội Sở</Checkbox>
              </Form.Item>
            </Col>
          )
        }
        <Col span={6}>
          <Form.Item
            label={''}
            name="it_branch_check"
            valuePropName="checked">
            <Checkbox disabled={cannot_edit}>IT Chi nhánh</Checkbox>
          </Form.Item>
        </Col>






        {/* <Col span={12}>
        <MyForm.Item
          innerprops={{
            disabled: cannot_edit,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'quỹ phép năm' }
            ),
            min: 0,
            step: '0.01',
          }}
          label={'Quỹ phép năm'}
          name="annual_leave_fund"
          type="input-number"

        />
      </Col> */}
        <Col span={12}>
          <SelectWorkHour disabled={cannot_edit} />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'ngày hết hạn hợp đồng thử việc' }
              ),
              format: 'DD/MM/YYYY',
              disabled: true
            }}
            label={'Ngày hết hạn hợp đồng thử việc'}
            name="probationary_contract_termination_date"
            type="date-picker"
          />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              disabled: cannot_edit,
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'ngày vào làm' }
              ),
              format: 'DD/MM/YYYY',
            }}
            label={'Ngày vào làm'}
            name="workingday"
            type="time-picker-input"
            required

          />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              disabled: true,
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'ngày ký hợp đồng lao động' }
              ),
              format: 'DD/MM/YYYY',
            }}
            label={'Ngày ký hợp đồng lao động'}
            name="date_sign"
            type="date-picker"
          />
        </Col>
        {/* <Col span={12}>J
        <RadioLoaiGioLamViec disabled={cannot_edit}/>
      </Col> */}
        <Col span={12}>
          <MyForm.Item
            label="Bắt buộc phải báo cáo tuần"
            name="weekly_report_is_mandatory"
            type="radio"
            initialValue={true}
            innerprops={{
              disabled: cannot_edit,
            }}
            options={[
              { label: 'Có', value: true },
              { label: 'Không', value: false },
            ]}
          />
        </Col>
        <Col span={12}>
          <SelectApecCommonContactIds disabled={cannot_edit} />
        </Col>
      </Row>
    </div>
  );
};

export default index;
