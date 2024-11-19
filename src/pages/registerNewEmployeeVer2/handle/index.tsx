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
import { departmentOptions, jobOptions } from '@/const/options';
import { mobileResponsive } from '@/utils/mobileResponsive';
import { IJobListArgs } from '@/api/job/job.api';
import SelectGender from '@/pages/components/selects/SelectGender';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

import { registerNewEmployeeUpdate } from '@/api/registerNewEmployee/register.api';
import React from 'react';
import FamilyInfo from './register/family-info';
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
  dataContract?: any;
}
interface DepartmentOption {
  label: string;
  value: string;
}
const NewEmployeeRequestFormVer2 = ({
  onClose,
  registerNewEmployee,
  open,
  idRegisterNewEmployee,
  setForceUpdate,
  forceUpdate,
  form,
  url1,
  url2,
  url3,
 
  setOpen,
  children,
  setChildren,
  dataContract,
}: IProps) => {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const { isMobile } = mobileResponsive();
  const [department, setDepartment] = useState<DepartmentOption[]>([]);
  const [job, setJob] = useState<any[]>([]);
  const [value, setValue] = React.useState<string[]>([]);
  const [dataParent, setDataParent] = useState([]);

  const [fileFrontCCCD, setFileFrontCCCD] = useState<any>(null);
  const [fileBackCCCD, setFileBackCCCD] = useState<any>(null);

  const option =
    dataContract &&
    dataContract
      .filter((item: any) => item?.mis_id !== false)
      .map((item: any) => ({
        label: registerNewEmployee?.name + '-' + item?.mis_id,
        value: item.id,
      }));

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
    const handleData = async () => {
      const data = await departmentOptions(registerNewEmployee.company_id.id);
      setDepartment(data);
      let jobArgs: IJobListArgs = {
        company_id: '',
        level: '',
        name: '',
        department_id: registerNewEmployee.department_id.id,
        page_size: '',
        page: '',
      };
      const data2 = await jobOptions(jobArgs);
      setJob(data2);
    };
    if (registerNewEmployee) {
      handleData();
    }
  }, [registerNewEmployee]);
  useEffect(() => {
    if (registerNewEmployee) {
      setChildren(registerNewEmployee.number_of_children);
    }
  }, [registerNewEmployee.number_of_children]);


  const onFinish = async () => {
    await form?.validateFields();
    const data = form?.getFieldsValue();

    if (data) {
      let new_data_json = {
        id: idRegisterNewEmployee,
        name: data?.name,
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
        file_name_front_cccd: fileFrontCCCD?.name ,
        file_name_back_cccd: fileBackCCCD?.name ,
        mimetype_front_cccd: fileFrontCCCD?.type,
        mimetype_back_cccd: fileBackCCCD?.type,
        file_avatar: fileAvatar?.data,
        file_name_file_avatar: fileAvatar?.name,
        mimetype_file_avatar: fileAvatar?.type,
        weekly_report_is_mandatory: data?.weekly_report_is_mandatory,
        parent_id: data?.parent_id ? data?.parent_id.value : data?.parent_id,
        number_of_children: data?.number_of_children,
        employee_ids: value ? value : data?.employee_ids,
      };
      const final_data = {
        params: {
          args: [new_data_json],
        },
      };
      const length = localStorage.getItem('length');

      if (length && length == children) {
        const res = await registerNewEmployeeUpdate(final_data);
        setLoading(true);
        if (res) {
          if (res?.error?.code && res?.error?.code == 400) {
            $message.error(res?.error?.message);
            setLoading(false);
            return;
          }
          $message.success('Chỉnh sửa thành công');
          setForceUpdate && setForceUpdate(!forceUpdate);
          setFileAvatar([]);
          setFileBackCCCD([]);
          setFileFrontCCCD([]);
          setLoading(false);
          setOpen(false);
        } 
      }else {
        $message.error(
          'Vui lòng nhập số thân nhân  bằng với số nhân thân đã nhập'
        );
        return;
      }
    }
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

  const is_administrative = localStorage.getItem('is_administrative');
  const isAdministrative = is_administrative === 'true';
  return (
    <>
      <Drawer
        key={idRegisterNewEmployee}
        title={'Sửa đơn xin đổi thông tin'}
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
                <MyForm.Item
                  required
                  label="Ngày sinh"
                  type="time-picker"
                  name="date_of_birth"
                  innerprops={{
                    format: 'DD/MM/YYYY',
                  }}
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
                    min={0}
                  />
                </Form.Item>
              </Col>
              {isAdministrative && (
                <Col span={12}>
                  <Form.Item
                    name="employee_ids"
                    label="Hồ sơ"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn ít nhất một hồ sơ!',
                      },
                    ]}>
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      onChange={setValue}
                      placeholder="Chọn hồ sơ"
                      options={option}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </MyForm>
          <Col>
            <FamilyInfo
              open3={open}
              registerNewEmployee={registerNewEmployee}
              idRegisterNewEmployee={idRegisterNewEmployee}
            />
          </Col>
        </Spin>
      </Drawer>
    </>
  );
};

export default NewEmployeeRequestFormVer2;
