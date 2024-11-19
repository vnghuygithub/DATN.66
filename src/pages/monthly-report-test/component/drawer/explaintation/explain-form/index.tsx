import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import BaseForm from '../../base-form';
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  TimePicker,
  Typography,
} from 'antd';
import {
  calculateAttendanceReport,
  createExplainLeave,
  getAttendanceMark,
} from '@/api/weeklyreport/weeklyreport';
import './style.css';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { message as $message } from 'antd';
import { InvalidTimesheet } from '@/interface/weeklyreport/type';
import detailAttendanceSlice from '../../../../../../stores/detail-attendance.store';
import { createInvalidTimeSheet } from '@/api/invalidTimesheet/invalidTimesheet.api';
import moment from 'moment';
import { useSelector } from 'react-redux';
import {
  convertFloatToHourMinute,
  convertFloatToHourMinuteV2,
} from '@/utils/common';
import { invalidTypeOptions } from '@/const/options';
import { formatDate, formatDateDot, formatDateTime } from '@/utils/formatDate';
import { log } from 'console';
interface ILeaveFormProps {
  show: boolean;
  setShow: (value: boolean) => void;
  showExplainForm: boolean;
  setShowExplainForm: Dispatch<SetStateAction<boolean>>;
  foreUpdateLeave: boolean;
  setForceUpdateLeave: Dispatch<SetStateAction<boolean>>;
  detailAttendanceSelected: InvalidTimesheet;
  isView: boolean;
  isCreating: boolean;
  selectedTimeIn: string;
  selectedTimeOut: string;
  setSelectedTimeIn: Dispatch<SetStateAction<string>>;
  setSelectedTimeOut: Dispatch<SetStateAction<string>>;

