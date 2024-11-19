import TextEditor from "@/components/basic/textEditor"
import TextEditorV2 from "@/components/basic/textEditorV2";
import MyForm from "@/components/core/form"
import { Col, Row } from "antd"

const BookReview = ({form,value,isView}: any) => {
    const handleReviewContentChange = (e: any) => {
        console.log("review_content",e)
        form && form.setFieldsValue({ review_content: e });
    };
    return (
        <>
            <Row gutter={24}>
                <Col span={24}>
                    <MyForm.Item
                        label="Tiêu đề"
                        name="book_name"
                        type="input"
                        innerprops={{
                            allowClear: true,
                            placeholder: 'Vui lòng nhập tiêu đề',
                        }}
                    />
                    <MyForm.Item
                        label="Nội dung review"
                        name="review_content"
                    >
                        <TextEditorV2 value={value} onChange={handleReviewContentChange} isView={isView}/>
                    </MyForm.Item>

                </Col >
            </Row>
        </>

    )
}

export default BookReview
