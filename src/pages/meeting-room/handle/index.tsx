import { Button, Drawer, FormInstance, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import Detail from '../components/detail';
import { mobileResponsive } from '@/utils/mobileResponsive';

import moment from 'moment';
import {
  createMeetingRoomsByArgs,
  getBookingRoomById,
  updateBookingRoom,
} from '@/api/meeting_rooms/bookingrooms.api';

interface Props {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idBookingRoom?: number;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  isViewMode?: boolean;
  isCreating?: boolean;
}

const FormBookingRooms: FC<Props> = ({
  onClose,
  open,
  idBookingRoom,
  setForceUpdate,
  forceUpdate,
  form,
  isViewMode,
  isCreating,
}) => {
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const { isMobile } = mobileResponsive();
  useEffect(() => {
    if (isCreating) {
      setIsCreatingForm(true);
    } else {
      setIsCreatingForm(false);
    }
  }, [isCreating]);

  function set_data_type_date(property: string, res: any) {
    let string_props = null;
    if (res) {
      if (
        res[property] != false &&
        res[property] != null &&
        res[property] != undefined
      ) {
        string_props = res[property];
        form &&
          form.setFieldsValue({
            [property]: moment(string_props) ?? '',
          });
      } else {
        string_props = '';
        form &&
          form.setFieldsValue({
            [property]: undefined,
          });
      }
    }
  }
  function set_data_type_date_time(property: string, res: any) {
    if (res && res[property] != null && res[property] !== undefined) {
      const formattedDate = moment(res[property], 'YYYY-MM-DD-HH-mm');
      form &&
        form.setFieldsValue({
          [property]: formattedDate.isValid() ? formattedDate : null,
        });
    } else {
      form &&
        form.setFieldsValue({
          [property]: undefined,
        });
    }
  }

  const [loading, setLoading] = useState(false);
  const onFinish = async () => {
    if (isCreating) {
      console.log('create', isCreating);

      await form?.validateFields();
      const data = await form?.getFieldsValue();

      if (data.employee == false) {
        $message.error('Vui lòng chọn nhân viên!');
        return;
      }
      if (data.date_to < data.date_from) {
        $message.error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu!');
        return;
      }
      if (data.date_from < data.req_date) {
        $message.error('Ngày bắt đầu không được nhỏ hơn ngày đặt phòng!');
        return;
      }
      if (data.date_to < data.req_date) {
        $message.error('Ngày kết thúc không được nhỏ hơn ngày đặt phòng!');
        return;
      }
      if (data) {
        console.log(data);
        setLoading(true);
        const res = await createMeetingRoomsByArgs({
          room: data.room,
          employee: data.employee,
          date_from: data.date_from,
          date_to: data.date_to,
          req_date: data.req_date,
          purpose: data.purpose,
        });
        if (res.success ==true) {
          console.log(res);
          $message.success('Tạo mới thành công!');
          form?.resetFields();
          setForceUpdate && setForceUpdate(!forceUpdate);
          setLoading(false);
          onClose && onClose();
        } else if (res.success ==false) {
          console.log(res);
          $message.error(res.message);
          setLoading(false);
        }
      }
    } else {
      await form?.validateFields();
      const data = await form?.getFieldsValue();
      if (data.employee.value == false && data.employee.label == false) {
        $message.error('Vui lòng chọn nhân viên!');
        return;
      }
      if (data.date_to < data.date_from) {
        $message.error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu!');
        return;
      }
      if (data.date_from < data.req_date) {
        $message.error('Ngày bắt đầu không được nhỏ hơn ngày đặt phòng!');
        return;
      }
      if (data.date_to < data.req_date) {
        $message.error('Ngày kết thúc không được nhỏ hơn ngày đặt phòng!');
        return;
      }
      console.log('data', data);

      if (data) {
        try {
          let req_date = data.req_date;
          let date_from = data.date_from;
          let date_to = data.date_to;
          req_date = moment(req_date).add(1, 'days');
          date_from = moment(date_from).add(1, 'days');
          date_to = moment(date_to).add(1, 'days');
          let room = data?.room;
          let employee = data?.employee;
          if (typeof room !== 'number') {
            room = data.room.value;
          }
          if (typeof employee !== 'number') {
            employee = data.employee.value;
          }
          setLoading(true);
          if (idBookingRoom) {
            console.log({
              room: room,
              employee: employee,
            });

            const res = await updateBookingRoom({
              id: idBookingRoom,
              room: room,
              employee: employee,
              req_date: data.req_date,
              date_from: data.date_from,
              date_to: data.date_to,
              purpose: data.purpose,
            });
            if (res) {
              $message.success('Cập nhật thành công!');
              setForceUpdate && setForceUpdate(!forceUpdate);
              onClose && onClose();
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    }
  };
  const fetchBookingRoomById = async (id?: number) => {
    if (!id) {
      return;
    }
    try {
      setLoading(true);
      const res = await getBookingRoomById(id);

      
      if (res) {
        console.log(res);

        // set_data_type_date('req_date', res);
        // set_data_type_date_time('date_from', res);
        // set_data_type_date_time('date_to', res);
        console.log(moment(res.date_from, 'YYYY-MM-DD-HH-mm').format('YYYY-MM-DDTHHmm'));
        const test = moment(res.date_from, 'YYYY-MM-DD-HH-mm').format('YYYY-MM-DDTHH:mm')
        const test2 = moment(res.date_to, 'YYYY-MM-DD-HH-mm').format('YYYY-MM-DDTHH:mm')

        form &&
          form.setFieldsValue({
            key: res.id,
            employee: {
              value: res.employee?.id ?? '',
              label: res.employee?.name ?? '',
            },
            room: {
              value: res.room?.id ?? '',
              label: res.room?.name ?? '',
            },
            // req_date: res.req_date,
            date_from:  test,
            // date_to: moment(res.date_to, 'YYYY-MM-DD-HH-mm'),
            date_to:test2,
            purpose: res.purpose,
            state: res.state,
          });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (idBookingRoom !== undefined) {
      console.log('idBookingRoom', idBookingRoom);
      fetchBookingRoomById(idBookingRoom);
    }
    form?.resetFields();
  }, [idBookingRoom]);
  return (
    <Drawer
      key={idBookingRoom}
      title={idBookingRoom && 'Thông tin chi tiết'}
      width={isMobile ? '100%' : '650'}
      onClose={onClose}
      open={open}
      destroyOnClose
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        !isViewMode && (
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Button key={1} onClick={onClose}>
              Hủy
            </Button>
            <Button key={2} onClick={onFinish} type="primary" loading={loading}>
              Lưu
            </Button>
          </div>
        )
      }>
      <Spin spinning={loading}>
        <MyForm<any>
          onFinish={onFinish}
          form={form}
          layout="vertical"
          disabled={isViewMode}>
          <Detail isCreatingForm={isCreatingForm} />
        </MyForm>
      </Spin>
    </Drawer>
  );
};

export default FormBookingRooms;
