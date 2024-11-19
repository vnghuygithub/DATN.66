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
import MyForm from '@/components/core/form';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { type } from 'os';
import { DOMAIN_IMPORT_CONTRACT_API } from '@/api/constApi';
import { request } from '@/api/request';

interface Props {
  onClose?: () => void;
  showDrawerImport?: () => void;
  importOpen?: boolean;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
}
const FileForm: FC<Props> = ({
  onClose,
  showDrawerImport,
  importOpen,
  setForceUpdate,
  forceUpdate,
  form,
}) => {
  const [loading, setLoading] = useState(false);
  const [fileContract, setFileContract] = useState<any>();
  const [error, setError] = useState<any>([]);
  const onFinish = async () => {
    await form?.validateFields();
    const data = form?.getFieldsValue();
    setError([]);
    try {
      const url = DOMAIN_IMPORT_CONTRACT_API.IMPORT
      var formData = new FormData();
      formData.append("file", fileContract);
      if (!fileContract) {
        $message.error("Vui lòng chọn file");
        return;
      }
      setLoading(true);
      const res = await request("post", url, formData)
      if (res.success) {
        if (res.error.length == 0) {
          $message.success('Import thành công');
        }
        else {
          setError(res.error);
          $message.success(`Import thành công và có ${res.error.length} dòng lỗi vui lòng kiểm tra lại file excel`);
        }
        setForceUpdate!(true);
        // onClose!();
      }
      else if (!res.success && res.message) {
        $message.error(res.message);
        onClose!();
      }
      else if (res?.error?.code && res.error.code == 400) {
        $message.error(res.error.message);
        onClose!();
      }
    } catch (error) {
      $message.error('Import thất bại');
    } finally {
      setLoading(false);

    }


  }
  const handleDownload = () => {
    fetch(
      'https://dl.dropboxusercontent.com/scl/fi/o63qyj8fbwzso749vie3f/Master-File-MMN.xlsx?rlkey=t69zlcn4f2pyj81ybbeplt9yj&dl=0'
    )
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Master-File-Template.xlsx';
        link.click();
      })
      .catch(console.error);
  };
  const customRequest = async ({
    file,
    onSuccess,
    onError,
    onProgress,
  }: any) => {
    if (file) {
      setFileContract(file);
      onSuccess('ok');
    } else {
      onError('error');
    }
  };
  return (
    <>
      <Drawer
        title="Import hợp đồng và nhân viên"
        width={500}

        onClose={onClose}
        open={importOpen}
        destroyOnClose
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Button key={1} onClick={onClose}>
              Hủy
            </Button>
            <Button key={2} onClick={onFinish} type="primary" loading={loading}>
              Lưu
            </Button>
          </div>
        }>
        <Spin spinning={loading} >
          <MyForm<any> onFinish={onFinish} form={form} layout="vertical" style={{ display: "flex", alignContent: "center", justifyContent: "center", marginLeft: 80 }}>
            <Row gutter={24}>
              <Col span={24}>
                <MyForm.Item name="file" label="File Upload">
                  <Space direction="vertical">
                    <Upload customRequest={customRequest}>
                      <Button icon={<UploadOutlined /> } style={{width: 300}}>Click to Upload</Button>
                    </Upload>
                  </Space>
                </MyForm.Item>
              </Col>
              <Col span={24}>
                <Space direction="vertical">
                  <span>Template File</span>
                  <Button
                    style={{ marginTop: 10, width: 300}}
                    type="primary"
                    onClick={handleDownload}
                    icon={<DownloadOutlined />}>
                    Tải xuống Template
                  </Button>
                </Space>
              </Col>
              {
                error.length > 0 && (
                  <Col span={24} style={{ marginTop: 15 }}>
                    <Space direction="vertical">
                      <span style={{ color: 'red' }}>Dòng lỗi</span>
                      <ol>
                        {
                          error.map((item: any, index: number) => (
                            <li key={index} style={{marginTop: 10, marginRight: 10}}>{item.message}</li>
                          ))
                        }
                      </ol>
                    </Space>
                  </Col>
                )
              }
            </Row>
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default FileForm;
