import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { FC } from 'react';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { useState } from 'react';
import { message as $message } from 'antd';
import { useLocale } from '@/locales';
import { Button,  Form, Space, Tag } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  IEmployeeAllocation,
  IEmployeeAllocationArgs,
} from '@/interface/employeeAllocation/employeeAllocation';
import {
  approveAllocation,
  deleteAllocation,
  denyAllocation,
  getEmployeeAllocationById,
  getEmployeeAllocationLog,
  getListEmployeeAllocation,
} from '@/api/employee-allocation/employeeAllocation.api';
import SearchEmployeeAllocationMis from '../components/search-mis';
import FormAllocation from '@/pages/employee-allocation/components/handle';
import { formatDate } from '@/utils/formatDate';

const EmployeeAllocationList: FC = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [idAllocation, setIdAllocation] = useState<any>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isView, setIsView] = useState(false);
  const _getEmployeeAllocationListByArgs = async (
    params: IEmployeeAllocationArgs
  ) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getListEmployeeAllocation(params);
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };
  const onClose = () => {
    setOpen(false);
    setIsCreating(false);
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const  handleView = (id: number) => {
    setIdAllocation(id);
    setIsCreating(false);
    setIsView(true);
    showDrawer();
  };
  const tableColumns: MyPageTableOptions<IEmployeeAllocation> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      width: 100,
      key: 'state',
      align: 'center',
      render: item => {
        let textColor = '';
        let stateText = '';
        if (item === 'chờ duyệt') {
          textColor = 'blue';
          stateText = 'Chờ duyệt';
        } else if (item === 'đã duyệt') {
          textColor = 'green';
          stateText = 'Đã duyệt';
        } else if (item === 'hủy') {
          textColor = 'red';
          stateText = 'Hủy';
        }
        const spanStyle = textColor;
        return (
          <Tag color={spanStyle} style={{ fontSize: '13px' }}>
            {stateText}
          </Tag>
        );
      },
    },
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   width: 50,
    //   align: 'center',
    // },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: 100,
      key: 'create_date',
      align: 'center',
      render: item => {
        return item ? formatDate(item) : '';
      },
    },
    {
      title: 'Tên phiếu',
      dataIndex: 'name',
      width: 350,
      key: 'name',
      align: 'center',
    },
    {
      title: 'Loại phiếu',
      dataIndex: 'allocation_type',
      width: 100,
      key: 'allocation_type',
      align: 'center',
      render: item => {
        return item === 'công ty' ? 'Công ty' : 'Phòng ban';
      },
    },
    {
      title: 'Công ty hiện tại',
      dataIndex: 'current_company_name',
      width: 550,
      key: 'current_company_name',
      align: 'center',
    },
    {
      title: 'Công ty chuyển đến',
      dataIndex: 'company_name',
      width: 550,
      key: 'company_name',
      align: 'center',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employee_names',
      width: 200,
      key: 'employee_names',
      align: 'center',
    },
    {
      title: 'Phòng ban hiện tại',
      dataIndex: 'current_department_name',
      width: 220,
      key: 'current_department_name',
      align: 'center',
    },
    {
      title: 'Phòng ban chuyển đến',
      dataIndex: 'department_name',
      width: 300,
      key: 'department_name',
      align: 'center',
    },
    {
      title: 'Ngày kết thúc làm việc công ty hiện tại',
      dataIndex: 'severance_day_old_company',
      width: 150,
      key: 'severance_day_old_company',
      align: 'center',
      render: item => {
        return item ? formatDate(item) : '';
      },
    },
    {
      title: 'Ngày bắt đầu làm việc công ty mới',
      dataIndex: 'new_company_working_date',
      width: 150,
      key: 'new_company_working_date',
      align: 'center',
      render: item => {
        return item ? formatDate(item) : '';
      },
    },
    {
      title: 'Ngày duyệt',
      dataIndex: 'approved_date',
      width: 100,
      key: 'approved_date',
      align: 'center',
      render: item => {
        return item ? formatDate(item) : '';
      },
    },
    {
      title: 'Người duyệt',
      dataIndex: 'approved_by_name',
      width: 150,
      key: 'approved_by_name',
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
          {(is_general_manager === "true" || is_administrative === 'true') && (
            <EditOutlined
              style={{ fontSize: '14px', color: '#0960bd' }}
              onClick={() => handleEdit(item)}
            />
          )}
          <EyeOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleView(item)}
          />
        </Space>
      ),
    },
  ];
  const _getAllocationById = async (id: number) => {
    const res = await getEmployeeAllocationById(id);
    if (res.state === 'chờ duyệt') {
      return true;
    }
    return false;
  };
  const handleEdit = async (id: number) => {
    const canEdit = await _getAllocationById(id);
    if (!canEdit) {
      $message.error(
        'Không thể chỉnh sửa phiếu điều chuyển nhân viên đã được duyệt'
      );
      return;
    }
    setIdAllocation(id);
    setIsCreating(false);
    setIsView(false);
    showDrawer();
  };
  const handleApprove = async () => {
    store.dispatch(setGlobalState({ loading: true }));
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 phiếu điều chuyển nhân viên');
      setForceClearSelection(!forceClearSelection);
      setSelectedRowArr([]);
      store.dispatch(setGlobalState({ loading: false }));
      return;
    }
    const ids = selectedRowArr.map((item: any) => item.id);
    if (selectedRowArr.some((item: any) => item.state !== 'chờ duyệt')) {
      $message.error(
        'Vui lòng chọn phiếu điều chuyển nhân viên đang ở trạng thái chờ duyệt'
      );
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
      store.dispatch(setGlobalState({ loading: false }));
      return;
    }
    try {
      await Promise.all(
        ids.map((id: number) =>
          approveAllocation(id)
            .then(res => {
              if (!res.result.error) {
                setForceUpdate(!forceUpdate);
                setSelectedRowArr([]);
                setForceClearSelection(!forceClearSelection);
                store.dispatch(setGlobalState({ loading: false }));
              } else {
                $message.error(res.result.error);
                setForceUpdate(!forceUpdate);
                setSelectedRowArr([]);
                setForceClearSelection(!forceClearSelection);
                store.dispatch(setGlobalState({ loading: false }));
              }
            })
            .catch(err => {
              console.log('err', err);
            })
        )
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleDeny = async () => {
    store.dispatch(setGlobalState({ loading: true }));
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 phiếu điều chuyển nhân viên');
      setForceClearSelection(!forceClearSelection);
      setSelectedRowArr([]);
      store.dispatch(setGlobalState({ loading: false }));
      return;
    }
    const ids = selectedRowArr.map((item: any) => item.id);
    if (selectedRowArr.some((item: any) => item.state !== 'chờ duyệt')) {
      $message.error(
        'Vui lòng chọn phiếu điều chuyển nhân viên đang ở trạng thái chờ duyệt'
      );
      setForceClearSelection(!forceClearSelection);
      setSelectedRowArr([]);
      store.dispatch(setGlobalState({ loading: false }));
      return;
    }
    try {
      await Promise.all(
        ids.map((id: number) =>
          denyAllocation(id)
            .then(res => {
              if (res) {
                setForceUpdate(!forceUpdate);
                setForceClearSelection(!forceClearSelection);
                setSelectedRowArr([]);
                store.dispatch(setGlobalState({ loading: false }));
              }
            })
            .catch(err => {
              console.log('err', err);
            })
        )
      );
    } catch (error) {
      console.log('error', error);
    }
  };
  const handleDelete = async () => {
    store.dispatch(setGlobalState({ loading: true }));
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 phiếu điều chuyển nhân viên');
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
      store.dispatch(setGlobalState({ loading: false }));
      return;
    }
    const ids = selectedRowArr.map((item: any) => item.id);
    if (selectedRowArr.some((item: any) => item.state !== 'chờ duyệt')) {
      $message.error(
        'Vui lòng chọn phiếu điều chuyển nhân viên đang ở trạng thái chờ duyệt'
      );
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
      store.dispatch(setGlobalState({ loading: false }));
      return;
    }
    try {
      await Promise.all(
        ids.map((id: number) =>
          deleteAllocation(id)
            .then(res => {
              if (res) {
                setForceUpdate(!forceUpdate);
                setSelectedRowArr([]);
                setForceClearSelection(!forceClearSelection);
                store.dispatch(setGlobalState({ loading: false }));
              }
            })
            .catch(err => {
              console.log('err', err);
            })
        )
      );
    } catch (error) {
      console.log('error', error);
    }
  };
  const handleCreate = () => {
    setIsCreating(true);
    setIsView(false);
    setIdAllocation(undefined);
    showDrawer();
  };
  const _getEmployeeAllocationLog = async () => {
    const res = await getEmployeeAllocationLog();
    if (res) {
      return res;
    }
  };
  let is_general_manager = localStorage.getItem('is_general_manager');
  let is_administrative = localStorage.getItem('is_administrative');
  return (
    <>
      <MyPage
        rowkey="id"
        pageApi={_getEmployeeAllocationListByArgs}
        // logData={_getEmployeeAllocationLog}
        title="Kiểm kê phiếu điều chuyển nhân viên"
        forceUpdate={forceUpdate}
        tableOptions={tableColumns}
        setSelectedRowData={setSelectedRowArr}
        forceClearSelection={forceClearSelection}
        searchRender={<SearchEmployeeAllocationMis />}
        multipleSelection
        selectedRowArr={selectedRowArr}

        slot={
          (is_general_manager === "true" || is_administrative === 'true') && (
            <>
              <Button type="primary" onClick={handleCreate}>
                Tạo
              </Button>
              <Button type="primary" onClick={handleApprove}>
                Duyệt
              </Button>
              <Button type="primary" onClick={handleDeny}>
                Hủy
              </Button>
              <Button type="primary" onClick={handleDelete}>
                Xóa
              </Button>
            </>
          )
        }
      />
      <FormAllocation
        isCreating={isCreating}
        form={form}
        onClose={onClose}
        open={open}
        forceUpdate={forceUpdate}
        setForceUpdate={setForceUpdate}
        idAllocation={idAllocation}
        showDrawer={showDrawer}
        isView={isView}
      />
    </>
  );
};
export default EmployeeAllocationList;
