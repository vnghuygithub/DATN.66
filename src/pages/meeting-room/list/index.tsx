import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { FC } from 'react';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { useState, useEffect } from 'react';
import { message as $message, Modal, Select } from 'antd';
import { useLocale } from '@/locales';
import { Button, Form, Space, Tag } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  deleteBookingRoomById,
  getBookingRoomsByArgs,
  updateBookingRoom,
  updateHandleBookingRoom,
} from '@/api/meeting_rooms/bookingrooms.api';
import {
  IBookingRooms,
  ICreateRoomsArgs,
} from '@/interface/meetingRooms/meeting_rooms';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import SearchBookingRooms from '../components/search';
import FormBookingRooms from '../handle';
import FormCreateRooms from '../create-rooms';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import SelectMeetingRooms from '@/pages/components/selects/SelectMeetingRooms';
const MeetingRoom: FC = () => {
  const [form] = Form.useForm();
  const { t } = useLocale();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [openRoom, setOpenRoom] = useState(false);
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [isCreating, setIsCreating] = useState<boolean>();
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>();
  const [idBookingRoom, setIdBookingRoom] = useState<any>(undefined);
  const [isView, setIsView] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataCalendar, setDataCalendar] = useState<any>([]);

  //modal open
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const _getBookingRoomListByArgs = async (params: ICreateRoomsArgs) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getBookingRoomsByArgs(params);

    if (res) {
      setDataCalendar(res.results.data);
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };

  const handleDelete = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 đơn đặt phòng họp để xóa');
      return;
    }

    const ids = selectedRowArr.map((item: IBookingRooms) => item.id);
    try {
      store.dispatch(setGlobalState({ loading: true }));
      await Promise.all(ids.map(id => deleteBookingRoomById(id)));
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
      setForceUpdate(!forceUpdate);
      store.dispatch(setGlobalState({ loading: false }));
      $message.success('Xóa đơn đặt phòng thành công');
    }
  };

  const handleConfirm = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 đơn đặt phòng họp để duyệt');
      return;
    }
    console.log(selectedRowArr[0].state);
    if (
      selectedRowArr[0].state == 'waiting' ||
      selectedRowArr[0].state == 'draft'
    ) {
      await Promise.all(
        selectedRowArr.map((item: any) => {
          const data = {
            id: item.id,
            room: item?.room[0],
            employee: item?.employee_id,
            req_date: item?.req_date,
            date_from: item?.date_from,
            date_to: item?.date_to,
            purpose: item?.purpose,
            state: 'confirm',
          };
          return updateHandleBookingRoom(data);
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
    } else {
      $message.error('Chỉ được duyệt đơn ở trạng thái Chờ duyệt');
    }
  };
  const handleReject = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 đơn đặt phòng họp để từ chối');
      return;
    }
    console.log(selectedRowArr);
    if (
      selectedRowArr[0].state == 'waiting' ||
      selectedRowArr[0].state == 'draft'
    ) {
      await Promise.all(
        selectedRowArr.map((item: any) => {
          const data = {
            id: item.id,
            room: item?.room[0],
            employee: item?.employee_id,
            req_date: item?.req_date,
            date_from: item?.date_from,
            date_to: item?.date_to,
            purpose: item?.purpose,
            state: 'reject',
          };
          return updateHandleBookingRoom(data);
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
    } else {
      $message.error('Chỉ được từ chối đơn ở trạng thái Chờ duyệt');
    }
  };
  const handleCreate = () => {
    setIsCreating(true);
    showDrawer();
    setIdBookingRoom(undefined);
    setIsView(false);
  };
  const handleCreateRoom = () => {
    showDrawerRoom();
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const showDrawerRoom = () => {
    setOpenRoom(true);
    setIsCreatingRoom(true);
  };
  const handleEdit = (id: number) => {
    setIsCreating(false);
    setIdBookingRoom(id);
    showDrawer();
    setIsView(false);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onCloseRoom = () => {
    setOpenRoom(false);
  };
  let sub_admin_role = localStorage.getItem('sub_admin_role');
  const tableColums: MyPageTableOptions<IBookingRooms> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      width: 40,
      align: 'center',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employee_name',
      key: 'employee_name',
      width: 150,
      align: 'center',
    },
    {
      title: 'Phòng họp',
      dataIndex: 'room_name',
      key: 'room_name',
      width: 100,
      align: 'center',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'req_date',
      key: 'req_date',
      width: 100,
      align: 'center',
      render: (item: string) => {
        return <span>{item && formatDate(item)}</span>;
      },
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'date_from',
      key: 'date_from',
      width: 150,
      align: 'center',
      render: (item: string) => {
        return <span>{item && formatDateTime(item)}</span>;
      },
    },
    {
      title: 'Kết thúc',
      dataIndex: 'date_to',
      key: 'date_to',
      width: 150,
      align: 'center',
      render: (item: string) => {
        return <span>{item && formatDateTime(item)}</span>;
      },
    },
    {
      title: 'Mục đích',
      dataIndex: 'purpose',
      key: 'purpose',
      width: 140,
      align: 'center',
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'state',
      key: 'state',
      width: 100,
      align: 'center',
      render: (item: string) => {
        let textColor = '';
        let stateText = '';

        if (item == 'waiting' || item == 'draft') {
          textColor = 'cyan';
          stateText = 'Chờ duyệt';
        } else if (item == 'confirm') {
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
          {(is_general_manager === 'true' ||
            is_department_secretary === 'true' ||
            is_head_of_department === 'true' ||
            is_administrative === 'true' ||
            sub_admin_role !== 'none') && (
            <EditOutlined
              style={{ fontSize: '14px', color: '#0960bd' }}
              onClick={() => handleEdit(item)}
            />
          )}
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
    setIdBookingRoom(id);
    showDrawer();
    setIsView(true);
  };
  const is_general_manager = localStorage.getItem('is_general_manager');
  const is_head_of_department = localStorage.getItem('is_head_of_department');
  const is_department_secretary = localStorage.getItem(
    'is_department_secretary'
  );
  const is_administrative = localStorage.getItem('is_administrative');

  // lấy data để đổ vào calender

  const events =
    dataCalendar &&
    dataCalendar.map((event: any) => ({
      title: event.room_name,

      start: new Date(event.date_from), // Chuyển đổi chuỗi thành Date
      end: new Date(event.date_to), // Chuyển đổi chuỗi thành Date
    }));
  const localizer = momentLocalizer(moment);
  const formats = {
    timeGutterFormat: 'HH:mm', // Hiển thị giờ theo định dạng 24h
    agendaTimeFormat: 'HH:mm', // Hiển thị thời gian trong chế độ agenda
    dayHeaderFormat: 'dddd DD/MM', // Hiển thị ngày/tháng
  };

  return (
    <>
      <Modal
        className="modal-meeting-room"
        title="Thông tin phòng họp"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
          
        <SelectMeetingRooms 
        
          style={{ position: 'absolute', top: '80px', right: '350px' }}
          isModalOpen={isModalOpen}
        />
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="agenda" // Hiển thị chế độ tuần với cột thời gian
          formats={formats} // Đặt định dạng cho giờ
          step={60} // Mỗi ô tương ứng với 60 phút
          timeslots={1} // Một khung giờ trên mỗi dòng
          min={new Date(2024, 8, 26, 1, 0)} // Bắt đầu từ 1h sáng
          max={new Date(2024, 8, 26, 23, 59)} // Kết thúc lúc 23:59 thay vì 24:00
          style={{ height: '100vh', width: '100%' }} // Đặt chiều cao và rộng full màn hình
        />
      </Modal>
      <MyPage
        rowkey="id"
        title="Danh sách đơn đặt phòng họp"
        // logData={_getContractLog}
        pageApi={_getBookingRoomListByArgs}
        tableOptions={tableColums}
        forceUpdate={forceUpdate}
        searchRender={<SearchBookingRooms />}
        setSelectedRowData={setSelectedRowArr}
        forceClearSelection={forceClearSelection}
        selectedRowArr={selectedRowArr}
        multipleSelection
        slot={
          <>
            {(is_general_manager === 'true' ||
              is_department_secretary === 'true' ||
              is_head_of_department === 'true' ||
              is_administrative === 'true' ||
              sub_admin_role !== 'none') && (
              <>
                <Button type="primary" onClick={showModal}>
                  Thông tin phòng họp
                </Button>
                {/* <Button type="primary" onClick={handleCreateRoom}>
                  Thêm phòng họp
                </Button> */}
                <Button type="primary" onClick={handleConfirm}>
                  Duyệt đơn
                </Button>
                <Button type="primary" onClick={handleReject}>
                  Từ chối
                </Button>
                {/* <Button type="primary" onClick={handleDelete}>
                  Xóa
                </Button> */}
              </>
            )}
            <Button type="primary" onClick={handleCreate}>
              Tạo mới
            </Button>
          </>
        }
      />
      <FormBookingRooms
        onClose={onClose}
        showDrawer={showDrawer}
        open={open}
        idBookingRoom={idBookingRoom}
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
export default MeetingRoom;
