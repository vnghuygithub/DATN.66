import { useEffect, useState, useCallback, Children } from 'react';
import {
  Card,
  Spin,
  Table,
  Typography,
  message as $message,
  Button,
  Modal,
  Badge,
  Calendar,
  Col,
  Row,
} from 'antd';
import MyButton from '@/components/basic/button';
import type { ColumnsType } from 'antd/es/table';
import {
  DataWeeklyType,
  WeeklyReportState,
} from '@/interface/weeklyreport/type';
import FileForm from '../handle/fileForm';
import { useDispatch, useSelector } from 'react-redux';
import { setWeeklyData } from '@/stores/weekly.store';
import './style-antd.css';
import { LocaleFormatter } from '@/locales';
import { formatDate, formatDateTable } from '@/utils/formatDate';
import moment from 'moment';
import { ReactComponent as WarningSvg } from '@/assets/icons/ic_warming.svg';
const { Text } = Typography;
import { Empty } from 'antd';
import weeklyreport from '@/mock/weeklyreport/attendance_raw_converted.json';
// import weeklyreport from '@/mock/weeklyreport/employee_data.json';
import {
  calculateAttendanceReport,
  getAttendanceReport,
} from '@/api/weeklyreport/weeklyreport';
import {
  IGetAttendanceContentParams,
  IGetAttendanceParams,
} from '@/interface/weeklyreport/type';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import { transformObject } from '@/utils/common-antd';
import { setListAttendance } from '@/stores/list-attendance-report.store';
import { get, update } from 'lodash';
import { Form } from 'antd';
import {
  IScheduleShiftArgs,
  scheduleShift,
} from '@/api/shiftRequest/shiftRequest.api';
import { ExceptionOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { Moment } from 'moment';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'moment/locale/vi';
import { viVN_account } from '@/locales/vi-VN/account';
import locale from 'antd/lib/calendar/locale/vi_VN';
import { mobileResponsive } from '@/utils/mobileResponsive';
import SelectMultipleEmployeeSearch from '@/pages/components/selects/SelectMultipleEmployeeSearch';

const data: any = weeklyreport;
interface ITableProps {
  onShowInfo: () => void;
  forceUpdate?: boolean;
  fromDate: string;
  toDate: string;
  dataAttendant: any;
  setDataAttendant: any;
  disabledButton: boolean;
  setForceUpdate?: any;
}
const index = (props: ITableProps) => {
  const {
    onShowInfo,
    forceUpdate,
    fromDate,
    toDate,
    dataAttendant,
    setDataAttendant,
    disabledButton,
    setForceUpdate,
  } = props;

  const { isMobile } = mobileResponsive();
  const [forceRender, setForceRender] = useState(false);
  const _setListAttendance = (data: any) => dispatch(setListAttendance(data));
  const [updateAttendance, setUpdateAttendance] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [importOpen, setImportOpen] = useState(false);
  const dispatch = useDispatch();
  const _setWeeklyData = (data: WeeklyReportState) =>
    dispatch(setWeeklyData(data));

  const { loading } = useSelector(state => state.global);
  const { cellsActive } = useSelector(state => state.common);
  const [_listData, set_listData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalInfoEmployeeVisible, setIsModalInfoEmployeeVisible] =
    useState(false);
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState<any | null>(
    null
  );
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<any | null>(
    null
  );
  const [employeeIndex, setEmployeeIndex] = useState(0);
  const [openScheduleShift, setOpenScheduleShift] = useState(false);
  const [employeeIds, setEmployeeIds] = useState<number[]>([]);

  const onClose = () => {
    setOpen(false);
    setImportOpen(false);
  };

  const showDrawerImport = () => {
    setImportOpen(true);
  };

  const handleImport = () => {
    showDrawerImport();
  };

  const getAttendance = useCallback(async () => {
    try {
      if (fromDate !== '' && toDate !== '') {
        const args: string[] = [fromDate, toDate, ''];
        const params: IGetAttendanceContentParams = {
          args,
        };
        const body: IGetAttendanceParams = {
          params,
        };

        store.dispatch(setGlobalState({ loading: true }));

        const { result } = (await getAttendanceReport(body)) as any;

        if (result) {
          const formattedObject = transformObject(result);
          setDataAttendant(formattedObject);

          _setListAttendance(JSON.stringify(formattedObject));
          store.dispatch(setGlobalState({ loading: false }));
          setForceRender(!forceRender);
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [updateAttendance]);

  const handleCalculate = async () => {
    try {
      if (fromDate !== '' && toDate !== '') {
        const args: string[] = [fromDate, toDate, ''];
        const params: IGetAttendanceContentParams = {
          args,
        };
        const body: IGetAttendanceParams = {
          params,
        };
        store.dispatch(setGlobalState({ loading: true }));
        const res = await calculateAttendanceReport(body);

        if (res.result != undefined) {
          setUpdateAttendance(!updateAttendance);
          store.dispatch(setGlobalState({ loading: false }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSchedule = async (args: IScheduleShiftArgs) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await scheduleShift(args);
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      res.result.forEach((item: any) =>
        calculateAttendanceReport({
          params: {
            args: [fromDate, toDate, item.employee_code, item.company_id],
          },
        })
          .then(res => {
            if (res) {
              $message.success(
                'Phân ca thành công cho nhân viên ' +
                item.employee_name +
                ' với mã nhân viên ' +
                item.employee_code +
                ' trong công ty ' +
                item.company_name
              );
            }
          })
          .catch(err => {
            $message.error(
              'Phân ca thất bại cho nhân viên ' +
              item.employee_name +
              ' với mã nhân viên ' +
              item.employee_code +
              ' trong công ty ' +
              item.company_name
            );
          })
      );

      setUpdateAttendance(!updateAttendance);
      setForceUpdate(!forceUpdate);
      setEmployeeIds([]);
      setOpenScheduleShift(false);
      $message.success('Phân ca thành công');
      return res;
    } else {
      store.dispatch(setGlobalState({ loading: false }));
      $message.error('Phân ca thất bại');
      setEmployeeIds([]);
    }
  };

  const handleClickShowInfo = (employeeCode: string) => {
    const flattenedChildren = dataAttendant
      .map((item: any) => item.children)
      .flat();
    const greenCells = document.querySelectorAll('.ant-picker-cell.bg-green');
    greenCells.forEach(cell => {
      cell.classList.remove('bg-green');
    });
    const goldCells = document.querySelectorAll('.ant-picker-cell.bg-gold');
    goldCells.forEach(cell => {
      cell.classList.remove('bg-gold');
    });
    // Tìm chỉ số của nhân viên trong mảng đã làm phẳng
    const employeeIndex = flattenedChildren.findIndex(
      (employee: any) => employee.employee_code === employeeCode
    );

    // Đặt mã nhân viên đã chọn và chỉ số nhân viên
    setIsModalVisible(true);
    setSelectedEmployeeCode(employeeCode);
    setEmployeeIndex(employeeIndex);
  };

  const handleClickShowInfoEmployee = (employeeCode: string) => {
    const flattenedChildren = dataAttendant
      .map((item: any) => item.children)
      .flat();

    // Tìm chỉ số của nhân viên trong mảng đã làm phẳng
    const employeeIndex = flattenedChildren.findIndex(
      (employee: any) => employee.employee_code === employeeCode
    );

    // Đặt mã nhân viên đã chọn và chỉ số nhân viên
    setIsModalInfoEmployeeVisible(true);
    setSelectedEmployeeCode(employeeCode);
    setEmployeeIndex(employeeIndex);
  };

  const changeEmployee = (direction: string) => {
    // Lấy mảng đã làm phẳng của children
    const flattenedChildren = dataAttendant
      .map((item: any) => item.children)
      .flat();

    let newEmployeeIndex = 0;

    if (direction === 'next') {
      const greenCells = document.querySelectorAll('.ant-picker-cell.bg-green');
      greenCells.forEach(cell => {
        cell.classList.remove('bg-green');
      });
      const goldCells = document.querySelectorAll('.ant-picker-cell.bg-gold');
      goldCells.forEach(cell => {
        cell.classList.remove('bg-gold');
      });
      newEmployeeIndex = Math.min(
        employeeIndex + 1,
        flattenedChildren.length - 1
      );
    } else if (direction === 'previous') {
      const greenCells = document.querySelectorAll('.ant-picker-cell.bg-green');
      greenCells.forEach(cell => {
        cell.classList.remove('bg-green');
      });
      const goldCells = document.querySelectorAll('.ant-picker-cell.bg-gold');
      goldCells.forEach(cell => {
        cell.classList.remove('bg-gold');
      });
      newEmployeeIndex = Math.max(employeeIndex - 1, 0);
    }

    // Cập nhật chỉ số nhân viên
    setEmployeeIndex(newEmployeeIndex);

    // Đặt mã nhân viên đã chọn dựa trên chỉ số nhân viên đã được cập nhật
    const selectedEmployeeCode =
      flattenedChildren[newEmployeeIndex]?.employee_code;
    setIsModalVisible(true);
    setSelectedEmployeeCode(selectedEmployeeCode);
  };

  useEffect(() => {
    if (selectedEmployeeCode) {
      const employee = dataAttendant
        .map((item: any) => item.children)
        .flat()
        .find(
          (childItem: any) => childItem.employee_code == selectedEmployeeCode
        );
      if (employee) {
        setSelectedEmployeeName(employee.employee_name);
      }
    }
  }, [selectedEmployeeCode, dataAttendant]);

  const Columns: ColumnsType<DataWeeklyType> = [
    {
      title: '#', // Tiêu đề số thứ tự
      key: 'stt',
      align: 'center',
      width: 70,
      fixed: isMobile ? undefined : 'left',

      render: (_, __, index) => index + 1, // Render số thứ tự
    },
    {
      title: 'Bộ phận',
      dataIndex: 'department',
      key: 'department',
      align: 'center',
      fixed: isMobile ? undefined : 'left',
      width: 90,
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'employee_code',
      key: 'employee_code',
      align: 'center',
      fixed: isMobile ? undefined : 'left',
      width: 150,

      render: item => {
        return item && <div>{item}</div>;
      },
    },
    {
      title: 'Họ và tên',
      dataIndex: 'employee_name',
      key: 'employee_name',
      align: 'center',
      fixed: isMobile ? undefined : 'left',
      width: 100,
      onCell: record => {
        return {
          onClick: () => {
            if (record.employee_code) {
              handleClickShowInfoEmployee(record.employee_code);
            }
          },
          style: { cursor: 'pointer' },
        };
      },
      render: item => {
        return item && <div>{item}</div>;
      },
    },

    {
      title: 'Chức vụ',
      dataIndex: 'job_title',
      key: 'job_title',
      align: 'center',
      fixed: isMobile ? undefined : 'left',
      width: 100,
      render: item => {
        return item && <div>{item?.en_US}</div>;
      },
    },
    {
      title: 'Công thực tế',
      dataIndex: 'actual_paid_day',
      key: 'actual_paid_day',
      align: 'center',
      fixed: isMobile ? undefined : 'left',
      width: 100,
      onCell: record => {
        return {
          onClick: () => {
            if (record.employee_code) {
              handleClickShowInfo(record.employee_code);
            }
          },
          style: { cursor: 'pointer' },
        };
      },
      render: item => {
        return (
          item && (
            <div style={{ color: 'green', textDecoration: 'underline' }}>
              {(item / 480).toFixed(2)}
            </div>
          )
        );
      },
    },

    {
      title: 'Ngày vào làm',
      dataIndex: 'join_date',
      key: 'join_date',
      align: 'center',
      //   fixed: 'left',
      width: 100,
      render: item => {
        // Kiểm tra xem item có giá trị không
        return item ? <div>{format(new Date(item), 'dd/MM/yyyy')}</div> : null;
      },
    },
    {
      title: 'Ngày kết thúc thử việc',
      dataIndex: 'probation_completion_wage',
      key: 'probation_completion_wage',
      align: 'center',
      //   fixed: 'left',
      width: 100,
      render: item => {
        // Kiểm tra xem item có giá trị không
        return item ? <div>{format(new Date(item), 'dd/MM/yyyy')}</div> : null;
      },
    },
    {
      title: 'Tỷ lệ hưởng lương thử việc',
      dataIndex: 'probation_wage_rate',
      key: 'probation_wage_rate',
      align: 'center',
      //   fixed: 'left',
      width: 100,
      render: item => {
        return item && <div>{item}</div>;
      },
    },
    {
      title: 'Công chuẩn',
      dataIndex: 'averageStandardWorkingDay',
      key: 'averageStandardWorkingDay',
      align: 'center',
      //   fixed: 'left',
      width: 80,
      render: item => {
        return item && <div>{item}</div>;
      },
    },
    {
      title: 'Tổng số ngày OFF',
      dataIndex: 'count_off',
      key: 'count_off',
      align: 'center',
      //   fixed: 'left',
      width: 80,
      render: item => {
        return item && <div>{item}</div>;
      },
    },
    {
      title: 'Tổng số ngày nghỉ không lương',
      dataIndex: 'count_ktl',
      key: 'count_ktl',
      align: 'center',
      //   fixed: 'left',
      width: 100,
      render: item => {
        return item && <div>{item}</div>;
      },
    },
    {
      title: 'Thử việc',
      width: 150,
      align: 'center',
      children: [
        {
          title: 'Tổng số ngày lễ',
          dataIndex: 'count_ph',
          key: 'count_ph',
          align: 'center',
          //   fixed: 'left',
          width: 100,
          render: item => {
            return item && <div>{item}</div>;
          },
        },
        {
          title: 'Tăng ca',
          width: 150,
          align: 'center',
          children: [
            {
              title: 'Ngày thường',
              dataIndex: 'count_ot_normal',
              key: 'count_ot_normal',
              width: 80,
              align: 'center',
            },
            {
              title: 'Ngày lễ',
              dataIndex: 'count_ot_holiday',
              key: 'count_ot_holiday',
              width: 80,
              align: 'center',
            },
          ],
        },
        {
          title: 'Làm ca đêm',
          width: 150,
          align: 'center',
          children: [
            {
              title: 'Ngày thường',
              dataIndex: 'count_nh_normal',
              key: 'count_nh_normal',
              width: 80,
              align: 'center',
            },
            {
              title: 'Ngày lễ',
              dataIndex: 'count_nh_holiday',
              key: 'count_nh_holiday',
              width: 80,
              align: 'center',
            },
          ],
        },
        {
          title: 'Tổng số ca gãy',
          dataIndex: 'count_split_shift',
          key: 'count_split_shift',
          align: 'center',
          //   fixed: 'left',
          width: 80,
          render: item => {
            return item && <div>{item}</div>;
          },
        },
        {
          title: 'Tổng số ngày nghỉ có lương khác',
          dataIndex: 'count_ctl',
          key: 'count_ctl',
          align: 'center',
          //   fixed: 'left',
          width: 80,
          render: item => {
            return item && <div>{item}</div>;
          },
        },
        {
          title: 'Tổng số ngày nghỉ bù',
          dataIndex: 'amount_cl_reserve',
          key: 'amount_cl_reserve',
          align: 'center',
          //   fixed: 'left',
          width: 80,
          render: item => {
            return item && <div>{(item / 480).toFixed(2)}</div>;
          },
        },
        {
          title: 'Tổng số ngày đi làm thực tế',
          dataIndex: 'normal_working_days',
          key: 'normal_working_days',
          align: 'center',
          //   fixed: 'left',
          width: 80,
          render: item => {
            return item && <div>{(item / 480).toFixed(2)}</div>;
          },
        },
        {
          title: 'Tổng số ngày được trả lương',
          dataIndex: 'employee_work_in_month_probation',
          key: 'employee_work_in_month_probation',
          align: 'center',
          //   fixed: 'left',
          width: 80,
          render: item => {
            return item && <div>{(item / 480).toFixed(2)}</div>;
          },
        },
      ],
    },
    {
      title: 'Chính thức',
      width: 150,
      align: 'center',
      children: [
        {
          title: 'Tổng số ngày lễ',
          dataIndex: 'count_ph_staff',
          key: 'count_ph_staff',
          align: 'center',
          //   fixed: 'left',
          width: 80,
          render: item => {
            return item && <div>{item}</div>;
          },
        },
        {
          title: 'Tăng ca',
          width: 150,
          align: 'center',
          children: [
            {
              title: 'Ngày thường',
              dataIndex: 'count_ot_normal_staff',
              key: 'count_ot_normal_staff',
              width: 80,
              align: 'center',
            },
            {
              title: 'Ngày lễ',
              dataIndex: 'count_ot_holiday_staff',
              key: 'count_ot_holiday_staff',
              width: 80,
              align: 'center',
            },
          ],
        },
        {
          title: 'Làm ca đêm',
          width: 150,
          align: 'center',
          children: [
            {
              title: 'Ngày thường',
              dataIndex: 'count_nh_normal_staff',
              key: 'employee_code',
              width: 80,
              align: 'center',
            },
            {
              title: 'Ngày lương',
              dataIndex: 'count_nh_holiday_staff',
              key: 'employee_name',
              width: 80,
              align: 'center',
            },
          ],
        },
        {
          title: 'Tổng số ca gãy',
          dataIndex: 'count_split_shift_staff',
          key: 'count_split_shift_staff',
          align: 'center',
          //   fixed: 'left',
          width: 80,
          render: item => {
            return item && <div>{item}</div>;
          },
        },
        {
          title: 'Tổng số phép năm đã sử dụng',
          dataIndex: 'amount_al_reserve_staff',
          key: 'amount_al_reserve_staff',
          align: 'center',
          //   fixed: 'left',
          width: 100,
          render: item => {
            return item && <div>{(item / 480).toFixed(2)}</div>;
          },
        },
        {
          title: 'Tổng số ngày nghỉ ốm',
          dataIndex: 'employee_work_in_month',
          key: 'employee_work_in_month',
          align: 'center',
          //   fixed: 'left',
          width: 80,
          render: item => {
            return item !== undefined ? <div>-</div> : <div>-</div>;
          },
        },
        {
          title: 'Tổng số ngày nghỉ sinh',
          dataIndex: 'employee_work_in_month',
          key: 'employee_work_in_month',
          align: 'center',
          //   fixed: 'left',
          width: 80,
          render: item => {
            return item !== undefined ? <div>-</div> : <div>-</div>;
          },
        },
        {
          title: 'Tổng số ngày nghỉ có lương',
          dataIndex: 'count_ctl_staff',
          key: 'count_ctl_staff',
          align: 'center',
          //   fixed: 'left',
          width: 80,
          render: item => {
            return item && <div>{item}</div>;
          },
        },
        {
          title: 'Tổng số ngày nghỉ bù',
          dataIndex: 'amount_cl_reserve_staff',
          key: 'amount_cl_reserve_staff',
          align: 'center',
          //   fixed: 'left',
          width: 80,
          render: item => {
            return item && <div>{(item / 480).toFixed(2)}</div>;
          },
        },
        {
          title: 'Tổng số ngày công',
          dataIndex: 'normal_working_days_staff',
          key: 'normal_working_days_staff',
          align: 'center',
          //   fixed: 'left',
          width: 80,
          render: item => {
            return item && <div>{(item / 480).toFixed(2)}</div>;
          },
        },
        {
          title: 'Tổng số ngày được trả lương',
          dataIndex: 'employee_work_in_month_staff',
          key: 'employee_work_in_month_staff',
          align: 'center',
          //   fixed: 'left',
          width: 80,
          render: item => {
            return item && <div>{(item / 480).toFixed(2)}</div>;
          },
        },
      ],
    },

    // ...generateColumns(fromDate, toDate),
  ];

  useEffect(() => {
    getAttendance();
  }, [updateAttendance]);

  const onCellClick = (cellSelected: WeeklyReportState) => {
    _setWeeklyData(cellSelected);
    onShowInfo();
  };

  const [height, setHeight] = useState(window.innerHeight - 400);
  const updateDimensions = () => {
    setHeight(window.innerHeight - 400);
  };
  useEffect(() => {
    setForceRender(!forceRender);
  }, [forceUpdate]);
  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  let is_general_manager = localStorage.getItem('is_general_manager');
  let shouldShowButtons = is_general_manager === 'true';
  let employee_ho = localStorage.getItem('employee_ho');
  let is_administrative = localStorage.getItem('is_administrative');

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Thêm số 0 phía trước nếu tháng < 10
    const day = String(date.getDate()).padStart(2, '0'); // Thêm số 0 phía trước nếu ngày < 10
    return `${year}-${month}-${day}`;
  };
  const [currentEmployeeData, setCurrentEmployeeData] = useState([]);

  const getListData = (
    item: any,
    start: any,
    end: any,
    selectedEmployeeCode: any
  ) => {
    let listData: { type: string; content: JSX.Element; date: string }[] = [];
    console.log({
      ITEM: item,
      KECK: start,
    });

    start = formatDateTable(start);
    end = formatDateTable(end);

    let currentDate = new Date(start);

    while (currentDate <= new Date(end)) {
      const currentDateString = formatDate(currentDate);

      // Lặp qua từng phần tử trong mảng item
      item.forEach((dayItem: any) => {
        // Lấy tất cả các mảng children của mỗi phần tử
        const allChildren = dayItem.children;

        // Lặp qua từng mảng children
        allChildren.forEach((childrenArray: any) => {
          // Lấy tất cả các phần tử trong mảng children của mỗi phần tử
          const childrenOfDay = childrenArray[currentDateString];

          // Lặp qua từng phần tử trong mảng children
          if (
            childrenOfDay &&
            childrenOfDay.employee_code === selectedEmployeeCode
          ) {
            let bg = 'transparent';
            let bd = '1px solid rgb(240, 240, 240)';
            let bgClass = 'bg-transparent';
            // Your conditions for determining background color (bg) and border (bd)
            if (
              !childrenOfDay?.total_shift_work_time &&
              (childrenOfDay?.attendance_attempt_1 ||
                childrenOfDay?.attendance_attempt_2 ||
                childrenOfDay?.attendance_attempt_3 ||
                childrenOfDay?.attendance_attempt_4 ||
                childrenOfDay?.attendance_attempt_5 ||
                childrenOfDay?.attendance_attempt_6 ||
                childrenOfDay?.attendance_attempt_7 ||
                childrenOfDay?.attendance_attempt_8 ||
                childrenOfDay?.attendance_attempt_9 ||
                childrenOfDay?.attendance_attempt_10 ||
                childrenOfDay?.attendance_attempt_11 ||
                childrenOfDay?.attendance_attempt_12 ||
                childrenOfDay?.attendance_attempt_13 ||
                childrenOfDay?.attendance_attempt_14 ||
                childrenOfDay?.attendance_attempt_15 ||
                childrenOfDay?.last_attendance_attempt)
            ) {
              // bgClass = 'bg-gold';
              bg = 'gold';
              const pickerCells = document.querySelectorAll(
                `.ant-picker-cell[title="${currentDateString}"]`
              );
              pickerCells.forEach(cell => {
                cell.classList.remove('bg-gold');
                cell.classList.remove('bg-green');
              });
              pickerCells.forEach(cell => {
                cell.classList.add('bg-gold');
              });
            } else {
              bg = 'transparent';
            }

            let tangCa = false;
            if (
              childrenOfDay?.date &&
              childrenOfDay?.attendance_attempt_1 &&
              childrenOfDay?.last_attendance_attempt
            ) {
              const hourFloat =
                moment(childrenOfDay.attendance_attempt_1).hour() +
                moment(childrenOfDay.attendance_attempt_1).minute() / 60;
              const hourFloat2 =
                moment(childrenOfDay.last_attendance_attempt).hour() +
                moment(childrenOfDay.last_attendance_attempt).minute() / 60;
              if (
                childrenOfDay.shift_start &&
                childrenOfDay.shift_end &&
                childrenOfDay.total_shift_work_time &&
                childrenOfDay.total_work_time
              ) {
                if (childrenOfDay.total_shift_work_time > 0) {
                  if (
                    !(
                      Number(childrenOfDay?.total_shift_work_time) * 60 >
                      Number(childrenOfDay?.total_work_time)
                    )
                  ) {
                    if (
                      (childrenOfDay.shift_start - hourFloat >= 0.5 &&
                        hourFloat2 - childrenOfDay.shift_end >= 0) ||
                      (hourFloat2 - childrenOfDay.shift_end >= 0.5 &&
                        childrenOfDay.shift_start - hourFloat >= 0)
                    ) {
                      tangCa = true;
                    } else if (
                      childrenOfDay.shift_start - hourFloat === 0 &&
                      hourFloat - childrenOfDay.shift_end >= 0.5
                    ) {
                      tangCa = true;
                    }
                  }
                }
              }
            }

            if (
              childrenOfDay?.missing_checkin_break &&
              childrenOfDay?.total_work_time
            ) {
              const pickerCells = document.querySelectorAll(
                `.ant-picker-cell[title="${currentDateString}"]`
              );

              pickerCells.forEach(cell => {
                cell.classList.add('bg-green');
              });
              // bg = '#d7f542';
            }

            listData.push({
              type: 'custom',
              content: (
                <div
                  className="content-table-antd"
                  style={{
                    background: bg,
                    cursor: childrenOfDay?.employee_code
                      ? 'pointer'
                      : 'not-allowed',
                  }}>
                  <div>
                    {childrenOfDay?.shift_name && (
                      <span style={{ color: '#694730' }}>
                        {childrenOfDay?.shift_name}
                      </span>
                    )}
                    {childrenOfDay?.total_work_time !== undefined &&
                      childrenOfDay?.total_work_time !== null &&
                      childrenOfDay?.total_work_time !== 0 && (
                        <span
                          style={{
                            color:
                              Number(childrenOfDay?.total_shift_work_time) *
                                60 >
                              Number(childrenOfDay?.total_work_time)
                                ? 'red'
                                : 'blue',
                            marginRight: 5,
                          }}>
                          _
                          {childrenOfDay?.missing_checkin_break
                            ? Math.min(
                                childrenOfDay?.total_work_time,
                                childrenOfDay?.total_shift_work_time * 30
                              )
                            : childrenOfDay?.shift_name.includes('/OFF')
                            ? Math.round(
                                Math.min(childrenOfDay?.total_work_time, 240) -
                                  Math.min(
                                    childrenOfDay?.attendance_late,
                                    childrenOfDay?.leave_early
                                  )
                              )
                            : Math.round(childrenOfDay?.total_work_time)}
                        </span>
                      )}
                    {tangCa && <WarningSvg width={15} height={15} />}
                    {item?.total_work_time < item?.actual_total_work_time && (
                      <ExceptionOutlined width={15} height={15} />
                    )}
                  </div>
                  {/* {childrenOfDay?.num_validate_leave &&
                    childrenOfDay?.num_validate_leave !== 0 &&
                    childrenOfDay?.number_of_leave &&
                    childrenOfDay?.number_of_leave !== 0 && (
                      <div>
                        <span style={{ color: 'green' }}>
                          {`${childrenOfDay.num_validate_leave}/${childrenOfDay.number_of_leave} Đ`}
                        </span>
                      </div>
                    )} */}
                  {childrenOfDay?.amount_cl_reserve !== undefined &&
                    childrenOfDay?.amount_cl_reserve !== null &&
                    childrenOfDay?.amount_cl_reserve !== 0 && (
                      <div>
                        <span>{`AL ${childrenOfDay.amount_cl_reserve}`}</span>
                      </div>
                    )}

                  {childrenOfDay?.amount_al_reserve !== undefined &&
                    childrenOfDay.amount_al_reserve !== null &&
                    childrenOfDay.amount_al_reserve !== 0 && (
                      <div>
                        <span>{`CL ${childrenOfDay.amount_al_reserve}`}</span>
                      </div>
                    )}
                  {childrenOfDay?.ot_normal &&
                    childrenOfDay?.ot_normal !== 0 &&
                    childrenOfDay?.ot_holiday &&
                    childrenOfDay?.ot_holiday !== 0 && (
                      <div>
                        <span style={{ color: 'green' }}>
                          {`OT ${
                            childrenOfDay.ot_normal + childrenOfDay?.ot_holiday
                          }`}
                        </span>
                      </div>
                    )}
                </div>
              ),
              date: currentDateString,
            });
          }
        });
      });

      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
    set_listData(listData);

    return listData;
  };

  const dateCellRender = (date: moment.Moment) => {
    const filteredData = _listData.filter(data => {
      const dataDate = moment(data.date, 'YYYY-MM-DD');
      return dataDate.isSame(date, 'day');
    });

    return (
      <div>
        {filteredData.map((data, index) => (
          <div
            className="day-cell"
            key={index}
            style={{
              marginBottom: '3px',
              fontSize: '13px',
              font: 'bold',
              background: 'gold',
            }}>
            {data.content}
          </div>
        ))}
      </div>
    );
  };

  const [selectedMonth, setSelectedMonth] = useState(
    moment(fromDate, 'DD/MM/YYYY')
  );

  useEffect(() => {
    setSelectedMonth(moment(fromDate, 'DD/MM/YYYY'));
  }, [fromDate]);

  const handlePanelChange = (date: any, mode: any) => {
    // Ngăn chặn lịch từ việc chuyển tháng chọn ô lịch
    setSelectedMonth(moment(fromDate, 'DD/MM/YYYY'));
  };
  const handleOpenScheduleShift = () => {
    setEmployeeIds([]);
    setOpenScheduleShift(true);
  }
  const handleCloseScheduleShift = () => {
    setEmployeeIds([]);
    setOpenScheduleShift(false);
  }
  const handleChangeEmployees = (value: any) => {
    setEmployeeIds(value);
  }
  useEffect(() => {
    if (dataAttendant) {
      getListData(dataAttendant, fromDate, toDate, selectedEmployeeCode);
      console.log(
        'check dataAAA',
        dataAttendant
          .map((item: any) => item.children)
          .flat() // Chuyển mảng 2D thành mảng 1D
          .filter(
            (childItem: any) => childItem.employee_code === selectedEmployeeCode
          )
      );
    }
  }, [selectedEmployeeCode]);
  let sub_admin_role = localStorage.getItem('sub_admin_role');
  let today_minus_45_days = moment().subtract(45, 'days').format('YYYY-MM-DD');
  return (
    <div className="table-wrapper-antd">
      <Card
        title={`Báo cáo từ ngày ${fromDate} đến ngày ${toDate}`}
        extra={
          <div>
            {shouldShowButtons &&
              (employee_ho === 'true' ||
                is_administrative === 'true' ||
                sub_admin_role !== 'none') && (
                <MyButton
                  type="primary"
                  onClick={() =>
                    handleOpenScheduleShift()
                  }>
                  Phân ca
                </MyButton>
              )}
            {shouldShowButtons && (
              <>
                <MyButton
                  disabled={disabledButton}
                  type="primary"
                  onClick={handleCalculate}>
                  Tính toán
                </MyButton>
              </>
            )}
          </div>
        }>
        <Spin
          spinning={loading}
          className="app-loading-wrapper"
          tip={<LocaleFormatter id="gloabal.tips.loading" />}></Spin>
        {dataAttendant?.length > 0 && true ? (
          <Table
            columns={Columns}
            dataSource={dataAttendant}
            bordered
            pagination={false}
            scroll={{ x: 1200, y: height }}
            expandable={{
              defaultExpandAllRows: false,
            }}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        <Modal
          title={"Phân ca"}
          width={isMobile ? '100%' : '60%'}
          onCancel={handleCloseScheduleShift}
          confirmLoading={loading}
          open={openScheduleShift}
          destroyOnClose
          bodyStyle={
            {
              paddingBottom: 80
            }
          }
          footer={
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button key={1} onClick={handleCloseScheduleShift}>
                Hủy
              </Button>
              <Button
                key={2}
                onClick={() => handleSchedule({ from_date: fromDate, to_date: toDate, employee_ids: employeeIds })}
                type="primary"
                loading={loading}>
                Xác nhận
              </Button>
            </div>
          }
        >

          <div style={{ "color": "red", "paddingBottom": "10px", "fontWeight": "bold" }}>
            Nếu không chọn nhân viên sẽ mặc định phân tất cả nhân viên trong công ty cho phép
          </div>
          <SelectMultipleEmployeeSearch domain_search={["|",["severance_day","=",false],["severance_day", ">=", today_minus_45_days]]} onChange={handleChangeEmployees} />

        </Modal>
        <FileForm
          onClose={onClose}
          showDrawerImport={showDrawerImport}
          importOpen={importOpen}
          setForceUpdate={setForceUpdate}
          forceUpdate={forceUpdate}
          form={form}
        />
      </Card>
      <Modal
        title={`Báo cáo nhân viên từ ngàyy ${fromDate} đến ngày ${toDate}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1200}
        style={{
          height: 800,
        }}
        className="custom-modal">
        {/* {isMobile ? (

        ) : ()} */}
        {isMobile ? (
          <Col style={{ gap: '12' }}>
            <Col span={12}>
              <div className="modal-headerr">
                {selectedEmployeeCode && (
                  <Row gutter={[8, 8]}>
                    {selectedEmployeeCode && (
                      <div className="info-containerr">
                        <div className="info-row">
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={7}
                            className="col-left">
                            <p>Mã nhân viên:</p>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={7}
                            className="col-right">
                            <span>{selectedEmployeeCode}</span>
                          </Col>
                        </div>
                        <div className="info-row">
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={7}
                            className="col-left">
                            <p>Tên nhân viên</p>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={7}
                            className="col-right">
                            <span>
                              {
                                dataAttendant
                                  .map((item: any) => item.children)
                                  .flat()
                                  .filter(
                                    (childItem: any) =>
                                      childItem.employee_code ===
                                      selectedEmployeeCode
                                  )[0].employee_name
                              }
                            </span>
                          </Col>
                        </div>
                        <div className="info-row">
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={7}
                            className="col-left">
                            <p>Phòng ban:</p>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={7}
                            className="col-right">
                            <span>
                              {
                                dataAttendant
                                  .map((item: any) => item.children)
                                  .flat()
                                  .filter(
                                    (childItem: any) =>
                                      childItem.employee_code ===
                                      selectedEmployeeCode
                                  )[0].department
                              }
                            </span>
                          </Col>
                        </div>
                        <div className="info-row">
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={7}
                            className="col-left">
                            <p>Chức vụ:</p>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={7}
                            className="col-right">
                            <span>
                              {
                                dataAttendant
                                  .map((item: any) => item.children)
                                  .flat()
                                  .filter(
                                    (childItem: any) =>
                                      childItem.employee_code ===
                                      selectedEmployeeCode
                                  )[0].job_title
                              }
                            </span>
                          </Col>
                        </div>
                      </div>
                    )}
                  </Row>
                )}
                <div
                  className="button-container"
                  style={{ marginLeft: isMobile ? 0 : '' }}>
                  <button
                    className="button-container-1"
                    onClick={() => changeEmployee('previous')}>
                    NV Trước
                  </button>
                  <button
                    className="button-container-1"
                    onClick={() => changeEmployee('next')}>
                    NV Sau
                  </button>
                </div>
              </div>
            </Col>
            <Col span={24}>
              <Calendar
                // className="custom-calendar"
                dateCellRender={date => dateCellRender(date)}
                headerRender={({}) => null}
                value={selectedMonth}
                locale={locale}
                onPanelChange={handlePanelChange}
              />
            </Col>
          </Col>
        ) : (
          <Row>
            <Col span={6}>
              <div className="modal-headerr">
                {selectedEmployeeCode && (
                  <Row gutter={[8, 8]}>
                    {selectedEmployeeCode && (
                      <div className="info-containerr">
                        <div className="info-row">
                          <Col span={12} className="col-left">
                            <p>Mã nhân viên:</p>
                          </Col>
                          <Col span={12} className="col-right">
                            <span>{selectedEmployeeCode}</span>
                          </Col>
                        </div>
                        <div className="info-row">
                          <Col span={12} className="col-left">
                            <p>Tên nhân viên</p>
                          </Col>
                          <Col span={12} className="col-right">
                            <span>
                              {
                                dataAttendant
                                  .map((item: any) => item.children)
                                  .flat()
                                  .filter(
                                    (childItem: any) =>
                                      childItem.employee_code ===
                                      selectedEmployeeCode
                                  )[0].employee_name
                              }
                            </span>
                          </Col>
                        </div>
                        <div className="info-row">
                          <Col span={12} className="col-left">
                            <p>Phòng ban:</p>
                          </Col>
                          <Col span={12} className="col-right">
                            <span>
                              {
                                dataAttendant
                                  .map((item: any) => item.children)
                                  .flat()
                                  .filter(
                                    (childItem: any) =>
                                      childItem.employee_code ===
                                      selectedEmployeeCode
                                  )[0].department
                              }
                            </span>
                          </Col>
                        </div>
                        <div className="info-row">
                          <Col span={12} className="col-left">
                            <p>Chức vụ:</p>
                          </Col>
                          <Col span={12} className="col-right">
                            <span>
                              {
                                dataAttendant
                                  .map((item: any) => item.children)
                                  .flat()
                                  .filter(
                                    (childItem: any) =>
                                      childItem.employee_code ===
                                      selectedEmployeeCode
                                  )[0].job_title
                              }
                            </span>
                          </Col>
                        </div>
                      </div>
                    )}
                  </Row>
                )}
                <div className="button-container">
                  <button
                    className="button-container-1"
                    onClick={() => changeEmployee('previous')}>
                    NV Trước
                  </button>
                  <button
                    className="button-container-1"
                    onClick={() => changeEmployee('next')}>
                    NV Sau
                  </button>
                </div>
              </div>
            </Col>
            <Col span={18}>
              <Calendar
                className="custom-calendar"
                style={{
                  marginLeft: 50,
                }}
                dateCellRender={date => dateCellRender(date)}
                headerRender={({}) => null}
                value={selectedMonth}
                locale={locale}
                onPanelChange={handlePanelChange}
              />
            </Col>
          </Row>
        )}
      </Modal>

      <Modal
        title={`${selectedEmployeeName}`}
        open={isModalInfoEmployeeVisible}
        onCancel={() => setIsModalInfoEmployeeVisible(false)}
        footer={null}
        width={1200}
        style={{
          height: 900,
          borderBottom: '5px solid #e8e8e8',
        }}
        className="custom-modal-info">
        <Row>
          <Col span={6}>
            <div className="info-employee-main">
              <div className="info-employee-column-right">
                <p>{selectedEmployeeCode}</p>
                <p>
                  {
                    dataAttendant
                      .map((item: any) => item.children)
                      .flat()
                      .filter(
                        (childItem: any) =>
                          childItem.employee_code === selectedEmployeeCode
                      )[0]?.department
                  }
                </p>
              </div>
              <div className="info-employee-column-left">
                <p>{selectedEmployeeName}</p>
                <p>
                  {
                    dataAttendant
                      .map((item: any) => item.children)
                      .flat()
                      .filter(
                        (childItem: any) =>
                          childItem.employee_code === selectedEmployeeCode
                      )[0]?.job_title
                  }
                </p>
              </div>
            </div>
          </Col>
          <Col>
            <div className="info-employee-contain">
              <div className="info-employee-item">
                <div className="info-employee-title">THÔNG TIN CHUNG</div>
                <div className="info-employee-content-1">
                  <div className="info-columns">
                    <div className="info-column">
                      <div className="info-label">Ngày sinh:</div>
                      <div className="info-value">Value</div>
                    </div>
                    <div className="info-column">
                      <div className="info-label">Bằng cấp:</div>
                      <div className="info-value">Value</div>
                    </div>
                  </div>
                  <div className="info-columns">
                    <div className="info-column">
                      <div className="info-label">Số CMTND:</div>
                      <div className="info-value">Value</div>
                    </div>
                    <div className="info-column">
                      <div className="info-label">Tên trường:</div>
                      <div className="info-value">Value</div>
                    </div>
                  </div>
                  <div className="info-columns">
                    <div className="info-column">
                      <div className="info-label">SĐT:</div>
                      <div className="info-value">Value</div>
                    </div>
                    <div className="info-column">
                      <div className="info-label">Chuyên ngành học:</div>
                      <div className="info-value">Value</div>
                    </div>
                  </div>
                  <div className="info-columns">
                    <div className="info-column">
                      <div className="info-label">Email:</div>
                      <div className="info-value">Value</div>
                    </div>
                    <div className="info-column">
                      <div className="info-label">Năm tốt nghiệp:</div>
                      <div className="info-value">Value</div>
                    </div>
                  </div>
                  <div className="info-columns">
                    <div className="info-column">
                      <div className="info-label">Địa chỉ:</div>
                      <div className="info-value">Value</div>
                    </div>
                    <div className="info-column">
                      <div className="info-label">Chứng chỉ khác:</div>
                      <div className="info-value">Value</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="info-employee-item">
                <div className="info-employee-title">KINH NGHIỆM LÀM VIỆC</div>
                <div className="info-employee-content">
                  <div className="experience-row">
                    <div className="experience-column">
                      <span className="experience-value">Thời gian</span>
                    </div>
                    <div className="experience-column">
                      <span className="experience-value">Tên công ty</span>
                    </div>
                    <div className="experience-column">
                      <span className="experience-value">Vị trí làm việc</span>
                    </div>
                  </div>
                  <div className="experience-position">
                    <h3>Mô tả công việc</h3>
                  </div>
                  <div className="experience-description">
                    <ul>
                      <li>Controlled cash and provided banking needs</li>
                      <li>Made store preparations for daily operations</li>
                      <li>Trained new employees in store operations</li>
                      <li>
                        Provided customer service and trained employees as
                        effective team members
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="info-employee-item">
                <div className="info-employee-title">QUÁ TRÌNH LÀM VIỆC</div>
                <div className="info-employee-content">
                  <div className="experience-row">
                    <div className="experience-column">
                      <span className="experience-value">Thời gian</span>
                    </div>
                    <div className="experience-column">
                      <span className="experience-value">Ban/TT</span>
                    </div>
                    <div className="experience-column">
                      <span className="experience-value">Phòng</span>
                    </div>
                  </div>
                  <div className="experience-position">
                    <h3>Mô tả công việc</h3>
                  </div>
                  <div className="experience-description">
                    <ul>
                      <li>Controlled cash and provided banking needs</li>
                      <li>Made store preparations for daily operations</li>
                      <li>Trained new employees in store operations</li>
                      <li>
                        Provided customer service and trained employees as
                        effective team members
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="info-employee-item">
                <div className="info-employee-title">KHEN THƯỞNG</div>
                <div className="info-employee-content">
                  <div className="experience-row">
                    <div className="experience-column">
                      <span className="experience-value">Thời gian</span>
                    </div>
                  </div>
                  <div className="experience-position">
                    <h3>Thành tích</h3>
                  </div>
                  <div className="experience-description">
                    <ul>
                      <li>Controlled cash and provided banking needs</li>
                      <li>Made store preparations for daily operations</li>
                      <li>Trained new employees in store operations</li>
                      <li>
                        Provided customer service and trained employees as
                        effective team members
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="info-employee-item">
                <div className="info-employee-title">KỶ LUẬT</div>
                <div className="info-employee-content">
                  <div className="experience-row">
                    <div className="experience-column">
                      <span className="experience-value">Thời gian</span>
                    </div>
                  </div>
                  <div className="experience-position">
                    <h3>Lý do kỷ luật</h3>
                  </div>
                  <div className="experience-description">
                    <ul>
                      <li>Controlled cash and provided banking needs</li>
                      <li>Made store preparations for daily operations</li>
                      <li>Trained new employees in store operations</li>
                      <li>
                        Provided customer service and trained employees as
                        effective team members
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
export default index;
