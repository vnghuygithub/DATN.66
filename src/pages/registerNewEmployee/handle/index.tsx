import {
  Button,
  Col,
  Drawer,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Spin,
  Upload,
} from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';

import { workLocationOptions } from '@/const/options';
import { mobileResponsive } from '@/utils/mobileResponsive';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAllNoRight';
import { getJobById } from '@/api/job/job.api';
import SelectGender from '@/pages/components/selects/SelectGender';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { registerNewEmployeeUpdate } from '@/api/registerNewEmployee/register.api';
import SelectEmployee from '@/pages/components/selects/selectEmployee';
import FamilyInfo from './family-info';
import { getListDepartmentHO2 } from '@/api/timekeepingList/department.api';
import SelectJobRegister from '@/pages/components/selects/SelectJobRegister';
import SelectApecGroupMail from '@/pages/components/selects/SelectApecGroupMail';
import SelectWorkHour from '@/pages/components/selects/SelectWorkHour';
interface IProps {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idRegisterNewEmployee?: any;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  updateState?: boolean;
  registerNewEmployee: any;
  url1?: string;
  url2?: string;
  url3?: string;
  setOpen: any;
  setDataParent?: any;
  dataParent?: any;
  children?: any;
  setChildren?: any;
}
interface DepartmentOption {
  label: string;
  value: string;
}
const NewEmployeeRequestForm = ({
  onClose,
  registerNewEmployee,
  setDataParent,
  open,
  idRegisterNewEmployee,
  setForceUpdate,
  forceUpdate,
  form,
  dataParent,
  url1,
  url2,
  url3,
  setOpen,
  children,
  setChildren,
}: IProps) => {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const { isMobile } = mobileResponsive();
  const [department, setDepartment] = useState<DepartmentOption[]>([]);
  const [companyId, setCompanyId] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [fileFrontCCCD, setFileFrontCCCD] = useState<any>(null);
  const [fileBackCCCD, setFileBackCCCD] = useState<any>(null);
  const [workLocation, setWorkLocation] = useState<any>(null);
  useEffect(() => {
    workLocationOptions().then(res => {
      setWorkLocation(res);
    });
  }, []);
  const [stateOptionsData, setStateOptionsData] = useState<any[]>([
    {
      value: 'Cục Cảnh Sát Quản Lý Hành Chính Về Trật Tự Xã Hội',
      label: 'Cục Cảnh Sát Quản Lý Hành Chính Về Trật Tự Xã Hội',
    },
    {
      value: 'Cục Cảnh Sát ĐKQL Cư Trú và DLQG Về Dân Cư',
      label: 'Cục Cảnh Sát ĐKQL Cư Trú và DLQG Về Dân Cư',
    },
  ]);
  const [fileAvatar, setFileAvatar] = useState<any>(null);
  useEffect(() => {
    if (registerNewEmployee) {
      setChildren(registerNewEmployee.number_of_children);
    }
  }, [registerNewEmployee.number_of_children]);

  const onFinish = async () => {
    await form?.validateFields();
    const data = form?.getFieldsValue();
    if (data.parent_id.value === false) {
      setLoading(false);
      $message.error('Vui lòng nhập người quản lý');
      return;
    }
    const apec_group_mail_ids = data?.apec_group_mail_ids
      ?.map((item: any) => item?.value)
      ?.filter((item: any) => item !== null && item !== undefined);
    if (data) {
      let new_data_json = {
        id: idRegisterNewEmployee,
        name: data?.name,
        company_id: data?.company_noright_id.value
          ? data?.company_noright_id.value
          : data?.company_noright_id,
        department_id: data?.department_id.value
          ? data?.department_id.value
          : data?.department_id,
        job_id: data?.job_id.value ? data?.job_id.value : data?.job_id,
        start_work_date: data?.start_work_date
          ? moment(data?.start_work_date).format('YYYY-MM-DD')
          : '2024-01-01',
        date_of_birth: data?.date_of_birth
          ? moment(data?.date_of_birth).format('YYYY-MM-DD')
          : '2024-01-01',
        citizen_id: data?.citizen_id ? data?.citizen_id : '',
        verified_citizen_id_date: data?.verified_citizen_id_date
          ? moment(data?.verified_citizen_id_date).format('YYYY-MM-DD')
          : '2024-01-01',
        verified_citizen_id_by: data?.verified_citizen_id_by
          ? data?.verified_citizen_id_by
          : '',
        tax_number: data?.tax_number ? data?.tax_number : '',
        social_insurance_number: data?.social_insurance_number
          ? data?.social_insurance_number
          : '',
        original_address: data?.original_address ? data?.original_address : '',
        current_address: data?.current_address ? data?.current_address : '',
        license_plate: data?.license_plate ? data?.license_plate : '',
        vehicle_info: data?.vehicle_info ? data?.vehicle_info : '',
        bidv_info: data?.bidv_info ? data?.bidv_info : '',
        gender: data?.gender,
        file_front_cccd: fileFrontCCCD?.data,
        file_back_cccd: fileBackCCCD?.data,
        file_name_front_cccd: fileFrontCCCD?.name,
        file_name_back_cccd: fileBackCCCD?.name,
        mimetype_front_cccd: fileFrontCCCD?.type,
        mimetype_back_cccd: fileBackCCCD?.type,
        file_avatar: fileAvatar?.data,
        file_name_file_avatar: fileAvatar?.name,
        mimetype_file_avatar: fileAvatar?.type,
        weekly_report_is_mandatory: data?.weekly_report_is_mandatory,
        parent_id: data?.parent_id.value
          ? data?.parent_id.value
          : data.parent_id,
        number_of_children: data?.number_of_children,
        apec_group_mail_ids:
          apec_group_mail_ids?.length > 0
            ? apec_group_mail_ids
            : data?.apec_group_mail_ids,
        work_location: data?.work_location.value ?? data?.work_location ?? '',
        work_email: data?.work_email,
        mobile_phone: data?.mobile_phone,
        personal_email: data?.personal_email,
        time_keeping_code: data?.time_keeping_code,
        resource_calendar_id: data?.resource_calendar_id.value
          ? data?.resource_calendar_id.value
          : data.resource_calendar_id,
      };
      const final_data = {
        params: {
          args: [new_data_json],
        },
      };
      if (dataParent && dataParent.length !== +children) {
        $message.error(
          'Vui lòng nhập số thân nhân  bằng với số nhân thân đã nhập'
        );
        setLoading(false);
        return;
      }
      const res = await registerNewEmployeeUpdate(final_data);
      setLoading(true);
      if (res) {
        if (res?.result?.error?.code && res.result.error.code == 400) {
          setLoading(false);
          return;
        } else {
          $message.success('Chỉnh sửa thành công');
          setForceUpdate && setForceUpdate(!forceUpdate);
          setFileAvatar([]);
          setFileBackCCCD([]);
          setFileFrontCCCD([]);
          setLoading(false);
          setOpen(false);
        }
      }
    }
    setLoading(false);
  };

  const customRequestFront = async ({ file, onSuccess, onError }: any) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileFrontCCCD({
          data: reader.result,
          name: file.name,
          type: file.type,
        });
        onSuccess(reader.result);
      };
      reader.onerror = onError;
      reader.readAsDataURL(file);
    } else {
      onError('No file selected');
    }
  };
  const customRequestBack = async ({ file, onSuccess, onError }: any) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBackCCCD({
          data: reader.result,
          name: file.name,
          type: file.type,
        });
        onSuccess(reader.result);
      };
      reader.onerror = onError;
      reader.readAsDataURL(file);
    } else {
      onError('No file selected');
    }
  };

  const customRequestAvatar = async ({ file, onSuccess, onError }: any) => {
    if (file) {
      console.log(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileAvatar({
          data: reader.result,
          name: file.name,
          type: file.type,
        });
        onSuccess(reader.result);
      };
      reader.onerror = onError;
      reader.readAsDataURL(file);
    } else {
      onError('No file selected');
    }
  };
  useEffect(() => {
    const handleDataDepartment = async () => {
      if (companyId) {
        form && form.resetFields(['department_id']);
      }
      const data = await getListDepartmentHO2(
        companyId ? companyId : registerNewEmployee?.company_id?.id
      );

      const dataConvert2 =
        data &&
        data.result &&
        data.result.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
      setDepartment(dataConvert2);
    };

    handleDataDepartment();
  }, [companyId, registerNewEmployee]);
  useEffect(() => {
    const handleDataDepartment = async () => {
      const data2 = await getJobById(
        jobId ? jobId : registerNewEmployee?.department_id?.id
      );

      if (jobId) {
        form && form.resetFields(['job_id']);
      }
      const dataConvert = {
        label: data2.name,
        value: data2.id,
      };
    };

    handleDataDepartment();
  }, [jobId, registerNewEmployee]);

  const onchangeJobId = (id: any) => {
    setJobId(id);
  };

  return (
    <>
      <Drawer
        key={idRegisterNewEmployee}
        title={'Sửa đăng ký nhân sự mới'}
        width={isMobile ? '100%' : '720'}
        onClose={onClose}
        open={open}
        destroyOnClose
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          loading ? (
            <Spin></Spin>
          ) : (
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
          <MyForm<any> onFinish={onFinish} form={form} layout="vertical">
            <Row gutter={24}>
              <Col span={12}>
                <MyForm.Item required label="Tên " type="input" name="name" />
              </Col>
              <Col span={12}>
                <SelectCompanyAll setCompanyId={setCompanyId} />
              </Col>
              <Col span={12}>
                <Form.Item required label="Phòng ban" name="department_id">
                  <Select
                    options={department}
                    onChange={onchangeJobId}></Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <SelectJobRegister selectedDepartmentId={jobId} />
              </Col>
              <Col span={12}>
                <SelectEmployee requiredOption={true} />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label={'Nơi làm việc'}
                  name="work_location"
                  type="select"
                  options={workLocation}
                  innerprops={{
                    placeholder: 'Vui lòng chọn',
                    allowClear: true,
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  rules={[
                    {
                      type: 'email',
                      message: 'Email không hợp lệ!',
                    },
                  ]}
                  required
                  label="Email công việc"
                  type="input"
                  name="work_email"
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  rules={[
                    {
                      type: 'email',
                      message: 'Email không hợp lệ!',
                    },
                    {
                      required: true,
                      message: 'Vui lòng nhập Email cá nhân!',
                    },
                  ]}
                  required
                  label="Email cá nhân"
                  type="input"
                  name="personal_email"
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  required
                  label="Id vân tay"
                  type="input"
                  name="time_keeping_code"
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  required
                  label="Số điện thoại cá nhân"
                  type="input"
                  name="mobile_phone"
                />
              </Col>
              <Col span={12}>
                <SelectWorkHour />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  required
                  label="Ngày bắt đầu làm"
                  type="time-picker-input"
                  name="start_work_date"
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  required
                  label="Ngày sinh"
                  type="time-picker-input"
                  name="date_of_birth"
                />
              </Col>
              <Col span={12}>
                <SelectGender />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  required
                  label="CCCD/CMND"
                  type="input"
                  name="citizen_id"
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Nơi cấp CMND/CCCD"
                  name="verified_citizen_id_by"
                  type="select"
                  options={stateOptionsData}
                  required
                  innerprops={{
                    allowClear: true,
                    placeholder: t(
                      { id: 'placeholder_input' },
                      { msg: 'nơi cấp CMND/CCCD' }
                    ),
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Mã số thuế"
                  type="input"
                  name="tax_number"
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  required
                  label="Mã số BHXH"
                  type="input"
                  name="social_insurance_number"
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  required
                  label="Hộ khẩu thường trú"
                  name="original_address">
                  <Input.TextArea></Input.TextArea>
                </MyForm.Item>
              </Col>
              <Col span={12}>
                <MyForm.Item
                  required
                  label="Địa chỉ hiện tại"
                  name="current_address">
                  <Input.TextArea></Input.TextArea>
                </MyForm.Item>
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Biển số xe"
                  type="input"
                  name="license_plate"
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  required
                  label="Loại xe, nhãn hiệu và màu sắc xe"
                  name="vehicle_info">
                  <Input.TextArea></Input.TextArea>
                </MyForm.Item>
              </Col>
              <Col span={12}>
                <MyForm.Item
                  required
                  label="Tài khoản BIDV"
                  type="input"
                  name="bidv_info"
                />
              </Col>

              <Col span={12}>
                <MyForm.Item
                  label="Ảnh CCCD mặt trước"
                  name="register_employee_url_ids">
                  <Upload
                    className="upload"
                    maxCount={1}
                    accept="image/*"
                    customRequest={customRequestFront}>
                    <Button style={{ width: '100%' }} icon={<UploadOutlined />}>
                      Upload
                    </Button>
                  </Upload>
                  {url1 &&
                    (fileFrontCCCD?.length === 0 || fileFrontCCCD === null) && (
                      <img
                        src={url1}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          marginTop: '10px',
                          maxHeight: '200px',
                        }}
                      />
                    )}
                </MyForm.Item>
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Ảnh CCCD mặt sau"
                  name="register_employee_url_ids">
                  <Upload
                    className="upload"
                    accept="image/*"
                    maxCount={1}
                    customRequest={customRequestBack}>
                    <Button style={{ width: '100%' }} icon={<UploadOutlined />}>
                      Upload
                    </Button>
                  </Upload>
                  {url2 &&
                    (fileBackCCCD?.length === 0 || fileBackCCCD === null) && (
                      <img
                        src={url2}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          marginTop: '10px',
                          maxHeight: '200px',
                        }}
                      />
                    )}
                </MyForm.Item>
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Ảnh chân dung"
                  name="register_employee_url_ids">
                  <Upload
                    className="upload"
                    maxCount={1}
                    accept="image/*"
                    customRequest={customRequestAvatar}>
                    <Button style={{ width: '100%' }} icon={<UploadOutlined />}>
                      Upload
                    </Button>
                  </Upload>
                  {url3 && (fileAvatar?.length === 0 || fileAvatar === null) && (
                    <img
                      src={url3}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        marginTop: '10px',
                        maxHeight: '200px',
                      }}
                    />
                  )}
                </MyForm.Item>
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Bắt buộc phải báo cáo tuần"
                  name="weekly_report_is_mandatory"
                  type="radio"
                  initialValue={true}
                  options={[
                    { label: 'Có', value: true },
                    { label: 'Không', value: false },
                  ]}
                />
              </Col>

              <Col span={12}>
                <Form.Item
                  initialValue={1}
                  required
                  label="Số nhân thân"
                  name="number_of_children">
                  <Input
                    type="number"
                    onChange={e => setChildren(e.target.value)}
                    // min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <SelectApecGroupMail />
              </Col>
            </Row>
          </MyForm>
          <Col>
            <FamilyInfo
              idRegisterNewEmployee={idRegisterNewEmployee}
              setDataParent={setDataParent}
            />
          </Col>
        </Spin>
      </Drawer>
    </>
  );
};

export default NewEmployeeRequestForm;
