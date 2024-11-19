import {
  approveChangeRequest,
  deleteChangeRequest,
  getChangeRequest,
  getChangeRequestById,
  IChangeRequestArgs,
  updateChangeResquest,
} from '@/api/approvalChangeRequest';
import { IApprovalChangeRequest } from '@/api/approvalChangeRequest/transform';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { useLocale } from '@/locales';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Form, message, Space, Tag } from 'antd';
import { FC, useState } from 'react';
import SearchApprovalChangeRequest from '../components/search';
import ApprovalChangeRequestForm from '../components/handle';

const ApprovalChangeRequest: FC = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [idApproval, setIdApproval] = useState<any>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isView, setIsView] = useState(false);
  const _getApprovalChangeRequest = async (args: IChangeRequestArgs) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getChangeRequest(args);
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };
  const is_administrative = localStorage.getItem('is_administrative');
  const tableColumns: MyPageTableOptions<IApprovalChangeRequest> = [
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
    //     width: 30,
    //     align: 'center',
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

        if (state === 'Chờ duyệt') {
          textColor = 'cyan';
          stateText = 'Chờ duyệt';
        } else if (state === 'Đã duyệt') {
          textColor = 'green';
          stateText = 'Đã duyệt';
        } else if (state === 'Từ chối') {
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
      title: 'Người yêu cầu',
      dataIndex: 'approval_assigned_to_name',
      key: 'approval_assigned_to_name',
      width: 200,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Công ty',
      dataIndex: 'mis_id',
      key: 'mis_id',
      width: 70,
      align: 'center',
    },
    {
      title: 'Người quản lý mới',
      dataIndex: 'apec_common_contact_name',
      key: 'apec_common_contact_name',
      width: 200,
      align: 'center',
    },
    {
      title: 'Email người quản lý mới',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      align: 'center',
    },
    {
      title: 'Người duyệt',
      dataIndex: 'approval_uid_name',
      key: 'approval_uid_name',
      width: 100,
      align: 'center',
    },
    {
      title: 'Người tạo',
      dataIndex: 'create_uid_name',
      key: 'create_uid_name',
      width: 150,
      align: 'center',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      key: 'create_date',
      width: 100,
      align: 'center',
    },
    {
      title: t({ id: 'action' }),
      key: 'id',
      dataIndex: 'id',
      fixed: 'right',
      width: 70,
      align: 'center',
      render: item => (
        <Space size="middle">
          {is_administrative === 'true' && (
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
        </Space>
      ),
    },
  ];

  const handleEdit = async (item: number) => {
    const approvalItem = await getChangeRequestById(item);
    let canUpdate = true;
    if (approvalItem) {
      if (approvalItem.state !== '1') {
        canUpdate = false;
      }
      if (!canUpdate) {
        message.error('Không thể chỉnh sửa đơn đã được duyệt hoặc từ chối');
        return;
      }
      setIdApproval(item);
      setIsCreating(false);
      setIsView(false);
      setOpen(true);
    }
  };
  const handleView = (item: number) => {
    setIdApproval(item);
    setIsCreating(false);
    setIsView(true);
    setOpen(true);
  };

  const handleApprove = async () => {
    if (selectedRowArr.length === 0) {
      message.error('Vui lòng chọn ít nhất 1 dòng để duyệt');
      return;
    } else {
      store.dispatch(setGlobalState({ loading: true }));
      const check = selectedRowArr.some(
        item => item.state === '2' || item.state === '3'
      );
      if (check) {
        message.error('Không thể duyệt đơn đã được duyệt hoặc từ chối');
        setForceClearSelection && setForceClearSelection(!forceClearSelection);
        store.dispatch(setGlobalState({ loading: false }));
        setSelectedRowArr([]);

        return selectedRowArr;
      }
      const secondCheck = selectedRowArr.some(
        item => !item.apec_common_contact_id
      );
      if (secondCheck) {
        message.error('Không thể duyệt đơn không có người quản lý mới');
        setForceClearSelection && setForceClearSelection(!forceClearSelection);
        store.dispatch(setGlobalState({ loading: false }));
        setSelectedRowArr([]);
        return selectedRowArr;
      }
      let approvalResults = [];
      for (const item of selectedRowArr) {
        try {
          const res = await approveChangeRequest(item.id);
          if (res) {
            approvalResults.push(res);
          }
        } catch (error) {
          message.error('Duyệt thất bại');
          return;
        }
      }
      setForceClearSelection && setForceClearSelection(!forceClearSelection);
      setForceUpdate && setForceUpdate(!forceUpdate);
      store.dispatch(setGlobalState({ loading: false }));
      message.success('Duyệt thành công');
      setSelectedRowArr([]);
      return approvalResults;
    }
  };
  const handleDelete = async () => {
    if (selectedRowArr.length === 0) {
      message.error('Vui lòng chọn ít nhất 1 dòng để xóa');
      return;
    }

    const check = selectedRowArr.some(
      item => item.state === '2' || item.state === '3'
    );

    if (check) {
      message.error('Không thể xóa đơn đã được duyệt hoặc từ chối');
      setForceClearSelection && setForceClearSelection(!forceClearSelection);
      setSelectedRowArr([]);
      return selectedRowArr;
    }

    store.dispatch(setGlobalState({ loading: true }));

    const itemsToDelete = selectedRowArr.map(item => item.id);
    try {
      await Promise.all(
        itemsToDelete.map(async id => {
          const res = await deleteChangeRequest(id);
          if (res) {
            return res;
          } else {
            throw new Error('Xóa thất bại');
          }
        })
      );
      message.success('Xóa thành công');
    } catch (error) {
      console.log('11111111');

      message.error('Xóa thất bại');
    } finally {
      console.log('ávdsahjd');
      store.dispatch(setGlobalState({ loading: false }));
      setForceUpdate && setForceUpdate(!forceUpdate);
      setForceClearSelection && setForceClearSelection(!forceClearSelection);
      setSelectedRowArr([]);
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setIdApproval(undefined);
    setIsCreating(false);
    setIsView(false);
  };
  const handleCreate = () => {
    setIsCreating(true);
    showDrawer();
  };
  const handleDeny = async () => {
    if (selectedRowArr.length === 0) {
      message.error('Vui lòng chọn ít nhất 1 dòng để từ chối');
      return;
    } else {
      store.dispatch(setGlobalState({ loading: true }));
      const check = selectedRowArr.some(
        item => item.state === '2' || item.state === '3'
      );
      if (check) {
        message.error('Không thể từ chối đơn đã được duyệt hoặc từ chối');
        setForceClearSelection && setForceClearSelection(!forceClearSelection);
        store.dispatch(setGlobalState({ loading: false }));
        setSelectedRowArr([]);
        return selectedRowArr;
      }
      const itemsToDeny = selectedRowArr.map(item => item.id);
      await Promise.all(
        itemsToDeny.map(async id => {
          const res = await updateChangeResquest({ state: '3' }, id);
          if (res) {
            store.dispatch(setGlobalState({ loading: false }));
            setForceUpdate && setForceUpdate(!forceUpdate);
            setForceClearSelection &&
              setForceClearSelection(!forceClearSelection);
            message.success('Từ chối thành công');
            return res;
          }
        })
      )
        .catch(() => {
          message.error('Từ chối thất bại');
        })
        .finally(() => {
          setForceClearSelection &&
            setForceClearSelection(!forceClearSelection);
          setSelectedRowArr([]);
          store.dispatch(setGlobalState({ loading: false }));
        });
    }
  };
  return (
    <>
      <MyPage
        rowkey="id"
        title="Đơn xin đổi người quản lý"
        searchRender={<SearchApprovalChangeRequest />}
        pageApi={_getApprovalChangeRequest}
        forceUpdate={forceUpdate}
        setSelectedRowData={setSelectedRowArr}
        selectedRowArr={selectedRowArr}
        forceClearSelection={forceClearSelection}
        multipleSelection
        tableOptions={tableColumns}
        
        slot={
          <>
            {is_administrative === 'true' && (
              <>
                <Button type="primary" onClick={handleApprove}>
                  Duyệt
                </Button>
                <Button type="primary" onClick={handleDeny}>
                  Từ chối
                </Button>
              </>
            )}
            <Button type="primary" onClick={handleCreate}>
              Tạo mới
            </Button>
            <Button type="primary" onClick={handleDelete}>
              Xóa
            </Button>
            <div style={{ position: 'absolute', bottom: 30, left: 20 }}>
              Số bản ghi đã được chọn :
              <span style={{ fontWeight: 'bold',paddingLeft:5 }}>
                {selectedRowArr.length}
              </span>
            </div>
          </>
        }
      />
      <ApprovalChangeRequestForm
        onClose={onClose}
        showDrawer={showDrawer}
        isView={isView}
        open={open}
        idApproval={idApproval}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        form={form}
        isCreating={isCreating}
      />
    </>
  );
};

export default ApprovalChangeRequest;
