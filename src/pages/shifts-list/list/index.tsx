//@ts-ignore
import XlsExport from 'xlsexport';
import {
  Button,
  Card,
  Divider,
  Form,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import { FC, useState, useEffect } from 'react';
import { message as $message } from 'antd';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { useLocale } from '@/locales';
import moment from 'moment';
import { formatDate } from '@/utils/formatDate';
import { companyOptions } from '@/const/options';
import { IShiftIdDtoResultV2, IShiftsListColumn } from '@/interface/shifts/shifts';
import { IShiftArgs, deleteShiftById, getListShifts, getShiftV2 } from '@/api/shift/shift.api';
import SearchShift from '../components/search/index';
import FormShift from '../handle/FormShift';
import { EditOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { leaveTypeOptions } from '@/const/options';
import { getShiftLog } from '../../../api/shift/shift.api';

const ShiftList: FC = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [foceUpdate, setFoceUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [idShift, setIdShift] = useState<any>(null);
  const [company, setCompany] = useState<any[]>([]);
  const [leaveType, setLeaveType] = useState<any[]>([]);
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [isView, setIsView] = useState<boolean>(false);
  useEffect(() => {
    companyOptions().then((res) => {
      // console.log(res);
      setCompany(res);
    });
    leaveTypeOptions().then((res) => {
      // console.log(res);
      setLeaveType(res);

    });

  }, []);
  const _getListShiftV2 = async (args: IShiftArgs) => {
    const res = await getShiftV2(args);
    store.dispatch(setGlobalState({ loading: true }));
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  }
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setIsView(false);
    setIdShift(null)
  };
  const tableColums: MyPageTableOptions<IShiftIdDtoResultV2> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      align: 'center',
    },
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   width: 50,
    //   align: "center",
    // },
    {
      title: 'Tên ca',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <Tooltip
          title={
            <div>
              {`Tên ca: ${record.name}`} <br />{' '}
              {`Tổng thời gian làm việc: ${parseFloat(record.total_work_time).toFixed(2)}`} <br />
              {`Số ngày làm việc: ${record.number_of_attendance.toFixed(2)}`} <br />
              {`Ngày cập nhật: ${record.day_work_value}`} <br />
              {`Ngày tạo: ${record.create_date}`} <br />
              {`Ngày ghi nhận: ${record.write_date}`} <br />
              {`Lần cập nhật cuối: ${record.__last_update}`}
            </div>
          }
          // trigger="click"
          color="rgb(185, 136, 104)">
          <span>{record.name}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Công ty',
      dataIndex: 'mis_id',
      key: 'mis_id',
      width: 100,
      align: 'center',
      // render: (record) => {
      //   console.log(record)
      //   return record?.mis_id;
      // },
    },
    {
      title: 'Giờ bắt đầu làm việc',
      dataIndex: 'c_start_work_time',
      key: 'c_start_work_time',
      width: 100,
      align: 'center',
    },
    {
      title: 'Giờ kết thúc làm việc',
      dataIndex: 'c_end_work_time',
      key: 'c_end_work_time',
      width: 100,
      align: 'center',
    },
    {
      title: 'Giờ bắt đầu nghỉ',
      dataIndex: 'c_start_rest_time',
      key: 'c_start_rest_time',
      width: 100,
      align: 'center',
    },
    {
      title: 'Giờ kết thúc nghỉ',
      dataIndex: 'c_end_rest_time',
      key: 'c_end_rest_time',
      width: 100,
      align: 'center',
    },
    {
      title: 'Tổng thời gian làm việc',
      dataIndex: 'total_work_time',
      key: 'total_work_time',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <span>{Number(record.total_work_time).toFixed(2)}</span>
      )
    },
    {
      title: 'Tổng thời gian nghỉ',
      dataIndex: 'total_rest_time',
      key: 'total_rest_time',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <span>{Number(record.total_rest_time).toFixed(2)}</span>
      )
    },
    {
      title: 'Ca ăn',
      dataIndex: 'shifts_eat',
      key: 'shifts_eat',
      width: 100,
      align: 'center',
    },
    {
      title: 'Ca gãy',
      dataIndex: 'fix_rest_time',
      key: 'fix_rest_time',
      width: 100,
      align: 'center',
      render: (record) => {
        if (record === true) {
          return <CheckOutlined />;
        }


      }
    },
    {
      title: 'Ca nghỉ',
      dataIndex: 'rest_shifts',
      key: 'rest_shifts',
      width: 100,
      align: 'center',
      // render: (record) => {
      render: (record) => {
        if (record === true) {
          return <CheckOutlined />;
        }
        //   else {
        //     return <CloseOutlined />;
        // }


      }


    },
    // {
    //   title: 'Làm việc theo giờ hội sở',
    //   dataIndex: 'is_ho_shift',
    //   key: 'is_ho_shift',
    //   width: 100,
    //   align: 'center',
    //   // render: (record) => {
    //   render: (record) => {
    //     if (record == true) {
    //       return <CheckOutlined />;
    //     }
    //   }

    // },
    {
      title: 'Ca đêm',
      dataIndex: 'night',
      key: 'night',
      width: 100,
      align: 'center',
      // render: (record) => {
      render: (record) => {
        if (record === true) {
          return <CheckOutlined />;
        }
        //   else {
        //     return <CloseOutlined />;
        // }


      }


    },
    {
      title: 'Mã ca nghỉ',
      dataIndex: 'rest_shift_name',
      key: 'rest_shift_name',
      width: 150,
      align: 'center',
    },
    {
      title: 'Hành động',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (record) => (
        // <Button >Update</Button>
        <Space>
          {
            is_general_manager === "true" && (
              <EditOutlined
                style={{ fontSize: '14px', color: '#0960bd' }}
                onClick={() => handleUpdate(record)} />
            )
          }
          <EyeOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleView(record.id)}
          />
        </Space>
      ),
    },

  ];
  const handleView = (id: number) => {
    setIsView(true);
    showDrawer()
    setIdShift(id);
  }
  const handleDelete = () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ca cần xóa');
    }
    else {
      store.dispatch(setGlobalState({ loading: true }));
      selectedRowArr.map(async (item) => {
        try {
          const res = await deleteShiftById(item.id);
          if (res) {
            store.dispatch(setGlobalState({ loading: false }));
            $message.success('Xoá thành công');
            setFoceUpdate(!foceUpdate);
            setForceClearSelection(!forceClearSelection);
            setSelectedRowArr([]);
          }
        }
        catch (err) {
          console.log(err);
        }
      });
    }

  }
  const handleUpdate = async (record: any) => {
    await form.resetFields();
    console.log("record is", record)
    updateidShift(record.id);
    let c_start_work = moment('1000-11-11' + record.c_start_work_time, 'YYYY-MM-DD HH:mm')
    let c_end_work = moment('1000-11-11' + record.c_end_work_time, 'YYYY-MM-DD HH:mm')
    let c_start_rest = moment('1000-11-11' + record.c_start_rest_time, 'YYYY-MM-DD HH:mm')
    let c_end_rest = moment('1000-11-11' + record.c_end_rest_time, 'YYYY-MM-DD HH:mm')

    form.setFieldsValue({
      name: record.name,
      rest_shifts: record.rest_shifts,
      is_ho_shift: record.is_ho_shift,
      fix_rest_time: record.fix_rest_time,
      breakfast: record.breakfast,
      lunch: record.lunch,
      dinner: record.dinner,
      night: record.night,
      start_work_time: c_start_work,
      end_work_time: c_end_work,
      start_rest_time: c_start_rest,
      end_rest_time: c_end_rest,
      number_of_attendance: record.number_of_attendance,
      // fromToTime: [c_start_work, c_end_work],
      // TimeBreak: [c_start_rest, c_end_rest],

      rest_shift_id: record.rest_shift_id,
      company_id: record.company,
     
    });


    showDrawer();
  };

  const updateidShift = (id: any) => {
    setIdShift(id);
  };
  const _getShiftLog = async () => {
    const res = await getShiftLog();
    if (res) {
      return res;
    }
  }
  const handleCreate = async () => {
    form.resetFields();
    showDrawer();
  };
  let is_general_manager = localStorage.getItem('is_general_manager');
  return (
    <>
      <MyPage
        rowkey="id"
        pageApi={_getListShiftV2}
        // logData={_getShiftLog}
        title={'Danh sách ca'}
        searchRender={<SearchShift />}
        tableOptions={tableColums}
        forceUpdate={foceUpdate}
        setSelectedRowData={setSelectedRowArr}
        forceClearSelection={forceClearSelection}
        multipleSelection
        selectedRowArr={selectedRowArr}

        slot={
          is_general_manager === "true" && (
            <>
              <Button type="primary" onClick={handleCreate}>
                {t({ id: 'create' })}
              </Button>
              <Button type='primary' onClick={handleDelete}>
                {t({ id: 'delete' })}
              </Button>
            </>
          )
        }
      />
      <FormShift
        form={form}
        isView={isView}
        setFoceUpdate={setFoceUpdate}
        foceUpdate={foceUpdate}
        idShift={idShift}
        open={open}
        showDrawer={showDrawer}
        onClose={onClose}
      />
    </>
  );
};

export default ShiftList;
