import { FC, useEffect } from 'react';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { useState } from 'react';
import { message as $message, Table } from 'antd';
import { useLocale } from '@/locales';
import { Button, Form, Space, Tag } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import UpdateForm from './UpdateForm';
import { deleteEquipmentById, getEquipmentsByArgs } from '@/api/equipment_request/equipment_request.api';
import { IEquipments } from '@/interface/equipmentRequest/equipment-request';
const CreateRoom: FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { t } = useLocale();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [equipment, setEquipments] = useState<any>([]);
  const [idEquipment, setIDEquipment] = useState<any>([]);
  const _getEquipmentsByArgs = async (params: IEquipments) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getEquipmentsByArgs(params);
    console.log(res, "OOOOOOOOOOOOOOOOOOOOOOOOO")
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      setEquipments(res.results.data);
      return res;
    }
  };
  const initialParams = {
    name: '',
    id: '',
    check_availability: false,
    page: '',
    page_size: '',
  };
  useEffect(() => {
    _getEquipmentsByArgs(initialParams);
  }, [equipment, forceUpdate]);
  const handleDelete = async (id: number) => {

    setLoading(true);
    const res = await deleteEquipmentById(id);
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
    setIDEquipment(null);
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
    setIDEquipment(id);
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
      title: 'Tên văn phòng phẩm',
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
        columns={tableColumns}
        dataSource={equipment}
        bordered
        rowClassName={() => 'editable-row'}
      />
      <UpdateForm
        room={equipment}
        showModal={showModal}
        onCloseUpdate={onCloseUpdate}
        openEditForm={openEditForm}
        form={form}
        idEquipment={idEquipment}
        forceUpdate={forceUpdate}
        setForceUpdate={setForceUpdate}
      />
    </>
  );
};
export default CreateRoom;
