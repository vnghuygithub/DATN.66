import {
  Button,
  Col,
  Drawer,
  FormInstance,
  Row,
  Space,
  Spin,
  Upload,
} from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import BaseInfo from './components/base-info';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
//import Tabs from './components/tabs';
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
import { createNewDocument, updateDocument } from '@/api/export/export.api';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { log } from 'console';

interface Props {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idEmployee?: string;
  setFoceUpdate?: Dispatch<SetStateAction<boolean>>;
  foceUpdate?: boolean;
  form?: FormInstance<any>;
  isView: boolean;
  isCreating: boolean;
   downLoad?: any;
  // setOpen: any;
}
const FormDocument: FC<Props> = ({
  onClose,
  open,
  idEmployee,
  foceUpdate,
  setFoceUpdate,
  isCreating,
  isView,
  form,
   downLoad,
  // setOpen,
}) => {
  console.log('hhhhhhhhhhhh', isCreating);

  const { isMobile } = mobileResponsive();
  const { t } = useLocale();
  const [disableDepartment, setDisableDepartment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const [file, setFile] = useState<any>(null);
  const customRequest = async ({ file, onSuccess, onError }: any) => {
    console.log(file, 'FILEEEEEEE');

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result;

        let base64Data: string | null = null;

        if (typeof result === 'string') {
          // Nếu result là string, ta có thể gọi split
          base64Data = result.split('base64,')[1] || null;
        } else if (result instanceof ArrayBuffer) {
          // Nếu result là ArrayBuffer, cần chuyển đổi sang string trước
          const decoder = new TextDecoder();
          const dataString = decoder.decode(result);
          base64Data = dataString.split('base64,')[1] || null;
        }
        setFile({
          data: base64Data,
        });

        // Gọi hàm onSuccess với reader.result
        onSuccess(reader.result);
      };

      reader.onerror = onError;
      reader.readAsDataURL(file);
    } else {
      onError('No file selected');
    }
  };

  let company_id = Number(localStorage.getItem('company_id'));
  const onFinish = async () => {
    await form?.validateFields();
    const result: { [key: string]: number | string | boolean | object | null } =
      {};
    const data = await form?.getFieldsValue();

    if (Array.isArray(data?.sub_admin_role)) {
      data['sub_admin_role'] = data?.sub_admin_role[0];
    }
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] === null || data[key] === undefined) {
          result[key] = false;
        } else if (typeof data[key] !== 'object') {
          if (data[key] === '') {
            result[key] = '';
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

    if (data.from_date && data.from_date > data.to_date) {
      $message.error('Ngày kết thúc phải lớn hơn ngày bắt đầu!'); 
      return;
    }

    if (!data.from_date) {
      $message.error('Vui lòng chọn từ ngày');
      return;
    }
    if (!data.to_date) {
      $message.error('Vui lòng chọn đến ngày');
      return;
    }

    const currentDate = new Date(); // Get the current date

if (new Date(data.from_date) > currentDate) {
  $message.error('Từ ngày không được lớn hơn ngày hiện tại');
  return;
}

if (new Date(data.to_date) > currentDate) {
  $message.error('Đến ngày không được lớn hơn ngày hiện tại');
  return;
} 
    if (!data.url) {
      $message.error('Vui lòng tải file');
      return;
    }
    console.log(isCreating, 'WWWWWWWWWWWW');
    if (isCreating) {
      setLoading(true);
      try {
        if (data) {
          console.log('data la', data);

          setLoading(false);
          const res = await createNewDocument({
            id: data.id,
            name: data.name,
            from_date: data.from_date,
            to_date: data.to_date,
            url: data.url,
            company_id:
              localStorage.getItem('is_administrative') === 'true'
                ? data.company_id
                : company_id,
            file: file,
          });
          console.log('res add file', res);
          $message.success('Thành công!');
          isCreating = false;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        onClose && onClose();
        setFoceUpdate && setFoceUpdate(!foceUpdate);
        return;
      }
    } else {
      if (data) {
        console.log(data, 'AAAAAAAAAAAAAAA');

        try {
          const res = await updateDocument({
            id: idEmployee,
            name: data.name,
            from_date: data.from_date,
            to_date: data.to_date,
            url: data.url,
            company_id:
              localStorage.getItem('is_administrative') === 'true'
                ? data.company_id
                : company_id,
            file: file,
            ...data,
          });
          if (res) {
            console.log(' file2222222222222', res);
            $message.success('Cập nhật thành công');
            onClose && onClose();
          setFoceUpdate && setFoceUpdate(!foceUpdate);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
          onClose && onClose();
          setFoceUpdate && setFoceUpdate(!foceUpdate);
        }
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
  useEffect(() => {
    if (!isCreating) {
      setIsDisable(true);  // Disable the button when isCreating is false
    } else {
      setIsDisable(false); // Enable the button when isCreating is true
    }
  }, [isCreating]);
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
          !isView && (
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
            disabled={isView}
            onFinish={onFinish}
            form={form}
            layout="vertical">
            <BaseInfo
              disableDepartment={disableDepartment}
              isCreatingEmployee={isCreating}
              idEmployee={idEmployee}
              form={form}
            />
            <Col span={20}>
              <MyForm.Item required label="Upload File" name="url">
                <Upload
                  className="upload"
                  maxCount={1}
                 
                  accept=".xls,.xlsx"
                  customRequest={customRequest}>
                  <Button  disabled={isDisable} style={{ width: '100%' }} icon={<UploadOutlined />}>
                    Upload
                  </Button>
                </Upload>
               
              </MyForm.Item>
            </Col>
            {/* <span>Download file tài liệu</span>
            {downLoad && downLoad.map((item: any) => (
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
            ))} */}
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default FormDocument;
function showDrawer() {
  throw new Error('Function not implemented.');
}
