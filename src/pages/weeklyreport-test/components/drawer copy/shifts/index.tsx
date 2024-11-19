import {
  getListShifts,
  updateEmployeeSchedulingMore,
} from '@/api/weeklyreport-test/weeklyreport';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'antd/lib/grid';
import { Button, Form, Input, Space, Typography } from 'antd';
import './style.css';
import { setSelectedShifts, clearSelectedShifts } from '@/stores/shifts.store'; //clearSelectedShifts,
import { useDispatch, useSelector } from 'react-redux';
import { WarningOutlined } from '@ant-design/icons';
import {
  IUpdateAttendanceMoreContentArg,
  IUpdateAttendanceMoreContentParams,
  IUpdateAttendanceMoreParams,
  IUpdateSchedulingMoreResult,
  ShiftItemRes,
  WeeklyReportState,
} from '@/interface/weeklyreport-test/type';
import { formatDate } from '@/utils/formatDate';
import { setWeeklyData } from '@/stores/weekly.store';
import { setUpdateScheduleList } from '@/stores/update-schedule.store';
import { message as $message } from 'antd';
import { getShiftV2 } from '@/api/shift/shift.api';

interface shiftProps {
  setForceUpdate: any;
  forceUpdate: boolean;
  setForceUpdateShift: (value: boolean) => void;
  forceUpdateShift: boolean;
  currentTabIndex: number;
}
const index = (props: shiftProps) => {
  const { setForceUpdate, forceUpdate, forceUpdateShift, currentTabIndex,  } =
    props;
  const { Text } = Typography;
  // ========================
  // State
  // ========================
  const [listFixedShifts, setListFixedShifts] = useState<string[]>(
    JSON.parse(localStorage.getItem('fixedShift')!) ?? []
  );
  const [listRestShifts, setListRestShifts] = useState<string[]>(
    JSON.parse(localStorage.getItem('restShift')!) ?? []
  );
  const [listCoupleShifts, setListCoupleShifts] = useState<string[]>(
    JSON.parse(localStorage.getItem('coupleShift')!) ?? []
  );
  const [listMaintShifts, setListMaintShifts] = useState<string[]>(
    JSON.parse(localStorage.getItem('mainShift')!) ?? []
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredMainShifts, setFilteredMainShifts] = useState<string[]>([]);
  const [filteredRestShifts, setFilteredRestShifts] = useState<string[]>([]);
  const [filteredCoupleShifts, setFilteredCoupleShifts] = useState<string[]>(
    []
  );
  const [filteredFixedShifts, setFilteredFixedShifts] = useState<string[]>([]);
  // =========================
  // Selector
  // =========================
  const { selectedShift, message } = useSelector(state => state.shifts);

  const { date, employee_code, company } = useSelector(state => state.weekly);
  
  const { cellsActive } = useSelector(state => state.common);
  // =========================
  // Dispatch
  // =========================
  const dispatch = useDispatch();
  const initialShiftArgs = {
    name: '',
    page_size: 200,
    page: 1,
  };
  const _setSelectedShifts = (item: string) =>
    dispatch(setSelectedShifts(item));
  const _clearSelectedShifts = () => dispatch(clearSelectedShifts());
  const _setWeeklyData = (data: WeeklyReportState) =>
    dispatch(setWeeklyData(data));
  const _setUpdateScheduleList = (data: IUpdateSchedulingMoreResult[]) =>
    dispatch(setUpdateScheduleList(data));
  // =========================
  // Handler
  // =========================
  const getShiftsListAsync = useCallback(async () => {
    store.dispatch(
      setGlobalState({
        loading: true,
      })
    );
    const res = (await getShiftV2(initialShiftArgs)) as any;
    if (res) {
      localStorage.setItem('listShifts', JSON.stringify(res));
      store.dispatch(
        setGlobalState({
          loading: false,
        })
      );
      let fixedShift: any = [];
      let restShift: any = [];
      let mainShift: any = [];
      let coupleShift: any = [];
      res?.results?.data.map((item: any) => {
        if (item.name.includes('/')) {
          coupleShift.push(item.name);
        } else if (item.fix_rest_time) {
          fixedShift.push(item.name);
        } else if (item.rest_shifts) {
          restShift.push(item.name);
        } else {
          mainShift.push(item.name);
        }
      });
      setListFixedShifts(fixedShift);
      setListMaintShifts(mainShift);
      setListCoupleShifts(coupleShift);
      setListRestShifts(restShift);
      localStorage.setItem('fixedShift', JSON.stringify(fixedShift));
      localStorage.setItem('mainShift', JSON.stringify(mainShift));
      localStorage.setItem('coupleShift', JSON.stringify(coupleShift));
      localStorage.setItem('restShift', JSON.stringify(restShift));
      return res?.result?.data;
    }
  }, []);
  useEffect(() => {
    if (currentTabIndex === 2) {
      getShiftsListAsync();
    }
  }, [forceUpdateShift]);
  const getArrArgs = (_shifts_name: string) => {
    let temp: IUpdateAttendanceMoreContentArg[] = [];
    cellsActive.map(cell => {
      temp.push({
        employee_code: cell.code,
        date: formatDate(cell.date!).toString() ?? '',
        shift_name: _shifts_name,
        company: company,
      });
    });
    return [temp];
  };

  const handleSearchShift = () => {
    const filteredMainShifts = listMaintShifts.filter(item => {
      return item
        .toLowerCase()
        .includes(searchTerm.replace(/\s/g, '').toLowerCase());
    });

    const filteredRestShifts = listRestShifts.filter(item =>
      item.toLowerCase().includes(searchTerm.replace(/\s/g, '').toLowerCase())
    );
    const filteredFixedShifts = listFixedShifts.filter(item =>
      item.toLowerCase().includes(searchTerm.replace(/\s/g, '').toLowerCase())
    );
    const filteredCoupleShifts = listCoupleShifts.filter(item =>
      item.toLowerCase().includes(searchTerm.replace(/\s/g, '').toLowerCase())
    );
    setIsSearching(true);
    setFilteredMainShifts(filteredMainShifts);
    setFilteredRestShifts(filteredRestShifts);
    setFilteredFixedShifts(filteredFixedShifts);
    setFilteredCoupleShifts(filteredCoupleShifts);
  };

  const updateScheduleEmployeee = async (ignoreShift: boolean) => {
    let selectedShiftName = '';
    if (selectedShift.length == 2) {
      selectedShiftName = selectedShift.join('/');
    } else {
      selectedShiftName = selectedShift[0];
    }
    if (ignoreShift) {
      selectedShiftName = '';
    }
    const args: IUpdateAttendanceMoreContentArg[][] =
      getArrArgs(selectedShiftName);
    const params: IUpdateAttendanceMoreContentParams = {
      args,
    };
    const body: IUpdateAttendanceMoreParams = {
      params,
    };
    store.dispatch(
      setGlobalState({
        loading: true,
      })
    );
    const res = (await updateEmployeeSchedulingMore(body)) as any;
    if (res.result) {
      _setUpdateScheduleList(res.result);
      setForceUpdate(!forceUpdate);
      store.dispatch(
        setWeeklyData({
          shift_name: res.result[0].shift_name,
          date: res.result[0].date,
          employee_code: res.result[0].employee_code,
          rest_start: res.result[0].rest_start,
          rest_end: res.result[0].rest_end,
          total_shift_work_time: res.result[0].total_shift_work_time,
          total_work_time: res.result[0].total_work_time,
          holiday_start: res.result[0].holiday_start,
          holiday_end: res.result[0].holiday_end,
          employee_name: res.result[0].employee_name,
          resource_calendar: res.result[0].resource_calendar,
          attendance_attempt_1: res.result[0].attendance_attempt_1,
          attendance_attempt_2: res.result[0].attendance_attempt_2,
          attendance_attempt_3: res.result[0].attendance_attempt_3,
          attendance_attempt_4: res.result[0].attendance_attempt_4,
          attendance_attempt_5: res.result[0].attendance_attempt_5,
          attendance_attempt_6: res.result[0].attendance_attempt_6,
          attendance_attempt_7: res.result[0].attendance_attempt_7,
          attendance_attempt_8: res.result[0].attendance_attempt_8,
          attendance_attempt_9: res.result[0].attendance_attempt_9,
          attendance_attempt_10: res.result[0].attendance_attempt_10,
          attendance_attempt_11: res.result[0].attendance_attempt_11,
          attendance_attempt_12: res.result[0].attendance_attempt_12,
          attendance_attempt_13: res.result[0].attendance_attempt_13,
          attendance_attempt_14: res.result[0].attendance_attempt_14,
          attendance_attempt_15: res.result[0].attendance_attempt_15,
          last_attendance_attempt: res.result[0].last_attendance_attempt,
          missing_checkin_break: res.result[0].missing_checkin_break,
          department: res.result[0].department,
          id: res.result[0].id,
          company: res.result[0].company,
          job_title: res.result[0].job_title,
          time_keeping_code: res.result[0].time_keeping_code,
          shift_start: res.result[0].shift_start,
          shift_end: res.result[0].shift_end,
          leave_early: res.result[0].leave_early,
          attendance_late: res.result[0].attendance_late,
        })
      );
      store.dispatch(
        setGlobalState({
          loading: false,
        })
      );
      $message.success('Cập nhật thành công');
      _clearSelectedShifts();
    } else {
      $message.error(res.error.data.message ?? res.error.message);
    }
    console.log('forceUpdate in comp', forceUpdate);
  };

  const toggleActiveListShifts = (item: string) => {
    _setSelectedShifts(item);
  };
  // useEffect(() => {
  //   handleSearchShift();
  //   console.log('chekckkk22222222', isSearching);
  // }, [isSearching]);
  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
    if (e.target.value == '') {
      setIsSearching(!isSearching);
      // handleSearchShift();
    }
  };

  const handleKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchShift();
    }
  };

  // =============
  // Hooks

  // =============
  useEffect(() => {
    _clearSelectedShifts();
  }, []);
  const parseString = (str: string): [number | typeof Infinity, string] => {
    const match = str.match(/(\d+)([A-Za-z]+)/);
    return match ? [parseInt(match[1]), match[2]] : [Infinity, str];
  };

  return (
    <Space direction="vertical" className="shifts">
      {message && (
        <Text type="danger">
          {' '}
          <WarningOutlined color="red" /> {message}
        </Text>
      )}
      <Row gutter={24}>
        <Col span={50}>
          <Form.Item label={'Tìm kiếm ca'} name="shift">
            <Input
              size="middle"
              placeholder="Nhập từ khoá ca"
              value={searchTerm}
              onChange={handleChange}
              onKeyDown={handleKeyEnter}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Text strong className="title">
            Ca chính
          </Text>
        </Col>
        {(isSearching ? filteredMainShifts : listMaintShifts) &&
          (isSearching
            ? filteredMainShifts.length > 0
            : listMaintShifts.length > 0) &&
          (isSearching ? filteredMainShifts : listMaintShifts)
            .slice()
            .sort((a, b) => {
              return (
                parseString(a)[0] - parseString(b)[0] ||
                parseString(a)[1].localeCompare(parseString(b)[1])
              );
            })
            .reduce(
              (
                acc: Array<[number | typeof Infinity, string[]]>,
                item: string
              ) => {
                const lastGroup = acc[acc.length - 1];
                const [num, char] = parseString(item);

                if (!lastGroup || lastGroup[0] !== num) {
                  // Tạo một nhóm mới
                  acc.push([num, [item]]);
                } else {
                  // Thêm vào nhóm hiện tại
                  lastGroup[1].push(item);
                }

                return acc;
              },
              []
            )
            .map(([num, items], groupIndex) => (
              <Col span={24} key={groupIndex} style={{ marginBottom: '5px' }}>
                <Row gutter={24} style={{ margin: 0 }}>
                  {items.map((item, itemIndex) => (
                    <Col span={8} key={itemIndex}>
                      <Button
                        type={`${
                          selectedShift.includes(item) ? 'primary' : 'default'
                        }`}
                        onClick={() => toggleActiveListShifts(item)}>
                        {item}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Col>
            ))}
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <Text strong className="title">
            Ca nghỉ
          </Text>
        </Col>
        {(isSearching ? filteredRestShifts : listRestShifts) &&
          (isSearching
            ? filteredRestShifts.length > 0
            : listRestShifts.length > 0) &&
          (isSearching ? filteredRestShifts : listRestShifts)
            .slice()
            .sort((a, b) => {
              return (
                parseString(a)[0] - parseString(b)[0] ||
                parseString(a)[1].localeCompare(parseString(b)[1])
              );
            })
            .reduce(
              (
                acc: Array<[number | typeof Infinity, string[]]>,
                item: string
              ) => {
                const lastGroup = acc[acc.length - 1];
                const [num, char] = parseString(item);

                if (!lastGroup || lastGroup[0] !== num) {
                  // Tạo một nhóm mới
                  acc.push([num, [item]]);
                } else {
                  // Thêm vào nhóm hiện tại
                  lastGroup[1].push(item);
                }

                return acc;
              },
              []
            )
            .map(([num, items], groupIndex) => (
              <Col span={24} key={groupIndex} style={{ marginBottom: '5px' }}>
                <Row gutter={24} style={{ margin: 0 }}>
                  {items.map((item, itemIndex) => (
                    <Col span={8} key={itemIndex}>
                      <Button
                        type={`${
                          selectedShift.includes(item) ? 'primary' : 'default'
                        }`}
                        onClick={() => toggleActiveListShifts(item)}>
                        {item}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Col>
            ))}
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Text strong className="title">
            Ca gãy
          </Text>
        </Col>
        {(isSearching ? filteredFixedShifts : listFixedShifts) &&
          (isSearching
            ? filteredFixedShifts.length > 0
            : listFixedShifts.length > 0) &&
          (isSearching ? filteredFixedShifts : listFixedShifts)
            .slice()
            .sort((a, b) => {
              return (
                parseString(a)[0] - parseString(b)[0] ||
                parseString(a)[1].localeCompare(parseString(b)[1])
              );
            })
            .reduce(
              (
                acc: Array<[number | typeof Infinity, string[]]>,
                item: string
              ) => {
                const lastGroup = acc[acc.length - 1];
                const [num, char] = parseString(item);

                if (!lastGroup || lastGroup[0] !== num) {
                  // Tạo một nhóm mới
                  acc.push([num, [item]]);
                } else {
                  // Thêm vào nhóm hiện tại
                  lastGroup[1].push(item);
                }

                return acc;
              },
              []
            )
            .map(([num, items], groupIndex) => (
              <Col span={24} key={groupIndex} style={{ marginBottom: '5px' }}>
                <Row gutter={24} style={{ margin: 0 }}>
                  {items.map((item, itemIndex) => (
                    <Col span={8} key={itemIndex}>
                      <Button
                        type={`${
                          selectedShift.includes(item) ? 'primary' : 'default'
                        }`}
                        onClick={() => toggleActiveListShifts(item)}>
                        {item}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Col>
            ))}
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Text strong className="title">
            Ca ghép
          </Text>
        </Col>
        {(isSearching ? filteredCoupleShifts : listCoupleShifts) &&
          (isSearching
            ? filteredCoupleShifts.length > 0
            : listCoupleShifts.length > 0) &&
          (isSearching ? filteredCoupleShifts : listCoupleShifts)
            .slice()
            .sort((a, b) => {
              return (
                parseString(a)[0] - parseString(b)[0] ||
                parseString(a)[1].localeCompare(parseString(b)[1])
              );
            })
            .reduce(
              (
                acc: Array<[number | typeof Infinity, string[]]>,
                item: string
              ) => {
                const lastGroup = acc[acc.length - 1];
                const [num, char] = parseString(item);

                if (!lastGroup || lastGroup[0] !== num) {
                  // Tạo một nhóm mới
                  acc.push([num, [item]]);
                } else {
                  // Thêm vào nhóm hiện tại
                  lastGroup[1].push(item);
                }

                return acc;
              },
              []
            )
            .map(([num, items], groupIndex) => (
              <Col span={24} key={groupIndex} style={{ marginBottom: '5px' }}>
                <Row gutter={24} style={{ margin: 0 }}>
                  {items.map((item, itemIndex) => (
                    <Col span={8} key={itemIndex}>
                      <Button
                        type={`${
                          selectedShift.includes(item) ? 'primary' : 'default'
                        }`}
                        onClick={() => toggleActiveListShifts(item)}>
                        {item}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Col>
            ))}
      </Row>
      <Row gutter={24} style={{ marginBottom: 60 }}></Row>
      <Row gutter={24}>
        <div className="shift-wrapper-btn">
          <Button
            style={{ width: '50%', marginTop: 20 }}
            className="shift-update-btn"
            type="primary"
            disabled={cellsActive.length === 0}
            onClick={() => updateScheduleEmployeee(true)}>
            Bỏ ca
          </Button>
          <Button
            disabled={selectedShift.length === 0 || cellsActive.length === 0}
            style={{ width: '50%', marginTop: 20 }}
            className="shift-update-btn"
            type="primary"
            onClick={() => updateScheduleEmployeee(false)}>
            Cập nhật
          </Button>
        </div>
      </Row>
    </Space>
  );
};

export default index;
