import TextEditor from "@/components/basic/textEditor"
import MyForm from "@/components/core/form"
import { Col, Row } from "antd"

const WorkContent = ({ form,value, isView }: any) => {
    const handleReportContentChange = (e: any) => {
        console.log("report_content",e)
        form && form.setFieldsValue({ report_content: e });
    };
    return (
        <>
            <Row gutter={24}>
                <Col span={24}>
                    <h4>Tóm tắt nội dung công việc</h4>
                    <MyForm.Item
                        label="Mô tả"
                        required
                        name="report_content"
                    >
                        <TextEditor value={value} onChange={handleReportContentChange} isView={isView} />
                    </MyForm.Item>
                </Col >
            </Row>
        </>

    )
}

export default WorkContent
