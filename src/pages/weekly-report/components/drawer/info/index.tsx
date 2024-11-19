import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Divider, Space, Typography, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import moment from 'moment';
import {
  formatDateCallApi,
  formatDateDot,
  formatDateMonth,
} from '@/utils/formatDate';
import Icon, {
  ArrowRightOutlined,
  DownCircleOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import {
  IListLeavereq,
  InvalidTimesheet,
  historyShiftEditBody,
  historyShiftEditParams,
} from '@/interface/weeklyreport/type';
import { getHistoryEditById } from '@/api/shift/shift.api';
import { formatedHistoryShift } from '@/utils/common';
const { Text } = Typography;
import {
  getAttendanceDetailById,
  getAttendanceMark,
} from '@/api/weeklyreport/weeklyreport';
import {
  IGetAttendanceDetails,
  IGetAttendanceDetailsParams,
} from '@/interface/weeklyreport/type';
interface IInforProps {
  currentTabIndex: number;
  forceUpdate: boolean;
  foreUpdateLeave: boolean;
  setForceUpdateLeave: Dispatch<SetStateAction<boolean>>;
}

import { format_time } from '../leave';
import ExplainForm from '../explaintation/explain-form';
import LeaveForm from '../leave-work-late/leave-form';
import LeaveFormEarly from '../leave-work-early/leave-form';
import { setDetailAttendanceItem } from '@/stores/detail-attendance.store';
const floatToHourMinute = (floatValue: number): string => {
  const hours = Math.floor(floatValue);
  const minutes = Math.round((floatValue - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
};
export function formatDate(inputDateStr: string): string {
  // Parse the input string into a Date instance
  const inputDate = new Date(inputDateStr);

  // Extract individual components from the Date instance
  const day = inputDate.getDate().toString().padStart(2, '0');
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
  const year = inputDate.getFullYear();
  const hours = inputDate.getHours().toString().padStart(2, '0');
  const minutes = inputDate.getMinutes().toString().padStart(2, '0');

  // Create the formatted date string
  const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;

  return formattedDate;
}
const index = (props: IInforProps) => {
  const { currentTabIndex, forceUpdate } = props;
  const [isShowPoup, setIsShowPoup] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const { foreUpdateLeave, setForceUpdateLeave } = props;
  const [selectedTimeIn, setSelectedTimeIn] = useState<string>('');
  const [selectedTimeOut, setSelectedTimeOut] = useState<string>('');

  const [historyShiftEdits, setHistoryShiftEdits] = useState<any>([]);
  const employee_ho = localStorage.getItem('employee_ho');
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const is_ho =
    employee_ho === 'true' ||
    is_administrative === 'true' ||
    sub_admin_role === 'administration' ||
    sub_admin_role === 'recruitment'
      ? true
      : false;
  const dispatch = useDispatch();
  const detailAttendance = useSelector(state => state.detailAttendance);

  // =================
  // Selectors
  // =================
  const initialStateInvalidTimeSheet: InvalidTimesheet = {
    id: 0,
    reason: false,
    remarks: '',
    validated: '1',
    employee_id: 0,
    employee_name: '',
    employee_code: '',
    department: '',
    position: false,
    invalid_date: '',
    invalid_type: '',
    shift_from: '',
    shift_to: '',
    shift_break: false,
    real_time_attendance_data: '',
    validation_data: '',
    content: false,
    create_date: '',
    last_attendance_attempt: '',
    first_attendance_attempt: '',
    keep_in_time: false,
    attendance_missing_from: '',
    attendance_missing_to: '',
    
    
  };
  const [detailAttendanceSelected, setDetailAttendanceSelected] =
    useState<InvalidTimesheet>(initialStateInvalidTimeSheet);

  const {
    shift_name,
    shift_start,
    shift_end,
    rest_start,
    rest_end,
    total_work_time,
    total_shift_work_time,
    time_keeping_code,
    resource_calendar,
    id,
    employee_code,
    date,

    actual_total_work_time,
    locked

  } = useSelector(state => state.weekly);
  
 

  const initialStateIListLeave: IListLeavereq = {
    id: 0,
    created_date: '',
    from_date: '',
    state: '',
    date_to: '',
    holiday_status_id: {
      id: 0,
      name: '',
      type: '',
    },
    employee_id: {
      id: 0,
      name: '',
    },
    config_id: {
      id: 0,
      name: '',
    },
    for_reasons: '',
    reasons: '',
    time: 0,
    minutes: 0,
    overtime_from: null,
    overtime_to: null,
    attendance_missing_from: null,
    attendance_missing_to: null,
    convert_overtime: false,
    multiplier_wage: 0,
    multiplier_work_time: 0,
    employee_parent_id: null,
    hr_approval_id: null,
    work_trip_location: null,
    holiday_request_url_ids: [],
    locked:null,
  };
  const [detailAttendanceSelectedLeave, setDetailAttendanceSelectedLeave] =
    useState<IListLeavereq | null>(initialStateIListLeave);

  const [isShowPoupLeave, setIsShowPoupLeave] = useState<boolean>(false);
  const [isViewLeave, setIsisViewLeave] = useState<boolean>(false);

  const [isShowPoupLeaveEarly, setIsShowPoupLeaveEarly] =
    useState<boolean>(false);
  const [isViewLeaveEarly, setIsisViewLeaveEarly] = useState<boolean>(false);
  const createLeave = () => {
    setIsShowPoupLeave(!setIsShowPoupLeave);
    setIsisViewLeave(false);
    setDetailAttendanceSelectedLeave(null);
  };
  const showLeave = () => {
    setIsShowPoupLeave(!isShowPoupLeave);
    setIsisViewLeave(true);
    setSelectedTimeIn('');
    setSelectedTimeOut('');
  };
  useEffect(() => {
    setSelectedTimeIn('');
    setSelectedTimeOut('');

  }, [isViewLeave]);


  const createLeaveEarly = () => {
    setIsShowPoupLeaveEarly(!setIsShowPoupLeaveEarly);
    setIsisViewLeaveEarly(false);
    setDetailAttendanceSelectedLeave(null);
  };

  const showLeaveEarly = () => {
    setIsShowPoupLeaveEarly(!isShowPoupLeaveEarly);
    setIsisViewLeaveEarly(true);
  };

  
  const [
    nonNullUndefinedattendance_attemptArr,
    setNonNullUndefinedattendance_attemptArr,
  ] = useState<string[]>([]);
  const [
    nonNullUndefinedattendance_inoutArr,
    setNonNullUndefinedattendance_inoutArr,
  ] = useState<string[]>([]);
  // ========================
  // State
  // ========================

  var typeShift = 'Ca chính';
  // const [typeShift,setTypeShift] = useState('');
  const fixedShift = JSON.parse(localStorage.getItem('fixedShift')!);
  const restShift = JSON.parse(localStorage.getItem('restShift')!);
  const coupleShift = JSON.parse(localStorage.getItem('coupleShift')!);
  const mainShift = JSON.parse(localStorage.getItem('mainShift')!);
  if (fixedShift?.includes(shift_name)) {
    typeShift = 'Ca gãy';
  } else if (restShift?.includes(shift_name)) {
    typeShift = 'Ca nghỉ';
  } else if (coupleShift?.includes(shift_name)) {
    typeShift = 'Ca ghép';
  } else if (mainShift?.includes(shift_name)) {
    typeShift = 'Ca chính';
  } else {
    typeShift = 'Ca trống';
  }
  const getHistoryEdit = async (idShift: number) => {
    const args: string[] = [idShift.toString()];
    const params: historyShiftEditParams = {
      args: args,
    };
    const body: historyShiftEditBody = {
      params: params,
    };
    const res = await getHistoryEditById(body);
    if (res.result?.length > 0) {
      if (Array.isArray(res.result) && res.result.length > 0) {
        const formatedObj = formatedHistoryShift(res.result.reverse());
        setHistoryShiftEdits(formatedObj);
      }
    } else {
      setHistoryShiftEdits([]);
    }
  };
  // Hooks

  useEffect(() => {
    if (id) {
      getHistoryEdit(id);
    }
  }, [id, forceUpdate, currentTabIndex]);

  useEffect(() => {

    fetchData();
  }, [employee_code, date]);
  const fetchData = async () => {
    // console.log(nonNullUndefinedattendance_inoutArr)
    const inout_arr = [];
    const attendance_attempt_arr = [];
    const formattedDate = date.split('-').reverse().join('/');
    const data = await getAttendanceMark(employee_code, formattedDate);
    if (data) {
      for (let item of Object.values(data)) {
        (item as any).time = (item as any).time.replace(/\//g, '-');
        if ((item as any).in_out == false) {
          (item as any).in_out = '';
        }
      }
      for (let item of Object.values(data)) {
        attendance_attempt_arr.push((item as any).time);
        inout_arr.push((item as any).in_out);
      }
    }
    setNonNullUndefinedattendance_attemptArr(attendance_attempt_arr);
    setNonNullUndefinedattendance_inoutArr(inout_arr);
  };

  const isAttemptWithinShift = (
    attempt: any,
    shift_start: any,
    shift_end: any,
    rest_start: any,
    rest_end: any
  ) => {
    if (!attempt || !shift_start || !shift_end || !rest_start || !rest_end)
      return false;

    const attemptTime = new Date(attempt);
    const attemptHours = attemptTime.getHours() + attemptTime.getMinutes() / 60;

    const isWithinShiftHours =
      attemptHours > shift_start && attemptHours < shift_end;
    const isWithinRestHours =
      attemptHours >= rest_start && attemptHours <= rest_end;

    return isWithinShiftHours && !isWithinRestHours;
  };

  const createExplation = () => {
    setIsShowPoup(!isShowPoup);
  };

  const getAttendanceByIdAsync = async () => {
    const args: number[] = [id!];
    const params: IGetAttendanceDetailsParams = {
      args,
    };
    const body: IGetAttendanceDetails = {
      params,
    };
    const res = (await getAttendanceDetailById(body)) as any;
    if (res) {
      if (res?.result) {
        dispatch(setDetailAttendanceItem(res?.result));
        localStorage.setItem('detailAttendance', JSON.stringify(res?.result));
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    getAttendanceByIdAsync();
  }, [id, foreUpdateLeave]);

  const isTimeWithinRange = (
    timeToCheck: any,
    rangeStart: any,
    rangeEnd: any
  ) => {
    return timeToCheck >= rangeStart && timeToCheck <= rangeEnd;
  };

  // Sử dụng isTimeWithinRange để kiểm tra sự trùng khớp
  const isMissingTimeWithinAttendance = (
    attempt: any,
    attendanceHistory: any[]
  ) => {
    if (!Array.isArray(attendanceHistory)) {
      console.error('attendanceHistory is not an array:', attendanceHistory);
      return false;
    }
  
    for (const attendance of attendanceHistory) {
      const attendanceFrom = attendance.attendance_missing_from;
      const attendanceTo = attendance.attendance_missing_to;
      console.log(attendanceFrom);
      console.log(attendanceTo);
      console.log(attempt);
  
      if (isTimeWithinRange(attempt, attendanceFrom, attendanceTo)) {
        console.log('true');
        return true;
      }
    }
  
    console.log('false');
    return false;
  };
  

  return (
    <Space direction="vertical" className="weekly-info">
      <Text
        strong
        style={{
          textAlign: 'center',
          display: 'block',
          fontSize: 16,
          fontWeight: 500,
        }}>
        {typeShift}
      </Text>
      <Divider />
      <div className="weekly-info-row">
        <Text strong className="label">
          Mã ca:{' '}
        </Text>
        <Text strong className="content">
          {shift_name}
        </Text>
      </div>
      <div className="weekly-info-row">
        <Text strong className="label">
          Mã Chấm công:{' '}
        </Text>
        <Text strong className="content">
          {time_keeping_code}
        </Text>
      </div>
      {typeShift !== 'Ca nghỉ' ? (
        <React.Fragment>
          <div className="weekly-info-row">
            <Text strong className="label">
              Tổng thời gian ca:{' '}
            </Text>
            <Text strong className="content">
              {(Number(total_shift_work_time) * 60).toFixed(0)}
            </Text>
          </div>
          <div className="weekly-info-row">
            <Text className="label">Giờ bắt đầu ca: </Text>
            <Text strong className="content">
              {shift_start && floatToHourMinute(shift_start)}
            </Text>
          </div>
          <div className="weekly-info-row">
            <Text className="label">Giờ kết thúc ca: </Text>
            <Text strong className="content">
              {shift_end && floatToHourMinute(shift_end)}
            </Text>
          </div>
          <div className="weekly-info-row">
            <Text className="label">Thời gian làm việc:</Text>
            <Text strong className="content">
              {total_work_time ? total_work_time.toFixed(0) : 0}
            </Text>
          </div>
          <div className="weekly-info-row">
            <Text className="label">Công tính lương:</Text>
            <Text strong className="content">
              {actual_total_work_time ? actual_total_work_time.toFixed() : 0}
            </Text>
          </div>
          <div className="weekly-info-row">
            <Text strong className="label">
              Tổng thời gian nghỉ:
            </Text>
            <Text strong className="content">
              {(Number(rest_end) - Number(rest_start)).toFixed(2)}
            </Text>
          </div>
          <div className="weekly-info-row">
            <Text strong className="label">
              Giờ làm việc
            </Text>
            <Text strong className="content">
              {resource_calendar && resource_calendar}
            </Text>
          </div>
          {locked ? <LockOutlined /> : <UnlockOutlined />}
        </React.Fragment>
      ) : (
        <div className="weekly-info-row">
          <Text className="label">Tên ca: </Text>
          <Text className="content">Nghỉ phép</Text>
        </div>
      )}
      <Text
        strong
        style={{
          textAlign: 'center',
          display: 'block',
          fontSize: 16,
          fontWeight: 500,
          marginTop: 20,
        }}>
        Lịch sử chấm công
      </Text>
      <Divider />
      <div className="attendance-info-row">
        {nonNullUndefinedattendance_inoutArr.map((inout, index) => {
          const attempt: any = nonNullUndefinedattendance_attemptArr[index];
          const isWithinShift = isAttemptWithinShift(
            attempt,
            shift_start,
            shift_end,
            rest_start,
            rest_end
          );
          const isWithinAttendance = isMissingTimeWithinAttendance(
            attempt,
            detailAttendance.invalid_timesheet
          );
          const isAttemptLateIn =
            index === 0 &&
            isWithinShift &&
            inout === 'I' &&
            detailAttendance.list_leave &&
            detailAttendance.list_leave.some(
              leave =>
                leave.holiday_status_id && leave.holiday_status_id.type === "DXDM"

            );

          const isAttemptLateOut =
            index === nonNullUndefinedattendance_inoutArr.length - 1 &&
            isWithinShift &&
            inout == 'O' &&
            detailAttendance.list_leave &&
            detailAttendance.list_leave.some(
              leave =>
                leave.holiday_status_id && leave.holiday_status_id.type === "DXVS"

            );

          return (
            <div key={index} className="weekly-info-row">
              <Text className="label">Lần {index + 1}: </Text>
              <Text className="content">{inout}</Text>
              <button
                onClick={() => {
                  // if (index !== 0  ) {
                  if (is_ho) {
                    if (
                      index !== 0 &&
                      index !==
                        nonNullUndefinedattendance_inoutArr.length - 1 &&
                      isWithinShift
                    ) {
                      createExplation();
                      setIsCreating(true);
                      setIsView(false);
                      // Xử lý khi nhấn vào 'I'
                      if (inout === 'I') {
                        setSelectedTimeIn(attempt);
                        // Tìm giá trị 'O' trước đó
                        let indexOfSelectedOut = -1;
                        for (let i = index - 1; i >= 0; i--) {
                          if (nonNullUndefinedattendance_inoutArr[i] === 'O') {
                            indexOfSelectedOut = i;
                            break;
                          }
                        }
                        if (indexOfSelectedOut !== -1) {
                          setSelectedTimeOut(
                            nonNullUndefinedattendance_attemptArr[
                              indexOfSelectedOut
                            ]
                          );
                        } else {
                          setSelectedTimeOut('');
                        }
                      }
                      // Xử lý khi nhấn vào 'O'
                      if (inout === 'O') {
                        setSelectedTimeOut(attempt);
                        // Tìm giá trị 'I' sau đó
                        let indexOfSelectedIn = -1;
                        for (
                          let i = index + 1;
                          i < nonNullUndefinedattendance_inoutArr.length;
                          i++
                        ) {
                          if (nonNullUndefinedattendance_inoutArr[i] === 'I') {
                            indexOfSelectedIn = i;
                            break;
                          }
                        }
                        if (indexOfSelectedIn !== -1) {
                          setSelectedTimeIn(
                            nonNullUndefinedattendance_attemptArr[
                              indexOfSelectedIn
                            ]
                          );
                        } else {
                          setSelectedTimeIn('');
                        }
                      }

                      // if (inout === 'I') setSelectedTimeIn(attempt);
                      // if (inout === 'O') setselectedTimeOut(attempt);
                    } else if (index === 0 && isWithinShift && inout == 'I') {
                      createLeave();
                      showLeave();
                    } else if (
                      index ===
                        nonNullUndefinedattendance_inoutArr.length - 1 &&
                      isWithinShift &&
                      inout == 'O'
                    ) {
                      createLeaveEarly();
                      showLeaveEarly();
                    }
                  } else {
                    if (index === 0 && isWithinShift) {
                      createLeave();
                      showLeave();
                    } else if (
                      index ===
                        nonNullUndefinedattendance_inoutArr.length - 1 &&
                      isWithinShift
                    ) {
                      createLeaveEarly();
                      showLeaveEarly();
                    }
                  }
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: isWithinShift ? 'red' : 'inherit',
                  marginLeft: isWithinAttendance ? -11 : 0,
                }}
                className="content-open-shift">
                {isAttemptLateOut && <DownCircleOutlined />}
                {isAttemptLateIn && <DownCircleOutlined />}
                {isWithinAttendance && <DownCircleOutlined />}
                {attempt ? formatDate(attempt) : ''}
              </button>
            </div>
          );
        })}
        {(() => {
          if (nonNullUndefinedattendance_attemptArr.length > 0) {
            return (
              <div className="weekly-info-row">
                <Text className="label">Lần cuối: </Text>
                {(() => {
                  if (nonNullUndefinedattendance_inoutArr.length > 0) {
                    return (
                      <Text className="content">
                        {
                          nonNullUndefinedattendance_inoutArr[
                            nonNullUndefinedattendance_inoutArr.length - 1
                          ]
                        }
                      </Text>
                    );
                  }
                  return null;
                })()}
                <Text className="content">
                  {formatDate(
                    nonNullUndefinedattendance_attemptArr[
                      nonNullUndefinedattendance_attemptArr.length - 1
                    ]
                  )}
                </Text>
              </div>
            );
          }
          return null;
        })()}
      </div>
      <Text
        strong
        style={{
          textAlign: 'center',
          display: 'block',
          fontSize: 16,
          fontWeight: 500,
          marginTop: 20,
        }}>
        Lịch sử sửa ca
      </Text>
      <Divider />
      <div className="history-edit">
        {historyShiftEdits &&
          Array.isArray(historyShiftEdits) &&
          historyShiftEdits.length > 0 &&
          historyShiftEdits.map((historyShiftEdit, index) => {
            return (
              <div className="attendance-info-row" key={index}>
                <Space
                  direction="vertical"
                  className="weekly-info-row"
                  style={{ marginTop: 15 }}>
                  <Space direction="horizontal">
                    <Text className="label" strong>
                      {format_time(historyShiftEdit?.create_date)}
                    </Text>
                    <Divider style={{ width: 200 }} />
                  </Space>
                  {historyShiftEdit.user &&
                    Array.isArray(historyShiftEdit.user) &&
                    historyShiftEdit.user.length > 0 &&
                    historyShiftEdit.user.map((user: any, index: number) => {
                      return (
                        <Space key={index} direction="vertical">
                          <Text className="content">{user?.name}</Text>
                          {user.value &&
                            Array.isArray(user.value) &&
                            user.value.length > 0 &&
                            user.value.map((value: any, index: number) => {
                              return (
                                <div
                                  key={index}
                                  className="weekly-info-row"
                                  style={{ marginLeft: 20 }}>
                                  <Text className="label">
                                    {value?.old_value}
                                  </Text>
                                  <ArrowRightOutlined />
                                  <Text className="content">
                                    {value?.new_value}
                                  </Text>
                                </div>
                              );
                            })}
                        </Space>
                      );
                    })}
                </Space>
              </div>
            );
          })}
      </div>
      <ExplainForm
        show={isShowPoup}
        setShow={setIsShowPoup}
        showExplainForm={isShowPoup}
        setShowExplainForm={setIsShowPoup}
        setForceUpdateLeave={setForceUpdateLeave}
        foreUpdateLeave={foreUpdateLeave}
        detailAttendanceSelected={detailAttendanceSelected}
        isView={isView}
        isCreating={isCreating}
        selectedTimeIn={selectedTimeIn}
        selectedTimeOut={selectedTimeOut}
        setSelectedTimeIn={setSelectedTimeIn}
        setSelectedTimeOut={setSelectedTimeOut}
        // loading={loading}
      />
      <LeaveForm
        show={isShowPoupLeave}
        setShow={setIsShowPoupLeave}
        showExplainForm={isShowPoupLeave}
        setShowExplainForm={setIsShowPoupLeave}
        setForceUpdateLeave={setForceUpdateLeave}
        foreUpdateLeave={foreUpdateLeave}
        detailAttendanceSelected={detailAttendanceSelectedLeave}
        isView={isView}
      />
      <LeaveFormEarly
        show={isShowPoupLeaveEarly}
        setShow={setIsShowPoupLeaveEarly}
        showExplainForm={isShowPoupLeaveEarly}
        setShowExplainForm={setIsShowPoupLeaveEarly}
        setForceUpdateLeave={setForceUpdateLeave}
        foreUpdateLeave={foreUpdateLeave}
        detailAttendanceSelected={detailAttendanceSelectedLeave}
        isView={isView}
      />
    </Space>
  );
};

export default index;
