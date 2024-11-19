import { FC, useEffect } from 'react';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { useState } from 'react';
import { message as $message, Table } from 'antd';
import { useLocale } from '@/locales';
import { Form, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  deleteRoomById,
  getRoomsByArgs,
} from '@/api/meeting_rooms/bookingrooms.api';
import {
  IMeetingRooms,
} from '@/interface/meetingRooms/meeting_rooms';
import UpdateForm from './UpdateForm';
const CreateRoom: FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { t } = useLocale();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [room, setRoom] = useState<any>([]);
  const [idRoom, setIDRoom] = useState<any>([]);
  const _getRoomByArgs = async (params: IMeetingRooms) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getRoomsByArgs(params);
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      setRoom(res.results.data);
      return res;
    }
  };
  const initialParams = {
    name: '',
    id: '',
    check_availability: "",
    page: '',
    page_size: '',
  };
  useEffect(() => {
    _getRoomByArgs(initialParams);
  }, [room]);
  const handleDelete = async (id: number) => {
    setLoading(true);
    const res = await deleteRoomById(id);
    if (res) {
      setForceUpdate(!forceUpdate);
      setLoading(false);
      $message.success('Xoá thành công');
      return;
    }
  };
  const onClose = () => {
    setOpen(false);
  };
  const onCloseUpdate = () => {
    setOpenEditForm(false)
    setIsUpdate(false);
    setIDRoom(null);
  }
  const showDrawer = () => {
    setOpen(true);
  };
  const showModal = () => {
    setOpenEditForm(true);
  };
  const handleEdit = (id: number) => {
    showModal();
    setIsUpdate(true);
    setIDRoom(id);
  };
  const tableColumns: any = [
    {
      title: '#',
      dataIndex: 'no',
      key: 'no',
      width: 30,
      align: 'left',
    },
    {
      title: 'Phòng họp',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      align: 'left',
    },
    {
      title: t({ id: 'action' }),
      key: 'action',
      fixed: 'right',
      width: 50,
      align: 'center',
      render: (item: any) => (
        <Space size="middle">
          <Space size="middle" direction="horizontal">
            <EditOutlined
              style={{ fontSize: '14px', color: '#0960bd' }}
              onClick={() => handleEdit(item.id)}
            />
            <DeleteOutlined
              style={{ fontSize: '14px', color: 'red' }}
              onClick={() => handleDelete(item.id)}
            />
          </Space>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        // key={tableKey}
        // loading={loading}
        columns={tableColumns}
        dataSource={room}
        bordered
        rowClassName={() => 'editable-row'}
      />
      <UpdateForm
        room={room}
        showModal={showModal}
        onCloseUpdate={onCloseUpdate}
        openEditForm={openEditForm}
        form={form}
        idRoom={idRoom}
        forceUpdate={forceUpdate}
        setForceUpdate={setForceUpdate}
      />
    </>
  );
};
export default CreateRoom;
