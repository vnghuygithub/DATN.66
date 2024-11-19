
import { updateEquipment } from '@/api/equipment_request/equipment_request.api';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import { Button, Col, Drawer, FormInstance, Modal, Row, Spin, message as $message } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface Props {
    onCloseUpdate?: () => void;
    openEditForm?: boolean;
    showModal?: () => void;
    form?: FormInstance<any>;
    forceUpdate?: boolean;
    setForceUpdate?: Dispatch<SetStateAction<boolean>>;
    idEquipment: number;
    room: any
}
const UpdateForm = ({ onCloseUpdate, openEditForm, showModal, form, idEquipment, forceUpdate, setForceUpdate, room }: Props) => {
    const [loading, setLoading] = useState(false);
    const { t } = useLocale()
    const setRoomInfoById = (id: number) => {
        const data = room.find((item: any) => item.id === id)
        if (data) {
            form?.setFieldsValue({
                name: data.name,
            })
        }
    }
    const onFinish = async () => {
        await form?.validateFields();
      const data = await form?.getFieldsValue();
      
      if (data) {
        try {
          let name = data?.name
          setLoading(true);
          if (idEquipment) {
            const res = await updateEquipment({
              id: idEquipment,
              name: name,
            });
            if (res) {
              $message.success('Cập nhật thành công!');
              setForceUpdate && setForceUpdate(!forceUpdate);
              onCloseUpdate && onCloseUpdate();
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    }
    useEffect(() => {
        form?.resetFields()
        if (idEquipment) {
            setRoomInfoById(idEquipment)
        }
    }, [openEditForm, idEquipment])

    return (
        <>
            <Modal
                key={idEquipment}
                title={"Chỉnh sửa thông tin văn phòng phẩm"}
                width={500}
                onCancel={onCloseUpdate}
                confirmLoading={loading}
                // afterClose={onCloseUpdate}
                open={openEditForm}
                destroyOnClose
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button key={1} onClick={onCloseUpdate}>
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
                                    label="Tên văn phòng phẩm"
                                    name="name"
                                    type="input"
                                    required
                                    innerprops={{
                                        allowClear: true,
                                        placeholder: 'Nhập tên văn phòng phẩm'
                                    }}
                                />
                            </Col>
                        </Row>
                    </MyForm>
                </Spin>
            </Modal>
        </>
    )
}

export default UpdateForm