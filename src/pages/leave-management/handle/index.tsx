import { Button, Col, Drawer, FormInstance, Row, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import moment, { Moment } from "moment";
import { getLeaveById, updateEmployeeLeave } from '@/api/employee/leave.api';


interface IProps {
    onClose?: () => void;
    showDrawer?: () => void;
    open?: boolean;
    idLeave?: any;
    setForceUpdate?: Dispatch<SetStateAction<boolean>>;
    forceUpdate?: boolean;
    form?: FormInstance<any>;
}

const FormLeave: FC<IProps> = ({ onClose, showDrawer, open, idLeave, setForceUpdate, forceUpdate, form }) => {
    const { t } = useLocale();
    const [loading, setLoading] = useState(false);
    const onFinish = async () => {
        await form?.validateFields();
        const data = await form?.getFieldsValue()
        if (data) {
            setLoading(true);
            try {
                if (idLeave) {
                    const res = await updateEmployeeLeave(idLeave, {
                        params: {
                            data: {
                                note: data.note
                            }
                        }
                    });
                    if (res) {
                        $message.success('Cập nhật ghi chú thành công');
                    }
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
                onClose && onClose();
                setForceUpdate && setForceUpdate(!forceUpdate);
            }
        }
    }

    const fetchLeaveById = async (id: number) => {
        if (!id) {
            return
        }
        try {

            setLoading(true);
            const res = await getLeaveById(idLeave);
            if (res) {
                form?.setFieldsValue({
                    note: res.note ?? ''
                })
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchLeaveById(idLeave);
    }, [idLeave, forceUpdate])

    return (
        <>
            <Drawer
                key={idLeave}
                title="Ghi chú"
                width={320}
                onClose={onClose}
                open={open}
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
                            <Col span={20}>
                                <MyForm.Item
                                    label="Ghi chú"
                                    name="note"
                                    type="input"
                                    innerprops={{
                                        placeholder: t(
                                            { id: 'placeholder_input' },
                                            { msg: 'Ghi chú' }
                                        ),
                                    }}
                                />
                            </Col>
                        </Row>
                    </MyForm>
                </Spin>
            </Drawer >
        </>
    )
}

export default FormLeave;


