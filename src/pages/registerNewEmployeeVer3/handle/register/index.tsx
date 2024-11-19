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
  Space,
} from 'antd';
import { useLocale } from '@/locales';
import MyForm from '@/components/core/form';
import moment from 'moment';
import { FormInstance } from 'antd';
import { registerNewLetter } from '@/api/registerNewEmployee/registerLeave.api';
import { jobOptionsNoRight } from '@/const/options';
import { UploadOutlined } from '@ant-design/icons';
import FamilyInfo from './family-info';
import SelectEmployee from '@/pages/components/selects/selectEmployee';
import SelectEmployeeShiftRequest from '@/pages/components/selects/SelectEmployeeShiftRequest';
import TextArea from 'antd/lib/input/TextArea';
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
  const [fileAttachmentsList, setFileAttachmentsList] = useState<any[]>([]);
  const [fileAttachments, setFileAttachments] = useState<any>();
  const [fileUpLoad, setfileUpLoad] = useState<any>();
  const [idEmployee, setIdEmployee] = useState<any>();
  const [inputValue, setInputValue] = useState('');
  const HandleSubmit = async () => {
    setLoading(true);
    await form?.validateFields();
    const data = form?.getFieldsValue();

    if (data) {
      let new_data_json: any = {
        employee_id: data?.employee_id,
        name: data?.name,
        severance_day: data?.severance_day
          ? moment(data?.severance_day).format('YYYY-MM-DD')
          : '2024-01-01',
        date_of_birth: data?.date_of_birth
          ? moment(data?.date_of_birth).format('YYYY-MM-DD')
          : '2024-01-01',
        reason: data?.reason,
        hand_over_docs: [fileUpLoad],

      };

      const final_data = {
        params: {
          args: [new_data_json],
        },
      };

      const res = await registerNewLetter(final_data);
      console.log(res);
      if (res) {
        if (res?.error?.code && res?.error?.code == 400) {
          $message.error(res?.error?.message);
          setLoading(false);
          return;
        }
        setLoading(false);
        setForceUpdate && setForceUpdate(!forceUpdate);
        form.resetFields();
        $message.success('Đăng ký tạo đơn thành công');
      }
      form.resetFields();

      handleCancel();
    }
  };
  useEffect(() => {
    jobOptionsNoRight(selectedDepartmentId).then(res => {
      setJob(res);
    });
  }, [selectedDepartmentId]);
  const handleOnChangeEmployee = (value: any) => {
    setIdEmployee(value)
  }

  const customRequestBack = async ({ file, onSuccess, onError }: any) => {
    if (file) {
      await form?.validateFields();
      const data = form?.getFieldsValue();
      const reader = new FileReader();
      reader.onloadend = () => {
        setfileUpLoad({
          base64_data: reader.result,
          description: file.name,
          received_by: idEmployee,
          name: file.name,
          mimetype: file.type,
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
  const is_general_manager = localStorage.getItem('is_general_manager');
  return (
    <Modal
      confirmLoading={loading}
      open={openRegister}
      title="Đổi thông tin nghỉ việc"
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
            {
              is_administrative == "true" || is_general_manager == "true" ? (
                <SelectEmployeeShiftRequest onChange={handleOnChangeEmployee} />
              ) :
                (

                  <SelectEmployeeShiftRequest onChange={handleOnChangeEmployee} domain_search={[["id", "=", Number(localStorage.getItem("employee_id"))]]} />
                )
            }
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={20}>
            <MyForm.Item
              name="severance_day"
              label="Ngày nghỉ việc"
              type="date-picker"
              required
              innerprops={{
                placeholder: 'Nhập ngày vào làm',
                allowClear: true,
                format: 'DD/MM/YYYY',
              }}></MyForm.Item>
          </Col>

          <Col span={20}>
            <MyForm.Item name="reason" label="Lí do nghỉ việc" required>
              <TextArea />
            </MyForm.Item>
          </Col>
          <Col>
            {
              idEmployee && (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <MyForm.Item label="File đính kèm" required name="attachment_ids">
                    <Upload className="upload" customRequest={customRequestBack}>
                      <Button style={{ width: '100%' }} icon={<UploadOutlined />}>
                        Upload
                      </Button>
                    </Upload>
                  </MyForm.Item>
                </Space>
              )
            }
          </Col>
        </Row>
      </MyForm>
    </Modal>
  );
};

export default RegisterForm;
