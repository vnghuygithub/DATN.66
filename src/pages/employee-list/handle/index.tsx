import { Button, Col, Drawer, FormInstance, Row, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import BaseInfo from './components/base-info';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import Tabs from './components/tabs';
import {
  createNewEmployee,
  getEmployeeById,
  putEmployeeById,
} from '@/api/employee/employee.api';
import { mapFormEmployee } from '@/api/employee/transform';
import moment, { Moment } from 'moment';
import { jobOptions } from '@/const/options';
import { IJob } from '@/pages/components/selects/SelectSubJob';
import { hinhThucNhanVienOptions } from '@/const/options';
import { set } from 'lodash';
import { bangCapCaoNhatOptions } from '@/const/options';
import { mobileResponsive } from '@/utils/mobileResponsive';

interface Props {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
    idEmployee?: string;
  setFoceUpdate?: Dispatch<SetStateAction<boolean>>;
  foceUpdate?: boolean;
  form?: FormInstance<any>;
  isViewMode: boolean;
  isCreating: boolean;
}
const FormEmployee: FC<Props> = ({
  onClose,
  open,
  idEmployee,
  foceUpdate,
  setFoceUpdate,
  isCreating,
  isViewMode,
  form,
}) => {
  const { isMobile } = mobileResponsive();
  const { t } = useLocale();
  const [disableDepartment, setDisableDepartment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeRelativeInfo, setEmployeeRelativeInfo] = useState<any[]>([]);
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [wardId, setWardId] = useState(null);
  const [birthday, setBirthday] = useState<any>(null);
  const [issued_by_identification_day, setissued_by_identification_day] = useState<any>(null);
  const [workingday, setWorkingday] = useState<any>(null);
  const [severance_day, setSeverance_day] = useState<any>(null);

  useEffect(() => {
    if (isCreating) {
      setDisableDepartment(false);
    } else {
      setDisableDepartment(true);
    }
  }, [isCreating]);
  const [job, setJob] = useState<IJob[]>([]);
  useEffect(() => {
    jobOptions().then(res => {
      setJob(res);
    });
  }, []);

  function set_data_type_date(property: string, res: any) {
    let string_props = null;
    if (res) {
      if (
        res[property] != false &&
        res[property] != null &&
        res[property] != undefined
      ) {
        string_props = res[property];
        form &&
          form.setFieldsValue({
            [property]: moment(string_props) ?? '',
          });
      } else {
        string_props = '';
        form &&
          form.setFieldsValue({
            [property]: undefined,
          });
      }
    }
  }

  let company_id = Number(localStorage.getItem('company_id'));
  const onFinish = async () => {
    await form?.validateFields();
    const result: { [key: string]: number | string | boolean | object | null } =
      {};
    const data = await form?.getFieldsValue();
    
    if (Array.isArray(data?.sub_admin_role)) {
      data['sub_admin_role'] = data?.sub_admin_role[0]
    }
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] === null || data[key] === undefined) {
          result[key] = false;
        } else if (typeof data[key] !== 'object') {
          if (data[key] === '') {
            result[key] = ''; // Include fields with empty strings
          } else {
            result[key] = data[key];
          }
        } else if (
          data[key] &&
          typeof data[key] === 'object' &&
          moment.isMoment(data[key]) == false
        ) {
          result[key] = data[key].value;
        } else if (
          data[key] &&
          typeof data[key] === 'object' &&
          moment.isMoment(data[key]) == true
        ) {
          result[key] = data[key].format('YYYY-MM-DD');
          if (data[key].format('YYYY-MM-DD') == 'Invalid date') {
            result[key] = false;
          }
        }
      }
    }
    if (
      data.resource_calendar_id.value == false &&
      data.resource_calendar_id.label == false
    ) {
      $message.error('Vui lòng chọn lịch làm việc!');
      return;
    }
    if (data.severance_day && data.severance_day < data.workingday) {
      $message.error('Ngày thôi việc phải lớn hơn ngày vào làm!');
      return;
    }

    if (!data.time_keeping_code) {
      $message.error('Vui lòng nhập mã chấm công!');
      return;
    }
    if (
      (data.general_management_check &&
        data.head_of_department_check &&
        data.department_secretary_check) ||
      (data.general_management_check && data.head_of_department_check) ||
      (data.general_management_check && data.department_secretary_check) ||
      (data.head_of_department_check && data.department_secretary_check)
    ) {
      $message.error('Vui lòng chỉ chọn một chức danh');
      return;
    }
    if (
      data.probationary_contract_termination_date &&
      data.probationary_contract_termination_date < data.workingday
    ) {
      $message.error(
        'Ngày hết hạn hợp đồng thử việc phải lớn hơn ngày vào làm!'
      );
      return;
    }
    if (!data.department_id) {
      $message.error('Vui lòng chọn phòng ban!');
      return;
    }
    if (!data.name) {
      $message.error('Vui lòng nhập tên!');
      return;
    }
    var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
    var numberRegex = /\d/;
    for (var i = 0; i < specialChars.length; i++) {
      if (data?.name?.indexOf(specialChars[i]) > -1 || numberRegex.test(data?.name?.trim())) {
        $message.error('Tên không được chứa ký tự đặc biệt hoặc số!');
        return;
      }
    }
    if (data?.name?.trim() === '') {
      $message.error('Tên không được để trống!');
      return;
    }
    for (var i = 0; i < specialChars.length; i++) {
      if (data?.code?.indexOf(specialChars[i]) > -1) {
        $message.error('Mã nhân viên không được chứa ký tự đặc biệt!');
        return;
      }
    }
    if (data?.code?.trim() === '') {
      $message.error('Mã nhân viên không được để trống!');
      return;
    }
    if (!/^\d+$/.test(data?.time_keeping_code?.trim())) {
      $message.error('ID vân tay chỉ được chứa số!');
      return;
    }
    if (data?.time_keeping_code?.trim() === '') {
      $message.error('ID vân tay không được để trống!');
      return;
    }
    if (data?.mobile_phone && data?.mobile_phone?.trim() !== "" && !/^\d+$/.test(data?.mobile_phone?.trim())) {
      $message.error('Số điện thoại chỉ được chứa số!');
      return;
    }

    if (!data?.birthday && !birthday) {
      $message.error('Ngày sinh không được để trống!');
      return;
    }
    if (data?.work_email) {
      if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          data?.work_email?.trim()
        )
      ) {
        $message.error('Email không hợp lệ!');
        return;
      }
    }
    if (data?.work_email?.trim() === '') {
      $message.error('Email không được để trống!');
      return;
    }
    if (isCreating) {
      setLoading(true);
      try {
        if (data) {
          const res = await createNewEmployee({
            company_id: data.company_id ?? company_id,
            department_id: data.department_id,
            resource_calendar_id: data.resource_calendar_id,
            parent_id: data.parent_id,
            coach_id: data.coach_id,
            part_time_company_id: data.part_time_company_id,
            part_time_department_id: data.part_time_department_id,
            part_time_job_title: data.part_time_job_title,
            country_id: data.country_id,
            nation_id: data.nation_id,
            religion_id: data.religion_id,
            state_id: data.state_id,
            district_vietnam_id: data.district_vietnam_id,
            ward_vietnam_id: data.ward_vietnam_id,
            employee_type: data.employee_type,
            user_id: data.user_id,
            job_id: data.job_id,
            name: data?.name?.trim(),
            code: data?.code?.trim(),
            time_keeping_code: data?.time_keeping_code?.trim(),
            work_email: data?.work_email?.trim(),
            mobile_phone: data?.mobile_phone?.trim(),
            user_ids: data?.user_ids,
            is_accountant: data?.is_accountant,
            work_location: data?.work_location,
            working_status: data?.working_status,
            bank_id: data?.bank_id,
            sub_admin_role: data?.sub_admin_role,
            email_ccs: data?.email_ccs,
            ...result,
          });
          if (res) {
            $message.success('Thành công');
            const res2 = await putEmployeeById(res?.result, {
              "params": {
                "data": {
                  "mobile_phone": data?.mobile_phone?.trim(),
                }
              }
            })
            if (res2) {
              // setFoceUpdate && setFoceUpdate(!foceUpdate);
              isCreating = false;
              onClose && onClose();
            }
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if (result) {
      result["email_ccs"] = data?.email_ccs;
      try {
        setLoading(true);
        if (idEmployee) {
          console.log(result, 'result')
          const res = await putEmployeeById(Number(idEmployee), {
            params: {
              data: result,
            },
          });
          if (res) {
            $message.success('Thành công');
            // setFoceUpdate && setFoceUpdate(!foceUpdate);
            onClose && onClose();
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchEmployeeById = async (id?: string) => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      setDisableDepartment(true);
      const res = await getEmployeeById(id);
      let string_probationary_contract_termination_date = null;
      if (res) {
        if (
          res.probationary_contract_termination_date != false &&
          res.probationary_contract_termination_date != null &&
          res.probationary_contract_termination_date != undefined
        ) {
          string_probationary_contract_termination_date =
            res.probationary_contract_termination_date?.substring(0, 10);
          form &&
            form.setFieldsValue({
              probationary_contract_termination_date:
                moment(string_probationary_contract_termination_date) ?? '',
            });
        } else {
          string_probationary_contract_termination_date = '';
          form &&
            form.setFieldsValue({
              probationary_contract_termination_date: undefined,
            });
        }
        //set_data_type_date('severance_day', res);
        form?.setFieldsValue({
          severance_day:res.severance_day
        })
        setSeverance_day(res.severance_day);
       // set_data_type_date('workingday', res);
       form?.setFieldsValue({
        workingday:res.workingday
      })
      setWorkingday(res.workingday);
        set_data_type_date('date_sign', res);
        // set_data_type_date('birthday', res);
        form?.setFieldsValue({
          birthday:res.birthday
        })
        setBirthday(res.birthday);
      //  set_data_type_date('issued_by_identification_day', res);
      form?.setFieldsValue({
        issued_by_identification_day:res.issued_by_identification_day
      })
      setissued_by_identification_day(res.issued_by_identification_day);
        if (
          res.part_time_job_title != false &&
          res.part_time_job_title != null &&
          res.part_time_job_title != undefined
        )
          job.forEach(obj => {
            if (obj.value == res.part_time_job_title) {
              form &&
                form.setFieldsValue({
                  part_time_job_title: obj,
                });
            }
          });
        else {
          form &&
            form.setFieldsValue({
              part_time_job_title: undefined,
            });
        }
        hinhThucNhanVienOptions.forEach(obj => {
          if (obj.value == res.employee_type) {
            form &&
              form.setFieldsValue({
                employee_type: obj,
              });
          }
        });

        bangCapCaoNhatOptions.forEach(obj => {
          if (obj.value == res.certificate) {
            form &&
              form.setFieldsValue({
                certificate: obj,
              });
          }
        });
        setEmployeeRelativeInfo(res.hr_employee_relative_ids);
        setCountryId(res.country_id?.id);
        setStateId(res.state_id?.id);
        setDistrictId(res.district_vietnam_id?.id);
        setWardId(res.ward_vietnam_id?.id);
        form &&
          form.setFieldsValue({
            key: res.key,
            code: res?.code?.trim() ?? '',
            employee_ho: res.employee_ho ?? false,
            current_employee_code:
              res.current_employee_code !== false
                ? res.current_employee_code
                : '',
            name: res.name !== false ? res.name : '',
            time_keeping_code:
              res.time_keeping_code !== false ? res?.time_keeping_code?.trim() : '',
            mobile_phone: res.mobile_phone !== false ? res.mobile_phone : '',
            permanent_address: res.permanent_address ?? '',
            work_email: res.work_email !== false ? res.work_email : '',
            user_id: {
              value: res.user_id?.id ?? '',
              label: res.user_id?.name ?? '',
            },
            department_id: {
              value: res.department_id?.id ?? '',
              label: res.department_id?.name ?? '',
            },
            social_insurance_number:
              res.social_insurance_number !== false
                ? res.social_insurance_number
                : '',
            // date_sign: moment(res.date_sign) ?? '',
            probationary_salary_rate: res.probationary_salary_rate ?? '',
            job_title: res.job_title,
            company_id: {
              value: res.company_id?.id ?? '',
              label: res.company_id?.name ?? '',
            },
            parent_id: {
              value: res.parent_id?.id ?? '',
              label: res.parent_id?.name ?? '',
            },
            coach_id: {
              value: res.coach_id?.id ?? '',
              label: res.coach_id?.name ?? '',
            },
            employee_type: {
              value: res.employee_type ?? '',
            },
            work_phone: res.work_phone !== false ? res.work_phone : '',
            resource_calendar_id: {
              value: res.resource_calendar_id?.id ?? '',
              label: res.resource_calendar_id?.name ?? '',
            },
            part_time_company_id: {
              value: res.part_time_company_id?.id ?? '',
              label: res.part_time_company_id?.name ?? '',
            },
            part_time_department_id: {
              value: res.part_time_department_id?.id ?? '',
              label: res.part_time_department_id?.name ?? '',
            },
            // part_time_job_title: res.part_time_job_title ?? '',
            resource_calendar_type: res.resource_calendar_type ?? '',
            country_id: {
              value: res.country_id?.id ?? '',
              label: res.country_id?.name ?? '',
            },
            nation_id: {
              value: res.nation_id?.id ?? '',
              label: res.nation_id?.name ?? '',
            },
            religion_id: {
              value: res.religion_id?.id ?? '',
              label: res.religion_id?.name ?? '',
            },
            issued_by_identification: {
              value: res.issued_by_identification?.id ?? '',
              label: res.issued_by_identification?.name ?? '',
            },
            state_id: {
              value: res.state_id?.id ?? '',
              label: res.state_id?.name ?? '',
            },
            // severance_day:  moment(res.severance_day) ?? '',
            bank: res.bank !== false ? res.bank : '',
            bank_account_number:
              res.bank_account_number !== false ? res.bank_account_number : '',
            bank_branch: res.bank_branch !== false ? res.bank_branch : '',
            current_place_of_residence:
              res.current_place_of_residence !== false
                ? res.current_place_of_residence
                : '',
            issued_by_identification_text:
              res.issued_by_identification_text ?? '',
            // city: res.city ?? '',
            district_vietnam_id: {
              value: res.district_vietnam_id?.id ?? '',
              label: res.district_vietnam_id?.name ?? '',
            },
            ward_vietnam_id: {
              value: res.ward_vietnam_id?.id ?? '',
              label: res.ward_vietnam_id?.name ?? '',
            },
            personal_email:
              res.personal_email !== false ? res.personal_email : '',
            marital: res.marital !== false ? res.marital : '',
            // private_email: res.private_email !== false ? res.private_email : '',
            place_of_birth:
              res.place_of_birth !== false ? res.place_of_birth : '',
            gender: res.gender !== false ? res.gender : '',
            identification_id:
              res.identification_id !== false ? res.identification_id : '',
            country: res.country !== false ? res.country : '',
            study_school: res.study_school !== false ? res.study_school : '',
            highest_degree:
              res.highest_degree !== false ? res.highest_degree : '',
            study_field: res.study_field !== false ? res.study_field : '',
            range_of_vehicle:
              res.range_of_vehicle !== false ? res.range_of_vehicle : '',
            car_registration:
              res.car_registration !== false ? res.car_registration : '',
            license_plates:
              res.license_plates !== false ? res.license_plates : '',
            car_color: res.car_color !== false ? res.car_color : '',
            time_keeping_count:
              res.time_keeping_count !== false ? res.time_keeping_count : '',

            religion: res.religion !== false ? res.religion : '',
            tax_id: res.tax_id !== false ? res.tax_id : '',
            annual_leave_fund:
              res.annual_leave_fund !== false ? res.annual_leave_fund : '',
            // union_day: res.union_day ? moment(res.union_day) : '',

            department_secretary_check: res.department_secretary_check ?? '',
            general_management_check: res.general_management_check ?? '',
            head_of_department_check: res.head_of_department_check ?? '',
            job_id: {
              value: res.job_id?.id ?? '',
              label: res.job_id?.name ?? '',
            },
            work_location: res.work_location ? {
              value: res.work_location.id,
              label: res.work_location.name
            } : '',
            working_status: res.working_status ?? '',
            level: res.level ?? '',
            weekly_report_is_mandatory: res.weekly_report_is_mandatory ?? '',
            is_accountant: res.is_accountant ?? '',
            bank_id: res.bank_id ? {
              value: res.bank_id.id,
              label: res.bank_id.name
            } : '',
            sub_admin_role: res.sub_admin_role ?? '',
            user_ids: res.user_ids ? res.user_ids.map((item: any) => {
              return {
                value: item.id,
                label: item.name
              }
            }) : [],
            email_ccs: res.email_ccs ? res.email_ccs.map((item: any) => {
              return {
                value: item.id,
                label: item.name + " - " +  item.work_email,
              }
            }) : [],
            it_ho_check: res.it_ho_check ?? '',
            it_branch_check: res.it_branch_check ?? '',
            current_shift_name: res.current_shift_name ?? '',
          });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const is_general_manager = localStorage.getItem('is_general_manager');
  useEffect(() => {
    if (!isCreating) {
      fetchEmployeeById(idEmployee);
    }
  }, [idEmployee, foceUpdate, open]);

  useEffect(() => {
    if (isCreating) {
      if (is_general_manager === "true") {
        form && form.setFieldsValue({
          company_id: Number(localStorage.getItem('company_id')),
        })
      }
    }
  }, [isCreating])
  return (
    <>
      <Drawer
        key={idEmployee}
        title={idEmployee ? 'Thông tin chi tiết' : t({ id: 'create' })}
        width={isMobile ? '100%' : '900'}
        onClose={onClose}
        open={open}
        destroyOnClose
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          !isViewMode && (
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
            disabled={isViewMode}
            onFinish={onFinish}
            form={form}
            layout="vertical">
            <BaseInfo
              disableDepartment={disableDepartment}
              isCreatingEmployee={isCreating}
              idEmployee={idEmployee}
              form={form}
            />
            <Row gutter={24}>
              {/* Tabs */}
              <Col span={24}>
                <Tabs
                  idEmployee={idEmployee}
                  isCreatingEmployee={isCreating}
                  employeeRelativeInfo={employeeRelativeInfo}
                  forceUpdate={foceUpdate}
                  setForceUpdate={setFoceUpdate}
                  isViewMode={isViewMode}
                  form={form}
                  countryId={countryId}
                  districtId={districtId}
                  wardId={wardId}
                />
              </Col>
            </Row>
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default FormEmployee;
