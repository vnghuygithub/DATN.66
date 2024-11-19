import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import SelectCompany from '@/pages/components/selects/SelectCompany';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  message as $message,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import SelectDepartment from '../../../../components/selects/selectDepartment';
import SelectEmployee from '@/pages/components/selects/selectEmployee';
import SelectCoach from '@/pages/components/selects/selectCoach';
import SelectJob from '@/pages/components/selects/SelectJob';
import SelectDepartmentEmployeeForm from '@/pages/components/selects/SelectDepartmentEmployeeForm';
import { useEffect, useState } from 'react';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import SelectUser from '@/pages/components/selects/SelectUser';
import SelectEmployeeGeneralManager from '@/pages/components/selects/SelectGeneralManager';
import { jobOptions, workLocationOptions } from '@/const/options';
import { IJobListArgs, getJobById } from '@/api/job/job.api';
import { getEmployeeById } from '@/api/employee/employee.api';
import SelectMultipleUsers from '@/pages/components/selects/SelectMutipleUsers';

const index = ({
  disableDepartment,
  isCreatingEmployee,
  form,
  idEmployee,
}: any) => {
  const [isCreating, setIsCreating] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<any>(
    Number(localStorage.getItem('company_id')) || null
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<any>(null);
  const [workLocation, setWorkLocation] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  useEffect(() => {
    if (disableDepartment) {
      setIsCreating(false);
    } else {
      setIsCreating(true);
    }
  }, [disableDepartment]);
  const { t } = useLocale();
  let is_general_manager = localStorage.getItem('is_general_manager');
  let employee_ho = localStorage.getItem('employee_ho');
  let is_administrative = localStorage.getItem('is_administrative');
  let cannot_edit = true;
  if (is_general_manager === 'true' || isCreatingEmployee === true) {
    cannot_edit = false;
  }
  const jobArgs: IJobListArgs = {
    company_id: '',
    level: '',
    name: '',
    department_id: selectedDepartmentId,
    page_size: '',
    page: '',
  };

  const handleCompanyChange = (value: any) => {
    setSelectedCompanyId(value);
  };

  const sub_admin_role = localStorage.getItem('sub_admin_role');

  return (
    <Row gutter={24}>
      {is_administrative === 'true' || sub_admin_role !== 'none' ? (
        <Col span={12}>
          <SelectCompanyAll
            disabled={cannot_edit}
            onChange={handleCompanyChange}
          />
        </Col>
      ) : null}
      <Col span={12}>
        <MyForm.Item
          innerprops={{
            disabled: cannot_edit,
            placeholder: t({ id: 'placeholder_input' }, { msg: 'Từ ngày' }),
            format: 'DD/MM/YYYY',
          }}
          label={'Từ ngày'}
          name="from_date"
          type="time-picker-input"
          rules={[
            { required: true },
          ]}
        />
      </Col>
      <Col span={12}> 
        <MyForm.Item
          innerprops={{
            disabled: cannot_edit,
            placeholder: t({ id: 'placeholder_input' }, { msg: 'Đến ngày' }),
            format: 'DD/MM/YYYY',
          }}
          label={'Đến ngày'}
          name="to_date"
          type="time-picker-input"
          rules={[
            { required: true },
          ]}
        />
      </Col>

      {/* <Col span={20}>
            <MyForm.Item required label="Upload File" name="url">
              <Upload
                className="upload"
                maxCount={1}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                customRequest={customRequest}>
                <Button style={{ width: '100%' }} icon={<UploadOutlined />}>
                  Upload
                </Button>
              </Upload>
            </MyForm.Item>
          </Col> */}
    </Row>
  );
};

export default index;