  // loading: boolean;
}
const index = (props: ILeaveFormProps) => {
  const {
    show,
    setShow,
    showExplainForm,
    setShowExplainForm,
    foreUpdateLeave,
    setForceUpdateLeave,
    detailAttendanceSelected,
    isView,
    isCreating,
    selectedTimeIn,
    selectedTimeOut,
    setSelectedTimeIn,
    setSelectedTimeOut,
    // loading,
  } = props;
  const [form] = Form.useForm();
  const { Panel } = Collapse;
  const { Text } = Typography;
  const { TextArea } = Input;
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [invalidType, setInvalidType] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [clickable, setClickable] = useState<boolean>(true);

  const {
    employee_code,
    employee_name,
    company,
    department,
    job_title,
    date,
    shift_start,
    shift_end,
    split_shift,
    last_attendance_attempt,
    rest_start,
    rest_end,
  } = useSelector(state => state.weekly);

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
  // const nonNullUndefinedattendance_inoutArr: string[] = [];
  // attendance_inoutArr.forEach(variable => {
  //   if (variable !== null && variable !== undefined && variable) {
  //     nonNullUndefinedattendance_inoutArr.push(variable);
  //   }
  // });
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
  // const nonNullUndefinedattendance_attemptArr: string[] = [];
  // attendance_attemptArr.forEach(variable => {
  //   if (variable !== null && variable !== undefined && variable) {
  //     nonNullUndefinedattendance_attemptArr.push(variable);
  //   }
  // });

  // =================================
  const [
    nonNullUndefinedattendance_attemptArr,
    setNonNullUndefinedattendance_attemptArr,
  ] = useState<string[]>([]);
  const [
    nonNullUndefinedattendance_inoutArr,
    setNonNullUndefinedattendance_inoutArr,
  ] = useState<string[]>([]);
  useEffect(() => {
    // console.log("thefuckisthis?" ,nonNullUndefinedattendance_attemptArr)
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
  // ================================
  // Selector
  // ================================
  const onFinish = async (formData: any) => {
    setLoading(true);
    setClickable(false);
    store.dispatch(
      setGlobalState({
        loading: true,
      })
    );
    var attendance_missing_from = '';
    var attendance_missing_to = '';
    let body;
    if (detailAttendanceSelected.invalid_type === '3') {
      body = {
        params: {
          args: [
            detailAttendanceSelected.id,
            formData.reason.toString(),
            formData.remarks,
            '2',
            detailAttendanceSelected.invalid_type,
            detailAttendanceSelected.keep_in_time,
          ],
        },
      };
    } else {
      body = {
        params: {
          args: [
            detailAttendanceSelected.id,
            formData.reason.toString(),
            formData.remarks,
            '2',
            detailAttendanceSelected.invalid_type,
            false,
          ],
        },
      };
    }
    store.dispatch(
      setGlobalState({
        loading: true,
      })
    );
    if (isCreating) {
      let data = await form?.getFieldsValue();
      if (!data.reason) {
        $message.error('Vui lòng chọn lý do');
        setLoading(false);
        setClickable(true);
        store.dispatch(
          setGlobalState({
            loading: false,
          })
        );
        return;
      }
      data.employee_code = employee_code;
      data.shift_break = split_shift;
      data.shift_from = shift_start;
      data.shift_to = shift_end;
      data.validated = '1';
      data.invalid_date = date;
      data.invalid_type = Number(formData.invalid_type);
      if (data.invalid_type === 5) {
        var date_obj = moment(date);
        if (
          data.attendanceMissingTo === null ||
          data.attendanceMissingTo === undefined
        ) {
          $message.error('Vui lòng chọn giờ kết thúc ngoài');
          return;
        }
        if (
          data.attendanceMissingFrom != undefined &&
          data.attendanceMissingFrom != null
        ) {
          data.attendance_missing_from = formData.attendanceMissingFrom
            .set({
              year: date_obj.year(),
              month: date_obj.month(),
              date: date_obj.date(),
            })
            .format('YYYY-MM-DD HH:mm:ss');
        } else {
          $message.error('Vui lòng chọn giờ ra ngoài');
          store.dispatch(
            setGlobalState({
              loading: false,
            })
          );
          setLoading(false);
          setClickable(true);
          return;
        }

        if (
          formData.attendanceMissingTo != undefined &&
          formData.attendanceMissingTo != null
        ) {
          data.attendance_missing_to = formData.attendanceMissingTo
            .set({
              year: date_obj.year(),
              month: date_obj.month(),
              date: date_obj.date(),
            })
            .format('YYYY-MM-DD HH:mm:ss');
          if (
            moment(formData.attendanceMissingTo).isBefore(
              data.attendance_missing_from
            )
          ) {
            console.log(
              data.attendance_missing_from,
              data.attendance_missing_to
            );

            $message.error('Giờ kết thúc không được sớm hơn giờ bắt đầu');
            store.dispatch(
              setGlobalState({
                loading: false,
              })
            );
            setLoading(false);
            setClickable(true);
            return;
          }
        } else {
          const lastValueMissingTo = shift_end && floatToHourMinute(shift_end);
          data.attendance_missing_to = moment(lastValueMissingTo, 'HH:mm:ss')
            .set({
              year: date_obj.year(),
              month: date_obj.month(),
              date: date_obj.date(),
            })
            .format('YYYY-MM-DD HH:mm:ss');
        }

        console.log(data.attendance_missing_from, data.attendance_missing_to);
      }
      if (data.invalid_type === 3) {
        data.real_time_attendance_data = attendance_attempt_1
          ? attendance_attempt_1
          : last_attendance_attempt;
        if (!data.keep_in_time) {
          data.validation_data = !attendance_attempt_1
            ? shift_start && convertFloatToHourMinuteV2(shift_start)
            : shift_end && convertFloatToHourMinuteV2(shift_end);
        } else {
          data.validation_data =
            shift_start && convertFloatToHourMinuteV2(shift_start);
        }
      } else if (data.invalid_type === 2) {
        data.real_time_attendance_data = attendance_attempt_1;
        data.validation_data =
          shift_start && convertFloatToHourMinuteV2(shift_start);
      } else {
        data.real_time_attendance_data = last_attendance_attempt;
        data.validation_data =
          shift_end && convertFloatToHourMinuteV2(shift_end);
      }

      const res = await createInvalidTimeSheet(data);
      if (res) {
        store.dispatch(
          setGlobalState({
            loading: false,
          })
        );
        setForceUpdateLeave && setForceUpdateLeave(!foreUpdateLeave);
        setShow(!show);
        form.resetFields();
        $message.success('Tạo giải trình thành công');
        setClickable(true);
      } else {
        $message.error('Có lỗi xảy ra');
        setClickable(true);
        setLoading(false);
        store.dispatch(
          setGlobalState({
            loading: false,
          })
        );
      }
    } else {
      const res = (await createExplainLeave(body)) as any;
      if (res.result) {
        await calculateAttendanceReport({
          params: {
            args: [
              date ? moment(date).format('DD/MM/YYYY') : null,
              date ? moment(date).format('DD/MM/YYYY') : null,
              employee_code,
            ],
          },
        });
        setLoading(false);
        setClickable(true);
        $message.success('Cập nhật giải trình thành công');
        store.dispatch(
          setGlobalState({
            loading: false,
          })
        );
        form.resetFields();
        setForceUpdateLeave(!foreUpdateLeave);
        setShow(!show);
      } else {
        setLoading(false);
        setClickable(true);
        store.dispatch(
          setGlobalState({
            loading: false,
          })
        );
        $message.error(res.error.data.message ?? res.error.message);
      }
    }
  };
  useEffect(() => {
    setInvalidType(null);
  }, [isCreating, isView]);
  useEffect(() => {
    if (isView) {
      console.log(
        moment(detailAttendanceSelected.attendance_missing_to).format(
          'HH:mm:ss'
        )
      ),
        setInvalidType(Number(detailAttendanceSelected.invalid_type));
      form.setFieldsValue({
        reason: Number(detailAttendanceSelected.reason),
        remarks: detailAttendanceSelected.remarks
          ? detailAttendanceSelected.remarks
          : '',
        keep_in_time: detailAttendanceSelected.keep_in_time
          ? detailAttendanceSelected.keep_in_time
          : false,
        invalid_type: detailAttendanceSelected.invalid_type
          ? detailAttendanceSelected.invalid_type
          : '',

        attendanceMissingFrom: moment(
          detailAttendanceSelected.attendance_missing_from,
          'YYYY-MM-DD HH:mm:ss'
        ),
        attendanceMissingTo: moment(
          detailAttendanceSelected.attendance_missing_to,
          'YYYY-MM-DD HH:mm:ss'
        ),
      });
      setIsEditMode(false);
    } else {
      setIsEditMode(true);
      setInvalidType(Number(detailAttendanceSelected.invalid_type));
      form.setFieldsValue({
        reason: Number(detailAttendanceSelected.reason),
        remarks: detailAttendanceSelected.remarks
          ? detailAttendanceSelected.remarks
          : '',
        keep_in_time: detailAttendanceSelected.keep_in_time
          ? detailAttendanceSelected.keep_in_time
          : false,
        invalid_type: detailAttendanceSelected.invalid_type
          ? detailAttendanceSelected.invalid_type
          : '',
        attendanceMissingFrom: moment(
          detailAttendanceSelected.attendance_missing_from,
          'YYYY-MM-DD HH:mm:ss'
        ),
        attendanceMissingTo: moment(
          detailAttendanceSelected.attendance_missing_to,
          'YYYY-MM-DD HH:mm:ss'
        ),
      });
    }
  }, [show, isView, form, detailAttendanceSelected]);
  const handleInvalidTypeChange = (value: any) => {
    setInvalidType(Number(value));
  };

  const floatToHourMinute = (floatValue: number): string => {
    const hours = Math.floor(floatValue);
    const minutes = Math.round((floatValue - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
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
        attendanceMissingTo: timeObject,
        // .set({ second: 59 })
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
        attendanceMissingTo: timeObject,
        // .set({ second: 59 })
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
      attendanceMissingTo: timeObject,
      // .set({ second: 59 })
    };
    form.setFieldsValue(fieldsValue);
  };

  useEffect(() => {
    console.log(selectedTimeIn);

    if (selectedTimeIn) {
      form.setFieldsValue({
        attendanceMissingFrom: undefined,
        attendanceMissingTo: moment(selectedTimeIn, 'YYYY-MM-DD HH:mm:ss'),
      });
    }
  }, [selectedTimeIn]);

  useEffect(() => {
    console.log(moment(selectedTimeOut, 'HH:mm:ss'));

    if (selectedTimeOut) {
      form.setFieldsValue({
        // attendanceMissingTo: undefined,
        attendanceMissingFrom: moment(selectedTimeOut, 'YYYY-MM-DD HH:mm:ss'),
      });
    }
  }, [selectedTimeOut]);
  useEffect(() => {
    form.setFieldsValue({
      invalid_type: '5',
    });
  
    setInvalidType(5);
    
  }, [show]);
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
  useEffect(() => {
    if (!show) {
      setSelectedTimeIn && setSelectedTimeIn('');
      setSelectedTimeOut && setSelectedTimeOut('');
      form?.resetFields();
    }
  }, [show]);
  const items2 = [
    {
      key: '1',
      label: `Lịch sử chấm công`,
      children: (
        <Col span={24}>
          {invalidType === 5 && (
            <Col span={24}>
              <Form.Item
                // label={'Lịch sử chấm công:'}
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
                  {nonNullUndefinedattendance_inoutArr.map((inout, index) => {
                    const attempt =
                      nonNullUndefinedattendance_attemptArr[index];
                    const isWithinShift = isAttemptWithinShift(
                      attempt,
                      shift_start,
                      shift_end,
                      rest_start,
                      rest_end
                    );

                    return (
                      <div key={index} className="weekly-info-row">
                        <Text className="label">Lần {index + 1}: </Text>
                        <Text className="content">{inout}</Text>
                        <Button
                          className="contentTimeStart"
                          onClick={() => handleTimeStartSection(attempt)}
                          style={{
                            color: isWithinShift ? 'red' : 'inherit',
                          }}
                          // className="content-open-shift"
                        >
                          {attempt ? formatDateTime(attempt) : ''}
                        </Button>
                      </div>
                    );
                  })}
                </div>
                <div className="weekly-info-row">
                  <Text className="label">Thời gian đã chọn: </Text>
                </div>
              </Form.Item>
            </Col>
          )}
        </Col>
      ),
    },
  ];
  return (
    <BaseForm
    title={`Tạo giải trình`}
    showAddUpdate={show}
    onFinish={onFinish}
    setShowAddUpdate={setShow}
    showExplainForm={showExplainForm}
    setShowExplainForm={setShowExplainForm}
    form={form}
    loading={loading}
    isHideFooter={!isEditMode}
    isView={isView}
    detailAttendanceSelected={detailAttendanceSelected}
    clickable={clickable}>
    {/* Lý do */}
    <Col span={24}>
      <Form.Item
        required
        initialValue={'5'}
        label={'Loại giải trình'}
        name="invalid_type"
        rules={[
          { required: true, message: 'Vui lòng chọn loại giải trình!' },
        ]}>
        <Select
          defaultValue={'5'}
          options={invalidTypeOptions}
          onChange={value => {
            handleInvalidTypeChange(value);
          }}
        />
      </Form.Item>
    </Col>
    {/* {invalidType === 5 && (
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label={'Bắt đầu ra ngoài'} name="attendanceMissingFrom">
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
    )} */}

    <Col span={24} style={{ marginTop: 20 }}>
      <Text className="header-form">Lý do</Text>
    </Col>
    <Row gutter={24}>
      <Col span={24}>
        <Form.Item
          required
          name="reason"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn lý do!',
            },
          ]}>
          <Radio.Group>
            <Radio value={1}>Cá nhân</Radio>
            <Radio value={2}>Công việc</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>

      {invalidType === 3 && (
        <>
          <Col span={24} style={{ marginTop: 20 }}>
            <Text className="header-form">
              Giữ nguyên giờ làm việc thực tế
            </Text>
          </Col>
          <Col span={24}>
            <Form.Item
              name="keep_in_time"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn!',
                },
              ]}>
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </>
      )}

      <Col span={24} style={{ marginTop: 20 }}>
        {/* <Text className="header-form">Nội dung giải trình</Text> */}
      </Col>
      <Col span={24}>
        <Form.Item
          label={'Nội dung'}
          name="remarks"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
          <TextArea
            rows={2}
            placeholder="Tối đa 255 ký tự"
            maxLength={255}
            allowClear
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Collapse accordion style={{ marginBottom: '10px' }}>
          {items2.map((item: any) => (
            <Panel header={item.label} key={item.key}>
              {item.children}
            </Panel>
          ))}
        </Collapse>
      </Col>
    </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label={'Bắt đầu ra ngoài'} name="attendanceMissingFrom">
            <TimePicker
              disabled
              format={'HH:mm:ss'}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={'kết thúc ra ngoài'} name="attendanceMissingTo">
            <TimePicker
              disabled
              format={'HH:mm:ss'}
              style={{ width: '100%' }}
              // onChange={handleTimeChange}
            />
          </Form.Item>
        </Col>
      </Row>
  </BaseForm>
  );
};

export default index;
