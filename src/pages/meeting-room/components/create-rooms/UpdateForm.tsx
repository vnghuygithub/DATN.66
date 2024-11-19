
import { createEmployeeRelative, updateEmployeeRelative } from '@/api/employee/relative.api';
import { updateMeetingRoom } from '@/api/meeting_rooms/bookingrooms.api';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import { Button, Col, Drawer, FormInstance, Modal, Row, Spin, message as $message } from 'antd';
import moment from 'moment';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface Props {
    onCloseUpdate?: () => void;
    openEditForm?: boolean;
    showModal?: () => void;
    form?: FormInstance<any>;
    forceUpdate?: boolean;
    setForceUpdate?: Dispatch<SetStateAction<boolean>>;
    idRoom: number;
    room: any
}
const UpdateForm = ({ onCloseUpdate, openEditForm, showModal, form, idRoom, forceUpdate, setForceUpdate, room }: Props) => {
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
          if (idRoom) {
            const res = await updateMeetingRoom({
              id: idRoom,
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
        if (idRoom) {
            setRoomInfoById(idRoom)
        }
    }, [openEditForm, idRoom])

    return (
        <>
            <Modal
                key={idRoom}
                title={"Chỉnh sửa thông tin phòng họp"}
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
                                    label="Tên phòng họp"
                                    name="name"
                                    type="input"
                                    required
                                    innerprops={{
                                        allowClear: true,
                                        placeholder: 'Nhập tên phòng họp'
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