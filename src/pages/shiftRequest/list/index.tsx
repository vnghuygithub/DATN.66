import {
  IShiftRequestArgs,
  approveRequest,
  deleteRequest,
  getShiftRequests,
  updateRequest,
} from '@/api/shiftRequest/shiftRequest.api';
import { IShiftRequest } from '@/api/shiftRequest/transform';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { useLocale } from '@/locales';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Form, Space, Tag } from 'antd';
import { FC, useState } from 'react';
import SearchShiftRequest from '../search';
import ShiftRequestForm from '../handle';
import { message as $message } from 'antd';
import { getShiftRequestById } from '../../../api/shiftRequest/shiftRequest.api';
import ImportForm from '../handle/importForm';
import SearchShiftRequestMis from '../search-mis';
const ShiftRequest: FC = () => {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [idRequest, setIdRequest] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(true);
  const [isView, setIsView] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const _getShiftRequests = async (args: IShiftRequestArgs) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getShiftRequests(args);
    console.log(res);
    
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const tableColums: MyPageTableOptions<IShiftRequest> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      align: 'center',
      fixed: 'left',
    },
    // {
    //     title: 'ID',
    //     dataIndex: 'id',
    //     key: 'id',
    //     width: 50,
    //     align: 'center',
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      key: 'state',
      width: 130,
      align: 'center',
      fixed: 'left',

      render: (state: string) => {
        let textColor = '';
        let stateText = '';

        if (state === 'chờ duyệt') {
          textColor = 'cyan';
          stateText = 'Chờ duyệt';
        } else if (state === 'đã duyệt') {
          textColor = 'green';
          stateText = 'Đã duyệt';
        } else {
          textColor = 'volcano';
          stateText = 'Từ chối';
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
      title: 'Từ ngày',
      dataIndex: 'from_date',
      key: 'from_date',
      width: 100,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Đến ngày',
      dataIndex: 'to_date',
      key: 'to_date',
      width: 100,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employee_name',
      key: 'employee_name',
      width: 150,
      align: 'center',
      fixed: 'left',

    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'employee_code',
      key: 'employee_code',
      width: 150,
      align: 'center',
      fixed: 'left',

    },
   
    {
      title: 'Tiêu đề',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      align: 'center',
    },
   
    {
      title: 'Công ty',
      dataIndex: 'mis_id',
      key: 'mis_id',
      width: 70,
      align: 'center',
    
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department_name',
      key: 'department_name',
      width: 250,
      align: 'center',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'job_title',
      key: 'job_title',
      width: 250,
      align: 'center',
    },
    {
      title: 'Ca hiện tại',
      dataIndex: 'current_shift_name',
      key: 'current_shift_name',
      width: 90,
      align: 'center',
    },
    {
      title: 'Ca mới',
      dataIndex: 'new_shift_name',
      key: 'new_shift_name',
      width: 80,
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
          <>
            {(is_general_manager === 'true' ||
              is_administrative === 'true' ||
              sub_admin_role !== 'none') && (
              <EditOutlined
                style={{ fontSize: '14px', color: '#0960bd' }}
                onClick={() => handleEdit(item)}
              />
            )}
            <EyeOutlined
              style={{ fontSize: '14px', color: '#0960bd' }}
              onClick={() => handleView(item)}
            />
          </>
        </Space>
      ),
    },
  ];
  const handleView = (id: number) => {
    setIsView(true);
    setIdRequest(id);
    showDrawer();
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const handleEdit = async (id: number) => {
    const canEdit = await _getShiftRequestById(id);
    if (!canEdit) {
      $message.error('Không thể chỉnh sửa đơn đã duyệt hoặc từ chối !');
      return;
    }
    setIsCreating(false);
    setIdRequest(id);
    showDrawer();
  };
  const _getShiftRequestById = async (id: number) => {
    const res = await getShiftRequestById(id);
    if (res.state === 'chờ duyệt') {
      return true;
    }
    return false;
  };
  const handleCreate = () => {
    setIsCreating(true);
    showDrawer();
    setIdRequest(null);
  };
  const handleDelete = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn đơn !');
      return;
    } else {
      store.dispatch(setGlobalState({ loading: true }));
      const itemsToDelete = selectedRowArr.filter(
        (item: any) => item.state == 'chờ duyệt'
      );
      if (itemsToDelete.length === 0) {
        $message.error('Vui lòng chọn đơn chưa duyệt!');
        setSelectedRowArr([]);
        setForceClearSelection(!forceClearSelection);
        return;
      }
      await Promise.all(
        itemsToDelete.map(async (item: any) => {
          await deleteRequest(item.id);
        })
      )
        .then(() => {
          $message.success('Xóa thành công !');
          setForceUpdate(!forceUpdate);
          setSelectedRowArr([]);
          setForceClearSelection(!forceClearSelection);
          store.dispatch(setGlobalState({ loading: false }));
        })
        .catch(err => {
          console.log(err);
          $message.error('Xóa thất bại !');
          store.dispatch(setGlobalState({ loading: false }));
        });
    }
  };
  const handleApprove = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn đơn !');
    } else {
      store.dispatch(setGlobalState({ loading: true }));
      const itemsToApprove = selectedRowArr.filter(
        (item: any) => item.state == 'chờ duyệt'
      );
      if (itemsToApprove.length === 0) {
        $message.error('Vui lòng chọn đơn chưa duyệt!');
        setSelectedRowArr([]);
        setForceClearSelection(!forceClearSelection);
        return;
      }
      await Promise.all(
        itemsToApprove.map(async (item: any) => {
          await approveRequest(item.id);
        })
      )
        .then(() => {
          setForceUpdate(!forceUpdate);
          setSelectedRowArr([]);
          setForceClearSelection(!forceClearSelection);
          store.dispatch(setGlobalState({ loading: false }));
        })
        .catch(err => {
          console.log(err);
          $message.error('Duyệt thất bại !');
          store.dispatch(setGlobalState({ loading: false }));
        });
    }
  };
  const handleCancle = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn đơn !');
    } else {
      store.dispatch(setGlobalState({ loading: true }));
      const itemsToCancle = selectedRowArr.filter(
        (item: any) => item.state == 'chờ duyệt'
      );
      if (itemsToCancle.length === 0) {
        $message.error('Vui lòng chọn đơn chưa duyệt !');
        setSelectedRowArr([]);
        setForceClearSelection(!forceClearSelection);
        return;
      }
      await Promise.all(
        itemsToCancle.map(async (item: any) => {
          await updateRequest(item.id, {
            state: 'từ chối',
          });
        })
      )
        .then(() => {
          $message.success('Từ chối thành công !');
          setForceUpdate(!forceUpdate);
          setSelectedRowArr([]);
          setForceClearSelection(!forceClearSelection);
          store.dispatch(setGlobalState({ loading: false }));
        })
        .catch(err => {
          console.log(err);
          $message.error('Từ chối thất bại !');
          store.dispatch(setGlobalState({ loading: false }));
        });
    }
  };
  const onClose = () => {
    setOpen(false);
    setIsCreating(false);
    setIdRequest(null);
    setIsView(false);
    setImportOpen(false);
  };
  const showDrawerImport = () => {
    setImportOpen(true);
  };
  let is_general_manager = localStorage.getItem('is_general_manager');
  let is_head_of_department = localStorage.getItem('is_head_of_department');
  let is_department_secretary = localStorage.getItem('is_department_secretary');
  let is_administrative = localStorage.getItem('is_administrative');
  const handleImport = () => {
    showDrawerImport();
  };
  return (
    <>
      <MyPage
        rowkey="id"
        title="Danh sách đơn xin đổi ca"
        searchRender={<SearchShiftRequestMis />}
        pageApi={_getShiftRequests}
        tableOptions={tableColums}
        forceUpdate={forceUpdate}
        setSelectedRowData={setSelectedRowArr}
        selectedRowArr={selectedRowArr}

        forceClearSelection={forceClearSelection}
        multipleSelection
        slot={
          <>
            <Button type="primary" onClick={handleCreate}>
              Tạo mới
            </Button>
            {(is_general_manager === 'true' ||
              is_administrative === 'true' ||
              sub_admin_role !== 'none' ||
              is_head_of_department === 'true') && (
              <>
                <Button type="primary" onClick={handleApprove}>
                  Duyệt
                </Button>
                <Button type="primary" onClick={handleCancle}>
                  Từ chối
                </Button>
              </>
            )}
            {(is_general_manager === 'true' ||
              is_administrative === 'true' ||
              sub_admin_role !== 'none') && (
              <>
                <Button type="primary" onClick={handleImport}>
                  Import
                </Button>
                <Button type="primary" onClick={handleDelete}>
                  Xóa
                </Button>
              </>
            )}
          </>
        }
      />
      <ShiftRequestForm
        onClose={onClose}
        open={open}
        isView={isView}
        idRequest={idRequest}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        form={form}
        showDrawer={showDrawer}
        isCreating={isCreating}
      />
      <ImportForm
        onClose={onClose}
        showDrawerImport={showDrawerImport}
        importOpen={importOpen}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        form={form}
      />
    </>
  );
};

export default ShiftRequest;
