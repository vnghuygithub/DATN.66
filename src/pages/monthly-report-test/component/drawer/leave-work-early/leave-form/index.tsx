import React, { useEffect, useState } from 'react';
import { IListLeavereq } from '@/interface/weeklyreport/type';
import BaseForm from '../../base-form';
import {
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  TimePicker,
  Typography,
  Button,
  Checkbox,
  Space,
  Upload,
} from 'antd';
import dayjs from 'dayjs';
import SelectTypeLeave from '@/pages/components/selects/SelectTypeTreeLeaveWorkEarly';
import mockLeaveTypeData from '@/mock/select/leaveType.json';
import { IListLeaveResult } from '@/interface/weeklyreport/type';
import { convertToTreeDataSelector } from '@/utils/common';
import {
  createLeaveByEmployeeId,
  getListLeave,
} from '@/api/weeklyreport/weeklyreport';
import { useSelector } from 'react-redux';
import './style.css';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { message as $message } from 'antd';
import moment from 'moment';
import { data } from '@/mock/applicationlist/list';
import { type } from 'os';
import { set } from 'lodash';
import { calculateLeave, getRemainingLeaveCl } from '@/api/shift/leavetype';
import { formatDate, formatDateDot } from '@/utils/formatDate';
import SelectEmployeeGeneralManager from '@/pages/components/selects/SelectGeneralManager';
import SelectEmployeeHeadOfDepartment from '@/pages/components/selects/SelectHeadOfDepartment';
import SelectCompany from '@/pages/components/selects/SelectCompany';
import { getEmployeeByArgs } from '@/api/employee/employee.api';
import { IFilterEmployeesArgs } from '@/interface/employees/employee';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { GET_LIST_LEAVE } from '@/api/constApi';
import { request } from '@/api/request';
interface ILeaveFormProps {
  show: boolean;
  setShow: (value: boolean) => void;
  showExplainForm: boolean;
  setShowExplainForm: (value: boolean) => void;
  foreUpdateLeave: boolean;
  setForceUpdateLeave: (valueType: boolean) => void;
  detailAttendanceSelected: IListLeavereq | null;
  isView: boolean;
}
const index = (props: ILeaveFormProps) => {
  const {
    show,
    setShow,
    showExplainForm,
    setShowExplainForm,
    foreUpdateLeave,
    detailAttendanceSelected,
    setForceUpdateLeave,
    isView,
  } = props;
  const [form] = Form.useForm();
  const { Text } = Typography;
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [dataLeaveType, setDataLeaveType] = useState<any[]>([]);
  const [typeLeaveValue, setTypeLeaveValue] = useState('DXVS~54'); // 7~1
  const [typeLeaveInfo, setTypeLeaveInfo] = useState<string[]>([]); //[7,1]
  const [conpensatoryfund, setConpensatoryfund] = useState<string>();
  const [triggerFillData, setTriggerFillData] = useState<boolean>(false);
  const [triggerViewData, setTriggerViewData] = useState<boolean>(false);
  const [defaultLeaveType, setDefaultLeaveType] = useState<string>('');
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [remainingLeave, setRemainingLeave] = useState<number>(0);
  const [checked, setChecked] = useState<boolean>(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [multiplied_wage_amount, setMultiplied_wage_amount] =
    useState<number>(0);
  const [multiplied_work_time_amount, setMultiplied_work_time_amount] =
    useState<number>(0);
  const [remainingAlCl, setRemainingAlCl] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileAttachments, setFileAttachments] = useState<any>();
  const [fileAttachmentsList, setFileAttachmentsList] = useState<any[]>([]);
  const [responseAttachments, setResponseAttachments] = useState<any[]>([]);
  const [clickable, setClickable] = useState<boolean>(true);
  // ================================
  // Selector
  // ================================

  const {
    attendance_attempt_1,
    attendance_attempt_2,
    attendance_attempt_3,
    attendance_attempt_4,
    attendance_attempt_5,
    attendance_attempt_6,
    attendance_attempt_7,
    attendance_attempt_8,
    attendance_attempt_9,
    attendance_attempt_10,
    attendance_attempt_11,
    attendance_attempt_12,
    attendance_attempt_13,
    attendance_attempt_14,
    attendance_attempt_15,
    attendance_inout_1,
    attendance_inout_2,
    attendance_inout_3,
    attendance_inout_4,
    attendance_inout_5,
    attendance_inout_6,
    attendance_inout_7,
    attendance_inout_8,
    attendance_inout_9,
    attendance_inout_10,
    attendance_inout_11,
    attendance_inout_12,
    attendance_inout_13,
    attendance_inout_14,
    attendance_inout_15,
    attendance_inout_last,
  } = useSelector(state => state.weekly);
  const attendance_inoutArr = [
    attendance_inout_1,
    attendance_inout_2,
    attendance_inout_3,
    attendance_inout_4,
    attendance_inout_5,
    attendance_inout_6,
    attendance_inout_7,
    attendance_inout_8,
    attendance_inout_9,
    attendance_inout_10,
    attendance_inout_11,
    attendance_inout_12,
    attendance_inout_13,
    attendance_inout_14,
    attendance_inout_15,
    attendance_inout_last,
  ];
  const nonNullUndefinedattendance_inoutArr: string[] = [];
  attendance_inoutArr.forEach(variable => {
    if (variable !== null && variable !== undefined && variable) {
      nonNullUndefinedattendance_inoutArr.push(variable);
    }
  });
  const attendance_attemptArr = [
    attendance_attempt_1,
    attendance_attempt_2,
    attendance_attempt_3,
    attendance_attempt_4,
    attendance_attempt_5,
    attendance_attempt_6,
    attendance_attempt_7,
    attendance_attempt_8,
    attendance_attempt_9,
    attendance_attempt_10,
    attendance_attempt_11,
    attendance_attempt_12,
    attendance_attempt_13,
    attendance_attempt_14,
    attendance_attempt_15,
    // last_attendance_attempt,
  ];
  const nonNullUndefinedattendance_attemptArr: string[] = [];
  attendance_attemptArr.forEach(variable => {
    if (variable !== null && variable !== undefined && variable) {
      nonNullUndefinedattendance_attemptArr.push(variable);
    }
  });

  function getISOWeek(dateString: any) {
    const [day, month, year] = dateString.split('/').map(Number);
    const date: any = new Date(Date.UTC(year, month - 1, day)); // Note: Months are 0-based in JavaScript

    const dayOfWeek = (date.getUTCDay() + 6) % 7; // Adjust to start from Monday
    const january4: any = new Date(Date.UTC(year, 0, 4));
    const diff = date - january4;
    const dayOfYear = Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
    const weekNumber = Math.ceil((dayOfYear - dayOfWeek) / 7);

    return { year: date.getUTCFullYear(), week: weekNumber };
  }

  function areDatesInSameISOWeek(dateString1: any, dateString2: any) {
    const isoWeek1 = getISOWeek(dateString1);
    const isoWeek2 = getISOWeek(dateString2);

    return isoWeek1.year === isoWeek2.year && isoWeek1.week === isoWeek2.week;
  }

  const {
    id,
    employee_code,
    employee_name,
    company,
    department,
    job_title,
    leave_early,
    attendance_late,
    date,
    shift_name,
    shift_start,
    shift_end,
    rest_start,
    rest_end,
    time_keeping_code,
  } = useSelector(state => state.weekly);
  const [initialTimekeepingCode, setInitialTimekeepingCode] = useState<string>(
    time_keeping_code ?? ''
  );
  const employeeArgs: IFilterEmployeesArgs = {
    name: employee_name,
    code: employee_code,
    mobile_phone: '',
    department_id: null,
    time_keeping_code: '',
    job_title: '',
    work_email: '',
    severance_day: '',
    page_size: 1000,
    page: 1,
  };
  const _getEmployeeByArgs = async () => {
    const res = await getEmployeeByArgs(employeeArgs);
    if (res?.results?.data) {
      setInitialTimekeepingCode(res.results.data[0].time_keeping_code);
    }
  };
  useEffect(() => {
    _getEmployeeByArgs();
  }, [show]);
  const onFinish = async (formData: any) => {
    setClickable(false);
    setLoading(true);
    store.dispatch(
      setGlobalState({
        loading: true,
      })
    );

    var config_id = '';
    var fromDate = '';
    var toDate = '';
    var hours = '0';
    var minutes = '0';
    var overtime_from = '';
    var overtime_to = '';
    var attendance_missing_from = '';
    var attendance_missing_to = '';
    var convert_overtime = false;
    var multiplier_wage = 0;
    var multiplier_work_time = 0;
    if (typeLeaveInfo[0] === 'TC') {
      minutes = formData?.totalOvertimeMinute;
      // minutes = formData?.totalOvertimeHour;
      config_id = typeLeaveInfo[2];
      fromDate = toDate = formData.leaveDay.format('DD/MM/YYYY');
      var new_date = formData.leaveDay.format('YYYY-MM-DD');
      var overtime_from_raw = formData.overtime_from.format(
        'YYYY-MM-DD HH:mm:ss'
      );
      var overtime_to_raw = formData.overtime_to.format('YYYY-MM-DD HH:mm:ss');
      multiplier_wage = formData?.multiplier_wage;
      multiplier_work_time = formData?.multiplier_work_time;
      overtime_from_raw = overtime_from_raw.slice(11, 19);
      overtime_to_raw = overtime_to_raw.slice(11, 19);
      overtime_from = new_date + ' ' + overtime_from_raw;
      overtime_to = new_date + ' ' + overtime_to_raw;
      // var dateOtFrom = new Date(overtime_from);
      // var dateOtTo = new Date(overtime_to);
      // if (dateOtFrom >= dateOtTo) {
      //   dateOtTo.setDate(dateOtTo.getDate() + 2);
      // }
      // overtime_from = dateOtFrom.toISOString().slice(0, 10) + ' ' + dateOtFrom.toTimeString().slice(0, 8);
      // overtime_to = dateOtTo.toISOString().slice(0, 10) + ' ' + dateOtTo.toTimeString().slice(0, 8);

      convert_overtime = checked;
    } else if (typeLeaveInfo[0] === 'CN') {
      fromDate = dateRange[0];
      toDate = dateRange[1];
      let restOption = formData?.restOption;
      if (restOption == '1') {
        attendance_missing_to = attendance_missing_from = moment(date)
          .set({
            hour: 1,
            minute: 0,
            second: 0,
          })
          .format('YYYY-MM-DD HH:mm:ss');
      }
      if (restOption == '2') {
        attendance_missing_to = attendance_missing_from = moment(date)
          .set({
            hour: 16,
            minute: 0,
            second: 0,
          })
          .format('YYYY-MM-DD HH:mm:ss');
      }

      if (restOption == '4') {
        attendance_missing_to = attendance_missing_from = moment(date)
          .set({
            hour: 12,
            minute: 0,
            second: 0,
          })
          .format('YYYY-MM-DD HH:mm:ss');
      }

      if (restOption == '3') {
        attendance_missing_to = moment(date)
          .set({
            hour: 23,
            minute: 0,
            second: 0,
          })
          .format('YYYY-MM-DD HH:mm:ss');

        attendance_missing_from = moment(date)
          .set({
            hour: 6,
            minute: 0,
            second: 0,
          })
          .format('YYYY-MM-DD HH:mm:ss');
      }

      if (restOption == '5') {
        attendance_missing_to = attendance_missing_from = moment(date)
          .set({
            hour: 11,
            minute: 0,
            second: 0,
          })
          .format('YYYY-MM-DD HH:mm:ss');
      }

      if (restOption == '6') {
        attendance_missing_to = attendance_missing_from = moment(date)
          .set({
            hour: 13,
            minute: 0,
            second: 0,
          })
          .format('YYYY-MM-DD HH:mm:ss');
      }
    } else if (typeLeaveInfo[0] === 'P' || typeLeaveInfo[0] === 'B') {
      config_id = '';
      fromDate = dateRange[0];
      toDate = dateRange[1];

      const check_week = areDatesInSameISOWeek(fromDate, toDate);
      if (check_week == false) {
        $message.error(
          'Thời gian nghỉ không hợp lệ. Chỉ được phép chọn khoảng thời gian trong vòng 1 tuần.'
        );
        return;
      }
      // console.log(date1.getDay(), date2.getDay())

      if (form.getFieldValue('restHour') / 60 > Number(conpensatoryfund ?? 0)) {
        // $message.error('Số giờ nghỉ phép không được lớn hơn quỹ nghỉ');
        // return
      }
      minutes = formData?.restMinutes ?? 0;

      // hours = formData?.restHour;
    } else if (typeLeaveInfo[0] == 'TCC' || typeLeaveInfo[0] == 'RN') {
      fromDate = toDate = moment(date).format('DD/MM/YYYY');
      var date_obj = moment(date);
      console.log(formData.attendanceMissingFrom, formData.attendanceMissingTo);
      if (
        formData.attendanceMissingFrom != undefined &&
        formData.attendanceMissingFrom != null
      ) {
        attendance_missing_from = formData.attendanceMissingFrom
          .set({
            year: date_obj.year(),
            month: date_obj.month(),
            date: date_obj.date(),
          })
          .format('YYYY-MM-DD HH:mm:ss');
      }
      if (
        formData.attendanceMissingTo != undefined &&
        formData.attendanceMissingTo != null
      ) {
        attendance_missing_to = formData.attendanceMissingTo
          .set({
            year: date_obj.year(),
            month: date_obj.month(),
            date: date_obj.date(),
          })
          .format('YYYY-MM-DD HH:mm:ss');
        if (
          moment(formData.attendanceMissingTo).isBefore(attendance_missing_from)
        ) {
          console.log(attendance_missing_from, attendance_missing_to);

          $message.error('Giờ kết thúc không được sớm hơn giờ bắt đầu');
          return;
        }
      }
    } else if (typeLeaveInfo[0] == 'TCCR' || typeLeaveInfo[0] == 'TCCV') {
      fromDate = toDate = moment(date).format('DD/MM/YYYY');
      var date_obj = moment(date);
      if (typeLeaveInfo[0] == 'TCCV') {
        if (
          formData.attendanceMissingFrom != undefined &&
          formData.attendanceMissingFrom != null
        ) {
          attendance_missing_from = formData.attendanceMissingFrom
            .set({
              year: date_obj.year(),
              month: date_obj.month(),
              date: date_obj.date(),
            })
            .format('YYYY-MM-DD HH:mm:ss');
        }
      }

      if (typeLeaveInfo[0] == 'TCCR') {
        if (
          formData.attendanceMissingTo != undefined &&
          formData.attendanceMissingTo != null
        ) {
          attendance_missing_to = formData.attendanceMissingTo
            .set({
              year: date_obj.year(),
              month: date_obj.month(),
              date: date_obj.date(),
            })
            .format('YYYY-MM-DD HH:mm:ss');
        }
      }
    } else {
      config_id = '';
      fromDate = dateRange[0];
      toDate = dateRange[1];
      minutes = formData?.restMinutes ?? 0;
      // hours = formData?.restHour;
    }

    if (typeLeaveInfo[0] === 'RN') {
      if (
        formData.attendanceMissingTo.diff(
          formData.attendanceMissingFrom,
          'minutes'
        ) >= 480
      ) {
        $message.error('Thời gian nghỉ không được lớn hơn 8 tiếng');
        return;
      }
    }
    // if (typeLeaveInfo[0] === "P" || typeLeaveInfo[0] === "B") {
    //     minutes = String(attendance_late + leave_early);
    // }

    const holiday_status_id = typeLeaveInfo[1];
    if (!employee_code) {
      $message.error(
        'Nhân viên đang không có mã nhân viên, vui lòng bấm tính toán'
      );
    }
    //lấy date từ trong redux rồi dùng khi người dùng không chọn time mà time là tự fill
    const formattedDate = date.split('-').reverse().join('/');
    const body = {
      params: {
        args: [
          employee_code,
          initialTimekeepingCode,
          Number(config_id),
          fromDate,
          toDate,
          formData.typeReason,
          formData.reason,
          Number(holiday_status_id),
          Number(hours),
          Number(minutes),
          overtime_from,
          overtime_to,
          company,
          attendance_missing_from,
          attendance_missing_to,
          convert_overtime,
          Number(multiplier_wage),
          Number(multiplier_work_time),
          Number(formData.employee_parent_id),
          Number(formData.hr_manager),
          Number(formData.company_id),
        ],
      },
    };
    const formDataApi = new FormData();
    employee_code && formDataApi.append('employee_code', employee_code);
    initialTimekeepingCode &&
      formDataApi.append('time_keeping_code', initialTimekeepingCode);
    config_id && formDataApi.append('config_id', config_id);
    fromDate
      ? formDataApi.append('from_date', fromDate)
      : formDataApi.append('from_date', formattedDate);
    toDate
      ? formDataApi.append('to_date', toDate)
      : formDataApi.append('to_date', formattedDate);
    formData.typeReason &&
      formDataApi.append('for_reasons', formData.typeReason);
    formData.reason && formDataApi.append('reasons', formData.reason);
    holiday_status_id &&
      formDataApi.append('holiday_status_id', holiday_status_id);
    hours && formDataApi.append('hours', hours);
    minutes && formDataApi.append('minutes', minutes);
    overtime_from && formDataApi.append('overtime_from', overtime_from);
    overtime_to && formDataApi.append('overtime_to', overtime_to);
    company && formDataApi.append('company', company);
    attendance_missing_from &&
      formDataApi.append('attendance_missing_from', attendance_missing_from);
    attendance_missing_to &&
      formDataApi.append('attendance_missing_to', attendance_missing_to);
    convert_overtime &&
      formDataApi.append('convert_overtime', convert_overtime as any);
    multiplier_wage &&
      formDataApi.append('multiplier_wage', multiplier_wage as any);
    multiplier_work_time &&
      formDataApi.append('multiplier_work_time', multiplier_work_time as any);
    formData.employee_parent_id &&
      formDataApi.append('employee_parent_id', formData.employee_parent_id);
    formData.hr_manager &&
      formDataApi.append('hr_manager', formData.hr_manager);
    formData.company_id &&
      formDataApi.append('company_id', formData.company_id);
    fileAttachmentsList.forEach((file: any, index: any) => {
      formDataApi.append(`attachment_ids[${index}]`, file);
    });
    store.dispatch(
      setGlobalState({
        loading: true,
      })
    );
    let url = GET_LIST_LEAVE.CREATEAPI;
    const res = (await request('post', url, formDataApi)) as any;
    if (res?.error?.code && res.error.code == 400) {
      $message.error(res.error.message);
      setFileAttachmentsList([]);
      setResponseAttachments([]);
      setFileAttachments(undefined);
      setLoading(false);
      setClickable(true);
      store.dispatch(
        setGlobalState({
          loading: false,
        })
      );
    } else if (res?.is_success === false) {
      $message.error(res?.message);
      setClickable(true);
    } else {
      setLoading(false);
      $message.success('Tạo đơn thành công');
      store.dispatch(
        setGlobalState({
          loading: false,
        })
      );
      setForceUpdateLeave(!foreUpdateLeave);
      setFileAttachmentsList([]);
      setResponseAttachments([]);
      setFileAttachments(undefined);
      setShow(!show);
      setClickable(true);
      setForceUpdateLeave(!foreUpdateLeave);
      setInitialTimekeepingCode('');
    }
  };
  const getListLeaveType = () => {
    const body = {
      params: {
        args: [id],
      },
    };
    getListLeave(body).then(res => {
      setDataLeaveType(convertToTreeDataSelector(res.result));
      setTriggerViewData(!triggerViewData);
    });
  };
  const [dateRange, setDateRange] = useState<string[]>([]);

  const onCalendarChange = (dates: any, dateStrings: string[]) => {
    setDateRange(dateStrings);
  };

  const handleTimeStartSection = (time: any) => {
    const timeObject = moment(time, 'YYYY-MM-DD HH:mm:ss');
    const checkValueTime = form.getFieldsValue();
    if (checkValueTime.attendanceMissingTo) {
      const fieldsValue = {
        attendanceMissingFrom: timeObject,
        attendanceMissingTo: undefined, // Xóa giá trị của attendanceMissingTo
      };
      form.setFieldsValue(fieldsValue);
      setSelectedTimeRange(`${formatDate(timeObject.toString())}`);
    } else if (checkValueTime.attendanceMissingFrom) {
      const fieldsValue = {
        attendanceMissingTo: timeObject.set({ second: 59 }),
      };

      form.setFieldsValue(fieldsValue);
      setSelectedTimeRange(
        `${formatDate(checkValueTime.attendanceMissingFrom)} - ${formatDate(
          timeObject.toString()
        )}`
      );
    } else {
      const fieldsValue = {
        attendanceMissingFrom: timeObject,
      };
      form.setFieldsValue(fieldsValue);
      setSelectedTimeRange(`${formatDate(timeObject.toString())}`);
    }

    // const selectedTimeRange = `${startTime} - ${endTime}`;
  };

  const handleTimeStart = (time: any) => {
    const timeObject = moment(floatToHourMinute(time), 'HH:mm:ss');
    const checkValueTime = form.getFieldsValue();
    if (checkValueTime.attendanceMissingTo) {
      const fieldsValue = {
        attendanceMissingFrom: timeObject,
        attendanceMissingTo: undefined, // Xóa giá trị của attendanceMissingTo
      };
      form.setFieldsValue(fieldsValue);
      setSelectedTimeRange(`${formatDate(timeObject.toString())}`);
    } else if (checkValueTime.attendanceMissingFrom) {
      const fieldsValue = {
        attendanceMissingTo: timeObject.set({ second: 59 }),
      };
      form.setFieldsValue(fieldsValue);
      setSelectedTimeRange(
        `${formatDate(checkValueTime.attendanceMissingFrom)} - ${formatDate(
          timeObject.toString()
        )}`
      );
    } else {
      const fieldsValue = {
        attendanceMissingFrom: timeObject,
      };
      form.setFieldsValue(fieldsValue);
      setSelectedTimeRange(`${formatDate(timeObject.toString())}`);
    }
  };

  const handleTimeEndSection = (time: any) => {
    const timeObject = moment(time, 'YYYY-MM-DD HH:mm:ss');
    const fieldsValue = {
      attendanceMissingTo: timeObject.set({ second: 59 }),
    };
    form.setFieldsValue(fieldsValue);
  };

  const _calculateLeave = async (args: any) => {
    const res = await calculateLeave(args);
    if (res) {
      setRemainingLeave(res.result);
    }
  };

  const floatToHourMinute = (floatValue: number): string => {
    const hours = Math.floor(floatValue);
    const minutes = Math.round((floatValue - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  };

  const getRemainingAlCl = async (args: any) => {
    const res = await calculateLeave(args);
    if (res) {
      console.log('AL CLremaining_cl', res.result.remaining_cl);
      // localStorage.setItem('remainingAlCl', JSON.stringify(res.result));
      setRemainingAlCl(res.result);
    }
  };

  useEffect(() => {
    if (typeLeaveInfo[0] === 'P' || typeLeaveInfo[0] === 'B') {
      const formattedDate = moment(date).format('DD/MM/YYYY');
      const body = {
        params: {
          args: [
            employee_code,
            formattedDate,
            formattedDate,
            '1',
            '',
            typeLeaveInfo[1],
            company,
          ],
        },
      };
      setRemainingAlCl(0);
      _calculateLeave(body);
    } else if (typeLeaveInfo[0] === 'DXVS' || typeLeaveInfo[0] === 'DXDM') {
      const formattedDate = moment(date).format('DD/MM/YYYY');
      setRemainingLeave(0);
      const body = {
        params: {
          args: [
            employee_code,
            formattedDate,
            formattedDate,
            '1',
            '',
            typeLeaveInfo[1],
            company,
          ],
        },
      };
      getRemainingAlCl(body);
    } else {
      setRemainingLeave(0);
      setRemainingAlCl(0);
    }
  }, [typeLeaveInfo, date]);
  useEffect(() => {
    getListLeaveType();
    form.setFieldsValue({
      leaveDay: [moment('2024-08-01'), moment('2024-08-07')],
    });
    console.log('9900-909009000');
  }, [show]);
  useEffect(() => {
    if (
      (typeLeaveInfo[0] === 'P' || typeLeaveInfo[0] === 'B') &&
      typeLeaveInfo[3] !== undefined &&
      typeLeaveInfo[3] !== null &&
      typeLeaveInfo[3] !== ''
    ) {
      setConpensatoryfund(remainingLeave.toString());
    }

    if (typeLeaveInfo[0] === 'P' || typeLeaveInfo[0] === 'B') {
      form.setFieldValue('typeReason', '2');
      setReadOnly(true);
    } else if (typeLeaveInfo[0] === 'false') {
      form.setFieldValue('typeReason', '1');
      setReadOnly(true);
    } else if (typeLeaveInfo[0] === 'NB') {
      form.setFieldValue('typeReason', '1');
    } else if (typeLeaveInfo[0] === 'TCC') {
      form.setFieldValue('typeReason', '2');
      setReadOnly(true);
    } else if (typeLeaveInfo[0] === 'RN') {
      form.setFieldValue('typeReason', '2');
      setReadOnly(true);
    } else if (typeLeaveInfo[0] === 'TC') {
      form.setFieldValue('typeReason', '2');
      setMultiplied_wage_amount(0);
      setMultiplied_work_time_amount(0);
      form.setFieldsValue({
        multiplier_wage: 0,
        multiplier_work_time: 1,
      });
      setReadOnly(true);
    } else if (typeLeaveInfo[0] === 'CT') {
      form.setFieldValue(
        'company_id',
        detailAttendanceSelected?.work_trip_location
      );
    } else if (typeLeaveInfo[0] === 'DXDM') {
      form.setFieldValue('typeReason', '1');
      setReadOnly(true);
    } else if (typeLeaveInfo[0] === 'DXVS') {
      form.setFieldValue('typeReason', '1');
      setReadOnly(true);
    } else {
      form.setFieldValue('typeReason', '2');
      setReadOnly(false);
    }
    setTriggerFillData(!triggerFillData);
  }, [date]);
  useEffect(() => {
    if (
      typeLeaveValue !== '' &&
      typeLeaveValue !== undefined &&
      typeLeaveValue !== null
    ) {
      setTypeLeaveInfo(typeLeaveValue.split('~'));
    }
  }, [typeLeaveValue]);
  useEffect(() => {
    if (isView) {
      let updatedResponseAttachments: any[] = [];
      detailAttendanceSelected?.holiday_request_url_ids?.forEach(
        (item: any) => {
          const itemExists = updatedResponseAttachments.some(
            existingItem => existingItem.name === item.name
          );

          if (!itemExists) {
            updatedResponseAttachments.push(item);
          }
        }
      );
      setResponseAttachments(updatedResponseAttachments);
      setIsEditMode(false);
      form.setFieldsValue({
        typeLeave: detailAttendanceSelected?.holiday_status_id?.name,
        reason: detailAttendanceSelected?.reasons,
        typeReason: detailAttendanceSelected?.for_reasons,
        restMinutes: detailAttendanceSelected?.minutes,
      });
    } else {
      setIsEditMode(true);
      setFileAttachmentsList([]);
      setFileAttachments(undefined);
      setResponseAttachments([]);
      form.resetFields();
    }
  }, [show, isView, form, detailAttendanceSelected]);

  useEffect(() => {
    const body = {
      params: {
        args: [id],
      },
    };
    getListLeave(body).then(res => {
      setDataLeaveType(convertToTreeDataSelector(res.result));
    });
  }, [detailAttendanceSelected]);

  // useEffect(() => {
  //   if (detailAttendanceSelected?.holiday_status_id.type === 'TC') {
  //     for (let i = 0; i < dataLeaveType.length; i++) {
  //       for (let j = 0; j < dataLeaveType[i].children.length; j++) {
  //         if (
  //           dataLeaveType[i].children[j].title ===
  //           detailAttendanceSelected?.config_id.name
  //         ) {
  //           if (
  //             typeLeaveValue !==
  //             dataLeaveType[i].children[j].value +
  //               '~' +
  //               detailAttendanceSelected?.id
  //           ) {
  //             form.resetFields();
  //           }

  //           setTypeLeaveValue(
  //             dataLeaveType[i].children[j].value +
  //               '~' +
  //               detailAttendanceSelected?.id
  //           );
  //           break;
  //         }
  //       }
  //     }
  //   } else if (
  //     detailAttendanceSelected?.holiday_status_id.type == 'P' ||
  //     detailAttendanceSelected?.holiday_status_id.type == 'B'
  //   ) {
  //     for (let i = 0; i < dataLeaveType.length; i++) {
  //       if (
  //         dataLeaveType[i].title ===
  //           detailAttendanceSelected?.holiday_status_id.name &&
  //         dataLeaveType[i].children.length === 1
  //       ) {
  //         if (
  //           typeLeaveValue !==
  //           dataLeaveType[i].children[0].value +
  //             '~' +
  //             detailAttendanceSelected?.id
  //         ) {
  //           form.resetFields();
  //         }

  //         setTypeLeaveValue(
  //           dataLeaveType[i].children[0].value +
  //             '~' +
  //             detailAttendanceSelected?.id
  //         );
  //         break;
  //       }
  //     }
  //   } else {
  //     if (
  //       typeLeaveValue !==
  //       detailAttendanceSelected?.holiday_status_id.type +
  //         '~' +
  //         detailAttendanceSelected?.id
  //     ) {
  //       form.resetFields();
  //     }

  //     setTypeLeaveValue(
  //       detailAttendanceSelected?.holiday_status_id.type +
  //         '~' +
  //         detailAttendanceSelected?.id
  //     );
  //   }
  // }, [triggerViewData]);
  const [overtime_from, setOvertime_from] = useState<any>();
  const [overtime_to, setOvertime_to] = useState<any>();

  const handleOvertimeFrom = (value: any) => {
    setOvertime_from(value);
  };
  const handleOvertimeTo = (value: any) => {
    setOvertime_to(value);
  };

  useEffect(() => {
    if (
      detailAttendanceSelected !== undefined &&
      detailAttendanceSelected !== null
    ) {
      if (typeLeaveInfo[0] && typeLeaveInfo[0] === 'TC') {
        form.setFieldsValue({
          typeLeave: detailAttendanceSelected.config_id.name,
          reason: detailAttendanceSelected.reasons,
          typeReason: detailAttendanceSelected.for_reasons,
          leaveDay: moment(detailAttendanceSelected.from_date, 'YYYY-MM-DD'),
          // totalOvertimeHour: detailAttendanceSelected.time,
          totalOvertimeMinute: detailAttendanceSelected.minutes,
          overtime_from: moment(
            detailAttendanceSelected.overtime_from,
            ' HH:mm'
          ),
          overtime_to: moment(detailAttendanceSelected.overtime_to, ' HH:mm'),
          multiplier_wage: detailAttendanceSelected.multiplier_wage,
          multiplier_work_time: detailAttendanceSelected.multiplier_work_time,
          employee_parent_id: detailAttendanceSelected.employee_parent_id,
          hr_manager: detailAttendanceSelected.hr_approval_id,
        });
        setChecked(detailAttendanceSelected.convert_overtime);
        if (
          detailAttendanceSelected.minutes == 0 ||
          detailAttendanceSelected.minutes == null
        ) {
          setMultiplied_wage_amount(0);
          setMultiplied_work_time_amount(0);
        } else {
          if (
            detailAttendanceSelected.multiplier_wage == null ||
            detailAttendanceSelected.multiplier_wage == 0
          ) {
            setMultiplied_wage_amount(0);
          } else {
            setMultiplied_wage_amount(
              Number(detailAttendanceSelected.multiplier_wage) *
                Number(detailAttendanceSelected.minutes)
            );
          }
          if (
            detailAttendanceSelected.multiplier_work_time == null ||
            detailAttendanceSelected.multiplier_work_time == 0
          ) {
            setMultiplied_work_time_amount(0);
          } else {
            setMultiplied_work_time_amount(
              Number(detailAttendanceSelected.multiplier_work_time) *
                Number(detailAttendanceSelected.minutes)
            );
          }
        }
      } else if (
        (typeLeaveInfo[0] && typeLeaveInfo[0] === 'P') ||
        typeLeaveInfo[0] === 'B'
      ) {
        form.setFieldsValue({
          leaveDay: [
            detailAttendanceSelected.from_date
              ? moment(detailAttendanceSelected.from_date, 'YYYY-MM-DD')
              : null,
            detailAttendanceSelected.date_to
              ? moment(detailAttendanceSelected.date_to, 'YYYY-MM-DD')
              : null,
          ],
          reason: detailAttendanceSelected?.reasons,
          typeReason: detailAttendanceSelected?.for_reasons,
          typeLeave: detailAttendanceSelected?.holiday_status_id?.name,
          // restHour: detailAttendanceSelected?.time,
          restMinutes: detailAttendanceSelected?.minutes,
        });
      } else if (typeLeaveInfo[0] && typeLeaveInfo[0] === 'CN') {
        form.setFieldsValue({
          leaveDay: [
            detailAttendanceSelected.from_date
              ? moment(detailAttendanceSelected.from_date, 'YYYY-MM-DD')
              : null,
            detailAttendanceSelected.date_to
              ? moment(detailAttendanceSelected.date_to, 'YYYY-MM-DD')
              : null,
          ],
          reason: detailAttendanceSelected?.reasons,
          typeReason: '2',
          typeLeave: detailAttendanceSelected?.holiday_status_id?.name,
          // restHour: detailAttendanceSelected?.time,
          restMinutes: 60,
        });
        if (
          moment(detailAttendanceSelected.attendance_missing_from).format(
            'HH:mm:ss'
          ) == '01:00:00'
        ) {
          form.setFieldsValue({
            restOption: '1',
          });
        }
        if (
          moment(detailAttendanceSelected.attendance_missing_from).format(
            'HH:mm:ss'
          ) == '16:00:00'
        ) {
          form.setFieldsValue({
            restOption: '2',
          });
        }
        if (
          moment(detailAttendanceSelected.attendance_missing_from).format(
            'HH:mm:ss'
          ) == '12:00:00'
        ) {
          form.setFieldsValue({
            restOption: '4',
          });
        }
        if (
          moment(detailAttendanceSelected.attendance_missing_from).format(
            'HH:mm:ss'
          ) == '06:00:00' &&
          moment(detailAttendanceSelected.attendance_missing_to).format(
            'HH:mm:ss'
          ) == '23:00:00'
        ) {
          form.setFieldsValue({
            restOption: '3',
          });
        }
        if (
          moment(detailAttendanceSelected.attendance_missing_from).format(
            'HH:mm:ss'
          ) == '11:00:00' &&
          moment(detailAttendanceSelected.attendance_missing_to).format(
            'HH:mm:ss'
          ) == '11:00:00'
        ) {
          form.setFieldsValue({
            restOption: '5',
          });
        }
        if (
          moment(detailAttendanceSelected.attendance_missing_from).format(
            'HH:mm:ss'
          ) == '13:00:00' &&
          moment(detailAttendanceSelected.attendance_missing_to).format(
            'HH:mm:ss'
          ) == '13:00:00'
        ) {
          form.setFieldsValue({
            restOption: '6',
          });
        }
      } else if (
        (typeLeaveInfo[0] && typeLeaveInfo[0] === 'TCC') ||
        typeLeaveInfo[0] === 'RN'
      ) {
        form.setFieldsValue({
          leaveDay: [
            detailAttendanceSelected.from_date
              ? moment(detailAttendanceSelected.from_date, 'YYYY-MM-DD')
              : null,
            detailAttendanceSelected.date_to
              ? moment(detailAttendanceSelected.date_to, 'YYYY-MM-DD')
              : null,
          ],
          reason: detailAttendanceSelected?.reasons,
          typeReason: detailAttendanceSelected?.for_reasons,
          typeLeave: detailAttendanceSelected?.holiday_status_id?.name,
          attendanceMissingFrom:
            detailAttendanceSelected.attendance_missing_from
              ? moment(
                  detailAttendanceSelected.attendance_missing_from,
                  'YYYY-MM-DD HH:mm:ss'
                )
              : null,
          attendanceMissingTo: detailAttendanceSelected.attendance_missing_to
            ? moment(
                detailAttendanceSelected.attendance_missing_to,
                'YYYY-MM-DD HH:mm:ss'
              )
            : null,
        });
      } else if (typeLeaveInfo[0] && typeLeaveInfo[0] === 'TCCV') {
        form.setFieldsValue({
          leaveDay: [
            detailAttendanceSelected.from_date
              ? moment(detailAttendanceSelected.from_date, 'YYYY-MM-DD')
              : null,
            detailAttendanceSelected.date_to
              ? moment(detailAttendanceSelected.date_to, 'YYYY-MM-DD')
              : null,
          ],
          reason: detailAttendanceSelected?.reasons,
          typeReason: detailAttendanceSelected?.for_reasons,
          typeLeave: detailAttendanceSelected?.holiday_status_id?.name,
          attendanceMissingFrom:
            detailAttendanceSelected.attendance_missing_from
              ? moment(
                  detailAttendanceSelected.attendance_missing_from,
                  'YYYY-MM-DD HH:mm:ss'
                )
              : null,
          // attendanceMissingTo: detailAttendanceSelected.attendance_missing_to
          //   ? moment(
          //       detailAttendanceSelected.attendance_missing_to,
          //       'YYYY-MM-DD HH:mm:ss'
          //     )
          //   : null,
        });
      } else if (typeLeaveInfo[0] && typeLeaveInfo[0] === 'TCCR') {
        form.setFieldsValue({
          leaveDay: [
            detailAttendanceSelected.from_date
              ? moment(detailAttendanceSelected.from_date, 'YYYY-MM-DD')
              : null,
            detailAttendanceSelected.date_to
              ? moment(detailAttendanceSelected.date_to, 'YYYY-MM-DD')
              : null,
          ],
          reason: detailAttendanceSelected?.reasons,
          typeReason: detailAttendanceSelected?.for_reasons,
          typeLeave: detailAttendanceSelected?.holiday_status_id?.name,
          // attendanceMissingFrom:
          //   detailAttendanceSelected.attendance_missing_from
          //     ? moment(
          //         detailAttendanceSelected.attendance_missing_from,
          //         'YYYY-MM-DD HH:mm:ss'
          //       )
          //     : null,
          attendanceMissingTo: detailAttendanceSelected.attendance_missing_to
            ? moment(
                detailAttendanceSelected.attendance_missing_to,
                'YYYY-MM-DD HH:mm:ss'
              )
            : null,
        });
      } else {
        form.setFieldsValue({
          leaveDay: [
            detailAttendanceSelected.from_date
              ? moment(detailAttendanceSelected.from_date, 'YYYY-MM-DD')
              : null,
            detailAttendanceSelected.date_to
              ? moment(detailAttendanceSelected.date_to, 'YYYY-MM-DD')
              : null,
          ],
          reason: detailAttendanceSelected?.reasons,
          typeReason: detailAttendanceSelected?.for_reasons,
          typeLeave: detailAttendanceSelected?.holiday_status_id?.name,
          // restHour: detailAttendanceSelected?.time,
          restMinutes: detailAttendanceSelected?.minutes,
        });
      }
    }
  }, [triggerFillData]);
  const customRequest = async ({
    file,
    onSuccess,
    onError,
    onProgress,
    recordId,
  }: any) => {
    if (file) {
      const totalSize =
        fileAttachmentsList.reduce(
          (acc, currentFile) => acc + currentFile.size,
          0
        ) + file.size;
      if (totalSize > 10 * 1024 * 1024) {
        $message.error('Tổng dung lượng upload không được quá 10mb.');
        onError('error');
        return;
      }
      setFileAttachments(file);
      setFileAttachmentsList([...fileAttachmentsList, file]);
      onSuccess('ok');
    } else {
      onError('error');
    }
  };
  const handleDownloadFile = (url: string, name: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.click();
      })
      .catch(console.error);
  };
  // console.log(defaultLeaveType);
  // useEffect(() => {
  //   form.setFieldsValue({
  //     typeReason: '2',
  //   });

  //   setDefaultLeaveType('2');
  // }, []);
  const initialDate = date
  ? [moment(date, 'YYYY-MM-DD'), moment(date, 'YYYY-MM-DD')]
  : [];
  return (
    <BaseForm
    title={`Tạo đơn`}
    showAddUpdate={show}
    onFinish={onFinish}
    setShowAddUpdate={setShow}
    showExplainForm={showExplainForm}
    setShowExplainForm={setShowExplainForm}
    form={form}
    loading={loading}
    isHideFooter={!isEditMode}
    detailAttendanceSelected={detailAttendanceSelected}
    compensatoryFund={conpensatoryfund}
    clickable={clickable}>
    {/* Loại đơn */}
    <Row gutter={24}>
      <Col span={24}>
        <SelectTypeLeave
          treeData={dataLeaveType}
          setTypeLeaveValue={setTypeLeaveValue}
          typeLeaveValue={typeLeaveValue}
        />
      </Col>
    </Row>
    {/* Thông tin xin nghỉ */}
    {/* {typeLeaveInfo[0] && typeLeaveInfo[0] !== 'CN' && */}

    {typeLeaveInfo[0] &&
      typeLeaveInfo[0] !== 'TC' &&
      typeLeaveInfo[0] !== 'TCC' &&
      typeLeaveInfo[0] !== 'CN' &&
      typeLeaveInfo[0] !== 'TCCR' &&
      typeLeaveInfo[0] !== 'TCCV' &&
      typeLeaveInfo[0] != 'RN' && (
        <Row gutter={24}>
          {/* <Col span={24}>
            <Text className="header-form">Thông tin xin nghỉ</Text>
          </Col> */}
          <Col span={24}>
            <Form.Item
              label={'Thời gian nghỉ'}
              initialValue={initialDate}
              name="leaveDay"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập thời gian nghỉ',
                },
              ]}>
              <RangePicker
                format={'DD/MM/YYYY'}
                style={{ width: '100%' }}
                onCalendarChange={onCalendarChange}
              />
            </Form.Item>
          </Col>
          {typeLeaveInfo[0] === 'B' && (
            <>
              <Col span={12}>
                <Text className="text-label">Quỹ bù:</Text>
              </Col>
              <Col span={12}>
                <Text className="text-label text-value">
                  {remainingLeave ? remainingLeave : 0}
                </Text>
              </Col>
            </>
          )}
          {typeLeaveInfo[0] === 'P' && (
            <>
              <Col span={12}>
                <Text className="text-label">Quỹ phép:</Text>
              </Col>
              <Col span={12}>
                <Text className="text-label text-value">
                  {remainingLeave ? remainingLeave : 0}
                </Text>
              </Col>
            </>
          )}
          <>
            <Col span={12}>
              <Text className="text-label">Quỹ phép</Text>
            </Col>
            <Col span={12}>
              <Text className="text-label text-value">
                {remainingAlCl ? remainingAlCl.remaining_leave : 0}
              </Text>
            </Col>
            <Col span={12}>
              <Text className="text-label">Quỹ bù:</Text>
            </Col>
            <Col span={12}>
              <Text className="text-label text-value">
                {remainingAlCl ? remainingAlCl.remaining_cl : 0}
              </Text>
            </Col>
          </>
          <Col span={12}>
            <Form.Item
              label={'Số phút nghỉ'}
              name="restMinutes"
              initialValue={
                typeLeaveInfo[0] === 'DXDM' ? attendance_late : leave_early
              }>
              <Input
                type="number"
                min={0}
                size="middle"
                placeholder=" Vd: 30 phút"
                defaultValue={
                  typeLeaveInfo[0] === 'DXDM' ? attendance_late : leave_early
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={'Vì lý do'}
              name="typeReason"
              rules={[
                { required: true, message: 'Vui lòng chọn vì lý do!' },
              ]}>
              <Radio.Group
                defaultValue={defaultLeaveType}
                // disabled={readOnly}
              >
                <Radio value={'1'}>Cá nhân</Radio>
                <Radio value={'2'}>Công việc</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          
          {typeLeaveInfo[0] === 'CT' && (
            <Col span={12}>
              <SelectCompany />
            </Col>
          )}
        </Row>
      )}
    {/* Thông tin tăng ca */}
    {typeLeaveInfo[0] && typeLeaveInfo[0] === 'TC' && (
      <>
        <Row gutter={24}>
          <Col span={24}>
            <Text className="header-form">Thông tin tăng ca</Text>
          </Col>
          <Col span={12}>
            <Form.Item
              label={'Ngày tăng ca'}
              name="leaveDay"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập ngày tăng ca',
                },
              ]}>
              <DatePicker format={'DD/MM/YYYY'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          {/* toDate().toISOString().slice(0, 10) */}
          <Col span={12}>
            <Form.Item
              label={'Số phút tăng ca'}
              name="totalOvertimeMinute"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tổng thời gian tăng ca!',
                },
              ]}>
              <Input
                size="middle"
                type="number"
                min={0}
                onChange={e => {
                  setMultiplied_wage_amount(
                    Number(e.target.value) *
                      Number(form.getFieldValue('multiplier_wage'))
                  );
                  setMultiplied_work_time_amount(
                    Number(e.target.value) *
                      Number(form.getFieldValue('multiplier_work_time'))
                  );
                }}
                placeholder=" Vd: 30 phút"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* <span>Công :  {multiplied_work_time_amount}</span> */}
            <Form.Item
              label={'Hệ số công'}
              name="multiplier_work_time"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập hệ số công!',
                },
              ]}>
              <Input
                size="middle"
                type="number"
                min={0}
                step={0.1}
                defaultValue={1}
                placeholder=" Vd: 1,5"
                onChange={e => {
                  setMultiplied_work_time_amount(
                    Number(e.target.value) *
                      Number(form.getFieldValue('totalOvertimeMinute'))
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'   '} name="multiplier_work_time_amount">
              <span>
                Công Sau Quy Đổi Hệ Số: {multiplied_work_time_amount}
              </span>
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* <span>Lương: {multiplied_wage_amount}</span> */}
            <Form.Item
              label={'Hệ số lương'}
              name="multiplier_wage"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập hệ số lương!',
                },
              ]}>
              <Input
                size="middle"
                type="number"
                min={0}
                step={0.1}
                placeholder=" Vd: 1,5"
                defaultValue={0.5}
                onChange={e => {
                  setMultiplied_wage_amount(
                    Number(e.target.value) *
                      Number(form.getFieldValue('totalOvertimeMinute'))
                  );
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={'   '} name="multiplier_wage_amount">
              <span>Lương Sau Quy Đổi Hệ Số: {multiplied_wage_amount}</span>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={'Tăng ca từ'}
              name="overtime_from"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tổng thời gian tăng ca!',
                },
              ]}>
              <TimePicker
                format={'HH:mm'}
                style={{ width: '100%' }}
                value={overtime_from}
                onChange={handleOvertimeFrom}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={'Tăng ca đến'}
              name="overtime_to"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tổng thời gian tăng ca!',
                },
              ]}>
              <TimePicker
                format={'HH:mm'}
                style={{ width: '100%' }}
                value={overtime_to}
                onChange={handleOvertimeTo}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'Chuyển tăng ca'} name="convert_overtime">
              <Checkbox
                checked={checked}
                onChange={e => setChecked(e.target.checked)}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={24} style={{visibility: "hidden"}}>
          <Col span={12}>
            <SelectEmployeeHeadOfDepartment />
          </Col>
          <Col span={12}>
            <SelectEmployeeGeneralManager />
          </Col>
        </Row> */}
      </>
    )}
    {typeLeaveInfo[0] &&
      typeLeaveInfo[0] !== 'CN' &&
      typeLeaveInfo[0] !== 'TCC' &&
      typeLeaveInfo[0] !== 'TCCV' &&
      typeLeaveInfo[0] !== 'TCCR' &&
      typeLeaveInfo[0] !== 'RN' && (
        <Row gutter={24}>
       
          <Col span={24}>
            <Form.Item
              label={'Lý do:'}
              name="reason"
              rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}>
              <TextArea
                rows={2}
                placeholder="Tối đa 255 ký tự"
                maxLength={255}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
      )}
    {!isView && (
      <Col span={24}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item label="File đính kèm" name="attachment_ids">
            <Upload
              className="upload"
              customRequest={customRequest}
              accept="image/*">
              <Button style={{ width: '100%' }} icon={<UploadOutlined />}>
                Upload
              </Button>
            </Upload>
          </Form.Item>
        </Space>
      </Col>
    )}
    {/* {typeLeaveInfo[0] &&
      (typeLeaveInfo[0] === 'DXDM' || typeLeaveInfo[0] === 'DXVS') && (
        <>
          <Col span={24}>
            <Form.Item label="Lịch sử chấm công">
              <div className="weekly-info-row">
                <Text className="label">Giờ bắt đầu ca: </Text>
                <Text className="content">
                  {shift_start && floatToHourMinute(shift_start)}
                </Text>
              </div>
              <div className="weekly-info-row">
                <Text className="label">Giờ kết thúc ca: </Text>
                <Text className="content">
                  {shift_end && floatToHourMinute(shift_end)}
                </Text>
              </div>

              <div className="attendance-info-row">
                {nonNullUndefinedattendance_attemptArr.map(
                  (attempt, index) => {
                    if (attempt !== null) {
                      return (
                        <div key={index} className="weekly-info-row">
                          <Text className="label">Lần {index + 1}: </Text>
                          <Text className="content">
                            {nonNullUndefinedattendance_inoutArr[index]}
                          </Text>
                          <Text className="contentTimeStart">
                            {formatDateDot(attempt)}
                          </Text>
                        </div>
                      );
                    }

                    return null;
                  }
                )}
                {(() => {
                  if (nonNullUndefinedattendance_attemptArr.length > 0) {
                    return (
                      <div className="weekly-info-row">
                        <Text className="label">Lần cuối: </Text>
                        {(() => {
                          if (
                            nonNullUndefinedattendance_inoutArr.length > 0
                          ) {
                            return (
                              <Text className="content">
                                {
                                  nonNullUndefinedattendance_inoutArr[
                                    nonNullUndefinedattendance_inoutArr.length -
                                      1
                                  ]
                                }
                              </Text>
                            );
                          }
                          return null;
                        })()}
                        <Text className="contentTimeEnd">
                          {formatDateDot(
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
            </Form.Item>
          </Col>
        </>
      )} */}
    {typeLeaveInfo[0] && typeLeaveInfo[0] === 'CN' && (
      <>
        <Row gutter={24}>
          <Col span={24}>
            <Text className="header-form">Thông tin chế độ</Text>
          </Col>
          <Col span={24}>
            <Form.Item
              label={'Thời gian hưởng chế độ'}
              name="leaveDay"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập thời gian',
                },
              ]}>
              <RangePicker
                format={'DD/MM/YYYY'}
                style={{ width: '100%' }}
                onCalendarChange={onCalendarChange}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={'Thời gian nghỉ'} name="restOption">
              <Select
                options={[
                  {
                    label: '60 phút đầu ca',
                    value: '1',
                  },
                  {
                    label: '60 phút cuối ca',
                    value: '2',
                  },
                  {
                    label: '30 phút đầu ca + 30 phút cuối ca',
                    value: '3',
                  },
                  {
                    label: '30 phút đầu giờ nghỉ + 30 phút cuối giờ nghỉ',
                    value: '4',
                  },
                  {
                    label: '60 phút đầu giờ nghỉ',
                    value: '5',
                  },
                  {
                    label: '60 phút cuối giờ nghỉ',
                    value: '6',
                  },
                ]}></Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={'Lý do:'}
              name="reason"
              rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}>
              <TextArea
                rows={2}
                placeholder="Tối đa 255 ký tự"
                maxLength={255}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    )}

    {typeLeaveInfo[0] && typeLeaveInfo[0] === 'TCC' && (
      <>
        <Row gutter={24}>
          <Col span={24}>
            <Text style={{ color: 'red', marginTop: -20, marginBottom: 10 }}>
              Chú ý: Giờ thiếu chấm công nên cách giờ đầu ca và cuối ca lớn
              hơn 60 phút
            </Text>
          </Col>
          <Col span={24}>
            <Text className="header-form">Thông tin đơn</Text>
          </Col>

          {/* <Col span={12}>
            <Form.Item
              label={'Thời gian nghỉ'}
              name="restOption"

            ><Select onChange={(value) => {console.log(value)}} options={[{
              label: "Đầu giờ",
              value: "1"
            },
            {
              label: "Cuối giờ",
              value: "2"
            },
            {
              label: "Cả ngày",
              value: "3"
            },
            {
              label: "Nghỉ trưa",
              value:"4"
            }

            ]}>

            </Select>

              </Form.Item>

          </Col> */}
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={'Thêm chấm công đầu'}
              name="attendanceMissingFrom">
              <TimePicker format={'HH:mm:ss'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={'Thêm chấm công cuối'}
              name="attendanceMissingTo">
              <TimePicker format={'HH:mm:ss'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={'Vì lý do'}
              name="typeReason"
              rules={[
                { required: true, message: 'Vui lòng chọn vì lý do!' },
              ]}>
              <Radio.Group
              // defaultValue={defaultLeaveType}
              // disabled={readOnly}
              >
                <Radio value={'1'}>Cá nhân</Radio>
                <Radio value={'2'}>Công việc</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={'Lý do:'}
              name="reason"
              rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}>
              <TextArea
                rows={5}
                placeholder="Tối đa 255 ký tự"
                maxLength={255}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={'Lịch sử chấm công:'}
              name="history"
              // rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
            >
              <div className="weekly-info-row">
                <Text className="label">Giờ bắt đầu ca: </Text>
                <Button
                  onClick={() => handleTimeStart(shift_start)}
                  className="content">
                  {shift_start && floatToHourMinute(shift_start)}
                </Button>
              </div>
              <div className="weekly-info-row">
                <Text className="label">Giờ kết thúc ca: </Text>
                <Button
                  onClick={() => handleTimeStart(shift_end)}
                  className="content">
                  {shift_end && floatToHourMinute(shift_end)}
                </Button>
              </div>

              <div className="weekly-info-row">
                <Text className="label">Giờ bắt đầu nghỉ: </Text>
                <Button
                  onClick={() => handleTimeStart(rest_start)}
                  className="content">
                  {rest_start && floatToHourMinute(rest_start)}
                </Button>
              </div>
              <div className="weekly-info-row">
                <Text className="label">Giờ kết thúc nghỉ: </Text>
                <Button
                  onClick={() => handleTimeStart(rest_end)}
                  className="content">
                  {rest_end && floatToHourMinute(rest_end)}
                </Button>
              </div>
              <div className="weekly-info-row">
                <Text className="label">Thời gian đã chọn: </Text>
                {/* {selectedTimeRange && (
                <Text className="content">{selectedTimeRange}</Text>
              )} */}
              </div>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label={'Thêm chấm công đầu'}
                    name="attendanceMissingFrom">
                    <TimePicker
                      disabled
                      format={'HH:mm:ss'}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={'thêm chấm công cuối'}
                    name="attendanceMissingTo">
                    <TimePicker
                      disabled
                      format={'HH:mm:ss'}
                      style={{ width: '100%' }}
                      // onChange={handleTimeChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
      </>
    )}

    {typeLeaveInfo[0] && typeLeaveInfo[0] === 'TCCV' && (
      <>
        <Row gutter={24}>
          <Col span={24}>
            <Text style={{ color: 'red', marginTop: -20, marginBottom: 10 }}>
              Chú ý: Giờ thiếu chấm công nên cách giờ đầu ca và cuối ca lớn
              hơn 60 phút
            </Text>
          </Col>
          <Col span={24}>
            <Text className="header-form">Thông tin đơn</Text>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={'Từ thời gian'} name="attendanceMissingFrom">
              <TimePicker format={'HH:mm:ss'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item
              label={'Thêm chấm công cuối'}
              name="attendanceMissingTo">
              <TimePicker format={'HH:mm:ss'} style={{ width: '100%' }} />
            </Form.Item>
          </Col> */}
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={'Vì lý do'}
              name="typeReason"
              rules={[
                { required: true, message: 'Vui lòng chọn vì lý do!' },
              ]}>
              <Radio.Group
              // defaultValue={defaultLeaveType}
              // disabled={readOnly}
              >
                <Radio value={'1'}>Cá nhân</Radio>
                <Radio value={'2'}>Công việc</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={'Lý do:'}
              name="reason"
              rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}>
              <TextArea
                rows={5}
                placeholder="Tối đa 255 ký tự"
                maxLength={255}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    )}

    {typeLeaveInfo[0] && typeLeaveInfo[0] === 'TCCR' && (
      <>
        <Row gutter={24}>
          <Col span={24}>
            <Text style={{ color: 'red', marginTop: -20, marginBottom: 10 }}>
              Chú ý: Giờ thiếu chấm công nên cách giờ đầu ca và cuối ca lớn
              hơn 60 phút
            </Text>
          </Col>
          <Col span={24}>
            <Text className="header-form">Thông tin đơn</Text>
          </Col>
        </Row>
        <Row gutter={24}>
          {/* <Col span={12}>
            <Form.Item
              label={'Thêm chấm công đầu'}
              name="attendanceMissingFrom">
              <TimePicker format={'HH:mm:ss'} style={{ width: '100%' }} />
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item label={'Đến thời gian'} name="attendanceMissingTo">
              <TimePicker format={'HH:mm:ss'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={'Vì lý do'}
              name="typeReason"
              rules={[
                { required: true, message: 'Vui lòng chọn vì lý do!' },
              ]}>
              <Radio.Group
              // defaultValue={defaultLeaveType}
              // disabled={readOnly}
              >
                <Radio value={'1'}>Cá nhân</Radio>
                <Radio value={'2'}>Công việc</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={'Lý do:'}
              name="reason"
              rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}>
              <TextArea
                rows={5}
                placeholder="Tối đa 255 ký tự"
                maxLength={255}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    )}

    {typeLeaveInfo[0] && typeLeaveInfo[0] === 'RN' && (
      <>
        <Row gutter={24}>
          <Col span={24}>
            <Text className="header-form">Thông tin đơn</Text>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={'Bắt đầu ra ngoài'}
              name="attendanceMissingFrom">
              <TimePicker
                inputReadOnly={true}
                format={'HH:mm:00'}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'Kết thúc ra ngoài'} name="attendanceMissingTo">
              <TimePicker
                inputReadOnly={true}
                format={'HH:mm:59'}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={'Vì lý do'}
              name="typeReason"
              rules={[
                { required: true, message: 'Vui lòng chọn vì lý do!' },
              ]}>
              <Radio.Group
              // defaultValue={defaultLeaveType}
              // disabled={readOnly}
              >
                <Radio value={'1'}>Cá nhân</Radio>
                <Radio value={'2'}>Công việc</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={'Lý do:'}
              name="reason"
              rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}>
              <TextArea
                rows={5}
                placeholder="Tối đa 255 ký tự"
                maxLength={255}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={'Lịch sử chấm công:'}
              name="history"
              // rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
            >
              <div className="weekly-info-row">
                <Text className="label">Giờ bắt đầu ca: </Text>
                <Button
                  onClick={() => handleTimeStart(shift_start)}
                  className="content">
                  {shift_start && floatToHourMinute(shift_start)}
                </Button>
              </div>
              <div className="weekly-info-row">
                <Text className="label">Giờ kết thúc ca: </Text>
                <Button
                  onClick={() => handleTimeStart(shift_end)}
                  className="content">
                  {shift_end && floatToHourMinute(shift_end)}
                </Button>
              </div>

              <div className="attendance-info-row">
                {nonNullUndefinedattendance_attemptArr.map(
                  (attempt, index) => {
                    if (attempt !== null) {
                      return (
                        <div key={index} className="weekly-info-row">
                          <Text className="label">Lần {index + 1}: </Text>
                          <Text className="content">
                            {nonNullUndefinedattendance_inoutArr[index]}
                          </Text>
                          <Button
                            className="contentTimeStart"
                            onClick={() => handleTimeStartSection(attempt)}>
                            {formatDateDot(attempt)}
                          </Button>
                        </div>
                      );
                    }

                    return null;
                  }
                )}
                {(() => {
                  if (nonNullUndefinedattendance_attemptArr.length > 0) {
                    return (
                      <div className="weekly-info-row">
                        <Text className="label">Lần cuối: </Text>
                        {(() => {
                          if (
                            nonNullUndefinedattendance_inoutArr.length > 0
                          ) {
                            return (
                              <Button className="content">
                                {
                                  nonNullUndefinedattendance_inoutArr[
                                    nonNullUndefinedattendance_inoutArr.length -
                                      1
                                  ]
                                }
                              </Button>
                            );
                          }
                          return null;
                        })()}
                        <Button
                          className="contentTimeEnd"
                          onClick={() =>
                            handleTimeEndSection(
                              nonNullUndefinedattendance_attemptArr[
                                nonNullUndefinedattendance_attemptArr.length -
                                  1
                              ]
                            )
                          }>
                          {formatDateDot(
                            nonNullUndefinedattendance_attemptArr[
                              nonNullUndefinedattendance_attemptArr.length - 1
                            ]
                          )}
                        </Button>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="weekly-info-row">
                <Text className="label">Thời gian đã chọn: </Text>
                {/* {selectedTimeRange && (
                  <Text className="content">{selectedTimeRange}</Text>
                )} */}
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="attendanceMissingFrom">
              <TimePicker
                disabled
                format={'HH:mm:ss'}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="attendanceMissingTo">
              <TimePicker
                disabled
                format={'HH:mm:ss'}
                style={{ width: '100%' }}
                // onChange={handleTimeChange}
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    )}
  </BaseForm>
  );
};

export default index;
