import { useEffect, useState } from 'react';

import MyPage, { MyPageTableOptions } from '@/components/business/page';
import SearchApplicationListMis from '../components/search-mis';
import { Button, Collapse, Form, Modal, Space, Tag } from 'antd';
import { IApplicationList } from '@/interface/applicationlist/type';
import {
  IGetLeaveListArgs,
  IUpdateSummaryArgs,
  calculateAttendanceReport,
  deleteLeave,
  searchListLeaveV2,
  updateSummaryReport,
} from '@/api/weeklyreport/weeklyreport';
import { IUpdateStatusLeaveBody, IUpdateStatusLeaveParams } from './type';
import './style.css';
import { formatDate } from '@/utils/formatDate';
import { updateStatusLeave } from '@/api/shift/leavetype';
import { formatLeaveArr } from '@/utils/common';
import { message as $message } from 'antd';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { getTimeKeepingLog } from '@/api/timekeepingList/timekeeping.api';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useLocale } from '@/locales';
import ApplicationForm from '../handle';
import { getExplainationById } from '@/api/explanationRequest/explanationRequest.api';
import moment from 'moment';

const index = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [foceUpdate, setFoceUpdate] = useState(false);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [leaveData, setLeaveData] = useState<any>(null);
  const [idApplication, setIdApplication] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [isView, setIsView] = useState(false);
  const [checkUpdate, setCheckUpdate] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [success, setSuccess] = useState([]);
  const [error, setError] = useState([]);
  const [status, setStatus] = useState('');

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setIsView(false);
  };

  const tableColums: MyPageTableOptions<IApplicationList> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
      width: 60,
      fixed: 'left',

      render: index => {
        return index + 1;
      },
    },
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: 'center',
    //   width: 50,
    // },
    {
      title: 'Trạng thái ',
      dataIndex: 'state',
      key: 'state',
      align: 'center',
      width: 150,
      fixed: 'left',

      render: (item: string) => {
        if (item === 'confirm') {
          return (
            <Tag className="tags" color="#8F6161">
              Chờ duyệt
            </Tag>
          );
          //  <p className="table-state table-state-not">Chờ duyệt</p>;
        } else if (item === 'refuse') {
          return (
            <Tag className="tags" color="#cd201f">
              Từ chối
            </Tag>
          );
        } else if (item === 'validate') {
          return (
            <Tag className="tags" color="#22D73F">
              Đã duyệt
            </Tag>
          );
        } else if (item === 'validate1') {
          return (
            <Tag className="" color="#FF6600">
              Đã duyệt cấp 1
            </Tag>
          );
        }
      },
    },
    {
      title: 'Từ ngày',
      dataIndex: 'date_from',
      key: 'date_from',
      width: 150,
      align: 'center',
      fixed: 'left',
      render: item => {
        return <div>{moment(item).format('HH:mm - DD/MM ')}</div>;
      },
    },
    {
      title: 'Đến ngày',
      dataIndex: 'date_to',
      key: 'date_to',
      width: 150,
      align: 'center',
      fixed: 'left',

      render: item => {
        return <div>{moment(item).format('HH:mm - DD/MM ')}</div>;
      },
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'employee_code',
      key: 'employee_code',
      width: 120,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'employee_name',
      key: 'employee_name',
      width: 150,
      align: 'center',
      fixed: 'left',
    },

    {
      title: 'Loại đơn',
      dataIndex: 'holiday_status_name',
      key: 'holiday_status_name',
      width: 150,
      align: 'center',
    },
    {
      title: 'Vì lý do',
      dataIndex: 'for_reasons',
      key: 'for_reasons',
      width: 100,
      align: 'center',
      render: item => {
        return (
          <div>
            {item === '1' ? 'Cá nhân' : item === '2' ? 'Công việc' : ''}
          </div>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      key: 'create_date',
      width: 100,
      align: 'center',
      render: item => {
        return <div>{formatDate(item)}</div>;
      },
    },
    {
      title: 'Lý do',
      dataIndex: 'reasons',
      key: 'reasons',
      width: 200,
      align: 'center',
    },

    {
      title: 'Số phút', // TODO
      dataIndex: 'minutes',
      key: 'minutes',
      width: 100,
      align: 'center',
    },
    {
      title: 'Số phút cũ',
      dataIndex: 'old_minutes',
      key: 'old_minutes',
      width: 100,
      align: 'center',
    },
    {
      title: 'Người duyệt',
      dataIndex: 'employee_parent_name',
      key: 'employee_parent_name',
      width: 200,
      align: 'center',
    },
    {
      title: 'HCNS duyệt',
      dataIndex: 'hr_approval_name',
      key: 'hr_approval_name',
      width: 100,
      align: 'center',
    },
    {
      title: 'Ngày duyệt',
      dataIndex: 'approval_date',
      key: 'approval_date',
      width: 120,
      align: 'center',
      render: item => {
        if (item != null && item != false) {
          return <div>{formatDate(item)}</div>;
        } else {
          return <span></span>;
        }
      },
    },
    {
      title: 'Công ty',
      dataIndex: 'mis_id',
      key: 'mis_id',
      width: 100,
      align: 'center',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department_name',
      key: 'department_name',
      width: 220,
      align: 'center',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'employee_job_title',
      key: 'employee_job_title',
      width: 220,
      align: 'center',
    },
    {
      title: t({ id: 'action' }),
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: item => (
        <Space size="middle">
          {is_general_manager === 'true' && (
            <EditOutlined
              style={{ fontSize: '14px', color: '#0960bd' }}
              onClick={() => handleEdit(item.id)}
            />
          )}
          <EyeOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleView(item.id)}
          />
        </Space>
      ),
    },
  ];
  const handleView = (id: number) => {
    showDrawer();
    setIdApplication(id);
    setIsView(true);
  };
  const _getApplicationById = async (id: number) => {
    const res = await getExplainationById(id);
    console.log(res, 'QQQQQQQQQQQQQQ');
    if (res) {
      if (res?.state !== 'confirm') {
        return false;
      }
      return true;
    }
  };
  const handleEdit = async (id: number) => {
    const canUpdate = await _getApplicationById(id);

    if (!canUpdate && is_administrative === 'true') {
      setCheckUpdate(true);
    } else {
      setCheckUpdate(false);
    }
    if (!canUpdate && is_administrative === 'false') {
      $message.error('Không được phép sửa đơn đã duyệt hoặc từ chối!');
      return;
    } else {
      showDrawer();
      setIdApplication(id);
    }
  };
  const handleApprove = async () => {
    // console.log('Approve');
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 đơn');
      return;
    }

    // const ids = selectedRowArr.map((item: any) => item.id);
    //   const res = await updateStatusLeave(ids);
    //   if (res) {
    //     setSuccess(res.results.message);
    //     setError(res.results.error);
    //     showModal();
    //   }
    _updateStatusLeaveList(selectedRowArr, 'validate');
  };
  const handleCancel = () => {
    // console.log('Cancel');
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 đơn');
      return;
    }

    _updateStatusLeaveList(selectedRowArr, 'refuse');
  };
  const searhListLeave = async (args: IGetLeaveListArgs) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await searchListLeaveV2(args);
    if (res) {
      setLeaveData(res.results);
      setFoceUpdate(!foceUpdate);
      setForceClearSelection(!forceClearSelection);
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };

  const is_administrative = localStorage.getItem('is_administrative');
  const _updateStatusLeaveList = async (selectedRow: any[], status: string) => {
    setStatus(
      status === 'validate' || status === 'validate1' ? 'duyệt' : 'hủy'
    );
    const args: string[] = [formatLeaveArr(selectedRow), status];
    const params: IUpdateStatusLeaveParams = {
      args: args,
    };
    const body: IUpdateStatusLeaveBody = {
      params: params,
    };
    const res = await updateStatusLeave(body);
    console.log(res, 'RESSSSSSSSS');
    if (res) {
      if (res.result.is_success) {
        //  $message.error(res.result.message);

        if (res.result.error.length > 0) {
          //setSuccess(res.results.message)

          setError(res.result?.error);
          showModal();
          console.log(error, 'OOOO');
        } else {
          $message.success('Cập nhật trạng thái thành công!');
        }
      }

      if (is_administrative !== 'true') {
        await Promise.all(
          selectedRow.map((item: any) => {
            calculateAttendanceReport({
              params: {
                args: [
                  item?.date_from
                    ? moment(item?.date_from).format('DD/MM/YYYY')
                    : '',
                  item?.date_to
                    ? moment(item?.date_to).format('DD/MM/YYYY')
                    : '',
                  item?.employee_code,
                ],
              },
            });
            const body: IUpdateSummaryArgs = {
              company_name: item?.company_name,
              start: item?.date_from
                ? moment(item?.date_from).format('YYYY-MM-DD')
                : '',
              end: item?.date_to
                ? moment(item?.date_to).format('YYYY-MM-DD')
                : '',
              page_size: 0,
              page_number: 0,
              is_update_contract: false,
              is_compute_worktime: false,
              department: false,
              employee_code: item?.employee_code,
            };
            updateSummaryReport(body);
          })
        );
      }

      setFoceUpdate(!foceUpdate);
      setForceClearSelection(!forceClearSelection);
      setSelectedRowArr([]);
    } else {
      setForceClearSelection(!forceClearSelection);
      setSelectedRowArr([]);
    }
  };
  const handleDelete = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 đơn');
      return;
    }
    if (is_general_manager !== 'true') {
      $message.error('Quản lý chung mới được phép xóa!');
      return;
    }
    store.dispatch(setGlobalState({ loading: true }));
    const ids = selectedRowArr.map((item: any) => item.id);
    await Promise.all(ids.map(id => deleteLeave(id)))
      .then(res => {
        if (res) {
          // $message.success('Xoá đơn thành công');
          setFoceUpdate(!foceUpdate);
          setSelectedRowArr([]);
          setForceClearSelection(!forceClearSelection);
          store.dispatch(setGlobalState({ loading: false }));
          selectedRowArr.forEach(
            (item: any) =>
              item?.state === 'validate' &&
              calculateAttendanceReport({
                params: {
                  args: [
                    item?.date_from
                      ? moment(item?.date_from).format('DD/MM/YYYY')
                      : '',
                    item?.date_to
                      ? moment(item?.date_to).format('DD/MM/YYYY')
                      : '',
                    item?.employee_code,
                  ],
                },
              }).then(() => {
                updateSummaryReport({
                  company_name: item?.company_name,
                  start: item?.date_from
                    ? moment(item?.date_from).format('YYYY-MM-DD')
                    : '',
                  end: item?.date_to
                    ? moment(item?.date_to).format('YYYY-MM-DD')
                    : '',
                  page_size: 0,
                  page_number: 0,
                  is_update_contract: false,
                  is_compute_worktime: false,
                  department: false,
                  employee_code: item?.employee_code,
                });
              })
          );
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        store.dispatch(setGlobalState({ loading: false }));
        setSelectedRowArr([]);
        setForceClearSelection(!forceClearSelection);
      });
  };
  const _getTimeKeepingLog = async () => {
    const res = await getTimeKeepingLog();
    if (res) {
      return res;
    }
  };
  let is_general_manager = localStorage.getItem('is_general_manager');
  let is_head_of_department = localStorage.getItem('is_head_of_department');
  let is_department_secretary = localStorage.getItem('is_department_secretary');

  const showModal = () => {
    setIsOpenModal(true);
  };
  const handleOk = () => {
    setIsOpenModal(false);
  };
  const closeModal = () => {
    setIsOpenModal(false);
  };

  const items = [
    {
      key: '1',
      label: `Có ${error?.length || 0} bản ghi ${status} thất bại`,
      children: <p>{error && error.map(item => <p>{item}</p>)}</p>,
    },
  ];
  const { Panel } = Collapse;
  return (
    <>
      <Modal
        title="Thông báo lỗi"
        open={isOpenModal}
        onOk={handleOk}
        onCancel={closeModal}>
        <Collapse accordion>
          {items.map((item: any) => (
            <Panel header={item.label} key={item.key}>
              {item.children}
            </Panel>
          ))}
        </Collapse>
      </Modal>
      <MyPage
        rowkey="id"
        pageApi={searhListLeave}
        multipleSelection
        forceUpdate={foceUpdate}
        title={'Danh sách đơn yêu cầu'}
        searchRender={<SearchApplicationListMis />}
        tableOptions={tableColums}
        setSelectedRowData={setSelectedRowArr}
        forceClearSelection={forceClearSelection}
        selectedRowArr={selectedRowArr}
        slot={
          <>
            <Button type="primary" onClick={handleApprove}>
              Duyệt
            </Button>

            <>
              <Button type="primary" onClick={handleCancel}>
                Từ chối
              </Button>
            </>

            <Button type="primary" onClick={handleDelete}>
              Xóa
            </Button>
          </>
        }
      />
      <ApplicationForm
        checkUpdate={checkUpdate}
        form={form}
        isView={isView}
        onClose={onClose}
        open={open}
        idApplication={idApplication}
        forceUpdate={foceUpdate}
        showDrawer={showDrawer}
        setForceUpdate={setFoceUpdate}
      />
    </>
  );
};

export default index;
