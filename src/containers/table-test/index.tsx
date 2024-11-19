import { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Spin,
  Table,
  Typography,
  message as $message,
  Switch,
  Modal,
  Button,
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
import './style.css';
import { LocaleFormatter } from '@/locales';
import { getFormattedDate } from '@/utils/common';
import { setACellActive, setCellsActive } from '@/stores/common.store';
import { ICellActive } from '@/interface/common/type';
import { formatDateTable } from '@/utils/formatDate';
import moment from 'moment';
import { ReactComponent as WarningSvg } from '@/assets/icons/ic_warming.svg';
const { Text } = Typography;
import { Empty } from 'antd';
import { updateUserSummary } from '@/api/employee_weekly_report/employeeWeeklyReport.api';
import {
  calculateAttendanceReport,
  getAttendanceReport,
  reCalculateData,
  fillReportData,
} from '@/api/weeklyreport/weeklyreport';
import {
  IGetAttendanceContentParams,
  IGetAttendanceParams,
} from '@/interface/weeklyreport/type';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import { transformObject } from '@/utils/common';
import { setListAttendance } from '@/stores/list-attendance-report.store';
import { Form } from 'antd';
import {
  IScheduleShiftArgs,
  scheduleShift,
} from '@/api/shiftRequest/shiftRequest.api';
import SelectMultipleEmployeeSearch from '@/pages/components/selects/SelectMultipleEmployeeSearch';
import { mobileResponsive } from '@/utils/mobileResponsive';

interface ITableProps {
  onShowInfo: () => void;
  forceUpdate?: boolean;
  fromDate: string;
  toDate: string;
  dataAttendant: any;
  setDataAttendant: any;
  disabledButton: boolean;
  setForceUpdate?: any;
  dataEmployee: any;
}
const TableTest = (props: ITableProps) => {
  const {
    onShowInfo,
    forceUpdate,
    fromDate,
    toDate,
    dataAttendant,
    setDataAttendant,
    disabledButton,
    setForceUpdate,
    dataEmployee,
  } = props;
  const [forceRender, setForceRender] = useState(false);
  const _setListAttendance = (data: any) => dispatch(setListAttendance(data));
  const [updateAttendance, setUpdateAttendance] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [importOpen, setImportOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [openScheduleShift, setOpenScheduleShift] = useState(false);
  const [employeeIds, setEmployeeIds] = useState<number[]>([]);
  const onChange = (checked: boolean) => {
    setChecked(checked);
  };
  useEffect(() => {
    if (employee_ho === 'true') {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, []);
  // Dispatch
  // =================
  const dispatch = useDispatch();
  const _setWeeklyData = (data: WeeklyReportState) =>
    dispatch(setWeeklyData(data));
  const _setCellsActive = (data: ICellActive) => dispatch(setCellsActive(data));
  const _setACellActive = (data: ICellActive) => dispatch(setACellActive(data));
  // =================================================================
  // Selector
  // =================================================================
  const { loading } = useSelector(state => state.global);
  const { cellsActive } = useSelector(state => state.common);

  const recursiveUpdateSummary = async (pageNumber: number) => {
    const args = [
      localStorage.getItem('company_name'),
      convertFormatDate(fromDate),
      convertFormatDate(toDate),
      500,
      pageNumber,
      false,
    ];
    const params: IGetAttendanceContentParams = {
      args,
    };
    const body: IGetAttendanceParams = {
      params,
    };
    const updatePromise = updateUserSummary(body);
    store.dispatch(setGlobalState({ loading: true }));
    if (updatePromise) {
      await updatePromise.then(res => {
        if (res.result.total_records == 500) {
          recursiveUpdateSummary(pageNumber + 1);
          // store.dispatch(setGlobalState({ loading: false }));
        } else if (res.result.total_records < 500) {
          setUpdateAttendance(!updateAttendance);
        }
      });
    }
  };

  const convertFormatDate = (date: string) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

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

  const handleClick = (item: any, event: any) => {
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    if (isCtrlPressed) {
      onCellClick(item);
      _setCellsActive({
        code: item?.employee_code,
        date: item?.date,
        id: item?.id,
        total_work_time: item?.total_work_time,
      });
    } else {
      onCellClick(item);
      _setACellActive({
        code: item?.employee_code,
        date: item?.date,
        id: item?.id,
        total_work_time: item?.total_work_time,
      });
    }
  };

  // sử lý hiển thị table
  const floatToHourMinute = (floatValue: number): string => {
    const hours = Math.floor(floatValue);
    const minutes = Math.round((floatValue - hours) * 60);

    if (minutes === 0) {
      return `${hours.toString()}h`;
    } else {
      return `${hours.toString()}h${minutes.toString()}`;
    }
  };
  let today_minus_45_days = moment().subtract(45, 'days').format('YYYY-MM-DD');

  const generateColumns = (
    start: string,
    end: string
  ): ColumnsType<DataWeeklyType> => {
    const columns: ColumnsType<DataWeeklyType> = [];
    start = formatDateTable(start);
    end = formatDateTable(end);
    const currentDate = new Date(start);
    while (currentDate <= new Date(end)) {
      var year = currentDate.getFullYear();
      var month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Thêm số 0 vào trước tháng nếu chỉ có một chữ số
      var day = ('0' + currentDate.getDate()).slice(-2); // Thêm số 0 vào trước ngày nếu chỉ có một chữ số

      // Định dạng chuỗi ngày tháng dưới dạng "YYYY-MM-DD"
      var dateString = year + '-' + month + '-' + day;
      const columnKey = `${dateString}`;
      const columnTitle = getFormattedDate(
        moment(currentDate).locale('vi').format('dddd DD/MM/YYYY')
      );
      const column = {
        title: columnTitle,
        dataIndex: columnKey,
        key: columnKey,
        width: 80,
        render: (item: any) => {
          let bg;
          let additionalClass = '';

          //convert thời gian
          const convertToTimeString = (decimalTime: any) => {
            const hours = Math.floor(decimalTime);
            const minutes = Math.floor((decimalTime - hours) * 60);
            return `${hours.toString().padStart(2, '0')}:${minutes
              .toString()
              .padStart(2, '0')}:00`;
          };
          //check xem nhân viên có ra ngoài trong giờ hay không
          // const checkAttendance = (item: any) => {
          //   if (!item) return false;

          //   let isLate = false;
          //   let i = 1;
          //   // tạo vong lặp để kiểm tra các lần ra vaof
          //   while (
          //     item[`attendance_inout_${i}`] ||
          //     item[`attendance_attempt_${i}`]
          //   ) {
          //     const attendanceInOut = item[`attendance_inout_${i}`];
          //     const attendanceAttempt = new Date(
          //       item[`attendance_attempt_${i}`]
          //     );

          //     if (attendanceInOut === 'O' && attendanceAttempt) {
          //       // Chuyển đổi các giá trị thời gian của ca làm và thời gian nghỉ sang đối tượng Date
          //       const shiftStart = new Date(
          //         item.date + ' ' + convertToTimeString(item.shift_start)
          //       );
          //       const shiftEnd = new Date(
          //         item.date + ' ' + convertToTimeString(item.shift_end)
          //       );
          //       const restStart = new Date(
          //         item.date + ' ' + convertToTimeString(item.rest_start)
          //       );
          //       const restEnd = new Date(
          //         item.date + ' ' + convertToTimeString(item.rest_end)
          //       );

          //       // Kiểm tra xem attendanceAttempt có nằm trong khoảng thời gian làm việc hay không
          //       if (
          //         attendanceAttempt > shiftStart &&
          //         attendanceAttempt < shiftEnd
          //       ) {
          //         // Kiểm tra xem attendanceAttempt có nằm trong khoảng thời gian nghỉ không
          //         if (
          //           attendanceAttempt < restStart ||
          //           attendanceAttempt > restEnd
          //         ) {
          //           isLate = true;
          //           break;
          //         }
          //       }
          //     }

          //     i++;
          //   }

          //   return isLate;
          // };

          // const isLate = checkAttendance(item);

          // const isLate = checkAttendance();
          // let bd = '1px solid rgb(240, 240, 240)';
          // Điều kiện để đặt nền trắng cho ô có mã ca là OFF hoặc -
          if (item?.shift_name === 'OFF' || item?.shift_name === '-') {
            bg = 'white';
            additionalClass = 'off-shift';
          }
          // if (
          //   !item?.total_shift_work_time &&
          //   (item?.attendance_attempt_1 ||
          //     item?.attendance_attempt_2 ||
          //     item?.attendance_attempt_3 ||
          //     item?.attendance_attempt_4 ||
          //     item?.attendance_attempt_5 ||
          //     item?.attendance_attempt_6 ||
          //     item?.attendance_attempt_7 ||
          //     item?.attendance_attempt_8 ||
          //     item?.attendance_attempt_9 ||
          //     item?.attendance_attempt_10 ||
          //     item?.attendance_attempt_11 ||
          //     item?.attendance_attempt_12 ||
          //     item?.attendance_attempt_13 ||
          //     item?.attendance_attempt_14 ||
          //     item?.attendance_attempt_15 ||
          //     item?.last_attendance_attempt)
          // ) {
          //   bg = 'gold';
          // } else {
          //   bg = 'transparent';
          // }
          let tangCa = false;

          if (
            item?.date &&
            item?.attendance_attempt_1 &&
            item?.last_attendance_attempt
          ) {
            const hourFloat =
              moment(item.attendance_attempt_1).hour() +
              moment(item.attendance_attempt_1).minute() / 60;
            const hourFloat2 =
              moment(item.last_attendance_attempt).hour() +
              moment(item.last_attendance_attempt).minute() / 60;
            if (
              item.shift_start &&
              item.shift_end &&
              item.total_shift_work_time &&
              item.total_work_time
            ) {
              if (item.total_shift_work_time > 0) {
                if (
                  !(
                    Number(item?.total_shift_work_time) * 60 >
                    Number(item?.total_work_time)
                  )
                ) {
                  if (
                    (item.shift_start - hourFloat >= 0.5 &&
                      hourFloat2 - item.shift_end >= 0) ||
                    (hourFloat2 - item.shift_end >= 0.5 &&
                      item.shift_start - hourFloat >= 0)
                  ) {
                    tangCa = true;
                  } else if (
                    item.shift_start - hourFloat === 0 &&
                    hourFloat - item.shift_end >= 0.5
                  ) {
                    tangCa = true;
                  }
                }
              }
            }
          }

          return {
            props: {
              style: {
                background: bg,
                cursor: item?.employee_code ? 'pointer' : 'not-allowed',
                // border: bd,
              },
            },
            children:
              item?.employee_code && checked ? (
                <div
                  className={`cell-content2${additionalClass} ${cellsActive &&
                      cellsActive.some(
                        (cell: ICellActive) =>
                          item?.employee_code === cell.code &&
                          item?.date === cell.date &&
                          item?.id === cell.id
                      ) &&
                      item?.employee_code
                      ? 'active'
                      : ''
                    }`}
                  onClick={event => handleClick(item, event)}
                  tabIndex={0}>
                  {/* {item?.shift_name && (
                  <Text style={{ color: '#694730' }}>{item?.shift_name}</Text>
                )} */}
                  <>
                    {[
                      'CL',
                      'AL',
                      'OFF',
                      'UP',
                      'PH',
                      'SL',
                      'WD',
                      'ML',
                      'CĐ',
                      '-',
                    ].includes(item?.shift_name) ? (
                      item?.shift_name
                    ) : (
                      <>
                        <div style={{ position: 'relative' }}>
                          {item?.attendance_late > 0 ? (
                            <div
                              style={{
                                background: '#f3a884',
                                width: '30px',
                                height: '16px',
                                position: 'absolute',
                                left: -6,
                                top: -5,
                                zIndex: 0,
                                opacity: 0.7,
                              }}></div>
                          ) : (
                            ''
                          )}
                          {/* {isLate ? (
                            <div
                              style={{
                                background: 'red',
                                width: '30px',
                                height: '12px',
                                position: 'absolute',
                                left: -6,
                                top: 10,
                                zIndex: 0,
                                opacity: 0.7,
                              }}></div>
                          ) : (
                            ''
                          )} */}
                          <Text
                            className="content"
                            style={{
                              position: 'relative',
                              zIndex: 1,
                              fontSize: '10px',
                              // backgroundColor:
                              //   item?.attendance_late > 0 ? 'red' : '',
                              color:
                                item?.attendance_late > 0 ? 'red' : 'black',
                            }}>
                            {item?.shift_start &&
                              floatToHourMinute(item?.shift_start)}
                          </Text>

                          <Text
                            className="content"
                            style={{
                              position: 'relative',
                              zIndex: 1,
                              // backgroundColor: item?.leave_early > 0 ? 'red' : '',
                              color: item?.leave_early > 0 ? 'red' : 'black',
                              // background: item?.leave_early > 0 ? 'red' : '',

                              fontSize: '10px',
                            }}>
                            {item?.shift_end &&
                              floatToHourMinute(item?.shift_end)}
                          </Text>
                          {item?.leave_early > 0 ? (
                            <div
                              style={{
                                background: '#f3a884',
                                width: '30px',
                                height: '16px',
                                position: 'absolute',
                                left: -6,
                                bottom: -5,
                                zIndex: 0,
                                opacity: 0.7,
                              }}></div>
                          ) : (
                            ''
                          )}
                        </div>
                        {item?.total_work_time && (
                          <Text
                            style={{
                              color:
                                Number(item?.total_shift_work_time) * 60 >
                                  Number(item?.total_work_time)
                                  ? 'red'
                                  : 'black',
                              fontWeight: 'bold',
                            }}>
                            {item?.missing_checkin_break
                              ? Math.round(Math.min(item?.total_work_time, 240))
                              : item?.shift_name.includes('/OFF') &&
                                item?.total_work_time > 240
                                ? Math.round(
                                  Math.min(item?.total_work_time, 240) -
                                  Math.min(
                                    item?.attendance_late,
                                    item?.leave_early
                                  )
                                )
                                : Math.round(item?.total_work_time)}
                          </Text>
                        )}
                      </>
                    )}
                  </>

                  {/* {tangCa && <WarningSvg width={25} height={25} />} */}
                  {/* {item?.total_work_time < item?.actual_total_work_time && (
                  <ExceptionOutlined width={25} height={25} />
                )} */}
                </div>
              ) : (
                <div
                  className={`cell-content ${cellsActive &&
                      cellsActive.some(
                        (cell: ICellActive) =>
                          item?.employee_code === cell.code &&
                          item?.date === cell.date &&
                          item?.id === cell.id
                      ) &&
                      item?.employee_code
                      ? 'active'
                      : ''
                    }`}
                  onClick={event => handleClick(item, event)}
                  tabIndex={0}>
                  {item?.shift_name && (
                    <Text style={{ color: '#694730' }}>{item?.shift_name}</Text>
                  )}
                  {item?.total_work_time && (
                    <Text
                      style={{
                        color:
                          Number(item?.total_shift_work_time) * 60 >
                            Number(item?.total_work_time)
                            ? 'red'
                            : '#815f53',
                      }}>
                      {item?.missing_checkin_break
                        ? Math.round(Math.min(item?.total_work_time, 240))
                        : item?.shift_name.includes('/OFF') &&
                          item?.total_work_time > 240
                          ? Math.round(
                            Math.min(item?.total_work_time, 240) -
                            Math.min(item?.attendance_late, item?.leave_early)
                          )
                          : Math.round(item?.total_work_time)}
                    </Text>
                  )}

                  {tangCa && <WarningSvg width={25} height={25} />}
                  {/* {item?.total_work_time < item?.actual_total_work_time && (
                <ExceptionOutlined width={25} height={25} />
              )} */}
                </div>
              ),
          };
        },
      };
      columns.push(column);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return columns;
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
    const ho_comp = localStorage.getItem('ho_selected');
    let list_ho_comp = ho_comp?.split(',');
    const list_ho_comp_int = list_ho_comp?.map(item => {
      return parseInt(item);
    });
    const admin_ho = localStorage.getItem('is_administrative');
    const sub_admin_role = localStorage.getItem('sub_admin_role');
    let args: any[] = [fromDate, toDate, ''];

    try {
      if (fromDate !== '' && toDate !== '') {
        if (
          ho_comp === null &&
          (admin_ho === 'true' || sub_admin_role !== 'none')
        ) {
          $message.error('Vui lòng chọn công ty');
          return;
        } else if (ho_comp != null && admin_ho === 'true') {
          const apiPromises = list_ho_comp_int?.map(async intValue => {
            args = [fromDate, toDate, '', intValue];

            const params: IGetAttendanceContentParams = {
              args,
            };
            const body: IGetAttendanceParams = {
              params,
            };
            store.dispatch(setGlobalState({ loading: true }));
            const res = await calculateAttendanceReport(body);
          });
          apiPromises &&
            (await Promise.all(apiPromises).then(res => {
              store.dispatch(setGlobalState({ loading: false }));
              setUpdateAttendance(!updateAttendance);
            }));
        } else {
          const params: IGetAttendanceContentParams = {
            args,
          };
          const body: IGetAttendanceParams = {
            params,
          };
          store.dispatch(setGlobalState({ loading: true }));
          const apiPromises = await calculateAttendanceReport(body);
          if (apiPromises) {
            // (await Promise.all(apiPromises).then( async  (res) => {

            let pageNumber = 0;
            recursiveUpdateSummary(pageNumber);

            //  const args = [localStorage.getItem('company_name') , convertFormatDate(fromDate) , convertFormatDate(toDate) , 500 , pageNumber , false]
            //  const params: IGetAttendanceContentParams = {
            //   args,
            // };
            // const body: IGetAttendanceParams = {
            //   params,
            // };
            //  const updatePromise = updateUserSummary(body)
            //   store.dispatch(setGlobalState({ loading: true }));
            //   if (updatePromise) {
            //     (await updatePromise.then((res) => {
            //       if (res){
            //         // store.dispatch(setGlobalState({ loading: false }));
            //         setUpdateAttendance(!updateAttendance);
            //       }

            // }));
            //   }
            // }));
          }
          // if  (res.result != undefined) {
          //   setUpdateAttendance(!updateAttendance);
          //   store.dispatch(setGlobalState({ loading: false }));
          // } else {
          //   store.dispatch(setGlobalState({ loading: false }));
          // }
          // store.dispatch(setGlobalState({ loading: false }));
        }
      }
    } catch (error) {
      console.log(error);

    }
  };
  //tính tổng cổng 
  const actual_total_work_time =
    dataEmployee &&
    dataEmployee.map((item: any) => {
      const workTime = item.actual_total_work_time;
      const reducedMinutes = item.minutes_working_reduced;
      const totalShiftWorkTime =
        Math.round(item.total_shift_work_time * 6) * 10 + reducedMinutes;
      // Kiểm tra nếu `totalShiftWorkTime` là 0 hoặc nhỏ hơn 1 để tránh phép chia cho 0
      const result = totalShiftWorkTime > 0 ? workTime / totalShiftWorkTime : 0;

      return { employee_code: item.employee_code, result };
    });
  const filteredArray4 =
    actual_total_work_time &&
    actual_total_work_time.filter((item: any) => {
      const isValid =
        item.result > 0 &&
        item.result !== false &&
        item.result !== null &&
        isFinite(item.result);
      return isValid;
    });

  const totalPerEmployeeCode =
    filteredArray4 &&
    filteredArray4.reduce((acc: any, item: any) => {
      if (!acc[item.employee_code]) {
        acc[item.employee_code] = 0;
      }
      acc[item.employee_code] += item.result;
      return acc;
    }, {});



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
      $message.success('Phân ca thành công');
      return res;
    } else {
      store.dispatch(setGlobalState({ loading: false }));
      $message.error('Phân ca thất bại');
    }
  };

  const handleRecalculateData = async () => {
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
        const res = await reCalculateData(body);

        if (res.result != undefined) {
          setUpdateAttendance(!updateAttendance);
          store.dispatch(setGlobalState({ loading: false }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFillData = async () => {
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
        const res = await fillReportData(body);

        if (res.result != undefined) {
          setUpdateAttendance(!updateAttendance);
          store.dispatch(setGlobalState({ loading: false }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Columns: ColumnsType<DataWeeklyType> = [
    {
      title: 'STT', // Tiêu đề số thứ tự
      key: 'stt',
      align: 'left',
      width: 80,
      fixed: 'left',
      render: (_, __, index) => index + 1, // Render số thứ tự
    },
    {
      title: 'Bộ phận',
      dataIndex: 'department',
      key: 'department',
      align: 'center',
      fixed: 'left',
      width: 90,
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'employee_code',
      key: 'employee_code',
      align: 'center',
      fixed: 'left',
      width: 110,
      render: item => {
        const style: React.CSSProperties = {
          height: '40px',
          whiteSpace: 'pre-wrap' as 'pre-wrap',
        };

        return <div style={style}>{item || ' '}</div>;
      },
    },

    {
      title: 'Họ và tên',
      dataIndex: 'employee_name',
      key: 'employee_name',
      align: 'center',
      fixed: 'left',
      width: 100,
      render: item => {
        return item && <div>{item}</div>;
      },
    },
    {
      title: 'Tổng công',
      align: 'center',
      fixed: 'left',
      width: 100,
      render(value, record, index) {
        // Kiểm tra nếu `employee_code` tồn tại trước khi sử dụng
        const employeeCode = record.employee_code;

        if (employeeCode) {
          const totalForEmployee = totalPerEmployeeCode[employeeCode] || 0;
          return (
            <div>
              <p>{totalForEmployee.toFixed(2)}</p>{' '}
              {/* Hiển thị tổng công với 2 chữ số thập phân */}
            </div>
          );
        }

        return (
          <div>
            <p>0</p>
          </div>
        ); // Nếu `employee_code` không tồn tại, hiển thị 0
      },
    },

    ...generateColumns(fromDate, toDate),
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
  let is_head_of_department = localStorage.getItem('is_head_of_department');
  let is_department_secretary = localStorage.getItem('is_department_secretary');
  let shouldShowButtons = is_general_manager === 'true';
  let employee_ho = localStorage.getItem('employee_ho');
  let is_administrative = localStorage.getItem('is_administrative');
  let sub_admin_role = localStorage.getItem('sub_admin_role');
  const { isMobile } = mobileResponsive();
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
  return (
    <div className="table-wrapper">
      <Card
        title={`Báo cáo từ ngày ${fromDate} đến ngày ${toDate}`}
        extra={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {is_administrative === 'true' && (
              <Switch
                checked={checked}
                onChange={onChange}
                style={{ marginRight: '15px' }}
              />
            )}

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
                <MyButton type="primary" onClick={handleImport}>
                  Import
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
            // dataSource={data}
            dataSource={dataAttendant}
            bordered
            pagination={false}
            scroll={{ y: height, x: 1200 }}
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
    </div>
  );
};

export default TableTest;
