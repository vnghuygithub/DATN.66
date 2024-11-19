import { Button, Col, Drawer, FormInstance, Row, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import moment, { Moment } from "moment";
import { getInvalidTimeSheetById, putInvalidTimeSheetById } from '@/api/invalidTimesheet/invalidTimesheet.api';
import { reasonOptions } from '@/const/options';
import SelectReviewerForm from '@/pages/components/selects/SelectReviewerForm';

interface Props {
    onClose?: () => void;
    showDrawer?: () => void;
    open?: boolean;
    idExplaination?: any;
    setForceUpdate?: Dispatch<SetStateAction<boolean>>;
    forceUpdate?: boolean;
    form?: FormInstance<any>
    isView?: boolean;
}
const ExplainationForm = ({ onClose, showDrawer, open, idExplaination, setForceUpdate, forceUpdate, form, isView }: Props) => {
    const [loading, setLoading] = useState(false);
    const { t } = useLocale();
    const onFinish = async () => {
        await form?.validateFields();
        const data = await form?.getFieldsValue()
        if (data) {
            setLoading(true);
            const res = await putInvalidTimeSheetById(idExplaination, {
                "reason": data?.reason,
                "remarks": data?.remarks,
                "reviewer": data?.reviewer
            });
            if (res) {
                $message.success("Sửa giải trình thành công");
                setLoading(false);
                onClose?.();
                setForceUpdate?.(!forceUpdate);
            }
        }
    }
    const fetchExplainationById = async (id: number) => {
        if (!id) {
            return
        }
        try {
            setLoading(true);
            const res = await getInvalidTimeSheetById(idExplaination);
            if (res) {
                form?.setFieldsValue({
                    "reason": res?.reason,
                    "remarks": res?.remarks,
                    "reviewer": res?.reviewer
                })
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchExplainationById(idExplaination);
    }, [idExplaination, open])
    return (
        <>
            <Drawer
                key={idExplaination}
                title="Sửa giải trình"
                width={420}
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
                }
            >
                <Spin spinning={loading}>
                    <MyForm<any>
                        disabled={isView}
                        onFinish={onFinish}
                        form={form}
                        layout="vertical">
                        <Row gutter={24}>
                            <Col span={24}>
                                <SelectReviewerForm />
                            </Col>
                            <Col span={24}>
                                <MyForm.Item
                                    label="Lý do"
                                    name="reason"
                                    type="select"
                                    options={reasonOptions}
                                    required
                                />
                            </Col>
                            <Col span={24}>
                                <MyForm.Item
                                    label="Ghi Chú"
                                    name="remarks"
                                    type="input-textarea"
                                />
                            </Col>
                        </Row>
                    </MyForm>
                </Spin>
            </Drawer>
        </>
    )
}

export default ExplainationForm