import { useEffect, useState } from 'react';
import { Button,Card, Spin, message as $message, Calendar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setWeeklyData } from '@/stores/weekly.store';
import './style.css';
import { LocaleFormatter } from '@/locales';
import moment from 'moment';
import { FaCheckCircle } from 'react-icons/fa';
import {
  FileDoneOutlined,
  FileExcelOutlined,
  FileExclamationOutlined,
} from '@ant-design/icons';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import { transformObject } from '@/utils/common';
import { setListAttendance } from '@/stores/list-attendance-report.store';
import { Form } from 'antd';
import { GoClock, GoClockFill } from 'react-icons/go';
import {
  IGetAttendanceContentParams,
  IGetAttendanceParams,
  WeeklyReportState,
} from '@/interface/personal-timekeeping/type';
import { FaRegFaceFrownOpen, FaRegFaceGrin } from 'react-icons/fa6';
import { updateUserSummary } from '@/api/employee_weekly_report/employeeWeeklyReport.api';
import { getAttendanceReportSelf } from '@/api/weeklyreport/weeklyreport';
import FileForm from '../handle/fileForm';
import viVN from 'antd/lib/calendar/locale/vi_VN';
import { IShiftRequestArgs, getShiftRequests } from '@/api/shiftRequest/shiftRequest.api';
import { log } from 'console';
import { useNavigate } from 'react-router-dom';
interface ITableProps {
  onShowInfo: () => void;
  //handleClosePopup: () =>void,
  forceUpdate?: boolean;
  dataAttendant: any;
  setDataAttendant: any;
  disabledButton: boolean;
  setForceUpdate?: any;
}
const TableTest = (props: ITableProps) => {
  const {
    onShowInfo,
    //handleClosePopup,
    forceUpdate,
    setForceUpdate,
    dataAttendant,
    setDataAttendant,
  
  } = props;
  const [forceRender, setForceRender] = useState(false);
  const _setListAttendance = (data: any) => dispatch(setListAttendance(data));
  const [updateAttendance, setUpdateAttendance] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [importOpen, setImportOpen] = useState(false);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/shiftrequest');
  };
  const [dataEmployee, setDataEmployee] = useState<any>([]);

  // =================
  const dispatch = useDispatch();
  const _setWeeklyData = (data: WeeklyReportState) =>
    dispatch(setWeeklyData(data));

  // =================================================================
  // Selector
  // =================================================================
  const { loading } = useSelector(state => state.global);

  const showDrawerImport = () => {
    setImportOpen(true);
  };
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
        } else if (res.result.total_records < 500) {
          setUpdateAttendance(!updateAttendance);
        }
      });
    }
  };

  const [isClose, setIsClose] = useState(true);
  const [res, setRes] = useState<any>();

  const closePopup  = () => {
    setIsClose(false);
  };
//API đơn xin đổi ca
// useEffect(() => {
//   const fetchShiftRequests = async () => {
//     const args: IShiftRequestArgs = {
//       employee_id: 0,
//       employee_code: '',
//       department_id: 0,
//       create_date: '',
//       job_title: '',
//       state: '',
//       page_size: 0,
//       page: 0,
//       company_id: 0
//     };

//     dispatch(setGlobalState({ loading: true }));
    
//     const response = await getShiftRequests(args);

//     // Check if response is not empty
//     if (response && response.results.total > 0) {
//       setRes(response); 
//     } else {
//       setRes([]);
//     }

//     console.log(response);
//   };

