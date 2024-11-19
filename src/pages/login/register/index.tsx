import { FC, useEffect, useState } from 'react';
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
  registerNewEmployeeParent,
} from '@/api/registerNewEmployee/register.api';
import {
  jobOptionsNoRight,
  workLocationOptionsNoRight,
} from '@/const/options';
import { UploadOutlined } from '@ant-design/icons';
import FamilyInfo from './family-info';
interface Props {
  onClose?: () => void;
  open?: boolean;
  form?: FormInstance<any>;
  handleCancel: () => void;
  // handleRegister?: () => void;
}

const RegisterForm: FC<Props> = ({
  onClose,
  open,
  // form,
  handleCancel,
  // handleRegister,
}) => {
  const { t } = useLocale()
  const [form] = Form.useForm();
  const [selectedCompanyId, setSelectedCompanyId] = useState<any>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [workLocation, setWorkLocation] = useState<any>(null);
  const [stateOptionsData, setStateOptionsData] = useState<any[]>([
    {
      value: 'Cục Cảnh Sát Quản Lý Hành Chính Về Trật Tự Xã Hội',
      label: 'Cục Cảnh Sát Quản Lý Hành Chính Về Trật Tự Xã Hội',
    },
    {
      value: 'Cục Cảnh Sát ĐKQL Cư Trú và DLQG Về Dân Cư',
      label: 'Cục Cảnh Sát ĐKQL Cư Trú và DLQG Về Dân Cư',
    },
    // { value: '', label: '' },
  ]);
  const [typePersonalId, setTypePersonalId] = useState<string | null>(null);

  const [fileFrontCCCD, setFileFrontCCCD] = useState<any>(null);
  const [fileBackCCCD, setFileBackCCCD] = useState<any>(null);
  const [fileAvatar, setFileAvatar] = useState<any>(null);
  const [employeeFamilyInfo, setEmployeeFamilyInfo] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    workLocationOptionsNoRight().then(res => {
      setWorkLocation(res);
    });
  }, []);
  const HandleSubmit = async () => {
    await form?.validateFields();
    const data = form?.getFieldsValue();
    if (+inputValue === employeeFamilyInfo.length) {
      if (data) {
        let new_data_json = {
          name: data?.name,
          company_id: data?.company_noright_id
            ? data?.company_noright_id
            : null,
          // department_id: data?.department_noright_id
          //   ? data?.department_noright_id
          //   : 1,
          // job_id: data?.job_id ? data?.job_id : 1,
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
          work_location: data?.work_location,
        };
        const final_data = {
          data: {
            args: [new_data_json],
          },
        };
        setLoading(true);
        const res = await registerNewEmployee(final_data);

        if (res) {
          if (res?.error?.code && res?.error?.code == 400) {
            $message.error(res?.error?.message);
            setLoading(false);
            return;
          }
          const data = {
            params: {
              id: res?.result?.id,
              relatives: employeeFamilyInfo,
            },
          };

          const response = await registerNewEmployeeParent(data);
          if (response) {
            if (res?.error?.code && res?.error?.code == 400) {
              $message.error(res?.error?.message);
              setLoading(false);
              return;
            }
            $message.success('Đăng ký thành công');
            setLoading(false);
          }
        }
        form.resetFields();
        setFileBackCCCD(null);
        setFileFrontCCCD(null);
        handleCancel();
        setLoading(false);
      }
    } else {
      $message.error(
        'Số nhân thân hiển thị trong bảng không khớp với số đã nhập'
      );
      setLoading(false);
    }
  };

  const onChangeSelectedCompany = (value: any) => {
    setSelectedCompanyId(value);
    form.setFieldValue('department_noright_id', null);
    form.setFieldValue('job_id', null);
  };

  const onChangeSelectedDepartment = (value: any) => {
    setSelectedDepartmentId(value);
    form.setFieldValue('job_id', null);
  };

  const updateTypePersonalId = (value: string) => {
    setTypePersonalId(value);
    form.setFieldValue('verified_citizen_id_by', '');
  };

  useEffect(() => {
    jobOptionsNoRight(selectedDepartmentId).then(res => {
      setJob(res);
    });

    // setJob(res);
    // });
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
      open={open}
      title="Đăng ký tài khoản"
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
              console.log('xx');
              HandleSubmit();
            }}
            loading={loading}
            type="primary"
            htmlType="submit">
            Đăng ký
          </Button>
        </div>
      }>
      <MyForm form={form} onFinish={HandleSubmit}>
        <Row gutter={24}>
          <Col span={20}>
            <MyForm.Item
              name="name"
              label="Họ và Tên"
              type="input"
              required
              innerprops={{
                placeholder: 'Nhập Tên',
                allowClear: true,
              }}></MyForm.Item>
          </Col>
          <Col span={20}>
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

          {/* <Col span={20}>

            <SelectDepartmentNoRight disabled={!selectedCompanyId} selectedCompanyId={selectedCompanyId} onChange={onChangeSelectedDepartment} />
          </Col> */}
        </Row>
        <Row gutter={24}>
          {/* <Col span={20}>
            <MyForm.Item
              label={'Chức vụ'}
              name="job_id"
              type="select"
              options={job}
              required
              innerprops={{
                disabled: !selectedDepartmentId,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
              }}
            />
          </Col> */}
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
            <MyForm.Item
              name="file_avatar"
              label="Ảnh chân dung&nbsp;&nbsp;&nbsp;&nbsp;">
              <Upload
                className="upload"
                maxCount={1}
                accept="image/*"
                customRequest={customRequestAvatar}>
                <Button style={{ width: '100%' }} icon={<UploadOutlined />}>
                  Upload
                </Button>
              </Upload>
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
            <MyForm.Item required label="CCCD mặt trước" name="file_front_cccd">
              <Upload
                className="upload"
                maxCount={1}
                accept="image/*"
                customRequest={customRequestFront}>
                <Button style={{ width: '100%' }} icon={<UploadOutlined />}>
                  Upload
                </Button>
              </Upload>
            </MyForm.Item>
          </Col>
          <Col span={20}>
            <MyForm.Item
              required
              label="CCCD mặt sau&nbsp;&nbsp;"
              name="file_back_cccd">
              <Upload
                className="upload"
                accept="image/*"
                maxCount={1}
                customRequest={customRequestBack}>
                <Button style={{ width: '100%' }} icon={<UploadOutlined />}>
                  Upload
                </Button>
              </Upload>
            </MyForm.Item>
          </Col>
          <Col span={20}>
            <MyForm.Item
              name="verified_citizen_id_date"
              label="Ngày cấp"
              type="date-picker"
              required
              innerprops={{
                placeholder: 'Nhập ngày cấp',
                allowClear: true,
                format: 'DD/MM/YYYY',
              }}></MyForm.Item>
          </Col>
          {/* <Col span={20}>
            <MyForm.Item
              label="Loại"
              type="radio"
              required
              options={[
                { value: '1', label: 'CCCD/CMND' },
                { value: '2', label: 'CMT' },
                { value: '3', label: 'Khác' },
                { value: '', label: '' },
              ]}
              innerprops={{
                onChange: (e: any) => {
                  updateTypePersonalId(e.target.value);
                },
              }}

            />
     
          </Col> */}
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
          <FamilyInfo
            setEmployeeFamilyInfo={setEmployeeFamilyInfo}
            employeeFamilyInfo={employeeFamilyInfo}
          />
        </Row>
      </MyForm>
    </Modal>
  );
};

export default RegisterForm;
