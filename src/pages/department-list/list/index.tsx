import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { Button, Form, Space} from 'antd';
import { FC } from 'react';
import { useState } from 'react';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { message as $message } from 'antd';
import {
  deleteDepartment,
  getDepartmentListV2,
} from '@/api/department/department.api';
import SearchDepartmentMis from '../components/search-mis';
import { useLocale } from '@/locales';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import FormDepartment from '../handle';
import { getDepartmentLog } from '@/api/timekeepingList/department.api';
import Fileform from '../handle/Fileform';
import { IDepartmentList } from '@/api/department/transform';

const DepartmentList: FC = () => {
  const { t } = useLocale();
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [idDepartment, setIdDepartment] = useState<string>('');
  const [isView, setIsView] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState<boolean>(false);

  const showDrawerImport = () => {
    setImportOpen(true);
  };
  const getDepartmentListByParams = async (params: any) => {
    const res = await getDepartmentListV2(params);
    if (res) {
      store.dispatch(setGlobalState({ loading: true }));
      return res;
    }
  };
  const handleEdit = (id: string) => {
    setIsCreating(false);
    setIdDepartment(id);
    showDrawer();
  };
  const handleView = (id: string) => {
    setIsView(true);
    setIsCreating(false);
    setIdDepartment(id);
    showDrawer();
  };
  const tableColumns: MyPageTableOptions<IDepartmentList> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
      width: 60,
    },

    {
      title: "Công ty",
      dataIndex: "mis_id",
      key: "mis_id",
      width: 70,
      align: "center",

    },
    {
      title: 'Tên phòng ban',
      dataIndex: 'name',
      key: 'name',
      width: 270,
      align: 'center',
    },
    {
      title: 'Số nhân viên',
      dataIndex: 'total_employee',
      key: 'total_employee',
      width: 70,
      align: 'center',
    },
    {
      title: 'Số lần chấm công',
      dataIndex: 'time_keeping_count',
      key: 'time_keeping_count',
      width: 70,
      align: 'center',
    },
    {
      title: 'Người quản lý',
      dataIndex: 'manager_name',
      key: 'manager_name',
      width: 170,
      align: 'center',
    },
    {
      title: 'Thư ký',
      dataIndex: 'secretary_name',
      key: 'secretary_name',
      width: 170,
      align: 'center',
    },
    {
      title: t({ id: 'action' }),
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (item: any, record: any) => (
        <Space size={'middle'}>
          <EditOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleEdit(item.id)}
          />
          <EyeOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleView(item.id)}
          />
        </Space>
      ),
    },
  ];
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setImportOpen(false);
    setIsView(false);
    setIsCreating(false);
  };
  const _getDepartmentLog = async () => {
    const res = await getDepartmentLog();
    if (res) {
      return res;
    }
  };
  const handleCreate = async () => {
    form.resetFields();
    showDrawer();
    setIsCreating(true);
  };
  const handleDelete = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn phòng ban cần xóa');
      return;
    }
    const total_employee = selectedRowArr.some(item => item.total_employee > 0);
    if (total_employee) {
      $message.error('Không thể xóa phòng ban đang có nhân viên');
      setForceClearSelection(!forceClearSelection);
      setSelectedRowArr([]);
      return;
    }
    const ids = selectedRowArr.map(item => item.id);
    store.dispatch(setGlobalState({ loading: true }));
    await Promise.all(
      ids.map(async id => {
        deleteDepartment(Number(id))
          .then(res => {
            if (res) {
              $message.success('Xóa phòng ban thành công');
              setForceUpdate(!forceUpdate);
              setForceClearSelection(!forceClearSelection);
              setSelectedRowArr([]);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            store.dispatch(setGlobalState({ loading: false }));
          });
      })
    );
  };
  const handleImport = () => {
    showDrawerImport();
  };
  return (
    <>
      <MyPage
        rowkey="id"
        pageApi={getDepartmentListByParams}
        title="Quản lý phòng ban"
        logData={_getDepartmentLog}
        tableOptions={tableColumns}
        searchRender={<SearchDepartmentMis />}
        forceUpdate={forceUpdate}
        forceClearSelection={forceClearSelection}
        setSelectedRowData={setSelectedRowArr}
        multipleSelection
        selectedRowArr={selectedRowArr}
        slot={
          <>
            {' '}
            <Button type="primary" onClick={handleImport}>
              {'Import'}
            </Button>
            <Button type="primary" onClick={handleCreate}>
              {'Thêm mới'}
            </Button>
            <Button type="primary" onClick={handleDelete}>
              {'Xóa'}
            </Button>
          </>
        }
      />
      <Fileform
        onClose={onClose}
        showDrawerImport={showDrawerImport}
        importOpen={importOpen}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        form={form}
      />
      <FormDepartment
        form={form}
        isView={isView}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        idDepartment={idDepartment}
        open={open}
        showDrawer={showDrawer}
        onClose={onClose}
        isCreating={isCreating}
      />
    </>
  );
};

export default DepartmentList;
