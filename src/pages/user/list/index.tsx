import { IUserRes } from '@/api/user/transform';
import { deleteUser, getUsers, userArgs } from '@/api/user/user.api';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { useLocale } from '@/locales';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import { Button, Form, Space, Tag, message as $message } from 'antd';
import { FC, useState } from 'react';
import { EditOutlined, EyeOutlined, LockOutlined } from '@ant-design/icons';
import UserForm from '../component/handle';
import PasswordForm from '../component/changePassword';
import SearchUserMis from '../component/SearchUserMis';
const UserList: FC = () => {
  const [forceUpdate, setForceUpdate] = useState(false);
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [isView, setIsView] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [idUser, setIdUser] = useState<number | undefined>(undefined);
  const [openPassword, setOpenPassword] = useState(false);
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const _getUserByArgs = async (args: userArgs) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getUsers(args);
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setIsCreating(false);
    setIsView(false);
    setOpenPassword(false);
  };

  const tableColumns: MyPageTableOptions<IUserRes> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      align: 'center',
    },
    // {
    //     title: "id",
    //     dataIndex: "id",
    //     key: "id",
    //     width: 100,
    //     align: "center",
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      key: 'state',
      width: 150,
      align: 'center',
      render: (state: string) => {
        let textColor = '';
        let stateText = '';

        if (state === 'new') {
          textColor = 'cyan';
          stateText = 'Chưa từng kết nối';
        } else if (state === 'active') {
          textColor = 'green';
          stateText = 'Đã xác nhận';
        }
        const spanStyle = textColor;
        return (
          <Tag color={spanStyle} style={{ fontSize: '13px' }}>
            {stateText}
          </Tag>
        );
      },
    },

    {
      title: 'Công ty',
      dataIndex: 'mis_id',
      key: 'mis_id',
      width: 100,
      align: 'center',
      // render:(value, record, index)=>{
      //     console.log(record)
      //     return record?.mis_id
      // }
    },

    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      align: 'center',
    },
    {
      title: 'Tài khoản đăng nhập',
      dataIndex: 'login',
      key: 'login',
      width: 220,
      align: 'center',
    },

    {
      title: 'Lần đăng nhập gần nhất',
      dataIndex: 'login_date',
      key: 'login_date',
      width: 200,
      align: 'center',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      key: 'create_date',
      width: 120,
      align: 'center',
    },

    {
      title: t({ id: 'action' }),
      key: 'id',
      dataIndex: 'id',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: item => (
        <Space size="middle">
          <EditOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleEdit(item)}
          />
          <EyeOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleView(item)}
          />
          <LockOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleChangePassword(item)}
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (id: number) => {
    setIdUser(id);
    setIsView(false);
    setIsCreating(false);
    showDrawer();
  };
  const handleView = (id: number) => {
    setIdUser(id);
    setIsView(true);
    setIsCreating(false);
    showDrawer();
  };
  const handleCreate = () => {
    setIsCreating(true);
    setIsView(false);
    setIdUser(undefined);
    showDrawer();
  };
  const showDrawerPassword = () => {
    setOpenPassword(true);
  };
  const handleChangePassword = (id: number) => {
    setIdUser(id);
    setIsView(false);
    setIsCreating(false);
    showDrawerPassword();
  };
  const handleDelete = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 người dùng để xóa');
      return;
    }
    const ids = selectedRowArr.map((item: IUserRes) => item.id);
    try {
      store.dispatch(setGlobalState({ loading: true }));
      await Promise.all(ids.map(id => deleteUser(id)));
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
      setForceUpdate(!forceUpdate);
      store.dispatch(setGlobalState({ loading: false }));
      $message.success('Xóa người dùng thành công');
    }
  };
  return (
    <>
      <MyPage
        rowkey="id"
        title="Quản lý người dùng"
        forceUpdate={forceUpdate}
        pageApi={_getUserByArgs}
        setSelectedRowData={setSelectedRowArr}
        selectedRowArr={selectedRowArr}
        forceClearSelection={forceClearSelection}
        multipleSelection
        searchRender={<SearchUserMis />}
        tableOptions={tableColumns}
        slot={
          <Space>
            <Button
              type="primary"
              onClick={handleCreate}
              style={{ marginLeft: 10 }}>
              Thêm mới
            </Button>
            <Button type="primary" onClick={handleDelete}>
              Xoá
            </Button>
          </Space>
        }
      />
      <UserForm
        onClose={onClose}
        showDrawer={showDrawer}
        isView={isView}
        open={open}
        idUser={idUser}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        form={form}
        isCreating={isCreating}
      />
      <PasswordForm
        onClose={onClose}
        showDrawer={showDrawerPassword}
        open={openPassword}
        idUser={idUser}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        form={form}
      />
    </>
  );
};

export default UserList;
