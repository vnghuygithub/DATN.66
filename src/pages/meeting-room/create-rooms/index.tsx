import { Button, Col, Drawer, FormInstance, Row, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import { mobileResponsive } from '@/utils/mobileResponsive';
import { createRoom } from '@/api/meeting_rooms/bookingrooms.api';
import CreateRoom from '../components/create-rooms';

interface Props {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idBookingRoom?: number;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  isViewMode?: boolean;
}

const FormCreateRooms: FC<Props> = ({
  onClose,
  open,
  setForceUpdate,
  forceUpdate,
  form,
}) => {
  const { isMobile } = mobileResponsive();
  const [loading, setLoading] = useState(false);
  let company_id = Number(localStorage.getItem('company_id'));
  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    console.log("data", data);
    console.log("company_id", company_id);

    if (data) {
      setLoading(true);
      const res = await createRoom({
        name: data.name,
        company_id: company_id
      });
      if (res) {
        console.log(res);
        $message.success('Tạo mới thành công!');
        form?.resetFields();
        setForceUpdate && setForceUpdate(!forceUpdate);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };
  // const fetchBookingRoomById = async (id?: number) => {
  //   if (!id) {
  //     return;
  //   }
  //   try {
  //     setLoading(true);
  //     const res = await getBookingRoomById(id);
  //     if (res) {
  //       console.log(res);

  //       form &&
  //         form.setFieldsValue({
  //           key: res.id,
  //           employee: {
  //             value: res.employee?.id ?? '',
  //             label: res.employee?.name ?? '',
  //           },
  //           room: {
  //             value: res.room?.id ?? '',
  //             label: res.room?.name ?? '',
  //           },
  //           purpose: res.purpose,
  //           state: res.state,
  //         });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   if (idBookingRoom !== undefined) {
  //     console.log('idBookingRoom', idBookingRoom);
  //     fetchBookingRoomById(idBookingRoom);
  //   }
  //   form?.resetFields();
  // }, [idBookingRoom]);
  return (
    <Drawer
      title={'Tạo phòng họp'}
      width={isMobile ? '100%' : '600'}
      onClose={onClose}
      open={open}
      destroyOnClose
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Button key={1} onClick={onClose}>
            Thoát
          </Button>
        </div>
      }>
      <MyForm<any> form={form} layout="vertical">
        <Row>
          <Col span={20}>
            <MyForm.Item
              label={'Tên phòng họp'}
              name="name"
              type="input"
              initialValue={''}
              required
              innerprops={{
                placeholder: 'Vui lòng nhập Tên phòng họp',
              }}
            />
          </Col>
          <Col span={4}>
            <Button
              key={2}
              onClick={onFinish}
              type="primary"
              loading={loading}
              style={{ margin: '30px 0px 0px 20px' }}>
              Thêm
            </Button>
          </Col>
        </Row>
      </MyForm>
      <Spin spinning={loading}>
        <MyForm<any> onFinish={onFinish} form={form} layout="vertical">
          <CreateRoom></CreateRoom>
        </MyForm>
      </Spin>
    </Drawer>
  );
};

export default FormCreateRooms;
