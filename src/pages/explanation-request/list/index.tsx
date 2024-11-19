import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { Button, Collapse, Form, Modal, Space, Tag } from 'antd';
import { FC } from 'react';
import SearchExplainRequestMis from '../components/search-mis';
import { IInvalidTimesheet } from '@/interface/weeklyreport/type';
import { useState } from 'react';
import {
  IUpdateInvalidTimesheetArgs,
  deleteInvalidTimeeSheetById,
  getInvalidTimeeSheetByArgs,
  updateInvalidTimeeSheet,
  updateInvalidTimeeSheet2,
} from '@/api/invalidTimesheet/invalidTimesheet.api';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import type { CollapseProps } from 'antd';
import { message as $message } from 'antd';
import { CheckOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { formatDate } from '@/utils/formatDate';
import { useLocale } from '@/locales';
import ExplainationForm from '../handle';
import { getInvalidTimeSheetById } from '../../../api/invalidTimesheet/invalidTimesheet.api';
import { calculateAttendanceReport } from '@/api/weeklyreport/weeklyreport';
import moment from 'moment';
const ExplanationRequest: FC = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [idExplaination, setIdExplaination] = useState<any>(null);
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [isView, setIsView] = useState(false);
  const [success, setSuccess] = useState([]);
  const [error, setError] = useState([]);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setIsView(false);
  };
  const _getInvalidTimeeSheetByArgs = async (params: IInvalidTimesheet) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getInvalidTimeeSheetByArgs(params);
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };
  function floatToHourMinutes(floatValue: number): string {
    const hours = Math.floor(floatValue);
    const minutesDecimal = floatValue - hours;
    const minutes = Math.round(minutesDecimal * 60);

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${formattedMinutes}`;
  }
  function convertDatetimeStringToHourMinute(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const is_administrative = localStorage.getItem('is_administrative');

  const handleApprove = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn giải trình');
    } else {
      store.dispatch(setGlobalState({ loading: true }));
      const itemsToValidate = selectedRowArr.filter(
        (item: any) => item.validated !== '2' && item.validated !== '3'
      );
      if (itemsToValidate.length === 0) {
        $message.warning('Tất cả giải trình đã được từ chối trước đó');
        setSelectedRowArr([]);
        setForceClearSelection(!forceClearSelection);
        return;
      }
      const ids = selectedRowArr.map((item: any) => item.id);
      const res = await updateInvalidTimeeSheet2(ids);
      if (res) {
        setSuccess(res.results.message);
        setError(res.results.error);
        showModal();
      }
      if (is_administrative !== 'true') {
        selectedRowArr.map((item: any) =>
          calculateAttendanceReport({
            params: {
              args: [
                item?.invalid_date
                  ? moment(item?.invalid_date).format('DD/MM/YYYY')
                  : null,
                item?.invalid_date
                  ? moment(item?.invalid_date).format('DD/MM/YYYY')
                  : null,
                item?.employee_code,
              ],
            },
          })
        );
      }

      setSelectedRowArr([]);
      setForceUpdate(!forceUpdate);
      setForceClearSelection(!forceClearSelection);
      store.dispatch(setGlobalState({ loading: false }));
    }
  };
  const handleCancle = async () => {
    store.dispatch(setGlobalState({ loading: true }));
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn giải trình');
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
    } else {
      for (const item of selectedRowArr) {
        const data: IUpdateInvalidTimesheetArgs = {
          id: Number(item.id),
          reason: item.reason,
          remarks: item.remarks,
          validated: '3',
          invalid_type: item.invalid_type,
          keep_in_time: item.keep_in_time,
        };
        await updateInvalidTimeeSheet(data);
      }

      setSelectedRowArr([]);
      setForceUpdate(!forceUpdate);
      setForceClearSelection(!forceClearSelection);
      store.dispatch(setGlobalState({ loading: false }));
    }
  };
  const handleDelete = async () => {
    store.dispatch(setGlobalState({ loading: true }));
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn giải trình');
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
      return;
    } else {
      for (const item of selectedRowArr) {
        const id: number = Number(item.id);
        await deleteInvalidTimeeSheetById(id);
      }
      selectedRowArr.map(
        (item: any) =>
          item?.validated === '2' &&
          calculateAttendanceReport({
            params: {
              args: [
                item?.invalid_date
                  ? moment(item?.invalid_date).format('DD/MM/YYYY')
                  : null,
                item?.invalid_date
                  ? moment(item?.invalid_date).format('DD/MM/YYYY')
                  : null,
                item?.employee_code,
              ],
            },
          })
      );
      setSelectedRowArr([]);
      setForceUpdate(!forceUpdate);
      setForceClearSelection(!forceClearSelection);
      store.dispatch(setGlobalState({ loading: false }));
    }
  };
  const tableColums: MyPageTableOptions<IInvalidTimesheet> = [
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
    //   align: 'center',
    //   width: 60,
    // },

    {
      title: 'Trạng thái',
      dataIndex: 'validated',
      key: 'validated',
      width: 100,
      align: 'center',
      fixed: 'left',

      render: (item: string) => {
        let textColor = '';
        let stateText = '';

        if (item === '1') {
          textColor = 'cyan';
          stateText = 'Chờ duyệt';
        } else if (item === '2') {
          textColor = 'green';
          stateText = 'Đã duyệt';
        } else if (item === '3') {
          textColor = 'red';
          stateText = 'Từ chối';
        } else {
          stateText = '';
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
      title: 'Ngày vi phạm',
      dataIndex: 'invalid_date',
      key: 'invalid_date',
      width: 120,
      align: 'center',
      render: (item: string) => {
        return <span>{item && formatDate(item)}</span>;
      },
    },
    {
      title: 'Leave from-To',
      width: 100,
      align: 'center',
      fixed: 'left',
      children: [
        {
          title: 'From',
          dataIndex: 'attendance_missing_from',
          key: 'attendance_missing_from',
          width: 70,
          align: 'center',
          fixed: 'left',

          render: (item: string) => {
            return <span>{item && moment(item).format('HH:mm')}</span>;
          },
        },
        {
          title: 'To',
          fixed: 'left',

          dataIndex: 'attendance_missing_to',
          key: 'attendance_missing_to',
          width: 70,
          align: 'center',
          render: (item: string) => {
            return <span>{item && moment(item).format('HH:mm')}</span>;
          },
        },
      ],
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
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      width: 100,
      align: 'center',
      render: (item: string) => {
        if (item === '1') {
          return <span>Cá nhân</span>;
        } else if (item === '2') {
          return <span>Công việc</span>;
        }
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 290,
      align: 'center',
    },
    {
      title: 'Loại giải trình',
      dataIndex: 'invalid_type',
      key: 'invalid_type',
      width: 110,
      align: 'center',
      render: (item: string) => {
        if (item === '1') {
          return <span>Về sớm</span>;
        } else if (item === '2') {
          return <span>Đi muộn</span>;
        } else if (item === '5') {
          return <span>Ra ngoài</span>;
        }
      },
    },
    
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
      width: 300,
      align: 'center',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      width: 300,
      align: 'center',
    },
   

    

    {
      title: 'Shift from-To',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'From',
          dataIndex: 'shift_from',
          key: 'shift_from',
          align: 'center',
          width: 80,
          render: (item: number) => {
            return <span>{item && floatToHourMinutes(item)}</span>;
          },
        },
        {
          title: 'To',
          dataIndex: 'shift_to',
          key: 'shift_to',
          align: 'center',
          width: 80,
          render: (item: number) => {
            return <span>{item && floatToHourMinutes(item)}</span>;
          },
        },
      ],
    },

    {
      title: 'Ca gãy',
      dataIndex: 'shift_break',
      key: 'shift_break',
      width: 100,
      align: 'center',
      render: (item: string) => {
        if (item) {
          return (
            <span>
              <CheckOutlined />
            </span>
          );
        }
      },
    },
    {
      title: 'Chấm công thực tế',
      dataIndex: 'real_time_attendance_data',
      key: 'real_time_attendance_data',
      width: 140,
      align: 'center',
      render: (item: string) => {
        return <span>{item && convertDatetimeStringToHourMinute(item)}</span>;
      },
    },
    {
      title: 'Validation data',
      dataIndex: 'validation_data',
      key: 'validation_data',
      width: 140,
      align: 'center',
      render: (item: number) => {
        return <span>{item && floatToHourMinutes(item)}</span>;
      },
    },
    
    {
      title: 'Người duyệt',
      dataIndex: 'reviewer_name',
      key: 'reviewer_name',
      width: 180,
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
    setIsView(true);
    showDrawer();
    setIdExplaination(id);
  };
  const _getInvalidtimeSheetById = async (id: number) => {
    const res = await getInvalidTimeSheetById(id);
    if (res) {
      if (res?.validated !== '1') {
        return false;
      }
      return true;
    }
  };
  const handleEdit = async (id: number) => {
    const canUpdate = await _getInvalidtimeSheetById(id);
    if (!canUpdate) {
      $message.error('Giải trình đã được duyệt hoặc từ chối');
      return;
    } else {
      showDrawer();
      setIdExplaination(id);
    }
  };

  let is_general_manager = localStorage.getItem('is_general_manager');
  let is_head_of_department = localStorage.getItem('is_head_of_department');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const items = [
    {
      key: '1',
      label: `Có ${success.length || 0} bản ghi duyệt thành công`,
      children: <p>{success && success.map(item => <p>{item}</p>)}</p>,
    },
    {
      key: '2',
      label: `Có ${error.length || 0} bản ghi duyệt thất bại`,
      children: <p>{error && error.map(item => <p>{item}</p>)}</p>,
    },
  ];
  const { Panel } = Collapse;
  return (
    <>
      <Modal
        title="modal thông báo"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
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
        pageApi={_getInvalidTimeeSheetByArgs}
        title={'Yêu cầu giải trình'}
        searchRender={<SearchExplainRequestMis />}
        tableOptions={tableColums}
        setSelectedRowData={setSelectedRowArr}
        forceClearSelection={forceClearSelection}
        multipleSelection
        forceUpdate={forceUpdate}
        selectedRowArr={selectedRowArr}
        slot={
          <>
            <>
              <Button type="primary" onClick={handleApprove}>
                {'Duyệt'}
              </Button>
              <Button type="primary" onClick={handleCancle}>
                {'Từ chối'}
              </Button>
            </>
            {is_general_manager === 'true' ? (
              <Button type="primary" onClick={handleDelete}>
                {'Xóa'}
              </Button>
            ) : null}
          </>
        }
      />
      <ExplainationForm
        isView={isView}
        form={form}
        onClose={onClose}
        open={open}
        idExplaination={idExplaination}
        forceUpdate={forceUpdate}
        setForceUpdate={setForceUpdate}
        showDrawer={showDrawer}
      />
    </>
  );
};

export default ExplanationRequest;
