import { request } from "@/api/request";
import MyForm from "@/components/core/form";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, FormInstance, Row, Space, Spin, Upload, message as $message } from 'antd';
import { Dispatch, SetStateAction, useState } from "react";
interface IProps {
    importOpen: boolean;
    onClose: () => void;
    showDrawerImport: () => void;
    setForceUpdate?: Dispatch<SetStateAction<boolean>>;
    forceUpdate?: boolean;
    form?: FormInstance<any>;
}

const ImportForm = ({ importOpen, onClose, showDrawerImport, setForceUpdate, forceUpdate, form }: IProps) => {
    const [loading, setLoading] = useState(false);
    const [fileShift, setFileShift] = useState<any>();
    const onFinish = async () => {
        await form?.validateFields();
        const data = form?.getFieldsValue();
        try {
            const url = "import_shift_request"
            var formData = new FormData();
            formData.append("file", fileShift);
            if (!fileShift) {
                $message.error("Vui lòng chọn file");
                return;
            }
            setLoading(true);
            const res = await request("post", url, formData)
            if (res.success) {
                $message.success(`Import thành công`);
                setForceUpdate!(true);
                onClose!();
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
            'https://dl.dropboxusercontent.com/scl/fi/4hvvgj7r24sayc86160mp/IMPORT_DON_DOI_CA.xlsx?rlkey=txmujqvjrerclnyah2x0rrvs9&dl=0'
        )
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'Don-xin-doi-ca-Template.xlsx';
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
            setFileShift(file);
            onSuccess('ok');
        } else {
            onError('error');
        }
    };
    return (
        <>
            <Drawer
                title="Import đơn xin đổi ca"
                width={300}
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
                                <MyForm.Item name="file" label="File Upload" style={{ display: 'flex', justifyContent: "center", alignContent: "center" }}>
                                    <Space direction="vertical">
                                        <Upload customRequest={customRequest}>
                                            <Button style={{ width: 155 }} icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                    </Space>
                                </MyForm.Item>
                            </Col>
                            <Col span={24} style={{ display: 'flex', justifyContent: "center", alignContent: "center" }}>
                                <Space direction="vertical" >
                                    <span>Template File</span>
                                    <Button
                                        style={{ marginTop: 2 }}
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
    )

}

export default ImportForm;
