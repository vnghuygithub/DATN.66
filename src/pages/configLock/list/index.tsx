import {
  IConfigLockArgs,
  deleteConfigLockById,
  getConfigLock,
} from '@/api/configLockFeature/configLock.api';
import { IConfigLock } from '@/api/configLockFeature/transform';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { useLocale } from '@/locales';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import { Form, Button, Space, message as $message, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';
import { ConfigSearch } from '../search';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { ConfigLockForm } from '../handle';
import ConfiglockLog from '../handle/log';
import SearchConfigLockMis from '../search/SearchMis';

export const ConfigLockList: FC = () => {
  const { t } = useLocale();
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [idConfigLock, setIdConfigLock] = useState<any>(null);
  const [showLog, setShowLog] = useState<boolean>(false);
  const _getConfigLock = async (args: IConfigLockArgs) => {
    const res = await getConfigLock(args);
    if (res) {
      store.dispatch(setGlobalState({ loading: true }));
      return res;
    }
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const tableColumns: MyPageTableOptions<IConfigLock> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
      width: 50,
    },
    // {
    //     title: 'ID',
    //     dataIndex: 'id',
    //     key: 'id',
    //     align: 'center',
    //     width: 50,
    // },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      align: 'center',
    },
    {
      title: 'Chức năng',
      dataIndex: 'model_lock',
      key: 'model_lock',
      width: 300,
      align: 'center',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_lock_date',
      key: 'start_lock_date',
      width: 150,
      align: 'center',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_lock_date',
      key: 'end_lock_date',
      width: 150,
      align: 'center',
    },
    {
      title: 'Công ty',
      dataIndex: 'mis_id',
      key: 'mis_id',
      width: 120,
      align: 'center',
      // render: (item) => {
      //     return item?.mis_id?? '-';
      // }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      key: 'create_date',
      width: 150,
      align: 'center',
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'write_date',
      key: 'write_date',
      width: 150,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      width: 120,
      align: 'center',
      render: (state: boolean) => {
        if (state == true) {
          return (
            <span>
              <CheckOutlined color="green" />
            </span>
          );
        } else if (state == false) {
          return (
            <span>
              <CloseOutlined color="red" />
            </span>
          );
        } else {
          return <span></span>;
        }
      },
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
          <HistoryOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleShowLog(item)}
          />
        </Space>
      ),
    },
  ];
  const handleShowLog = (item: any) => {
    setShowLog(true);
    setIdConfigLock(item);
  };
  const handleCreate = () => {
    setIsCreating(true);
    setIsView(false);
    showDrawer();
  };
  const onClose = () => {
    setOpen(false);
    setIsCreating(false);
    setIdConfigLock(null);
    setIsView(false);
    setShowLog(false);
  };
  const handleDelete = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 cấu hình để xóa');
      return;
    }

    const ids = selectedRowArr.map((item: IConfigLock) => item.id);
    const canDelete = selectedRowArr.every(
      (item: IConfigLock) => item.active === false
    );
    if (!canDelete) {
      $message.error('Không được phép xóa cấu hình đang hoạt động');
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
      setForceUpdate(!forceUpdate);
      store.dispatch(setGlobalState({ loading: false }));
      return;
    }
    try {
      store.dispatch(setGlobalState({ loading: true }));
      await Promise.all(ids.map(id => deleteConfigLockById(id)));
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
      setForceUpdate(!forceUpdate);
      store.dispatch(setGlobalState({ loading: false }));
      $message.success('Xóa cấu hình thành công');
    }
  };
  const handleEdit = (item: any) => {
    setIsCreating(false);
    showDrawer();
    setIdConfigLock(item);
  };
  const handleView = (item: any) => {
    setIsView(true);
    showDrawer();
    setIdConfigLock(item);
  };
  return (
    <>
      <MyPage
        rowkey="id"
        pageApi={_getConfigLock}
        searchRender={<SearchConfigLockMis />}
        tableOptions={tableColumns}
        forceUpdate={forceUpdate}
        forceClearSelection={forceClearSelection}
        setSelectedRowData={setSelectedRowArr}
        multipleSelection
        selectedRowArr={selectedRowArr}
        slot={
          <>
            <Button type="primary" onClick={handleCreate}>
              Thêm mới
            </Button>
            <Button type="primary" onClick={handleDelete}>
              Xóa
            </Button>
          </>
        }
      />
      <ConfigLockForm
        open={open}
        form={form}
        isCreating={isCreating}
        onClose={onClose}
        idConfigLock={idConfigLock}
        isView={isView}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        showDrawer={showDrawer}
      />
      <ConfiglockLog
        showLog={showLog}
        idConfigLock={idConfigLock}
        onClose={onClose}
      />
    </>
  );
};
