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
  import {INSURANCE } from '@/api/constApi';
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
      const onFinish = async () => {
          await form?.validateFields();
          const data = form?.getFieldsValue();
          try {
              const url = INSURANCE.IMPORT
              var formData = new FormData();
              formData.append("file", fileContract);
              if (!fileContract) {
                  $message.error("Vui lòng chọn file");
                  return;
              }
              setLoading(true);
              const res = await request("post", url, formData)
              if (res.success) {
                  $message.success(`success`);
                  setForceUpdate!(true);
                  onClose!();
              }
            //   else if (!res.success && res.message) {
            //       $message.error(res.message);
            //       onClose!();
            //   }
            //   else if (res?.error?.code && res.error.code == 400) {
            //       $message.error(res.error.message);
            //       onClose!();
            //   }
          } catch (error) {
              $message.error('Import thất bại');
          } finally {
              setLoading(false);
  
          }
  
  
      }
    const handleDownload = () => {
      fetch(
        'https://dl.dropboxusercontent.com/scl/fi/mnjxxxl9h4cbph5yadlqw/B-o-c-o-chi-ti-t-BHXH-2.xlsx?rlkey=c61y5puhxuelrpzrvrio0cvwp&dl=0'
      )
        .then(response => response.blob())
        .then(blob => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'BHXH-template.xlsx';
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
          width={320}
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
          <Spin spinning={loading}>
            <MyForm<any> onFinish={onFinish} form={form} layout="vertical">
              <Row gutter={24}>
                <Col span={24}>
                  <MyForm.Item name="file" label="File Upload">
                    <Space direction="vertical">
                      <Upload customRequest={customRequest}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                      </Upload>
                    </Space>
                  </MyForm.Item>
                </Col>
                <Col span={24}>
                  <Space direction="vertical">
                    <span>Template File</span>
                    <Button
                      style={{ marginTop: 10 }}
                      type="primary"
                      onClick={handleDownload}
                      icon={<DownloadOutlined />}>
                      Tải xuống Template
                    </Button>
                  </Space>
                </Col>
              </Row>
            </MyForm>
          </Spin>
        </Drawer>
      </>
    );
  };
  
  export default FileForm;
  