//   fetchShiftRequests();
// }, [dispatch]);
useEffect(() => {
  const fetchShiftRequests = async () => {
    if (fromDate && toDate) {
      const args: IShiftRequestArgs = {
        employee_id: 0,
        employee_code: '',
        department_id: 0,
        create_date: '',
        job_title: '',
        state: '',
        page_size: 0,
        page: 0,
        company_id: 0,
        fromDate,
        toDate
      };
      console.log(fromDate, toDate);
      

      dispatch(setGlobalState({ loading: true }));

      try {
        const response = await getShiftRequests(args);
        if (response && response.results.total > 0) {
          setRes(response);
        } else {
          setRes([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setGlobalState({ loading: false }));
      }
    }
  };

  fetchShiftRequests();
}, [fromDate, toDate, dispatch]);

//API chấm công
  useEffect(() => {
    const getAttendance = async () => {
      try {
        if (fromDate !== '' && toDate !== '') {
          const args = [fromDate, toDate, ''];
          console.log(args);
          
          const params = { args };
          const body = { params };
          store.dispatch(setGlobalState({ loading: true }));
          const { result } = (await getAttendanceReportSelf(body)) as any;
         console.log(result);
         
          setDataEmployee(result);
          if (result) {
            const formattedObject = transformObject(result);
            setDataAttendant(formattedObject);
            _setListAttendance(JSON.stringify(formattedObject));
            store.dispatch(setGlobalState({ loading: false }));
            setForceRender(!forceRender);
          } else {
            store.dispatch(setGlobalState({ loading: false }));
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAttendance();
  }, [fromDate, toDate]);

  const convertFormatDate = (date: string) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const onClose = () => {
    setOpen(false);
    setImportOpen(false);
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
  const currentDate = new Date();
  let currentMonth = (currentDate.getMonth() + 1).toString();
  currentMonth = currentMonth.padStart(2, '0');
  const handleCellClick = async (value: any) => {
    let dateString = value.format('YYYY-MM-DD');
    let dayData: any = null;
    dataAttendant.forEach((item: any) => {
      if (item.children) {
        const foundData = item.children.find((child: any) => child[dateString]);
        if (foundData) {
          dayData = foundData[dateString];
        }
      }
    });
    _setWeeklyData(dayData);

    onShowInfo();
  };
  const formatDate2 = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handlePanelChange = async (date: any) => {
    const selectedMonth = date.month() + 1;
    const formattedMonth = String(selectedMonth).padStart(2, '0');
    // Chuyển đổi giá trị thành số
    const month = parseInt(selectedMonth);
    const year = new Date().getFullYear();
    // Ngày đầu tiên của tháng
    const firstDay = new Date(year, month - 1, 1);
    // Ngày cuối cùng của tháng
    const lastDay = new Date(year, month, 0);
    const formattedFirstDay = formatDate(firstDay);
    const formattedLastDay = formatDate(lastDay);
    setFromDate(formattedFirstDay);
    setToDate(formattedLastDay);
    const dateString = formatDate2(firstDay);
    const args = [formattedFirstDay, formattedLastDay, ''];
    const params = { args };
    const body = { params };
    store.dispatch(setGlobalState({ loading: true }));
    const { result } = (await getAttendanceReportSelf(body)) as any;
    if (result) {
      const formattedObject = transformObject(result);
      let dayData: any = null;
      formattedObject.forEach((item: any) => {
        if (item.children) {
          const foundData = item.children.find(
            (child: any) => child[dateString]
          );
          if (foundData) {
            dayData = foundData[dateString];
          }
        }
      });
      // _setWeeklyData(dayData);
    }
  };
  // tính ngày đi muộn
  const attendance_late = dataEmployee.map((item: any) => item.attendance_late);
  const filteredArray = attendance_late.filter(
    (item: any) => item > 0 && item !== false && item !== null
  );
  //tính ngày về sớm
  const leave_early = dataEmployee.map((item: any) => item.leave_early);
  const filteredArray2 = leave_early.filter(
    (item: any) => item > 0 && item !== false && item !== null
  );
  // tính cổng chuẩn
  const standard_working_day = dataEmployee.map(
    (item: any) => item.standard_working_day
  );
  const total_shift_work_time = dataEmployee.map(
    (item: any) => item.total_shift_work_time
  );
  const filteredArray5 = total_shift_work_time.filter(
    (item: any) => item > 0 && item !== false && item !== null
  );
  const filteredArray3 = standard_working_day.filter(
    (item: any) => item > 0 && item !== false && item !== null
  );
  const total = filteredArray3.reduce((sum: any, value: any) => sum + value, 0);
  let average = 0;
  if (filteredArray5.length > 0) {
    average = total / filteredArray3.length;
  }
  const roundedAverage = average.toFixed(2);
  // tính công tính lương
  const actual_total_work_time = dataEmployee.map((item: any) => {
    const workTime = item.actual_total_work_time;
    // console.log(item.actual_total_work_time,"0000000")
    const reducedMinutes = item.minutes_working_reduced;
    const result =
      workTime /
      (Math.round(item.total_shift_work_time * 6) * 10 + reducedMinutes);
    return result;
  });

  const filteredArray4 = actual_total_work_time.filter((item: any) => {
    const isValid = item > 0 && item !== false && item !== null;
    return isValid;
  });

  const total2 = filteredArray4.reduce((sum: any, value: any) => {
    const newSum = sum + value;

    return newSum;
  }, 0);

  const roundedAverage2 = total2.toFixed(2);
  const dateCellRender = (date: any) => {
    const dateStr = date.format('YYYY-MM-DD');
    let dayData = null;
    dataAttendant.forEach((item: any) => {
      if (item.children) {
        const foundData = item.children.find((child: any) => child[dateStr]);
        if (foundData) {
          dayData = foundData[dateStr];
        }
      }
    });
    if (dayData) {
      const {
        actual_work_start,
        actual_work_end,
        id,
        attendance_attempt_1,
        last_attendance_attempt,
        total_work_time,
        attendance_late,
        leave_early,
        shift_name,
        date,
        total_shift_work_time,
      } = dayData;

      const date2 = new Date(date);

      const sumTime = total_shift_work_time * 60;
      const roundedSumTime = Math.round(sumTime);

      const outTime =
        roundedSumTime - total_work_time - attendance_late - leave_early;

      // Định dạng ngày và tháng
      const day = date2.getDate().toString().padStart(2, '0');
      const month = (date2.getMonth() + 1).toString().padStart(2, '0');

      const formattedDate = `${day}/${month}`;
      const formattedTime = actual_work_start
        ? moment(actual_work_start).format('HH:mm')
        : '';
      const formattedTime2 = actual_work_end
        ? moment(actual_work_end).format('HH:mm')
        : '';
      const formattedTime3 = attendance_attempt_1
        ? moment(attendance_attempt_1).format('HH:mm')
        : '';
      const formattedTime4 = last_attendance_attempt
        ? moment(last_attendance_attempt).format('HH:mm')
        : '';

      function getFormattedMinutes(value: any) {
        // Check if the value has a decimal part
        if (value % 1 === 0) {
          // It's a whole number, just return it
          return Math.floor(value);
        } else {
          // Get the first digit after the decimal
          const decimalPart = value.toString().split('.')[1];
          return `${Math.floor(value)}.${decimalPart[0]}`; // Display only the first digit after the decimal
        }
      }
      return (
        <div className="collum" key={id}>
          {attendance_late > 0 || leave_early > 0 ? (
            <div className="backgroundHeader"></div>
          ) : (
            ''
          )}
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
          ].includes(shift_name) && <div className="backgroundHeader2"></div>}
          {attendance_late > 0 || leave_early > 0 ? (
            <div className="backgroundBody"></div>
          ) : (
            ''
          )}
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
          ].includes(shift_name) && <div className="backgroundBody2"></div>}

          <span className="mothly">{formattedDate}</span>
          <div className="time">
            {formattedTime && (
              <GoClock style={{ color: 'white', marginRight: '4px' }} />
            )}
            <span> {formattedTime}</span>
            {formattedTime && formattedTime2 && <span>-</span>}
            <span>{formattedTime2}</span>
          </div>

          <div
            className="number"
            style={{
              borderRight: [
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
              ].includes(shift_name)
                ? '1px solid gray'
                : ' 1px solid #10965a',
              borderBottom: [
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
              ].includes(shift_name)
                ? '1px solid gray'
                : '1px solid #10965a',
            }}>
            {getFormattedMinutes(total_work_time || 0) }
          </div>
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
          ].includes(shift_name) ? (
            <div
              className="attendance_late"
              style={{
                borderRight: [
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
                ].includes(shift_name)
                  ? '1px solid gray'
                  : '1px solid #10965a',
              }}>
              Nghỉ
            </div>
          ) : (
            <div>
              <div
                className="time-late"
                style={{
                  backgroundColor:
                    outTime > 0 && total_work_time > 0 ? '#eff545' : '',
                }}>
                {/* <FileExcelOutlined /> <span style={{fontSize:'10px', marginLeft:'2px'}}>2/5</span><br /> */}
                ra ngoài <br />
                <span>
                  {attendance_late > 0 &&
                  attendance_attempt_1 < actual_work_start
                    ? `${getFormattedMinutes(outTime + attendance_late)} phút`
                    : `${
                        outTime > 0 && total_work_time > 0
                          ? getFormattedMinutes(outTime)
                          : 0
                      } phút`}
                </span>
                {/* {outTime > 0 && total_work_time > 0 ? outTime : 0} phút */}
              </div>
              <div className="attendance_late">
                {/* <FileDoneOutlined/><span style={{fontSize:'10px', marginLeft:'2px'}}>1/5</span><br /> */}
                đi muộn <br />
                {attendance_attempt_1 > actual_work_start
                  ? `${attendance_late} phút`
                  : ` 0 phút`}
                {/* {attendance_late || 0} phút */}
              </div>
              <div className="leave_early">
                {/* <FileExclamationOutlined /> <span style={{fontSize:'10px', marginLeft:'2px'}}>5/5</span><br /> */}
                về sớm <br />
                {leave_early || 0} phút
              </div>
            </div>
          )}

          <div>
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
            ].includes(shift_name) ? (
              <div className="shift_name">{shift_name}</div>
            ) : (
              <div className="time-morning">
                {attendance_late > 0 || leave_early > 0 ? (
                  <GoClockFill
                    style={{
                      fontSize: '17px',
                      color: '#faa525',
                    }}
                  />
                ) : attendance_attempt_1 !== null ? (
                  <FaCheckCircle
                    style={{
                      fontSize: '17px',
                      color: '#28b255',
                    }}
                  />
                ) : (
                  ''
                )}
                <div style={{ marginLeft: '5px' }}>
                  <span style={{ color: attendance_late > 0.0 ? 'red' : '' }}>
                    {formattedTime3 ? formattedTime3 : ''}
                  </span>
                  {formattedTime3 && <span>-</span>}
                  <span style={{ color: leave_early > 0.0 ? 'red' : '' }}>
                    {formattedTime4 ? formattedTime4 : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getFirstAndLastDateOfMonth = () => {
    const now = new Date();
    // now.setDate(now.getDate() - 10);
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);

    return {
      firstDate: formatDate(firstDate),
      lastDate: formatDate(lastDate),
    };
  };

  useEffect(() => {
    const { firstDate, lastDate } = getFirstAndLastDateOfMonth();
    setFromDate(firstDate);
    setToDate(lastDate);
  }, []);

 
  return (
    <div className="table-wrapper">
      <Card title={`Bảng chấm công cá nhân`}>
        <Card>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
            }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}>
              <FaRegFaceGrin style={{ fontSize: '20px', color: '#28b255' }} />
              <span
                style={{
                  fontWeight: '500',
                  color: '#28b255',
                  paddingLeft: '5px',
                }}>
                Số công : {roundedAverage2}/{' '}
                {isNaN(+roundedAverage) ? 0.0 : roundedAverage}
              </span>
            </div>
            <div
              style={{
                paddingLeft: '20px',
                display: 'flex',
                alignItems: 'center',
              }}>
              <FaRegFaceFrownOpen
                style={{ fontSize: '20px', color: '#faa525' }}
              />
              <span
                style={{
                  fontWeight: '500',
                  color: '#faa525',
                  paddingLeft: '5px',
                }}>
                Đi muộn : {filteredArray.length}
              </span>
            </div>
            <div
              style={{
                paddingLeft: '20px',
                display: 'flex',
                alignItems: 'center',
              }}>
              <FaRegFaceFrownOpen
                style={{ fontSize: '20px', color: '#faa525' }}
              />
              <span
                style={{
                  fontWeight: '500',
                  color: '#faa525',
                  paddingLeft: '5px',
                }}>
                Về sớm : {filteredArray2.length}
              </span>
            </div>
            <div
              style={{
                paddingLeft: '15px',
                display: 'flex',
                alignItems: 'center',
              }}>
              <div
                style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '100%',
                  backgroundColor: '#ff7868',
                }}></div>
              <span
                style={{
                  fontWeight: '500',
                  paddingLeft: '10px',
                  color: '#C0C0C0',
                }}>
                Ngày nghỉ
              </span>
            </div>
            <div
              style={{
                paddingLeft: '15px',
                display: 'flex',
                alignItems: 'center',
              }}>
              <div
                style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '100%',
                  backgroundColor: '#faa525',
                }}></div>
              <span
                style={{
                  fontWeight: '500',
                  paddingLeft: '10px',
                  color: '#C0C0C0',
                }}>
                Ngày đi muộn/về sớm
              </span>
            </div>
            <div
              style={{
                paddingLeft: '15px',
                display: 'flex',
                alignItems: 'center',
                paddingRight: '15px',
              }}>
              <div
                style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '100%',
                  backgroundColor: '#28b255',
                }}></div>
              <span
                style={{
                  fontWeight: '500',
                  paddingLeft: '10px',
                  color: '#C0C0C0',
                }}>
                Ngày đủ công
              </span>
            </div>
            <div
              style={{
                paddingLeft: '15px',
                display: 'flex',
                alignItems: 'center',
                borderLeft: '2px solid #d9d9d9',
              }}>
              <FaCheckCircle
                style={{
                  fontSize: '17px',
                  color: '#28b255',
                }}
              />
              <span
                style={{
                  fontWeight: '500',
                  paddingLeft: '10px',
                  color: '#C0C0C0',
                }}>
                Ca đủ công
              </span>
            </div>
            <div
              style={{
                paddingLeft: '15px',
                display: 'flex',
                alignItems: 'center',
              }}>
              <GoClockFill
                style={{
                  fontSize: '17px',
                  color: '#faa525',
                }}
              />
              <span
                style={{
                  fontWeight: '500',
                  paddingLeft: '10px',
                  color: '#C0C0C0',
                }}>
                Ca đi muộn/về sớm
              </span>
            </div>
          </div>
        </Card>
        <Spin
          spinning={loading}
          className="app-loading-wrapper"
          tip={<LocaleFormatter id="gloabal.tips.loading" />}></Spin>

        <ul className="weekly" style={{ marginTop: 20 }}>
          <li>Chủ nhật</li>
          <li>Thứ 2</li>
          <li>Thứ 3</li>
          <li>Thứ 4</li>
          <li>Thứ 5</li>
          <li>Thứ 6</li>
          <li>Thứ 7</li>
        </ul>
        <Calendar
          style={{ marginTop: 20 }}
          locale={viVN}
          dateCellRender={dateCellRender}
          onSelect={handleCellClick}
          onChange={handlePanelChange}
          // defaultValue={defaultMonth}
        />
        <FileForm
          onClose={onClose}
          showDrawerImport={showDrawerImport}
          importOpen={importOpen}
          setForceUpdate={setForceUpdate}
          forceUpdate={forceUpdate}
          form={form}
        />
      </Card>
      {isClose && res && res.length === 0 && (
      <div className="overlay">
        <div className="popup">
          <button className="close-btn" onClick={closePopup}>x</button>
          <p>Bạn chưa làm đơn xin đổi ca từ {fromDate} - {toDate}</p>
          <p>Hãy kiểm tra đơn xin đổi ca của bạn trong danh sách đơn xin đổi ca</p>
          <Button type="primary" className="btn_shift"  onClick={handleClick}>
            Tạo đơn xin đổi ca
          </Button>
        </div>
      </div>
    )}
    </div>
  );
};

export default TableTest;
