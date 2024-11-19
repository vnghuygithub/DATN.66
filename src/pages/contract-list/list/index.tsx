import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { FC } from 'react';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { formatDate } from '@/utils/formatDate';
import { IContract, IContractArgs } from '@/interface/contract/contract';
import {
  deleteContractById,
  getContractByArgs,
  getContractLog,
  updateContractState,
} from '@/api/contract/contract.api';
import { useState } from 'react';
import SearchContractMis from '../components/search-mis';
import { message as $message } from 'antd';
import { useLocale } from '@/locales';
import { Button, Divider, Form, Space, Tag } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined, EyeOutlined, HistoryOutlined } from '@ant-design/icons';
import FormContract from '../handle';
import FileForm from '../handle/fileForm';
import ContractLog from '../handle/log';
const ContractList: FC = () => {
  const [form] = Form.useForm();
  const { t } = useLocale();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [idContract, setIdContract] = useState<any>(undefined);
  const [showLog, setShowLog] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  let sub_admin_role = localStorage.getItem('sub_admin_role');
  let is_administrative = localStorage.getItem('is_administrative');
  const _getContractLog = async () => {
    const res = await getContractLog();
    if (res) {
      return res;
    }
  };
  const _getContractListByArgs = async (params: IContractArgs) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getContractByArgs(params);
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };
  const handleDelete = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 hợp đồng để xóa');
      return;
    }

    const ids = selectedRowArr.map((item: IContract) => item.id);
    try {
      store.dispatch(setGlobalState({ loading: true }));
      await Promise.all(ids.map(id => deleteContractById(id)));
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
      setForceUpdate(!forceUpdate);
      store.dispatch(setGlobalState({ loading: false }));
      $message.success('Xóa hợp đồng thành công');
    }
  };
  const handleUpdate = () => {
    setForceUpdate(!forceUpdate);
    updateContractState();
  };
  const handleImport = () => {
    showDrawerImport();
  };
  const showDrawerImport = () => {
    setImportOpen(true);
  };
  const handleCreate = () => {
    setIsCreating(true);
    showDrawer();
    setIdContract(undefined);
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const handleEdit = (id: number) => {
    setIsCreating(false);
    setIdContract(id);
    showDrawer();
  };
  const onClose = () => {
    setOpen(false);
    setImportOpen(false);
    setIsCreating(false);
    setIsView(false);
    setShowLog(false);
    setIdContract(undefined);
  };
  const tableColums: MyPageTableOptions<IContract> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      align: 'center',
      fixed: 'left',
    },
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   width: 100,
    //   align: 'center',
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      key: 'state',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: (state: string) => {
        let textColor = '';
        let stateText = '';

        if (state === 'Mới') {
          textColor = 'cyan';
          stateText = 'Mới';
        } else if (state === 'Đang chạy') {
          textColor = 'green';
          stateText = 'Đang chạy';
        } else if (state === 'Sắp hết hạn') {
          textColor = 'orange';
          stateText = 'Sắp hết hạn';
        } else if (state === 'Hết hạn' || state === 'Đã Hủy') {
          textColor = 'volcano';
          stateText = state === 'Hết hạn' ? 'Đã hết hạn' : 'Đã hủy';
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
      title: 'Tên nhân viên',
      dataIndex: 'employee_name',
      key: 'employee_name',
      width: 170,
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
      title: 'Phòng ban',
      dataIndex: 'department_name',
      key: 'department_name',
      width: 340,
      align: 'center',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'job_title',
      key: 'job_title',
      width: 270,
      align: 'center',
    },
    {
      title: 'Tên hợp đồng',
      dataIndex: 'name',
      key: 'name',
      width: 270,
      align: 'center',
    },

    {
      title: 'Loại hợp đồng',
      dataIndex: 'contract_type_name',
      key: 'contract_type_name',
      width: 130,
      align: 'center',
    },
    {
      title: 'Ngày ký',
      dataIndex: 'date_sign',
      key: 'date_sign',
      width: 100,
      align: 'center',
      render: (date: string) => {
        return <span>{date && formatDate(date)}</span>;
      },
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'date_start',
      key: 'date_start',
      width: 120,
      align: 'center',
      render: (date: string) => {
        return <span>{date && formatDate(date)}</span>;
      },
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'date_end',
      key: 'date_end',
      width: 120,
      align: 'center',
      render: (date: string) => {
        return <span>{date && formatDate(date)}</span>;
      },
    },
    {
      title: 'Giờ làm việc/tuần',
      dataIndex: 'resource_caldendar_name',
      key: 'resource_caldendar_name',
      width: 200,
      align: 'center',
    },
    {
      title: 'Số phút làm/ngày',
      dataIndex: 'minutes_per_day',
      key: 'minutes_per_day',
      width: 100,
      align: 'center',
    },
    // {
    //   title: "Chấm công đầu cuối",
    //   dataIndex: "start_end_attendance",
    //   key: "start_end_attendance",
    //   width: 150,
    //   align: "center",
    //   render: item => (item === true ? <CheckOutlined /> : <CloseOutlined />),
    // },
    // {
    //   title: "Theo ca của Huế",
    //   dataIndex: "by_hue_shift",
    //   key: "by_hue_shift",
    //   width: 150,
    //   align: "center",
    //   render: item => (item === true ? <CheckOutlined /> : <CloseOutlined />),
    // },
    {
      title: t({ id: 'action' }),
      key: 'id',
      dataIndex: 'id',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: item => (
        <Space size="middle">
          {(is_general_manager === 'true' || is_administrative == 'true' || sub_admin_role == 'recruitment' ) && (
            <>
              <EditOutlined
                style={{ fontSize: '14px', color: '#0960bd' }}
                onClick={() => handleEdit(item)}
              />
            </>
          )}
          <EyeOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleView(item)}
          />
          {/* <HistoryOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleShowHistory(item)}
          /> */}
        </Space>
      ),
    },
  ];
  const handleShowHistory = (id: number) => {
    setIdContract(id);
    setShowLog(true);
  };
  const handleView = (id: number) => {
    setIdContract(id);
    setIsCreating(false);
    setIsView(true);
    showDrawer();
  };
  let is_general_manager = localStorage.getItem('is_general_manager');
  let is_head_of_department = localStorage.getItem('is_head_of_department');
  return (
    <>
      <MyPage
        rowkey="id"
        title="Danh sách hợp đồng"
        // logData={_getContractLog}
        pageApi={_getContractListByArgs}
        tableOptions={tableColums}
        forceUpdate={forceUpdate}
        searchRender={
          (is_general_manager === 'true' ||
            is_head_of_department === 'true' ||
            sub_admin_role === 'recruitment') && <SearchContractMis />
        }
        setSelectedRowData={setSelectedRowArr}
        forceClearSelection={forceClearSelection}
        multipleSelection
        selectedRowArr={selectedRowArr}
        slot={
          (is_general_manager === 'true' || is_administrative === 'true' || sub_admin_role === 'recruitment') && (
            <>
              {/* <Button type="primary" onClick={handleImport}>
                Import
              </Button> */}
              <Button type="primary" onClick={handleCreate}>
                Tạo mới
              </Button>
            </>
          )
        }
      />
      <FormContract
        onClose={onClose}
        showDrawer={showDrawer}
        isView={isView}
        open={open}
        idContract={idContract}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        form={form}
        isCreating={isCreating}
      />
      <FileForm
        onClose={onClose}
        showDrawerImport={showDrawerImport}
        importOpen={importOpen}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        form={form}
      />
      <ContractLog
        showLog={showLog}
        idContract={idContract}
        onClose={onClose}
      />
    </>
  );
};
export default ContractList;
