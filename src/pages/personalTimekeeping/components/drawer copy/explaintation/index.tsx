import { getAttendanceDetailById } from '@/api/weeklyreport/weeklyreport';
import {
  IGetAttendanceDetails,
  IGetAttendanceDetailsParams,
  InvalidTimesheet,
} from '@/interface/weeklyreport/type';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import { Button, Divider, Row, Space, Tag, Typography } from 'antd';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import './style.css';
import ExplainForm from './explain-form';
import { stat } from 'fs';
const { Text } = Typography;
import { ReactComponent as LockSvg } from '@/assets/icons/ic_clock.svg';
import moment from 'moment';
import { convertDatetimeStringToHourMinute } from '@/utils/common';
interface LeaveFormProps {
  foreUpdateLeave: boolean;
  setForceUpdateLeave: Dispatch<SetStateAction<boolean>>;
}

const index = (props: LeaveFormProps) => {
  let is_general_manager = localStorage.getItem('is_general_manager');
  let is_head_of_department = localStorage.getItem('is_head_of_department');
  let is_department_secretary = localStorage.getItem('is_department_secretary');
  //
  // Props
  //
  const { foreUpdateLeave, setForceUpdateLeave } = props;
  // ================================
  // State
  // ================================
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
  const [isShowPoup, setIsShowPoup] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [detailAttendanceSelected, setDetailAttendanceSelected] =
    useState<InvalidTimesheet>(initialStateInvalidTimeSheet);
  const [selectedTimeIn, setSelectedTimeIn] = useState<string>('');
  const [selectedTimeOut, setselectedTimeOut] = useState<string>('');
  // ================================
  // Selector
  // ================================
  const { invalid_timesheet } = useSelector(state => state.detailAttendance);
  const { total_work_time, total_shift_work_time } = useSelector(
    state => state.weekly
  );
  const createExplation = () => {
    setIsShowPoup(!isShowPoup);
  };
  return (
    <React.Fragment>
      <Space direction="vertical" className="explaintation">
        <Text
          strong
          style={{
            textAlign: 'center',
            display: 'block',
            fontSize: 16,
            fontWeight: 500,
          }}>
          Danh sách giải trình
        </Text>
        <Divider />
        {invalid_timesheet &&
          invalid_timesheet.length > 0 &&
          invalid_timesheet.map(item => {
            console.log(item.real_time_attendance_data);
            console.log(
              convertDatetimeStringToHourMinute(item?.real_time_attendance_data)
            );
            return (
              <>
                <Space direction="vertical" className="explaintation-section">
                  {item.invalid_type === '1' && (
                    <div className="explain-header">
                      <Text strong className="label">
                        Giải trình về sớm
                      </Text>
                      <div className="title-lock">
                        <LockSvg />{' '}
                        {convertDatetimeStringToHourMinute(
                          item?.real_time_attendance_data
                        )}
                      </div>
                    </div>
                  )}
                  {item.invalid_type === '2' && (
                    <div className="explain-header">
                      <Text strong className="label">
                        Giải trình đi muộn
                      </Text>
                      <div className="title-lock">
                        <LockSvg />{' '}
                        {convertDatetimeStringToHourMinute(
                          item?.real_time_attendance_data
                        )}
                      </div>
                    </div>
                  )}
                  {item.invalid_type === '3' && (
                    <div className="explain-header">
                      <Text strong className="label">
                        Giải trình thiếu chấm công
                      </Text>
                      <div className="title-lock">
                        <LockSvg />{' '}
                        {convertDatetimeStringToHourMinute(
                          item?.real_time_attendance_data
                        )}
                      </div>
                    </div>
                  )}
                  <Text className="label">
                    Ngày vi phạm:{' '}
                    {moment(item?.invalid_date).format('DD-MM-YYYY') ??
                      'No date'}
                  </Text>
                  {item?.first_attendance_attempt && (
                    <Text className="label">
                      Chấm công lần đầu:{' '}
                      {moment(item?.first_attendance_attempt).format(
                        'DD-MM-YYYY HH:mm:ss'
                      )}
                    </Text>
                  )}
                  {item?.last_attendance_attempt && (
                    <Text className="label">
                      Chấm công lần cuối:{' '}
                      {moment(item?.last_attendance_attempt).format(
                        'DD-MM-YYYY HH:mm:ss'
                      )}
                    </Text>
                  )}
                  {item.invalid_type === '5' && (
                    <Text className="label">
                      Thời gian ra:{' '}
                      {moment(item?.attendance_missing_from).format(
                        'DD-MM-YYYY HH:mm:ss'
                      )}
                    </Text>
                  )}
                  {item.invalid_type === '5' && (
                    <Text className="label">
                      Thời gian vào:{' '}
                      {moment(item?.attendance_missing_to).format(
                        'DD-MM-YYYY HH:mm:ss'
                      )}
                    </Text>
                  )}
                  {item?.reason && item?.reason.toString() === '1' && (
                    <Text className="label">Giải trình: Cá nhân</Text>
                  )}
                  {item?.reason && item?.reason.toString() === '2' && (
                    <Text className="label">Giải trình: Công việc</Text>
                  )}
                  {!item?.reason && <Text className="label">Giải trình:</Text>}
                  <div className="explaintation-row">
                    <Text className="label">Trạng thái:</Text>
                    {item?.validated == '1' && (
                      <Tag
                        className="tag no-reason"
                        color="transparent"
                        onClick={() => {
                          setDetailAttendanceSelected(item);
                          setIsView(false);
                          createExplation();
                          setIsCreating(false);
                        }}>
                        Chưa duyệt
                      </Tag>
                    )}

                    {item?.validated == '3' && (
                      <Tag
                        className="tag refuse"
                        color="transparent"
                        onClick={() => {
                          setDetailAttendanceSelected(item);
                          setIsView(true);
                          createExplation();
                        }}>
                        Từ chối
                      </Tag>
                    )}
                    {item?.validated == '2' && (
                      <Tag
                        className="tag validate"
                        color="transparent"
                        onClick={() => {
                          setDetailAttendanceSelected(item);
                          setIsView(true);
                          createExplation();
                        }}>
                        Đã duyệt
                      </Tag>
                    )}
                  </div>
                  <Divider dashed />
                </Space>
              </>
            );
          })}
        {/* Empty hacking */}
        <Space
          direction="vertical"
          className="explaintation-section"
          style={{ opacity: 0 }}>
          <Text strong className="label">
            Empty
          </Text>
        </Space>
        {/* -------------- */}
      </Space>

      {/* <Row gutter={24}>
        <div className="explaintation-wrapper-btn">
          <Button
            style={{ width: '100%', margin: '20px 0' }}
            className="shift-update-btn"
            type="primary"
            onClick={() => {
              createExplation();
              setIsCreating(true);
              setIsView(false);
            }}>
            Tạo giải trình
          </Button>
        </div>
      </Row> */}

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
        setSelectedTimeOut={setselectedTimeOut}
      />
    </React.Fragment>
  );
};

export default index;
