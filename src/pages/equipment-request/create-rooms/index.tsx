import { Button, Col, Drawer, FormInstance, Row, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import CreateRoom from '../components/create-rooms';
import { createEquipment } from '@/api/equipment_request/equipment_request.api';

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

  const [loading, setLoading] = useState(false);
  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    if (data) {
      console.log(data);
      
      setLoading(true);
      const res = await createEquipment({
        name: data.name,
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
  return (
    <Drawer
      title={'Danh sách văn phòng phẩm'}
      width={600}
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
      <MyForm<any>
        form={form}
        layout="vertical">
        <Row>
          <Col span={20}>
            <MyForm.Item
              label={'Tên văn phòng phẩm'}
              name="name"
              type="input"
              initialValue={''}
              required
              innerprops={{
                placeholder: 'Vui lòng nhập Tên văn phòng phẩm',
              }}
            />
          </Col>
          <Col span={4}>
            <Button key={2} onClick={onFinish} type="primary" loading={loading} style={{ margin: '30px 0px 0px 20px' }}>
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
