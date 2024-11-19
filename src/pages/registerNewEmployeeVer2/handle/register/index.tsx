import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
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
import { useLocale } from '@/locales';
import MyForm from '@/components/core/form';
import moment from 'moment';
import { FormInstance } from 'antd';
import {
  registerNewEmployee,
} from '@/api/registerNewEmployee/register.api';
import { jobOptionsNoRight } from '@/const/options';
import { UploadOutlined } from '@ant-design/icons';
import FamilyInfo from './family-info';
interface Props {
  openRegister: boolean;
  handleCancel: () => void;
  form: FormInstance<any>;
  dataEmployee?: any;
  idEmployeeProfile?: any;
  setForceUpdate?: any;
  forceUpdate?: any;

  url4?: string;
  url5?: string;
  url6?: string;
}

const RegisterForm: FC<Props> = ({
  openRegister,
  form,
  handleCancel,
  setForceUpdate,
  forceUpdate,
  idEmployeeProfile,

  url4,
  url5,
  url6,
}) => {
  const { t } = useLocale();
  const [selectedCompanyId, setSelectedCompanyId] = useState<any>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  const [typePersonalId, setTypePersonalId] = useState<string | null>(null);

  const [fileFrontCCCD, setFileFrontCCCD] = useState<any>(null);
  const [fileBackCCCD, setFileBackCCCD] = useState<any>(null);
  const [fileAvatar, setFileAvatar] = useState<any>(null);
  const [parentLength, setParentLength] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const HandleSubmit = async () => {
    setLoading(true)
    await form?.validateFields();
    const data = form?.getFieldsValue();

    const length = localStorage.getItem('length2');

    if (length && inputValue === length) {
      if (data) {
        let new_data_json: any = {
          name: data?.name,
          company_id: data?.company_noright_id ? data?.company_noright_id : 1,
          department_id: data?.department_noright_id
            ? data?.department_noright_id
            : 1,
          job_id: data?.job_id ? data?.job_id : 1,
          start_work_date: data?.start_work_date
            ? moment(data?.start_work_date).format('YYYY-MM-DD')
            : '2024-01-01',
          date_of_birth: data?.date_of_birth
            ? moment(data?.date_of_birth).format('YYYY-MM-DD')
            : '2024-01-01',
          citizen_id: data?.citizen_id ? data?.citizen_id : '',
          verified_citizen_id_date: data?.verified_citizen_id_date1
            ? moment(data?.verified_citizen_id_date1).format('YYYY-MM-DD')
            : '2024-01-01',
          verified_citizen_id_by: data?.verified_citizen_id_by
            ? data?.verified_citizen_id_by
            : '',
          tax_number: data?.tax_number ? data?.tax_number : '',
          social_insurance_number: data?.social_insurance_number
            ? data?.social_insurance_number
            : '',
          original_address: data?.original_address
            ? data?.original_address
            : '',
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
          employee_ids: idEmployeeProfile,
        };
        if (url4 && (fileFrontCCCD?.length === 0 || fileFrontCCCD === null)) {
          new_data_json.file_cccd_url = url4;
        }
        if (url5 && (fileBackCCCD?.length === 0 || fileBackCCCD === null)) {
          new_data_json.file_cccd_back_url = url5;
        }
        if (url5 && (fileAvatar?.length === 0 || fileAvatar === null)) {
          new_data_json.file_avartar_url = url6;
        }
      
        const final_data = {
          data: {
            args: [new_data_json],
          },
        };
      
        const res = await registerNewEmployee(final_data);

        if (res) {
          if (res?.error?.code && res?.error?.code == 400) {
            $message.error(res?.error?.message);
            setLoading(false);
            return;
          }
          setLoading(false)
          setForceUpdate && setForceUpdate(!forceUpdate);
          form.resetFields();
          $message.success('Đăng ký tạo đơn thành công');
        
        }
        form.resetFields();
        setFileBackCCCD(null);
        setFileFrontCCCD(null);
        handleCancel();
      }
    } else {
      $message.error(
        'Số nhân thân hiển thị trong bảng không khớp với số đã nhập'
      );
      setLoading(false)
    }
  };
  useEffect(() => {
    jobOptionsNoRight(selectedDepartmentId).then(res => {
      setJob(res);
    });
  }, [selectedDepartmentId]);
  useEffect(() => {
    setFileBackCCCD(null);
    setFileFrontCCCD(null);
  }, [open]);

  
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
  return (
    <Modal
      confirmLoading={loading}
      open={openRegister}
      title="Đổi thông tin nhân viên"
      destroyOnClose
      onCancel={handleCancel}
      bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
      footer={
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            key={1}
            onClick={() => {
              handleCancel();
            }}
            type="primary">
            Hủy
          </Button>
          <Button
            key={2}
            onClick={() => {
              HandleSubmit();
            }}
            loading={loading}
            type="primary"
            htmlType="submit">
           Tạo Đơn
          </Button>
        </div>
      }>
      <MyForm form={form} onFinish={HandleSubmit}>
        <Row gutter={24}>
          <Col span={20}>
            <Form.Item name="name" label="Họ và Tên" required>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={20}>
            <MyForm.Item
              label="Giới tính"
              name="gender"
              type="select"
              innerprops={{
                placeholder: 'Vui lòng chọn',
                allowClear: true,
              }}
              options={[
                { value: 'male', label: 'Nam' },
                { value: 'female', label: 'Nữ' },
                { value: 'other', label: 'Khác' },
              ]}
              required
            />
          </Col>
          <Col span={20}>
            <MyForm.Item label="Ảnh chân dung" name="register_employee_url_ids">
              <Upload
                className="upload"
                maxCount={1}
                accept="image/*"
                customRequest={customRequestAvatar}>
                <Button style={{ width: '100%' }} icon={<UploadOutlined />}>
                  Upload
                </Button>
              </Upload>
              {url6 && (fileAvatar?.length === 0 || fileAvatar === null) && (
                <img
                  src={url6}
                  alt="Preview"
                  style={{
                    maxWidth: '50%',
                    marginTop: '10px',
                    maxHeight: '200px',
                  }}
                />
              )}
            </MyForm.Item>
          </Col>
          <Col span={20}>
            <MyForm.Item
              name="citizen_id"
              label="Số CMND"
              type="input"
              required
              innerprops={{
                placeholder: 'Nhập số CMND',
                allowClear: true,
              }}></MyForm.Item>
          </Col>
          <Col span={20}>
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
              {url4 && (fileFrontCCCD?.length === 0 || fileFrontCCCD === null) && (
                <img
                  src={url4}
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
          <Col span={20}>
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
              {url5 && (fileBackCCCD?.length === 0 || fileBackCCCD === null) && (
                <img
                  src={url5}
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
          <Col span={20}>
            <MyForm.Item
              name="verified_citizen_id_date1"
              label="Ngày cấp"
              type="date-picker"
              required
              innerprops={{
                placeholder: 'Nhập ngày cấp',
                allowClear: true,
                format: 'DD/MM/YYYY',
              }}>
                
              </MyForm.Item>
          </Col>

          {typePersonalId == '3' || typePersonalId == '2' ? (
            <Col span={20}>
              <MyForm.Item
                label="Nơi cấp CMND/CCCD"
                name="verified_citizen_id_by"
                type="input"
                // options={stateOptionsData}
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
          ) : (
            <Col span={20}>
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
          )}

          <Col span={20}>
            <MyForm.Item
              name="tax_number"
              label="Mã số thuế"
              type="input"
              innerprops={{
                placeholder: 'Nhập mã số thuế',
                allowClear: true,
              }}></MyForm.Item>
          </Col>
          <Col span={20}>
            <MyForm.Item
              name="social_insurance_number"
              label="Số BHXH"
              type="input"
              required
              innerprops={{
                placeholder: 'Nhập số BHXH',
                allowClear: true,
              }}></MyForm.Item>
          </Col>
          <Col span={20}>
            <MyForm.Item
              name="original_address"
              label="Địa chỉ thường trú"
              type="input"
              required
              innerprops={{
                placeholder: 'Nhập địa chỉ thường trú',
                allowClear: true,
              }}></MyForm.Item>
          </Col>
          <Col span={20}>
            <MyForm.Item
              name="current_address"
              label="Địa chỉ hiện tại"
              type="input"
              required
              innerprops={{
                placeholder: 'Nhập địa chỉ hiện tại',
                allowClear: true,
              }}></MyForm.Item>
          </Col>

          <Col span={20}>
            <MyForm.Item
              name="license_plate"
              label="Biển số xe"
              type="input"
              innerprops={{
                placeholder: 'Nhập biển số xe',
                allowClear: true,
              }}></MyForm.Item>
          </Col>
          <Col span={20}>
            <MyForm.Item
              name="vehicle_info"
              label="Thông tin xe"
              type="input"
              innerprops={{
                placeholder: 'Nhập thông tin xe',
                allowClear: true,
              }}></MyForm.Item>
          </Col>
          <Col span={20}>
            <MyForm.Item
              name="bidv_info"
              label="Thông tin BIDV"
              type="input"
              required
              innerprops={{
                placeholder: 'Nhập thông tin BIDV',
                allowClear: true,
              }}></MyForm.Item>
          </Col>
          <Col span={20}>
            <MyForm.Item
              name="start_work_date"
              label="Ngày vào làm"
              type="date-picker"
              required
              innerprops={{
                placeholder: 'Nhập ngày vào làm',
                allowClear: true,
                format: 'DD/MM/YYYY',
              }}></MyForm.Item>
          </Col>
          <Col span={20}>
            <MyForm.Item
              name="date_of_birth"
              label="Ngày sinh"
              type="date-picker"
              required
              innerprops={{
                placeholder: 'Nhập ngày vào làm',
                allowClear: true,
                format: 'DD/MM/YYYY',
              }}></MyForm.Item>
          </Col>
          <Col span={20}>
            <MyForm.Item
              name="number_of_children"
              label="Số nhân thân"
              required>
              <Input
                type="number"
                min={0}
                onChange={e => setInputValue(e.target.value)}
              />
            </MyForm.Item>
          </Col>
          <FamilyInfo open2={openRegister} />
        </Row>
      </MyForm>
    </Modal>
  );
};

export default RegisterForm;
