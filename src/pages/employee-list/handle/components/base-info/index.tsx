import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import SelectCompany from '@/pages/components/selects/SelectCompany';
import { Col, Row } from 'antd';
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


const index = ({ disableDepartment, isCreatingEmployee, form, idEmployee }: any) => {
  const [isCreating, setIsCreating] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<any>(Number(localStorage.getItem('company_id')) || null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<any>(null);
  const [workLocation, setWorkLocation] = useState<any>(null);
  useEffect(() => {
    if (disableDepartment) {
      setIsCreating(false);
    } else {
      setIsCreating(true);
    }
  }, [disableDepartment])
  const { t } = useLocale();
  let is_general_manager = localStorage.getItem('is_general_manager');
  let employee_ho = localStorage.getItem('employee_ho');
  let is_administrative = localStorage.getItem('is_administrative');
  let cannot_edit = true;
  if (is_general_manager === "true" || isCreatingEmployee === true) {
    cannot_edit = false
  }
  const jobArgs: IJobListArgs = {
    company_id: "",
    level: "",
    name: "",
    department_id: selectedDepartmentId,
    page_size: "",
    page: "",
  }

  useEffect(() => {
    workLocationOptions().then((res) => {
      console.log("res worklocation options", res)
      setWorkLocation(res);
    });
  }, []);


  useEffect(() => {
    jobOptions(jobArgs).then((res) => {
      setJob(res);
    });
  }, [selectedDepartmentId]);
  const _getJobById = async (id: any) => {
    const res = await getJobById(id);
    if (res) {
      form?.setFieldValue("level", res.level);
    }
  }
  const handleCompanyChange = (value: any) => {
    setSelectedCompanyId(value);
  }
  const handleDepartmentChange = (value: any) => {
    setSelectedDepartmentId(value);
    jobOptions({ ...jobArgs, department_id: value }).then((res) => {
      setJob(res);
    });
  }
  const fetchEmployeeById = async (id: number) => {
    const res = await getEmployeeById(String(id));
    if (res) {
      setSelectedCompanyId(res?.company_id?.id);
      setSelectedDepartmentId(res?.department_id?.id);
    }
  }
  useEffect(() => {
    if (idEmployee) {
      fetchEmployeeById(idEmployee);
    }
  }, [idEmployee]);
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  return (
    <Row gutter={24}>
      {
        (employee_ho === "true" || is_administrative === "true" || sub_admin_role !== "none") && (
          <Col span={12}>
            <MyForm.Item
              label="Là nhân viên HO"
              type="select"
              name="employee_ho"
              initialValue={false}
              options={[
                { value: true, label: "Là nhân viên HO" },
                { value: false, label: "Không phải nhân viên HO" },
              ]}
              innerprops={{
                placeholder: "Là nhân viên HO",
                allowClear: true,
              }}
            />
          </Col>
        )
      }
      {
        (is_administrative === "true" || sub_admin_role !== "none") && (
          <Col span={12}>
            <MyForm.Item
              label={"Admin Role"}
              name="sub_admin_role"
              type="checkbox"
              innerprops={{
                disabled: cannot_edit,
              }}
              options={[
                { label: 'Admin Hành Chính', value: 'administration' },
                { label: 'Admin Tuyển dụng', value: 'recruitment' },
              ]}
            />
          </Col>
        )
      }
      <Col span={12}>
        <MyForm.Item
          innerprops={{
            disabled: cannot_edit,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'Tên nhân viên' }
            ),
          }}
          label={'Tên nhân viên'}
          name="name"
          type="input"
          initialValue={''}
          required
        />
      </Col>
      {
        (is_general_manager === "true" && isCreatingEmployee == false) && (
          <>
            <Col span={12}>
              <SelectUser disabled={cannot_edit} />
            </Col>

            <Col span={12}>
              <SelectMultipleUsers disabled={cannot_edit} />
            </Col>
          </>
        )
      }
      {
        !isCreatingEmployee && (
          <Col span={12}>
            <MyForm.Item
              innerprops={{
                disabled: true,
                placeholder: t(
                  { id: 'placeholder_input' },
                  { msg: 'mã nhân viên' }
                ),
              }}
              label={'Mã nhân viên'}
              name="code"
              type="input"
              required
            />
          </Col>
        )
      }
      <Col span={12}>
        <MyForm.Item
          innerprops={{
            disabled: cannot_edit,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'Id vân tay' }
            ),
          }}
          label={'Id vân tay'}
          required
          name="time_keeping_code"
          type="input"

        />
      </Col>
      <Col span={12}>
        {
          (is_administrative === "true" || sub_admin_role !== "none") ? (
            <SelectCompanyAll disabled={cannot_edit} onChange={handleCompanyChange} />
          )
            : (
              <SelectCompanyAll disabled={true} />
            )
        }
      </Col>
      <Col span={12}>
        <SelectDepartmentEmployeeForm requiredOption={true} disabled={cannot_edit || !selectedCompanyId} isCreating={isCreating} selectedCompanyId={selectedCompanyId} onChange={handleDepartmentChange} />
      </Col>
      <Col span={12}>
        <MyForm.Item
          label={'Chức vụ'}
          name="job_id"
          type="select"
          options={job}
          required
          innerprops={{
            disabled: cannot_edit || !selectedDepartmentId,
            placeholder: 'Vui lòng chọn',
            allowClear: true,
            onChange: (value: number) => {
              _getJobById(value);
            }
          }}
        />
      </Col>
      <Col span={12}>
        <SelectEmployee requiredOption={true} disabled={cannot_edit || !selectedDepartmentId} selectedDepartmentId={selectedDepartmentId} />
      </Col>
      <Col span={12}>
        <MyForm.Item
          label="Cấp nhân sự"
          name="level"
          type="input-number"
          innerprops={{
            disabled: true,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'Cấp nhân sự' }
            ),
          }}
        />
      </Col>
      <Col span={12}>
        <MyForm.Item
          label="Số lần chấm công"
          name="time_keeping_count"
          type="input"
          innerprops={{
            disabled: true,
            placeholder: "Số lần chấm công",
          }}
        />
      </Col>
      <Col span={12}>
        <MyForm.Item
          innerprops={{
            disabled: cannot_edit,
            placeholder: t({ id: 'placeholder_input' }, { msg: 'Số điện thoại cá nhân' }),
          }}
          label={'Số điện thoại cá nhân'}
          name="mobile_phone"
          type="input"
          required
        />
      </Col>
      {/* Selector */}
      {/* <Col span={12}>
        <SelectEmployeeGeneralManager />
      </Col> */}
      {/* <Col span={12}>
        <SelectCoach disabled={cannot_edit} />
      </Col> */}
      {/* <Col span={12}>
        <MyForm.Item
          innerprops={{
            disabled: cannot_edit,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'Số điện thoại công việc' }
            ),
          }}
          label={'Số điện thoại công việc'}
          name="work_phone"
          type="input"
          required
        />
      </Col> */}
      <Col span={12}>
        <MyForm.Item
          innerprops={{
            disabled: cannot_edit,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'email công việc' }
            ),
          }}
          label={'Email công việc'}
          name="work_email"
          type="input"
          required
        />
      </Col>
      <Col span={12}>
        <MyForm.Item
          label={'Nơi làm việc'}
          name="work_location"
          type="select"
          required
          options={workLocation}
          innerprops={{
            disabled: cannot_edit,
            // placeholder: 'Vui lòng chọn',
            allowClear: true,
          }}
        // required
        />
      </Col>
      <Col span={12}>
        <MyForm.Item
          label={'Trạng thái làm việc'}
          name="working_status"
          type="select"
          required
          options={[
            { value: 'working', label: 'Đang làm việc' },
            { value: 'resigned', label: 'Đã nghỉ việc' },
          ]}
          innerprops={{
            disabled: cannot_edit,
            // placeholder: 'Vui lòng chọn',
            allowClear: true,
          }}
        // required
        />
      </Col>
      <Col span={12}>
        <MyForm.Item
          label={'Ca hiện tại'}
          name="current_shift_name"
          type="input"
          innerprops={{
            disabled: true,
          }}
        />
      </Col>
    </Row>
  );
};

export default index;
