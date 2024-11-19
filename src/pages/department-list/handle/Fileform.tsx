import MyForm from "@/components/core/form";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, FormInstance, Row, Space, Spin, Upload } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { message as $message } from "antd";
import { request } from "@/api/request";
interface FileformProps {
    onClose?: () => void;
    showDrawerImport?: () => void;
    importOpen?: boolean;
    setForceUpdate?: Dispatch<SetStateAction<boolean>>;
    forceUpdate?: boolean;
    form?: FormInstance<any>;
}

const Fileform = ({
    onClose,
    showDrawerImport,
    importOpen,
    setForceUpdate,
    forceUpdate,
    form
}: FileformProps
) => {
    const [loading, setLoading] = useState(false);
    const [fileDepartment, setFileDepartment] = useState<any>();
    const onFinish = async () => {
        await form?.validateFields();
        const data = form?.getFieldsValue();
        try {
            let url = "import_department"
            var formData = new FormData();
            formData.append("file", fileDepartment);
            if (!fileDepartment) {
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
        fetch("https://dl.dropboxusercontent.com/scl/fi/4gno4k24plk4fvc7iomam/DS-ph-ng-ban.xlsx?rlkey=f1f7tme86581a8btirisove1q&dl=0")
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "Template-Import-Phòng-ban.xlsx";
                link.click();
            })
            .catch(console.error);
    }
    const customRequest = async ({ file, onSuccess, onError, onProgress }: any) => {
        if (file) {
            setFileDepartment(file);
            onSuccess("ok")
        }
        else {
            onError("error")
        }
    };
    return (
        <>
            <Drawer
                title="Import phòng ban"
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
                        <Row gutter={24}>

                            <Col span={24}>
                                <MyForm.Item
                                    name="file"
                                    label="File Upload"
                                >
                                    <Space direction='vertical'>
                                        <Upload
                                            customRequest={customRequest}
                                        >
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                    </Space>
                                </MyForm.Item>
                            </Col>
                            <Col span={24}>
                                <Space direction='vertical'>
                                    <span>Template File</span>
                                    <Button
                                        style={{ marginTop: 10 }}
                                        type="primary"
                                        onClick={handleDownload}
                                        icon={<DownloadOutlined />}
                                    >
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

export default Fileform
