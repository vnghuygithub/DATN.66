import {
  Button,
  Col,
  Drawer,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Upload,
} from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import { departmentOptions, jobOptions } from '@/const/options';
import { mobileResponsive } from '@/utils/mobileResponsive';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAllNoRight';
import { IJobListArgs } from '@/api/job/job.api';
import SelectGender from '@/pages/components/selects/SelectGender';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

import { registerLetterUpdate } from '@/api/registerNewEmployee/registerLeave.api';
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
  idEmployees: string;
  setOpen: any;
  setDataParent?: any;
  dataParent?: any;
  children?: any;
  setChildren?: any;
  dataContract?: any;
  downLoad?: any;
}
interface DepartmentOption {
  label: string;
  value: string;
}
const NewEmployeeRequestFormVer3 = ({
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
  idEmployees,
  downLoad,
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
  const [fileUpLoad, setFileUpLoad] = useState<any>(null);
  const [fileAttachmentsList, setFileAttachmentsList] = useState<any[]>([]);
  const [fileAttachments, setFileAttachments] = useState<any>();

  const option =
    dataContract &&
    dataContract
      .filter((item: any) => item?.mis_id !== false)
      .map((item: any) => ({
        label: registerNewEmployee?.name + '-' + item?.mis_id,
        value: item.id,
      }));

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
    setLoading(true);

    await form?.validateFields();
    const data = form?.getFieldsValue();
    console.log(data);
    if (data) {
      let new_data_json = {
        id: idRegisterNewEmployee,
        employee_id: idEmployees,
        severance_day: data?.severance_day
          ? moment(data?.severance_day).format('YYYY-MM-DD')
          : '2024-01-01',
        reason: data?.reason,
        hand_over_docs: [fileUpLoad],
        // hand_over_docs:  data?.hand_over_docs,
      };

      // const final_data = {
      //   data: {
      //     args: [new_data_json],
      //   },
      // };

      const res = await registerLetterUpdate(new_data_json);
      console.log(res);
      if (res) {
        if (res?.error?.code && res?.error?.code == 400) {
          $message.error(res?.error?.message);
          setLoading(false);
          return;
        }
        setLoading(false);
        setForceUpdate && setForceUpdate(!forceUpdate);
        $message.success('Chỉnh sửa thành công');      
        setFileUpLoad(null);
        setOpen(false);
      }
    }
  };
  const handleDownloadFile = (url: string, name: string) => {
    console.log('download detail is', url, name);
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.click();
      })
      .catch(console.error);
  };

  const customRequestBack = async ({ file, onSuccess, onError }: any) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileUpLoad({
          base64_data: reader.result,
          description: file.name,
          received_by: idEmployees,
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

  return (
    <>
      <Drawer
        key={idRegisterNewEmployee}
        title={'Sửa đơn xin nghỉ việc'}
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
                <MyForm.Item
                  required
                  label="Ngày nghỉ việc"
                  type="date-picker"
                  name="severance_day"
                  innerprops={{
                    format: 'DD/MM/YYYY',
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Lý do nghỉ việc"
                  name="reason"
                  type="input-textarea"
                  required
                />
              </Col>
            </Row>
            <div>
              <h2>Tài liệu bàn giao</h2>
              <Col>
                <Space direction="vertical" style={{ width: '48%' }}>
                  <MyForm.Item
                    label="File đính kèm"
                    
                    name="hand_over_docs_ids">
                    <Upload
                      className="upload"
                      customRequest={customRequestBack}>
                      <Button
                        style={{ width: '100%' }}
                        icon={<UploadOutlined />}>
                        Upload
                      </Button>
                    </Upload>
                  </MyForm.Item>
                </Space>
              </Col>
            </div>
            <span>Download file tài liệu</span>
            {downLoad.map((item: any) => (
              <Col xs={24} sm={24} md={12} lg={8}>
                <Space direction="vertical" style={{ width: '100%' ,marginTop:'10px'}}>
                  <Button
                    style={{ width: '100%' }}
                    type="primary"
                    onClick={() => handleDownloadFile(item.name, item.url)}
                    icon={<DownloadOutlined />}>
                  {item.name}
                  </Button>
                </Space>
              </Col>
            ))}
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default NewEmployeeRequestFormVer3;
