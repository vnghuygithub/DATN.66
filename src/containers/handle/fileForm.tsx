import { Button, Col, Drawer, FormInstance, Row, Spin, Upload } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { type } from 'os';
import { DOMAIN_IMPORT_ATTENDANCE_TRANS_API} from '@/api/constApi';
import { request } from '@/api/request';
import { useForm } from 'antd/lib/form/Form';


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
    form
}) => {
    const [loading, setLoading] = useState(false);
    // const [form] = Form.useForm();
    const [fileContract, setFileContract] = useState<any>();
    const onFinish = async () => {
        await form?.validateFields();
        const data = form?.getFieldsValue();
        console.log(data)
        try {
            const url = DOMAIN_IMPORT_ATTENDANCE_TRANS_API.IMPORT
            var formData = new FormData();
            formData.append("file", fileContract);
            if (!fileContract) {
                $message.error("Vui lòng chọn file");
                return;
            }
            setLoading(true);
            const res = await request("post", url, formData)
            if (res) 
            {
                $message.success(`Import thành công`);
                // $message.success(`Import thành công và có ${res.duplicate.length} mã nhân viên bị trùng là ${res.duplicate.join(",")}`);
                setForceUpdate!(true);
                onClose!();
            }
        } catch (error) {
            $message.error('Import thất bại');
        } finally {
            setLoading(false);

        }


    }
    const handleDownload = () => {
        fetch("https://dl.dropboxusercontent.com/scl/fi/i6q01ggrsq83ghi4vuzmr/DLCC-1-20.9-all-2.xlsx?rlkey=iviubds67xbb3ccjbktuxxmi1&dl=0")
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "Template dữ liệu chấm công.xlsx";
                link.click();
            })
            .catch(console.error);
    }
    const customRequest = async ({ file, onSuccess, onError, onProgress }: any) => {
        if (file) {
            setFileContract(file);
            onSuccess("ok")
        }
        else {
            onError("error")
        }
    };
    return (
        <>
            <Drawer
                title="Import dữ liệu chấm công"
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
                        <Button
                            key={2}
                            onClick={onFinish}
                            type="primary"
                            loading={loading}>
                            Lưu
                        </Button>
                    </div>
                }
            >
                <Spin spinning={loading}>
                    <MyForm<any>
                        onFinish={onFinish}
                        form={form}
                        layout="vertical">
                        <MyForm.Item
                            name="file"
                            label="Chọn File"
                        >
                            <Upload
                                customRequest={customRequest} 
                                accept=".xlsx"
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>

                            <MyForm.Item
                            name="file"
                            label="Template Mẫu"
                            style ={{marginTop: 15}}
                            
                        >
                            <div style={{ display: 'flex' , justifyContent: 'center'}}>
                            <Button
                                
                                                            
                                style={{ marginTop: 10 }}
                                type="primary"
                                onClick={handleDownload}
                                icon={<DownloadOutlined />}
                                >
                                Tải xuống Template

                                </Button>
                            </div>
                               
                        </MyForm.Item>
                            

                       

                        </MyForm.Item>
                    </MyForm>
                </Spin>

            </Drawer>
        </>
    )
}

export default FileForm;

