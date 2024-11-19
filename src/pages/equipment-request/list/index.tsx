import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { FC } from 'react';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { useState, useEffect } from 'react';
import { message as $message } from 'antd';
import { useLocale } from '@/locales';
import { Button, Form, Space, Tag } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { formatDate } from '@/utils/formatDate';
import SearchBookingRooms from '../components/search';
import FormCreateRooms from '../create-rooms';
import { deleteEquipmentRequestById, getEquipmentRequestByArgs, updateStateEquipmentRequest } from '@/api/equipment_request/equipment_request.api';
import { IEquipmentRequest, IGetEquipmentRequest } from '@/interface/equipmentRequest/equipment-request';
import FormEquipmentRequest from '../handle';
import MyModal from '@/components/basic/modal';
const EquipmentRequest: FC = () => {
  const [form] = Form.useForm();
  const { t } = useLocale();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [openRoom, setOpenRoom] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [isCreating, setIsCreating] = useState<boolean>();
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>();
  const [idEquipmentRequest, setIdEquipmentRequest] = useState<any>(undefined);
  const [isView, setIsView] = useState<boolean>(false);
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const _getEquipmentRequestListByArgs = async (params: IGetEquipmentRequest) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getEquipmentRequestByArgs(params);
    console.log(res);
  
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };
  useEffect(() => {
    console.log("isCreate: ", isCreating);

  })
  const handleDelete = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 đơn xin văn phòng phẩm để xóa');
      return;
    }

    const ids = selectedRowArr.map((item: IEquipmentRequest) => item.id);
    try {
      store.dispatch(setGlobalState({ loading: true }));
      await Promise.all(ids.map(id => deleteEquipmentRequestById(id)));
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
      setForceUpdate(!forceUpdate);
      store.dispatch(setGlobalState({ loading: false }));
      $message.success('Xóa đơn xin văn phòng phẩm thành công');
    }
  };
  const handleConfirm = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 đơn xin văn phòng phẩm để duyệt');
      return;
    }
    console.log(selectedRowArr);
    await Promise.all(
      selectedRowArr.map((item: any) => {
        const data = {
          id: item.id,
          employee_name_id: item?.employee_id,
          department_name_id: item?.department_id,
          equipment_request_ids: item?.equipment_request_ids,
          create_date: item?.create_date,
          purpose: item?.purpose,
          status: 'approval',
        };
        return updateStateEquipmentRequest(data);
      })
    )
      .then(() => {
        $message.success('Duyệt đơn thành công');
        setSelectedRowArr([]);
        setForceUpdate(!forceUpdate);
        setForceClearSelection(!forceClearSelection);
        store.dispatch(setGlobalState({ loading: false }));
      })
      .catch(error => {
        console.error(error);
      });
  };
  const handleReject = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 đơn xin văn phòng phẩm để từ chối');
      return;
    }
    console.log(selectedRowArr);
    await Promise.all(
      selectedRowArr.map((item: any) => {
        const data = {
          id: item.id,
          employee_name_id: item?.employee_id,
          department_name_id: item?.department_id,
          equipment_request_ids: item?.equipment_request_ids,
          create_date: item?.create_date,
          purpose: item?.purpose,
          status: 'reject',
        };
        
        return updateStateEquipmentRequest(data);
      })
    )
      .then(() => {
        $message.success('Từ chối đơn thành công');
        setSelectedRowArr([]);
        setForceUpdate(!forceUpdate);
        setForceClearSelection(!forceClearSelection);
        store.dispatch(setGlobalState({ loading: false }));
      })
      .catch(error => {
        console.error(error);
      });
  };
  const handleCreate = () => {
    setIsCreating(true);
    showDrawer();
    setIdEquipmentRequest(undefined);
    setIsView(false);
  };
  const handleCreateRoom = () => {
    showDrawerRoom();
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const showDrawerRoom = () => {
    setOpenRoom(true)
    setIsCreatingRoom(true)
  }
  const handleEdit = (id: number) => {
    setIsCreating(false);
    setIdEquipmentRequest(id);
    showDrawer();
    setIsView(false);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onCloseRoom = () => {
    setOpenRoom(false);
  };
  const tableColums: MyPageTableOptions<IEquipmentRequest> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      align: 'center',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employee_name',
      key: 'employee_name',
      width: 100,
      align: 'center',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department_name',
      key: 'department_name_id',
      width: 100,
      align: 'center',
    },
    {
      title: 'Văn phòng phẩm',
      dataIndex: 'equipment_request_ids',
      key: 'equipment_request_ids',
      width: 240,
      align: 'center',
      render: (item) => {
        if (item) {
          const productNames = item.map((product: any) => product.product_name);
          
          return (
            <div>
              {productNames.map((product_name : any, index: number) => (
                <div key={index}>{product_name}</div>
              ))}
            </div>
          );
        } else {
          return "Không có thông tin sản phẩm";
        }
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      key: 'create_date',
      width: 80,
      align: 'center',
      render: (item: string) => {
        return <span>{item && formatDate(item)}</span>;
      },
    },
    {
      title: 'Mục đích',
      dataIndex: 'purpose',
      key: 'purpose',
      width: 80,
      align: 'center',
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (item: string) => {
        let textColor = '';
        let stateText = '';

        if (item == 'waiting' || item == 'draft') {
          textColor = 'cyan';
          stateText = 'Chờ duyệt';
        } else if (item == 'approval' || item == 'approved') {
          textColor = 'green';
          stateText = 'Đã duyệt';
        } else if (item == 'reject') {
          textColor = 'volcano';
          stateText = 'Từ chối';
        } else {
          textColor = 'grey';
          stateText = item;
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
      title: t({ id: 'action' }),
      key: 'id',
      dataIndex: 'id',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: item => (

        <Space size="middle">
          {
            (is_general_manager === 'true' || is_department_secretary === 'true' || is_head_of_department === 'true' || is_administrative === 'true' || sub_admin_role !== "none") && (
              <EditOutlined
                style={{ fontSize: '14px', color: '#0960bd' }}
                onClick={() => handleEdit(item)}
              />
            )
          }
          <EyeOutlined 
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => {
              setIsView(true);
              handleView(item);
            }}
          />
        </Space>
      ),
    },
  ];
  const handleView = (id: number) => {
    setIsCreating(false);
    setIdEquipmentRequest(id);
    showDrawer();
    setIsView(true);
  }
  const is_general_manager = localStorage.getItem('is_general_manager');
  const is_head_of_department = localStorage.getItem('is_head_of_department');
  const is_department_secretary = localStorage.getItem('is_department_secretary');
  const is_administrative = localStorage.getItem('is_administrative');
  return (

    <>
      <MyPage
        rowkey="id"
        title="Danh sách đơn xin văn phòng phẩm"
        // logData={_getContractLog}
        pageApi={_getEquipmentRequestListByArgs}
        tableOptions={tableColums}
        forceUpdate={forceUpdate}
        searchRender={<SearchBookingRooms />}
        setSelectedRowData={setSelectedRowArr}
        forceClearSelection={forceClearSelection}
        multipleSelection
        selectedRowArr={selectedRowArr}

        slot={
          <>
            {
              (is_general_manager === 'true' || is_department_secretary === 'true' || is_head_of_department === 'true' || is_administrative === 'true' || sub_admin_role !== "none") && (
                <>

                
                  <Button type="primary" onClick={handleCreateRoom}>
                    Danh sách vpp
                  </Button>
                  <Button type="primary" onClick={handleConfirm}>
                    Duyệt đơn
                  </Button>
                  <Button type="primary" onClick={handleReject}>
                    Từ chối
                  </Button>
                  <Button type="primary" onClick={handleDelete}>
                    Xóa
                  </Button>
                </>
              )
            }
            <Button type="primary" onClick={handleCreate}>
              Tạo đơn
            </Button>
          </>
        }
      />
      <FormEquipmentRequest
        onClose={onClose}
        showDrawer={showDrawer}
        open={open}
        idEquipmentRequest={idEquipmentRequest}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        form={form}
        isViewMode={isView}
        isCreating={isCreating}
      />
      <FormCreateRooms
        onClose={onCloseRoom}
        showDrawer={showDrawerRoom}
        open={openRoom}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        form={form}
      />
    </>
  );
};
export default EquipmentRequest;
