interface EmployeeAllocation {
  code: string;
  workingday: string;
}
import MyPage from '@/components/business/page';
import './styles.css';
import { Col, Divider, Row, Card, Space, Select, Button, Tag } from 'antd';
import PinIcon from '../component/iconComponent/PinIcon';
import MoreIcon from '../component/iconComponent/MoreIcon';
import Chart from '../component/iconComponent/Chart';
import ChartUp from '../component/iconComponent/ChartUp';
import NotiIcon from '../component/iconComponent/NotiIcon';
import BellRed from '../component/iconComponent/bellRed';
import BellGreen from '../component/iconComponent/bellGreen';
import { mobileResponsive } from '@/utils/mobileResponsive';
import dayjs from 'dayjs';
import { RiArrowDownSFill } from 'react-icons/ri';
import { useState, useEffect, useCallback } from 'react';
import {
  getEmployeeDashBoard_mis,
  getEmployeeweeklyreport_mis,
  getRemainingAlClDashBoard,
} from '../../../api/dashboard/employee';
import {
  getAttendanceDuplicate,
  getLeaveDashBoard,
  getMissingLeaveInfo,
} from '@/api/dashboard/leave';
import { getListEmployeeV2AllocationCurrent } from '@/api/employee/employee.api';
import { format } from 'date-fns';
import { getAttendanceReport } from '@/api/weeklyreport/weeklyreport';
import {
  IGetAttendanceContentParams,
  IGetAttendanceParams,
} from '@/interface/weeklyreport/type';
import { setGlobalState } from '@/stores/global.store';
import { transformObject } from '@/utils/common';
import { useDispatch } from 'react-redux';
import { setListAttendance } from '@/stores/list-attendance-report.store';
import store from '@/stores';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { startOfMonth, endOfMonth, subDays } from 'date-fns';
import {
  getHolidayLeavesDashboard,
  holidayLeavesArgs,
} from '@/api/holidayLeaves/holiday.leave.api';
import { IHolidayLeaves } from '@/api/holidayLeaves/transform';
interface Employee {
  id: number;
  name: string;
  birthday: string;
}

interface ROOMMEETING {
  id: number;
  name: string;
  start_date: string;
  to_date: string;
  req_date: string;
  purpose: string;
  state: string;
}
interface Employee {
  id: number;
  key: string;
  index: string;
  name: string;
  employeeCode: string;
  company: string;
  missingInfo: string[];
}
const index = () => {
  const { Item: SearchItem } = MyPage.MySearch;
  const { isMobile } = mobileResponsive();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [countRequestt, setDataCountRequestt] = useState<string[]>([]);
  const [birthDays, setBirthDays] = useState<string[]>([]);
  const [invalid, setInvalid] = useState('');
  const [contractTotal, setContractTotal] = useState();
  const [contractDraft, setContractDraft] = useState();
  const [contractEmployee, setContractEmployee] = useState();
  const [contractDateEndEmployee, setContractDateEndEmployee] = useState();
  const [totalLeaveRefuse, setTotalLeaveRefuse] = useState();
  const [totalLeaveEmployee, setTotalLeaveEmployee] = useState();
  const [totalLeaveEmployeeRefuse, setTotalLeaveEmployeeRefuse] = useState();
  const [totalLeaveEmployeeConfirm, setTotalLeaveEmployeeConfirm] = useState();
  const [totalLeaveEmployeeValidate, setTotalLeaveEmployeeValidate] =
    useState();
  const [totalInvalidEmployee, setTotalInvalidEmployee] = useState();
  const [totalInvalidEmployeeRefuse, setTotalInvalidEmployeeRefuse] =
    useState();
  const [totalInvalidEmployeeConfirm, setTotalInvalidEmployeeConfirm] =
    useState();
  const [totalInvalidEmployeeValidate, setTotalInvalidEmployeeValidate] =
    useState();
  const [totalEmployee, setTotalEmployee] = useState();
  const [totalEmployeeFemale, setTotalEmployeeFemale] = useState();
  const [totalEmployeeMale, setTotalEmployeeMale] = useState();
  const [dataAl, setDataAl] = useState();
  const [dataCl, setDataCl] = useState();
  const [workingDay, setWorkingDay] = useState<string[]>([]);

  const [data, setData] = useState<any>(null);
  const [headDepartment, setHeadDepartment] = useState<any>(null);
  const [admin, setAdministrative] = useState<any>(null);
  const dispatch = useDispatch();
  const _setListAttendance = (data: any) => dispatch(setListAttendance(data));
  const [dataAttendant, setDataAttendant] = useState<any>(null);
  const [totalWorkTime, setTotalWorkTime] = useState(0);
  const [groupedMeetings, setGroupedMeetings] = useState<Record<string, any>>(
    {}
  );
  const [bellDisplayed, setBellDisplayed] = useState(false);
  const [hoveredEmployee, setHoveredEmployee] = useState<any>(null);
  const [missingInfoEmployees, setMissingInfoEmployees] = useState<any>([]);
  const [missingEmployeeweeklyreport, setMissingEmployeeweeklyreport] =
    useState<any>([]);
  const [visibleReports, setVisibleReports] = useState(10);

  const [attendanceDuplicate, setAttendanceDuplicate] = useState<any>([]);
  const [missingLeaveInfo, setMissingLeaveInfo] = useState<any>([]);
  const [total_records, setTotal_records] = useState<any>([]);
  const [total_records2, setTotal_records2] = useState<any>([]);
  const [total_records_Leave, setTotal_records_Leave] = useState<any>([]);
  const [page, setPage] = useState({ pageSize: 10, pageNumber: 1 });
  const [page2, setPage2] = useState({ pageSize: 10, pageNumber: 1 });
  const [page3, setPage3] = useState({ pageSize: 10, pageNumber: 1 });
  const [holiday, setHoliday] = useState<IHolidayLeaves[]>([]);
  const [loading, setLoading] = useState(false);
  const todayMinus10Days = subDays(new Date(), 10);
  const initialStartDate = format(startOfMonth(todayMinus10Days), 'yyyy-MM-dd');
  const initialEndDate = format(endOfMonth(todayMinus10Days), 'yyyy-MM-dd');

  const [dateRange, setDateRange] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate,
  });
  const [dateRange2, setDateRange2] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate,
  });

  const [changeMonth, setChangeMonth] = useState('');
  const [changeMonth2, setChangeMonth2] = useState('');
  const [changeMonth3, setChangeMonth3] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedMonth2, setSelectedMonth2] = useState('');

  useEffect(() => {
    // Lấy ngày hôm nay trừ đi 10 ngày
    const todayMinus10Days = subDays(new Date(), 10);

    // Lấy tháng của ngày đã trừ đi 10 ngày
    const month = format(todayMinus10Days, 'MM');
    // Đặt giá trị vào state
    setSelectedMonth2(month);
    setSelectedMonth(month);
  }, []);

  const getAttendance = useCallback(async () => {
    try {
      const currentDate = moment(); // Lấy thời gian hiện tại
      const fromDate = currentDate.startOf('month').format('DD/MM/YYYY'); // Thời gian bắt đầu của tháng hiện tại
      const toDate = currentDate.endOf('month').format('DD/MM/YYYY');

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
          console.log(formattedObject);
          store.dispatch(setGlobalState({ loading: false }));
        } else {
          console.log('Lỗi rồi!^^');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!dataAttendant) {
      getAttendance();
    }
  }, [dataAttendant]);

  const calculateTotalWorktime = (dataAttendant: any) => {
    let totalWorktime = 0;
    if (dataAttendant && dataAttendant[0]?.children) {
      dataAttendant[0]?.children.forEach((child: any) => {
        for (const key in child) {
          if (
            key.match(/\d{4}-\d{2}-\d{2}/) &&
            child[key]?.actual_total_work_time
          ) {
            console.log('DATA', child[key]?.actual_total_work_time);
            totalWorktime += child[key]?.actual_total_work_time;
          }
        }
      });
    }
    return (totalWorktime / 480).toFixed(3);
  };

  //lấy thông tin ngày nghỉ lễ
  useEffect(() => {
    const handleGetHoliday = async () => {
      const param: holidayLeavesArgs = {
        name: '',
        company_id: '',
        page_size: page3.pageSize,
        page: page3.pageNumber,
        month: +changeMonth3,
      };
      try {
        const data = await getHolidayLeavesDashboard(param);

        if (data) {
          setHoliday(data?.results.data || []);
        }
      } catch (error) {}
    };
    handleGetHoliday();
  }, [page3.pageSize, changeMonth3]);

  //loadmore ngày lễ
  const handleLoadMore = async () => {
    setPage3(prevPage => ({
      ...prevPage,
      pageSize: prevPage.pageSize + 10,
    }));
  };

  useEffect(() => {
    if (dataAttendant) {
      const calculatedTotalWorkHours = calculateTotalWorktime(dataAttendant);
      setTotalWorkTime(Number(calculatedTotalWorkHours));
    }
  }, [dataAttendant]);
  const administrative = localStorage.getItem('is_administrative');

  const general_manage = localStorage.getItem('is_general_manager');
  const head_of_department = localStorage.getItem('is_head_of_department');
  useEffect(() => {
    if (general_manage && head_of_department && administrative) {
      setData(JSON.parse(general_manage));
      setHeadDepartment(JSON.parse(head_of_department));
      setAdministrative(JSON.parse(administrative));
    }
  }); // Remove empty array here

  function getCurrentDate(): string {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
  }
  const currentDate = getCurrentDate();

  const leaveFetch = async () => {
    try {
      const leaveDashboardData = await getLeaveDashBoard();

      if (leaveDashboardData) {
        const listEmployee = leaveDashboardData?.results.employeeResult.result;
        const listRoomMeeting = leaveDashboardData?.results.roomMeetingResult;
        const LISTEMPLOYEE: Employee[] = listEmployee;
        const LISTROOMMEETING: ROOMMEETING[] = listRoomMeeting?.meeting_room;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();

        const filteredEmployees = LISTEMPLOYEE?.filter((employee: any) => {
          const name = employee?.employee_name;
          const employeeDate = new Date(employee.birthday);
          const employeeMonth = employeeDate.getMonth() + 1;
          const employeeDay = employeeDate.getDate();

          return (
            employee.birthday &&
            employeeMonth === currentMonth &&
            employeeDay === currentDay &&
            name
          );
        });

        filteredEmployees?.forEach((employee: any) => {
          const birthDay = `${employee.employee_name} - Khối ${
            employee.department_name
          } - Ngày ${new Date(employee.birthday).toLocaleDateString('en-GB')}`;
          setBirthDays(prevBirthDays => [...prevBirthDays, birthDay]);
        });

        const filteredRoomMeeting = LISTROOMMEETING?.reverse()?.filter(
          (roomMeeting: any) => {
            const name = roomMeeting?.name;
            const purpose = roomMeeting?.purpose;
            const reqDate = roomMeeting.req_date;
            const startDate = roomMeeting.start_date;
            const toDate = roomMeeting.to_date;
            const state = roomMeeting.state;

            const bellColor = () => {
              if (state === 'confirm') {
                return <BellGreen />;
              } else if (state === 'waiting') {
                return <BellRed />;
              } else if (moment(toDate).isBefore(moment())) {
                setBellDisplayed(true);
                return <NotiIcon />;
              }
            };

            return (
              (name && purpose && reqDate && startDate && toDate && state && (
                <div>{!bellDisplayed && bellColor()}</div>
              )) ||
              ''
            );
          }
        );

        const groupedMeetingsData: Record<string, any> = {};
        filteredRoomMeeting?.forEach((roomMeeting: any) => {
          const name = roomMeeting.name;
          if (!groupedMeetingsData[name]) {
            groupedMeetingsData[name] = [];
          }
          groupedMeetingsData[name].push(roomMeeting);
        });
        setGroupedMeetings(groupedMeetingsData);

        setContractTotal(
          leaveDashboardData?.results?.contractResult.total_contract_draft
        );
        setContractDraft(
          leaveDashboardData?.results?.contractResult.total_contract_almost
        );

        setTotalEmployee(
          leaveDashboardData?.results?.employeeResult.total_employee
        );

        setTotalEmployeeFemale(
          leaveDashboardData?.results?.employeeResult.total_employee_female
        );
        setTotalEmployeeMale(
          leaveDashboardData?.results?.employeeResult.total_employee_male
        );
        setDataCountRequestt(leaveDashboardData.results?.total);

        setTotalLeaveRefuse(leaveDashboardData.results?.totalLeave);

        setInvalid(leaveDashboardData.results?.invalidTimesheetResult);

        setContractEmployee(
          leaveDashboardData?.results?.detailsContractEmployee
            .details_contract_employee[0]?.contract_type_id
        );
        setContractDateEndEmployee(
          leaveDashboardData?.results?.detailsContractEmployee
            .details_contract_employee[0]?.date_end
        );

        setTotalLeaveEmployee(
          leaveDashboardData.results?.totalLeaveEmployee?.total_leave
        );
        setTotalLeaveEmployeeRefuse(
          leaveDashboardData.results?.totalLeaveEmployee?.total_leave_refuse
        );
        setTotalLeaveEmployeeConfirm(
          leaveDashboardData.results?.totalLeaveEmployee?.total_leave_confirm
        );
        setTotalLeaveEmployeeValidate(
          leaveDashboardData.results?.totalLeaveEmployee?.total_leave_validate
        );

        setTotalInvalidEmployee(
          leaveDashboardData.results?.invalidTimesheetResultEmployee
            ?.total_invalid_timesheet
        );
        setTotalInvalidEmployeeRefuse(
          leaveDashboardData.results?.invalidTimesheetResultEmployee
            ?.invalid_timesheet_validate_employee
        );
        setTotalInvalidEmployeeConfirm(
          leaveDashboardData.results?.invalidTimesheetResultEmployee
            ?.invalid_timesheet_refuse_employee
        );
        setTotalInvalidEmployeeValidate(
          leaveDashboardData.results?.invalidTimesheetResultEmployee
            ?.invalid_timesheet_confirm_employee
        );
        console.log(leaveDashboardData.results?.totalLeaveEmployee);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const employee_id = localStorage.getItem('employee_id');
  const employeeCurrent = async () => {
    try {
      const data = await getListEmployeeV2AllocationCurrent();

      if (
        sub_admin_role === 'recruitment' ||
        sub_admin_role === 'administration'
      ) {
        if (data && data.result && data.result.result) {
          const checkId = data.result.result.filter(
            (item: any) => item.id == employee_id
          );
          if (checkId) {
            setWorkingDay(
              Object.entries(checkId).map(([key, value]: any) => {
                if (typeof value === 'object' && value !== null) {
                  localStorage.setItem(
                    'employeeCode',
                    (value as EmployeeAllocation)?.code
                  );
                  const typedValue: any = value;
                  return typedValue.workingday;
                }
                return null;
              })
            );
          }
        }
      } else {
        if (data && data.result && data.result.result) {
          const checkId = data.result.result.filter(
            (item: any) => item.id == employee_id
          );
          const codeEmployee2 = checkId[0]?.code;
          if (checkId) {
            setWorkingDay(
              Object.entries(checkId).map(([key, value]: any) => {
                if (typeof value === 'object' && value !== null) {
                  localStorage.setItem('employeeCode', codeEmployee2);
                  const typedValue: any = value;
                  return typedValue.workingday;
                }
                return null;
              })
            );
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const employeeCode = localStorage.getItem('employeeCode');
  const remainingALCLDashBoard = async () => {
    try {
      const companyName = localStorage.getItem('company_name');

      const result = await getRemainingAlClDashBoard(
        { remaining_cl: 0, remaining_leave: 0 },
        employeeCode || '',
        companyName || ''
      );
      if (result) {
        setDataAl(result.results.data.remaining_leave);
        setDataCl(result.results.data.remaining_cl);
      }
    } catch (error) {
      console.error('Error fetching ALCL', error);
    }
  };
  function calculateWorkingDays(specificDate: string) {
    const specificDateObj = new Date(specificDate);
    const currentDate = new Date();

    let workingDays = 0;
    let date = new Date(specificDateObj); // Tạo một bản sao của specificDateObj để không ảnh hưởng đến biến gốc

    while (date <= currentDate) {
      workingDays++;
      date.setDate(date.getDate() + 1); // Tăng ngày lên 1
    }

    return workingDays;
  }
  const workingDays = calculateWorkingDays(workingDay[0]);
  useEffect(() => {
    employeeCurrent();
    leaveFetch();
    setTimeout(() => remainingALCLDashBoard(), 1000);
  }, []);
  function getWeekOfMonth(date: any) {
    var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    var firstDayOfFifthWeek = new Date(firstDayOfMonth);
    firstDayOfFifthWeek.setDate(firstDayOfMonth.getDate() + 28);
    if (date >= firstDayOfFifthWeek) {
      return 5;
    } else {
      var firstDayOfWeek = firstDayOfMonth.getDay();
      var weekOfMonth = Math.ceil((date.getDate() + firstDayOfWeek) / 7);
      return weekOfMonth;
    }
  }
  const currentDatee = new Date();

  var weekOfMonth = getWeekOfMonth(currentDatee);

  useEffect(() => {
    const handleData_missingInfo = async () => {
      setLoading(true);
      const data = await getEmployeeDashBoard_mis(
        page.pageSize,
        page.pageNumber
      );
      if (data) {
        setLoading(false);
        setMissingInfoEmployees(data?.results?.data);
        setTotal_records(data?.results);
      }
    };
    if (administrative === 'true') {
      handleData_missingInfo();
    }
  }, [page.pageSize]);

  useEffect(() => {
    const handleEmployeeweeklyreport_missing = async () => {
      setLoading(true);
      const data = await getEmployeeweeklyreport_mis();
      if (data) {
        setLoading(false);
        setMissingEmployeeweeklyreport(data?.results?.data);
      }
    };
    handleEmployeeweeklyreport_missing();
  }, [page.pageSize]);
  const handleClickLoadmoreEmployeeweeklyreport_missing = () => {
    setVisibleReports(prevVisible => prevVisible + 10);
  };
  const handleClick = () => {
    setPage(prevPage => ({
      ...prevPage,
      pageSize: prevPage.pageSize + 10,
    }));
  };

  useEffect(() => {
    const handleAttendanceDuplicate = async () => {
      setLoading(true);
      const convertData = {
        startDate: dateRange2.startDate,
        endDate: dateRange2.endDate,
      };
      const data = await getAttendanceDuplicate(convertData);
      if (data) {
        setLoading(false);
        setAttendanceDuplicate(data?.results?.data);
        setTotal_records2(data?.results);
      }
    };
    handleAttendanceDuplicate();
  }, [changeMonth2]);

  useEffect(() => {
    const handleLeave_missingInfo = async () => {
      const convertData = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        page_size: page2.pageSize,
        page: page2.pageNumber,
      };
      setLoading(true);
      const data = await getMissingLeaveInfo(convertData);
      if (data) {
        setLoading(false);
        setMissingLeaveInfo(data?.results?.data);
        setTotal_records_Leave(data?.results);
      }
    };
    handleLeave_missingInfo();
  }, [page2.pageSize, changeMonth]);
  const handleClickMissingLeaveInfo = () => {
    setPage2(prevPage => ({
      ...prevPage,
      pageSize: prevPage.pageSize + 10,
    }));
  };
  const option = [
    { lable: '01', value: '01' },
    { lable: '02', value: '02' },
    { lable: '03', value: '03' },
    { lable: '04', value: '04' },
    { lable: '05', value: '05' },
    { lable: '06', value: '06' },
    { lable: '07', value: '07' },
    { lable: '08', value: '08' },
    { lable: '09', value: '09' },
    { lable: '10', value: '10' },
    { lable: '11', value: '11' },
    { lable: '12', value: '12' },
  ];

  const option2 = [
    { lable: '1', value: '1' },
    { lable: '2', value: '2' },
    { lable: '3', value: '3' },
    { lable: '4', value: '4' },
    { lable: '5', value: '5' },
    { lable: '6', value: '6' },
    { lable: '7', value: '7' },
    { lable: '8', value: '8' },
    { lable: '9', value: '9' },
    { lable: '10', value: '10' },
    { lable: '11', value: '11' },
    { lable: '12', value: '12' },
  ];
  const handleChangeMonth = (value: any) => {
    setChangeMonth(value);
    const year = dayjs().year();
    const startDate = dayjs(`${year}-${value}-01`)
      .startOf('month')
      .format('YYYY-MM-DD');
    const endDate = dayjs(`${year}-${value}-01`)
      .endOf('month')
      .format('YYYY-MM-DD');

    setDateRange({ startDate, endDate });
  };

  const handleChangeMonth2 = (value: any) => {
    setChangeMonth2(value);
    const year = dayjs().year();
    const startDate = dayjs(`${year}-${value}-01`)
      .startOf('month')
      .format('YYYY-MM-DD');
    const endDate = dayjs(`${year}-${value}-01`)
      .endOf('month')
      .format('YYYY-MM-DD');

    setDateRange2({ startDate, endDate });
  };

  const handleChangeMonth3 = (value: any) => {
    setChangeMonth3(value);
  };

  const almost = 'almost';
  const draft = 'draft';
  const confirm = 'confirm';
  const waiting = '1';

  return (
    <>
      {data || headDepartment || admin ? (
        <div style={customStyles.heightFull} className="container">
          <Divider orientation="left" style={customStyles.size24}>
            BÁO CÁO NHÂN SỰ - HRM
          </Divider>
          {isMobile ? (
            <Row
              style={{
                ...customStyles.heightFull,
              }}>
              <Col
                style={{
                  ...customStyles.container,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-betweet',
                  gap: '8px',
                }}
                className="gutter-row"
                xs={24}
                sm={24}
                md={24}>
                <div style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                  <div
                    style={{
                      padding: '10px',
                      borderRadius: '10px 10px 0 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      backgroundColor: '#F2844F',
                    }}>
                    <h3
                      style={{
                        ...customStyles.size18Weight500,
                        margin: 0,
                        color: '#FFFFFF',
                      }}>
                      Chúc mừng sinh nhật tháng {currentMonth} !
                    </h3>
                    <div>
                      <MoreIcon color="white" />
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '6px 12px 12px 12px',
                    }}>
                    <div style={customStyles.size12Weight700}>
                      Tuần {weekOfMonth}
                    </div>
                    <div style={{ ...customStyles.bg, padding: '6px 12px' }}>
                      {birthDays.length > 0 ? (
                        birthDays.map((birthday, index) => (
                          <div style={{ marginBottom: '10px' }} key={index}>
                            <div style={customStyles.size16Weight400}>
                              {birthday}
                            </div>
                            <div style={{ fontSize: '10px', color: '#686868' }}>
                              Hôm nay {currentDate}
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div style={customStyles.size16Weight400}>
                            Không có sinh nhật trong ngày
                          </div>
                          <div style={{ fontSize: '10px', color: '#686868' }}>
                            Hôm nay {currentDate}
                          </div>
                        </>
                      )}
                    </div>
                    <div></div>
                  </div>
                </div>
              </Col>
              <Col
                style={(customStyles.container, customStyles.px)}
                className="gutter-row"
                xs={24}>
                <Row gutter={16}>
                  <Col style={customStyles.card} xs={24}>
                    <Card
                      style={{
                        ...customStyles.border,
                        width: '100%',
                        height: '100%',
                      }}>
                      <div style={{ ...customStyles.flex, height: '100%' }}>
                        <div>
                          <div style={customStyles.size18Weight500}>
                            Tổng nhân sự
                          </div>
                          <div style={customStyles.number}>{totalEmployee}</div>
                          <div style={customStyles.size12Weight400}>
                            {totalEmployeeMale} Nam
                          </div>
                          <div style={customStyles.size12Weight400}>
                            {totalEmployeeMale} Nữ
                          </div>
                        </div>
                        <div>
                          <div>
                            <ChartUp />
                          </div>
                          <div
                            style={{
                              backgroundColor: '#FFEFE7',
                              borderRadius: '4px',
                              padding: '0 10px',
                              whiteSpace: 'nowrap',
                            }}>
                            +5% Tháng trước
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col style={customStyles.card} xs={24}>
                    <Card style={customStyles.bg}>
                      <Link
                        to={`/contract?state=${almost}`}
                        style={customStyles.linkRequest}>
                        <div className="flex-mb">
                          <div style={customStyles.size18Weight500}>
                            Sắp hết hạn
                          </div>
                          <div style={customStyles.size48Weight500}>
                            {contractDraft}
                          </div>
                          <div
                            style={{
                              ...customStyles.size16Weight400,
                              color: '#FF5151',
                            }}></div>
                        </div>
                      </Link>
                    </Card>
                  </Col>
                  <Col style={customStyles.card} xs={24}>
                    <Card style={customStyles.bgNew}>
                      <Link
                        to={`/contract?state=${draft}`}
                        style={customStyles.linkRequest}>
                        <div className="flex-mb">
                          <div style={customStyles.size18Weight500}>
                            Hợp đồng mới
                          </div>
                          <div style={customStyles.size48Weight500}>
                            {contractTotal}
                          </div>
                          <div
                            style={{
                              ...customStyles.size16Weight400,
                              color: '#3786F1',
                            }}></div>
                        </div>
                      </Link>
                    </Card>
                  </Col>
                  <Col style={customStyles.card} xs={24}>
                    <Card
                      style={{
                        ...customStyles.bgExplanation,
                        ...customStyles.flex,
                      }}>
                      <Link
                        to={`/explanationrequest?state=${waiting}`}
                        style={customStyles.linkRequest}>
                        <div className="flex-mb">
                          <div style={customStyles.size18Weight500}>
                            Giải trình chờ duyệt
                          </div>
                          <div
                            className="py-16"
                            style={customStyles.size48Weight500}>
                            {invalid}
                          </div>

                          <div
                            style={{
                              ...customStyles.size16Weight400,
                              color: '#EE61CF',
                            }}></div>
                        </div>
                      </Link>
                    </Card>
                  </Col>
                  <Col style={customStyles.card} xs={24}>
                    <Card
                      style={{
                        ...customStyles.border,
                        width: '100%',
                        height: '100%',
                      }}>
                      <Link
                        to={`/applicationlist?state=${confirm}`}
                        style={customStyles.linkRequest}>
                        <div style={{ ...customStyles.flex, height: '100%' }}>
                          <div>
                            <div style={customStyles.size18Weight500}>
                              Đơn chờ duyệt
                            </div>
                            <div
                              className="py-16"
                              style={customStyles.size48Weight500}>
                              {totalLeaveRefuse && totalLeaveRefuse}
                            </div>
                            <div>
                              {Object.values(countRequestt)
                                ?.slice(0, 2)
                                .map((result: any) => (
                                  <div
                                    style={{
                                      ...customStyles.subText,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'normal',
                                    }}
                                    key={result.time_off_type}>
                                    {result.total} {result.time_off_type}...
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div>
                            <div>
                              <Chart />
                            </div>
                            <div
                              style={{
                                backgroundColor: '#FFEFE7',
                                borderRadius: '4px',
                                padding: '0 10px',
                                whiteSpace: 'nowrap',
                              }}>
                              +5% Tháng trước
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  </Col>
                </Row>
                <div
                  style={{
                    padding: '0 12px 2px 12px',
                    backgroundColor: 'white',
                  }}>
                  <div
                    style={{
                      ...customStyles.flex,
                      padding: '12px 0',
                      backgroundColor: 'white',
                    }}>
                    <div style={customStyles.size18Weight500}>
                      Đặt lịch phòng họp
                    </div>
                    <SearchItem
                      style={{ margin: '0' }}
                      name="date"
                      type="date-picker"
                      innerprops={{
                        allowClear: true,
                        placeholder: 'Ngày gửi báo cáo',
                        format: 'DD/MM/YYYY',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      ...customStyles.subText,
                      overflowY: 'auto',
                      height: '420px',
                    }}>
                    {Object.keys(groupedMeetings)?.length > 0 ? (
                      Object.keys(groupedMeetings)?.map((roomName, index) => (
                        <div key={index}>
                          <div style={{ marginBottom: '10px' }}>
                            <div style={customStyles.size16Weight400}>
                              {roomName}
                            </div>
                          </div>
                          {groupedMeetings[roomName].map(
                            (meeting: any, meetingIndex: any) => (
                              <div
                                style={{ marginBottom: '10px' }}
                                key={meetingIndex}>
                                <Button
                                  style={{
                                    margin: '8px 0',
                                    height: '80px',
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}>
                                  <div>
                                    <div
                                      style={{
                                        ...customStyles.size16Weight400,
                                        textAlign: 'left',
                                      }}>
                                      {meeting.purpose}
                                    </div>
                                    <div>
                                      {moment(meeting.start_date).format(
                                        'DD/MM/YYYY HH:mm'
                                      )}
                                      -{moment(meeting.to_date).format('HH:mm')}
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', gap: '20px' }}>
                                    {/* Kiểm tra xem thời gian hiện tại có quá thời gian kết thúc của cuộc họp không */}
                                    {moment().isAfter(
                                      moment(meeting.to_date)
                                    ) ? (
                                      <div>
                                        <NotiIcon />
                                      </div>
                                    ) : meeting.state === 'confirm' ? (
                                      <div>
                                        <BellGreen />
                                      </div>
                                    ) : meeting.state === 'waiting' ? (
                                      <div>
                                        <BellRed />
                                      </div>
                                    ) : null}
                                    <div>
                                      <MoreIcon />
                                    </div>
                                  </div>
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      ))
                    ) : (
                      <>
                        <div style={customStyles.size16Weight400}>
                          Không có phòng họp
                        </div>
                      </>
                    )}
                  </div>
                  <Link
                    to="/bookingmeetingroom"
                    style={{ textDecoration: 'none' }}>
                    <Button
                      className="btn_more"
                      style={{
                        width: '100%',
                        margin: '0',
                        color: '#FF5151',
                        backgroundColor: '#FFEFE7',
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px',
                      }}>
                      Xem thêm
                    </Button>
                  </Link>
                </div>
              </Col>
            </Row>
          ) : (
            <Row
              style={{
                ...customStyles.heightFull,
              }}>
              <Col
                style={(customStyles.container, customStyles.px)}
                className="gutter-row"
                xs={24}
                lg={16}>
                <Row style={{ height: '354px' }} gutter={16}>
                  <Col style={customStyles.card} xs={24} sm={24} md={12} lg={8}>
                    <Card style={customStyles.bg}>
                      <Link
                        to={`/contract?state=${almost}`}
                        style={customStyles.linkRequest}>
                        <div className="flex">
                          <div style={customStyles.size18Weight500}>
                            Sắp hết hạn
                          </div>
                          <div style={customStyles.size48Weight500}>
                            {contractDraft}
                          </div>
                          <div
                            style={{
                              ...customStyles.size16Weight400,
                              color: '#FF5151',
                            }}>
                            {/* Tháng {currentMonth}/{currentYear} */}
                          </div>
                        </div>
                      </Link>
                    </Card>
                  </Col>
                  <Col style={customStyles.card} xs={24} sm={24} md={12} lg={8}>
                    <Card style={customStyles.bgNew}>
                      <Link
                        to={`/contract?state=${draft}`}
                        style={customStyles.linkRequest}>
                        <div className="flex">
                          <div style={customStyles.size18Weight500}>
                            Hợp đồng mới
                          </div>
                          <div style={customStyles.size48Weight500}>
                            {contractTotal}
                          </div>
                          <div
                            style={{
                              ...customStyles.size16Weight400,
                              color: '#3786F1',
                            }}></div>
                        </div>
                      </Link>
                    </Card>
                  </Col>
                  <Col style={customStyles.card} xs={24} sm={24} md={12} lg={8}>
                    <Card
                      style={{
                        ...customStyles.bgExplanation,
                        ...customStyles.flex,
                      }}>
                      <Link
                        to={`/explanationrequest?state=${waiting}`}
                        style={customStyles.linkRequest}>
                        <div className="flex">
                          <div style={customStyles.size18Weight500}>
                            Giải trình chờ duyệt
                          </div>

                          <div
                            className="py-16"
                            style={customStyles.size48Weight500}>
                            {invalid}
                          </div>

                          <div
                            style={{
                              ...customStyles.size16Weight400,
                              color: '#EE61CF',
                            }}></div>
                        </div>
                      </Link>
                    </Card>
                  </Col>
                  <Col style={customStyles.card} xs={24} lg={12}>
                    <Card
                      style={{
                        ...customStyles.border,
                        width: '100%',
                        height: '100%',
                      }}>
                      <div style={{ ...customStyles.flex, height: '100%' }}>
                        <div>
                          <div style={customStyles.size18Weight500}>
                            Tổng nhân sự
                          </div>
                          <div
                            className="py-16"
                            style={customStyles.size48Weight500}>
                            {totalEmployee}
                          </div>
                          <div style={customStyles.size12Weight400}>
                            {totalEmployeeMale} Nam
                          </div>
                          <div style={customStyles.size12Weight400}>
                            {totalEmployeeFemale} Nữ
                          </div>
                        </div>
                        <div>
                          <div>
                            <ChartUp />
                          </div>
                          <div
                            style={{
                              backgroundColor: '#FFEFE7',
                              borderRadius: '4px',
                              padding: '0 10px',
                              whiteSpace: 'nowrap',
                            }}>
                            +5% Tháng trước
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col style={customStyles.card} xs={24} lg={12}>
                    <Card
                      style={{
                        ...customStyles.border,
                        width: '100%',
                        height: '100%',
                      }}>
                      <Link
                        to={`/applicationlist?state=${confirm}`}
                        style={customStyles.linkRequest}>
                        <div style={{ ...customStyles.flex, height: '100%' }}>
                          <div>
                            <div style={customStyles.size18Weight500}>
                              Đơn chờ duyệt
                            </div>
                            <div
                              className="py-16"
                              style={customStyles.size48Weight500}>
                              {totalLeaveRefuse && totalLeaveRefuse}
                            </div>
                            <div>
                              {Object.values(countRequestt)
                                ?.slice(0, 2)
                                .map((result: any) => (
                                  <div
                                    style={{
                                      ...customStyles.subText,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'normal',
                                    }}
                                    key={result.time_off_type}>
                                    {result.total} {result.time_off_type}...
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div>
                            <div>
                              <Chart />
                            </div>
                            <div
                              style={{
                                backgroundColor: '#FFEFE7',
                                borderRadius: '4px',
                                padding: '0 10px',
                                whiteSpace: 'nowrap',
                              }}>
                              +5% Tháng trước
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  </Col>
                </Row>

                {/* <Row
                  style={{
                    ...customStyles.border,
                    alignContent: 'space-between',
                    margin: '0',
                    paddingTop: '10px',
                  }}
                  gutter={16}>
                  <Col span={24} style={customStyles.card}>
                    <Space
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <div style={customStyles.size18Weight400}>
                        Danh sách nhân viên thiếu thông tin
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        Có {total_records?.total} bản ghi
                      </div>
                    </Space>
                    <Space style={{ width: '100%', flexDirection: 'column' }}>
                      <Row>
                        {missingInfoEmployees?.map((data: any) => (
                          <div
                            key={data.id}
                            style={{ position: 'relative', width: '100%' }}>
                            <Link
                              to={`/employeelist?employee_code=${data?.employee[0].code}`}>
                              <Button
                                style={{
                                  minHeight: '30px',
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                                onMouseEnter={() => setHoveredEmployee(data)}
                                onMouseLeave={() => setHoveredEmployee(null)}>
                                <div style={{ fontSize: '14px' }}>
                                  {data?.employee[0].mis_id
                                    ? data?.employee[0].mis_id
                                    : 'Thiếu công ty'}
                                  -
                                  {data?.employee[0].name
                                    ? data?.employee[0].name
                                    : 'Thiếu tên'}
                                  -
                                  {data?.employee[0].code
                                    ? data?.employee[0].code
                                    : 'Thiếu mã'}
                                  - ({data?.missing_fields.length} thông tin)
                                </div>
                              </Button>
                            </Link>
                            {hoveredEmployee?.employee[0].id ===
                              data?.employee[0].id && (
                              <>
                                <div
                                  className="notification"
                                  style={{
                                    width: '100%',
                                    position: 'absolute',
                                    background: 'white',
                                    top: '-100%',
                                    left: '50%',
                                    borderRadius: '10px',
                                    transform: 'translate(-50%, -50%)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                  onMouseEnter={() => setHoveredEmployee(data)}
                                  onMouseLeave={() => setHoveredEmployee(null)}>
                                  {data?.missing_fields.map(
                                    (info: string, index: number) => (
                                      <Tag
                                        color="red"
                                        key={index}
                                        style={{
                                          border: '1px solid #d9d9d9',
                                          margin: '10px',
                                        }}>
                                        {info}
                                      </Tag>
                                    )
                                  )}
                                </div>
                                <RiArrowDownSFill
                                  className="icon_down"
                                  style={{
                                    fontSize: '40px',
                                    position: 'absolute',
                                    top: '-10px',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: 'white',
                                  }}
                                  onMouseEnter={() => setHoveredEmployee(data)}
                                  onMouseLeave={() => setHoveredEmployee(null)}
                                />
                              </>
                            )}
                          </div>
                        ))}
                      </Row>
                    </Space>
                  </Col>
                  <Button
                    onClick={handleClick}
                    loading={loading}
                    className="btn_more"
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      color: '#FF5151',
                      backgroundColor: '#FFEFE7',
                      borderBottomLeftRadius: '10px',
                      borderBottomRightRadius: '10px',
                    }}>
                    Xem thêm
                  </Button>
                </Row> */}

                {/* <Row
                  style={{
                    ...customStyles.border,
                    alignContent: 'space-between',
                    margin: '0',
                    paddingTop: '10px',
                  }}
                  gutter={16}>
                  <Col span={24} style={customStyles.card}>
                    <Space
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <div style={customStyles.size18Weight400}>
                        Danh sách đơn thiếu thông tin
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'end',
                        }}>
                        <div style={{ marginRight: '20px' }}>
                          Tháng{' '}
                          <Select
                            options={option}
                            defaultValue={selectedMonth}
                            onChange={handleChangeMonth}></Select>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          Có {total_records_Leave?.total} bản ghi
                        </div>
                      </div>
                    </Space>
                    <Space style={{ width: '100%', flexDirection: 'column' }}>
                      <Row>
                        {missingLeaveInfo &&
                          missingLeaveInfo?.map((data: any) => (
                            <div
                              key={data.id}
                              style={{ position: 'relative', width: '100%' }}>
                              <Link
                                to={`/applicationlist?employee_code= ${data.employee_code}&holiday_status_name=${data.holiday_status_name}&request_date_from=${data.request_date_from}`}>
                                <Button
                                  style={{
                                    minHeight: '30px',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}>
                                  <div style={{ fontSize: '14px' }}>
                                    {data.mis_id} - {data.employee_name} -
                                    {data.employee_code} -{' '}
                                    {data.request_date_from} -{' '}
                                    {data.holiday_status_name}
                                  </div>
                                </Button>
                              </Link>
                            </div>
                          ))}
                      </Row>
                    </Space>
                  </Col>
                  <Button
                    onClick={handleClickMissingLeaveInfo}
                    loading={loading}
                    className="btn_more"
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      color: '#FF5151',
                      backgroundColor: '#FFEFE7',
                      borderBottomLeftRadius: '10px',
                      borderBottomRightRadius: '10px',
                    }}>
                    Xem thêm
                  </Button>
                </Row> */}
                {/* <Row
                  style={{
                    ...customStyles.border,
                    alignContent: 'space-between',
                    margin: '0',
                    paddingTop: '10px',
                    marginBottom: '40px',
                    marginTop: '20px',
                  }}
                  gutter={16}>
                  <Col span={24} style={customStyles.card}>
                    <Space
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <div style={customStyles.size18Weight400}>
                        Danh sách trùng chấm công
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'end',
                        }}>
                        <div style={{ marginRight: '20px' }}>
                          Tháng{' '}
                          <Select
                            options={option}
                            defaultValue={selectedMonth2}
                            onChange={handleChangeMonth2}></Select>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          Có {total_records2?.total} bản ghi
                        </div>
                      </div>
                    </Space>
                    <Space style={{ width: '100%', flexDirection: 'column' }}>
                      <Row>
                        {attendanceDuplicate &&
                          attendanceDuplicate?.map((data: any) => (
                            <div
                              key={data.id}
                              style={{
                                position: 'relative',
                                width: '100%',
                                marginTop: '10px',
                              }}>
                              <Link
                                to={
                                  administrative
                                    ? '/monthlyreport-test'
                                    : '/monthlyreport'
                                }>
                                <Button
                                  style={{
                                    minHeight: '30px',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}>
                                  <div style={{ fontSize: '14px' }}>
                                    {data.employee_name} - {data.employee_code}{' '}
                                    -{data.date}
                                  </div>
                                </Button>
                              </Link>
                            </div>
                          ))}
                      </Row>
                    </Space>
                  </Col>
                </Row> */}

                <Row
                  style={{
                    ...customStyles.border,
                    alignContent: 'space-between',
                    margin: '0',
                    marginBottom: '70px',
                    paddingTop: '10px',
                  }}
                  gutter={16}>
                  <Col span={24} style={customStyles.card}>
                    <Space
                      style={{
                        width: '100%',
                        justifyContent: 'space-between',
                      }}>
                      <div style={customStyles.size18Weight400}>Thông báo</div>
                      <SearchItem
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                        name="date"
                        type="date-picker"
                        innerprops={{
                          allowClear: true,
                          placeholder: 'Ngày gửi báo cáo',
                          format: 'DD/MM/YYYY',
                        }}
                      />
                    </Space>
                    <Space style={{ width: '100%', flexDirection: 'column' }}>
                      <Row>
                        <Button
                          style={{
                            minHeight: '100px',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <div>
                            <a
                              href="/monthlyreport"
                              style={customStyles.linkRequest}>
                              <div style={customStyles.size16Weight400}>
                                KIỂM TRA CHẤM CÔNG
                              </div>
                            </a>
                          </div>
                          <div style={{ display: 'flex', gap: '20px' }}>
                            <div>
                              <MoreIcon />
                            </div>
                          </div>
                        </Button>
                      </Row>

                      <Row>
                        <Button
                          style={{
                            minHeight: '80px',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <div>
                            <a
                              href="/rewardcontent"
                              style={customStyles.linkRequest}>
                              <div style={customStyles.size16Weight400}>
                                DANH SÁCH CHÍNH SÁCH ĐÃI NGỘ
                              </div>
                            </a>
                            {/* <div style={{ textAlign: 'left' }}>
                              7 Minutes ago
                            </div> */}
                          </div>
                          <div style={{ display: 'flex', gap: '20px' }}>
                            <div>
                              <PinIcon type={false} />
                            </div>
                            <div>
                              <MoreIcon />
                            </div>
                          </div>
                        </Button>
                      </Row>
                    </Space>
                  </Col>

                  <Button
                    className="btn_more"
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      color: '#FF5151',
                      backgroundColor: '#FFEFE7',
                      borderBottomLeftRadius: '10px',
                      borderBottomRightRadius: '10px',
                    }}>
                    Xem thêm
                  </Button>
                </Row>
              </Col>
              <Col
                style={{
                  ...customStyles.container,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-betweet',
                  gap: '8px',
                }}
                className="gutter-row"
                xs={24}
                sm={24}
                md={12}
                lg={8}>
                <div style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                  {/* <Card> */}
                  <div
                    style={{
                      padding: '10px',
                      borderRadius: '10px 10px 0 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      backgroundColor: '#F2844F',
                    }}>
                    <h3
                      style={{
                        ...customStyles.size18Weight500,
                        margin: 0,
                        color: '#FFFFFF',
                      }}>
                      Chúc mừng sinh nhật tháng {currentMonth} !
                    </h3>
                    <div>
                      <MoreIcon color="white" />
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '6px 12px 12px 12px',
                      backgroundColor: 'white',
                    }}>
                    <div style={customStyles.size12Weight700}>
                      Tuần {weekOfMonth}
                    </div>
                    <div
                      style={{
                        ...customStyles.bg,
                        padding: '6px 12px',
                        overflowY: 'auto',
                        maxHeight: '106px',
                      }}>
                      {birthDays.length > 0 ? (
                        birthDays.map((birthday, index) => (
                          <div style={{ marginBottom: '10px' }} key={index}>
                            <div style={customStyles.size16Weight400}>
                              {birthday}
                            </div>
                            <div style={{ fontSize: '10px', color: '#686868' }}>
                              Hôm nay {currentDate}
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div style={customStyles.size16Weight400}>
                            Không có sinh nhật trong ngày
                          </div>
                          <div style={{ fontSize: '10px', color: '#686868' }}>
                            Hôm nay {currentDate}
                          </div>
                        </>
                      )}
                    </div>
                    <div></div>
                  </div>
                </div>
                <div
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                  }}>
                  <div
                    style={{
                      padding: '10px',
                      backgroundColor: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                    <div
                      style={{
                        marginBottom: '10px',
                        marginTop: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <div className="text-l">Ngày lễ trong tháng</div>
                      <div style={{ marginRight: '20px' }}>
                        Tháng{' '}
                        <Select
                          options={option2}
                          onChange={handleChangeMonth3}></Select>
                      </div>
                    </div>
                    <div>
                      {holiday.map(item => (
                        <div
                          style={{
                            width: '100%',
                            border: '1px solid #ccc',
                            padding: '5px',
                            borderRadius: '5px',
                            marginBottom: '5px',
                          }}
                          key={item.id}>
                          {item.mis_id} - {item.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="btn_more ant-btn-fix"
                    onClick={handleLoadMore}>
                    Xem thêm
                  </Button>
                  <Row
                    style={{
                      ...customStyles.border,
                      alignContent: 'space-between',
                      margin: '0',
                      paddingTop: '10px',
                      marginTop: '30px',
                    }}
                    gutter={16}>
                    <Col span={24} style={customStyles.card}>
                      <Space
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <div
                          style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                          DS nhân viên chưa làm báo cáo tuần
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          Có {missingEmployeeweeklyreport?.length} bản ghi
                        </div>
                      </Space>
                      <Space style={{ width: '100%', flexDirection: 'column' }}>
                        <Row>
                          {missingEmployeeweeklyreport
                            ?.slice(0, visibleReports)
                            ?.map((data: any) => (
                              <div
                                key={data.id}
                                style={{ position: 'relative', width: '100%' }}>
                                <Link to={`/employeeweeklyreport`}>
                                  <Button
                                    style={{
                                      minHeight: '30px',
                                      width: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}>
                                    <div style={{ fontSize: '14px' }}>
                                      {data.company} - {data.name} - {data.code}
                                    </div>
                                  </Button>
                                </Link>
                              </div>
                            ))}
                        </Row>
                      </Space>
                    </Col>
                    <Button
                      onClick={handleClickLoadmoreEmployeeweeklyreport_missing}
                      loading={loading}
                      className="btn_more"
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        color: '#FF5151',
                        backgroundColor: '#FFEFE7',
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px',
                      }}>
                      Xem thêm
                    </Button>
                  </Row>
                </div>
              </Col>
            </Row>
          )}
        </div>
      ) : (
        <>
          <div style={customStyles.heightFull} className="container">
            <Divider orientation="left" style={customStyles.size24}>
              BÁO CÁO NHÂN SỰ - HRM
            </Divider>
            {isMobile ? (
              <Row
                style={{
                  ...customStyles.heightFull,
                }}>
                <Col
                  style={{
                    ...customStyles.container,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-betweet',
                    gap: '8px',
                  }}
                  className="gutter-row"
                  xs={24}
                  sm={24}
                  md={24}>
                  <div
                    style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '10px 10px 0 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        backgroundColor: '#F2844F',
                      }}>
                      <h3
                        style={{
                          ...customStyles.size18Weight500,
                          margin: 0,
                          color: '#FFFFFF',
                        }}>
                        Chúc mừng sinh nhật tháng {currentMonth} !
                      </h3>
                      <div>
                        <MoreIcon color="white" />
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        padding: '6px 12px 12px 12px',
                      }}>
                      <div style={customStyles.size12Weight700}>
                        Tuần {weekOfMonth}
                      </div>
                      <div style={{ ...customStyles.bg, padding: '6px 12px' }}>
                        {birthDays.length > 0 ? (
                          birthDays.map((birthday, index) => (
                            <div style={{ marginBottom: '10px' }} key={index}>
                              <div style={customStyles.size16Weight400}>
                                {birthday}
                              </div>
                              <div
                                style={{ fontSize: '10px', color: '#686868' }}>
                                Hôm nay {currentDate}
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            <div style={customStyles.size16Weight400}>
                              Không có sinh nhật trong ngày
                            </div>
                            <div style={{ fontSize: '10px', color: '#686868' }}>
                              Hôm nay {currentDate}
                            </div>
                          </>
                        )}
                      </div>
                      <div></div>
                    </div>
                  </div>
                </Col>
                <Col
                  style={(customStyles.container, customStyles.px)}
                  className="gutter-row"
                  xs={24}>
                  <Row gutter={16}>
                    <Col
                      style={customStyles.card}
                      xs={24}
                      sm={24}
                      md={12}
                      lg={6}>
                      <Card
                        style={{
                          ...customStyles.bg,
                          boxShadow: '0px 4px 4px 0px #00000040',
                        }}>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignContent: 'center',
                            height: '100%',
                            textAlign: 'center',
                            gap: '16px',
                          }}>
                          <div
                            style={{
                              fontWeight: '500',
                              fontSize: '50px',
                              lineHeight: '35px',
                              color: '#530A00',
                            }}>
                            {workingDays}
                          </div>
                          <div style={customStyles.size14Weight400}>
                            Ngày bạn đã làm việc tại APEC GROUP
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col
                      style={customStyles.card}
                      xs={24}
                      sm={24}
                      md={12}
                      lg={6}>
                      <Card
                        style={{
                          ...customStyles.bgNew,
                          boxShadow: '0px 4px 4px 0px #00000040',
                        }}>
                        <a href="/contract" style={customStyles.linkRequest}>
                          <div className="flex">
                            <div
                              style={{
                                ...customStyles.size18Weight500,
                                color: '#000000',
                              }}>
                              Hợp đồng lao động
                            </div>
                            <div
                              style={{
                                ...customStyles.size30Weight500,
                                color: '#061DB3',
                              }}>
                              {contractEmployee === 5
                                ? 'Thử việc'
                                : contractEmployee === 4
                                ? 'Chính thức'
                                : ''}
                            </div>
                            <div
                              style={{
                                ...customStyles.size16Weight400,
                                color: '#3786F1',
                              }}>
                              Hạn
                              {contractDateEndEmployee
                                ? format(
                                    new Date(contractDateEndEmployee),
                                    'dd/MM/yyyy'
                                  )
                                : ''}
                            </div>
                          </div>
                        </a>
                      </Card>
                    </Col>
                    <Col style={customStyles.card} xs={24}>
                      <Card
                        style={{
                          ...customStyles.bgExplanation,
                          ...customStyles.flex,
                          boxShadow: '0px 4px 4px 0px #00000040',
                        }}>
                        <a
                          href="/leavemanagement"
                          style={customStyles.linkRequest}>
                          <div className="flex">
                            <div
                              style={{
                                ...customStyles.size18Weight500,
                                color: '#850000',
                              }}>
                              Quỹ phép
                            </div>
                            <div
                              style={{
                                ...customStyles.size36Weight500,
                                color: '#850000',
                              }}>
                              {dataAl ? dataAl : '0'}
                            </div>
                            <div
                              style={{
                                ...customStyles.size16Weight400,
                                color: '#EE61CF',
                              }}>
                              Quỹ phép tháng {currentMonth}
                            </div>
                          </div>
                        </a>
                      </Card>
                    </Col>
                    <Col style={customStyles.card} xs={24}>
                      <Card
                        style={{
                          ...customStyles.bgExplanation2,
                          ...customStyles.flex,
                          boxShadow: '0px 4px 4px 0px #00000040',
                        }}>
                        <a
                          href="/employeebyleave"
                          style={customStyles.linkRequest}>
                          <div className="flex">
                            <div
                              style={{
                                ...customStyles.size18Weight500,
                                color: '#072E64',
                              }}>
                              Quỹ bù
                            </div>
                            <div
                              style={{
                                ...customStyles.size36Weight500,
                                color: '#072E64',
                              }}>
                              {dataCl ? dataCl : dataCl}
                            </div>
                            <div
                              style={{
                                ...customStyles.size16Weight400,
                                color: '#EE61CF',
                              }}>
                              Quỹ bù tháng {currentMonth}/{currentYear}
                            </div>
                          </div>
                        </a>
                      </Card>
                    </Col>
                  </Row>
                  <div
                    style={{
                      padding: '0 12px 2px 12px',
                      backgroundColor: 'white',
                    }}>
                    <div
                      style={{
                        ...customStyles.flex,
                        padding: '12px 0',
                        backgroundColor: 'white',
                      }}>
                      <div style={customStyles.size18Weight500}>
                        Đặt lịch phòng họp
                      </div>
                      <SearchItem
                        style={{ margin: '0' }}
                        name="date"
                        type="date-picker"
                        innerprops={{
                          allowClear: true,
                          placeholder: 'Ngày gửi báo cáo',
                          format: 'DD/MM/YYYY',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        ...customStyles.subText,
                        overflowY: 'auto',
                        height: '420px',
                      }}>
                      {Object.keys(groupedMeetings)?.length > 0 ? (
                        Object.keys(groupedMeetings)?.map((roomName, index) => (
                          <div key={index}>
                            <div style={{ marginBottom: '10px' }}>
                              <div style={customStyles.size16Weight400}>
                                {roomName}
                              </div>
                            </div>
                            {groupedMeetings[roomName].map(
                              (meeting: any, meetingIndex: any) => (
                                <div
                                  style={{ marginBottom: '10px' }}
                                  key={meetingIndex}>
                                  <Button
                                    style={{
                                      margin: '8px 0',
                                      height: '80px',
                                      width: '100%',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                    }}>
                                    <div>
                                      <div
                                        style={{
                                          ...customStyles.size16Weight400,
                                          textAlign: 'left',
                                        }}>
                                        {meeting.purpose}
                                      </div>
                                      <div>
                                        {moment(meeting.start_date).format(
                                          'DD/MM/YYYY HH:mm'
                                        )}
                                        -
                                        {moment(meeting.to_date).format(
                                          'HH:mm'
                                        )}
                                      </div>
                                    </div>

                                    <div
                                      style={{ display: 'flex', gap: '20px' }}>
                                      {/* Kiểm tra xem thời gian hiện tại có quá thời gian kết thúc của cuộc họp không */}
                                      {moment().isAfter(
                                        moment(meeting.to_date)
                                      ) ? (
                                        <div>
                                          <NotiIcon />
                                        </div>
                                      ) : meeting.state === 'confirm' ? (
                                        <div>
                                          <BellGreen />
                                        </div>
                                      ) : meeting.state === 'waiting' ? (
                                        <div>
                                          <BellRed />
                                        </div>
                                      ) : null}
                                      <div>
                                        <MoreIcon />
                                      </div>
                                    </div>
                                  </Button>
                                </div>
                              )
                            )}
                          </div>
                        ))
                      ) : (
                        <>
                          <div style={customStyles.size16Weight400}>
                            Không có phòng họp
                          </div>
                        </>
                      )}
                    </div>
                    <Link
                      to="/bookingmeetingroom"
                      style={{ textDecoration: 'none' }}>
                      <Button
                        className="btn_more"
                        style={{
                          width: '100%',
                          margin: '0',
                          color: '#FF5151',
                          backgroundColor: '#FFEFE7',
                          borderBottomLeftRadius: '10px',
                          borderBottomRightRadius: '10px',
                        }}>
                        Xem thêm
                      </Button>
                    </Link>
                  </div>
                </Col>
              </Row>
            ) : (
              <Row
                style={{
                  ...customStyles.heightFull,
                  // overflow: 'hidden',
                }}>
                <Col
                  style={(customStyles.container, customStyles.px)}
                  className="gutter-row"
                  xs={24}
                  lg={16}>
                  <Row style={{ height: '354px' }} gutter={16}>
                    <Col
                      style={customStyles.card}
                      xs={24}
                      sm={24}
                      md={12}
                      lg={6}>
                      <Card
                        style={{
                          ...customStyles.bg,
                          boxShadow: '0px 4px 4px 0px #00000040',
                        }}>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignContent: 'center',
                            height: '100%',
                            textAlign: 'center',
                            gap: '16px',
                          }}>
                          <div
                            style={{
                              fontWeight: '500',
                              fontSize: '50px',
                              lineHeight: '35px',
                              color: '#530A00',
                            }}>
                            {workingDays}
                          </div>
                          <div style={customStyles.size14Weight400}>
                            Ngày bạn đã làm việc tại APEC GROUP
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col
                      style={customStyles.card}
                      xs={24}
                      sm={24}
                      md={12}
                      lg={6}>
                      <Card
                        style={{
                          ...customStyles.bgNew,
                          boxShadow: '0px 4px 4px 0px #00000040',
                        }}>
                        <a href="/contract" style={customStyles.linkRequest}>
                          <div className="flex">
                            <div
                              style={{
                                ...customStyles.size18Weight500,
                                color: '#000000',
                              }}>
                              Hợp đồng lao động
                            </div>
                            <div
                              style={{
                                ...customStyles.size30Weight500,
                                color: '#061DB3',
                              }}>
                              {contractEmployee === 5
                                ? 'Thử việc'
                                : contractEmployee === 4
                                ? 'Chính thức'
                                : ''}
                            </div>
                            <div
                              style={{
                                ...customStyles.size16Weight400,
                                color: '#3786F1',
                              }}>
                              Hạn
                              {contractDateEndEmployee
                                ? format(
                                    new Date(contractDateEndEmployee),
                                    'dd/MM/yyyy'
                                  )
                                : ''}
                            </div>
                          </div>
                        </a>
                      </Card>
                    </Col>
                    <Col
                      style={customStyles.card}
                      xs={24}
                      sm={24}
                      md={12}
                      lg={6}>
                      <Card
                        style={{
                          ...customStyles.bgExplanation,
                          ...customStyles.flex,
                          boxShadow: '0px 4px 4px 0px #00000040',
                        }}>
                        <a
                          href="/leavemanagement"
                          style={customStyles.linkRequest}>
                          <div className="flex">
                            <div
                              style={{
                                ...customStyles.size18Weight500,
                                color: '#850000',
                              }}>
                              Quỹ phép
                            </div>
                            <div
                              style={{
                                ...customStyles.size36Weight500,
                                color: '#850000',
                              }}>
                              {dataAl}
                            </div>
                            <div
                              style={{
                                ...customStyles.size16Weight400,
                                color: '#EE61CF',
                              }}></div>
                          </div>
                        </a>
                      </Card>
                    </Col>
                    <Col
                      style={customStyles.card}
                      xs={24}
                      sm={24}
                      md={12}
                      lg={6}>
                      <Card
                        style={{
                          ...customStyles.bgExplanation2,
                          ...customStyles.flex,
                          boxShadow: '0px 4px 4px 0px #00000040',
                        }}>
                        <a
                          href="/employeebyleave"
                          style={customStyles.linkRequest}>
                          <div className="flex">
                            <div
                              style={{
                                ...customStyles.size18Weight500,
                                color: '#072E64',
                              }}>
                              Quỹ bù
                            </div>
                            <div
                              style={{
                                ...customStyles.size36Weight500,
                                color: '#072E64',
                              }}>
                              {dataCl}
                            </div>
                            <div
                              style={{
                                ...customStyles.size16Weight400,
                                color: '#EE61CF',
                              }}></div>
                          </div>
                        </a>
                      </Card>
                    </Col>
                    <Col style={customStyles.card} xs={24} lg={9}>
                      <Card
                        style={{
                          ...customStyles.border,
                          width: '100%',
                          height: '100%',
                          boxShadow: '0px 4px 4px 0px #00000040',
                        }}>
                        <div style={{ ...customStyles.flex, height: '100%' }}>
                          <div>
                            <div style={customStyles.size18Weight500}>
                              Tổng đơn
                            </div>
                            <div
                              className="py-16"
                              style={customStyles.size48Weight500}>
                              {totalLeaveEmployee && (
                                <div>{totalLeaveEmployee}</div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                ...customStyles.size12Weight400,
                                backgroundColor: '#E7E8FF',
                                borderRadius: '6px',
                                marginBottom: '4px',
                                padding: '4px 0',
                                textAlign: 'center',
                              }}>
                              {totalLeaveEmployeeConfirm} chờ duyệt
                            </div>
                            <div
                              style={{
                                ...customStyles.size12Weight400,
                                backgroundColor: '#E7FFE7',
                                borderRadius: '6px',
                                marginBottom: '4px',
                                padding: '4px 0',
                                textAlign: 'center',
                              }}>
                              {totalLeaveEmployeeValidate} đã duyệt
                            </div>
                            <div
                              style={{
                                ...customStyles.size12Weight400,
                                backgroundColor: '#FEFFE1',
                                borderRadius: '6px',
                                marginBottom: '4px',
                                padding: '4px 0',
                                textAlign: 'center',
                              }}>
                              {totalLeaveEmployeeRefuse} từ chối
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col style={customStyles.card} xs={24} lg={9}>
                      <Card
                        style={{
                          ...customStyles.border,
                          width: '100%',
                          height: '100%',
                          boxShadow: '0px 4px 4px 0px #00000040',
                        }}>
                        <div style={{ ...customStyles.flex, height: '100%' }}>
                          <div>
                            <div style={customStyles.size18Weight500}>
                              Tổng giải trình
                            </div>
                            <div
                              className="py-16"
                              style={customStyles.size48Weight500}>
                              {totalInvalidEmployee}
                            </div>
                          </div>
                          <div style={{ flex: '1' }}>
                            <div
                              style={{
                                ...customStyles.size12Weight400,
                                backgroundColor: '#E7E8FF',
                                borderRadius: '6px',
                                marginBottom: '4px',
                                padding: '4px 0',
                                textAlign: 'center',
                              }}>
                              {totalInvalidEmployeeConfirm} Chờ duyệt
                            </div>
                            <div
                              style={{
                                ...customStyles.size12Weight400,
                                backgroundColor: '#E7FFE7',
                                borderRadius: '6px',
                                marginBottom: '4px',
                                padding: '4px 0',
                                textAlign: 'center',
                              }}>
                              {totalInvalidEmployeeValidate} Đã duyệt
                            </div>
                            <div
                              style={{
                                ...customStyles.size12Weight400,
                                backgroundColor: '#FEFFE1',
                                borderRadius: '6px',
                                marginBottom: '4px',
                                padding: '4px 0',
                                textAlign: 'center',
                              }}>
                              {totalInvalidEmployeeRefuse} Từ chối
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col style={customStyles.card} xs={24} lg={6}>
                      <Card
                        style={{
                          ...customStyles.border,
                          width: '100%',
                          height: '100%',
                          boxShadow: '0px 4px 4px 0px #00000040',
                        }}>
                        <div style={{ ...customStyles.flex, height: '100%' }}>
                          <div>
                            <div style={customStyles.size18Weight500}>
                              Tổng công
                            </div>
                            <div
                              className="py-16"
                              style={customStyles.size48Weight500}>
                              {totalWorkTime}
                            </div>
                          </div>
                          <div style={{ flex: '1' }}></div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  <Row
                    style={{
                      ...customStyles.border,
                      alignContent: 'space-between',
                      margin: '0',
                      paddingTop: '10px',
                      marginBottom: '40px',
                    }}
                    gutter={16}>
                    <Col span={24} style={customStyles.card}>
                      <Space
                        style={{
                          width: '100%',
                          justifyContent: 'space-between',
                        }}>
                        <div style={customStyles.size18Weight400}>
                          Thông báo
                        </div>
                        <SearchItem
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                          name="date"
                          type="date-picker"
                          innerprops={{
                            allowClear: true,
                            placeholder: 'Ngày gửi báo cáo',
                            format: 'DD/MM/YYYY',
                          }}
                        />
                      </Space>
                      <Space style={{ width: '100%', flexDirection: 'column' }}>
                        <Row>
                          <Button
                            style={{
                              minHeight: '100px',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <a
                              href="/monthlyreport"
                              style={customStyles.linkRequest}>
                              <div>
                                <div style={customStyles.size16Weight400}>
                                  KIỂM TRA CHẤM CÔNG THÁNG
                                </div>
                              </div>
                            </a>
                            <div style={{ display: 'flex', gap: '20px' }}>
                              <div>
                                <MoreIcon />
                              </div>
                            </div>
                          </Button>
                        </Row>
                      </Space>
                    </Col>

                    <Button
                      className="btn_more"
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        color: '#FF5151',
                        backgroundColor: '#FFEFE7',
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px',
                      }}>
                      Xem thêm
                    </Button>
                  </Row>
                </Col>
                <Col
                  style={{
                    ...customStyles.container,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-betweet',
                    gap: '8px',
                  }}
                  className="gutter-row"
                  xs={24}
                  sm={24}
                  md={12}
                  lg={8}>
                  <div
                    style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                    {/* <Card> */}
                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '10px 10px 0 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        backgroundColor: '#F2844F',
                      }}>
                      <h3
                        style={{
                          ...customStyles.size18Weight500,
                          margin: 0,
                          color: '#FFFFFF',
                        }}>
                        Chúc mừng sinh nhật tháng {currentMonth} !
                      </h3>
                      <div>
                        <MoreIcon color="white" />
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        padding: '6px 12px 12px 12px',
                        backgroundColor: 'white',
                      }}>
                      <div style={customStyles.size12Weight700}>
                        Tuần {weekOfMonth}
                      </div>
                      <div
                        style={{
                          ...customStyles.bg,
                          padding: '6px 12px',
                          overflowY: 'auto',
                          maxHeight: '106px',
                        }}>
                        {birthDays.length > 0 ? (
                          birthDays.map((birthday, index) => (
                            <div style={{ marginBottom: '10px' }} key={index}>
                              <div style={customStyles.size16Weight400}>
                                {birthday}
                              </div>
                              <div
                                style={{ fontSize: '10px', color: '#686868' }}>
                                Hôm nay {currentDate}
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            <div style={customStyles.size16Weight400}>
                              Không có sinh nhật trong ngày
                            </div>
                            <div style={{ fontSize: '10px', color: '#686868' }}>
                              Hôm nay {currentDate}
                            </div>
                          </>
                        )}
                      </div>
                      <div></div>
                    </div>
                  </div>
                  <div
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                    }}>
                    <div
                      style={{
                        padding: '10px',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                          marginBottom: '10px',
                          marginTop: '10px',
                        }}>
                        <div className="text-l">Ngày lễ trong tháng</div>
                        <div style={{ marginRight: '20px' }}>
                          Tháng{' '}
                          <Select
                            options={option2}
                            onChange={handleChangeMonth3}></Select>
                        </div>
                      </div>
                      <div>
                        {holiday.map(item => (
                          <div
                            style={{
                              width: '100%',
                              border: '1px solid #ccc',
                              padding: '5px',
                              borderRadius: '5px',
                              marginBottom: '5px',
                            }}
                            key={item.id}>
                            {item.mis_id} - {item.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="btn_more ant-btn-fix"
                      onClick={handleLoadMore}>
                      Xem thêm
                    </Button>
                    <Row
                      style={{
                        ...customStyles.border,
                        alignContent: 'space-between',
                        margin: '0',
                        paddingTop: '10px',
                      }}
                      gutter={16}>
                      <Col span={24} style={customStyles.card}>
                        <Space
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <div
                            style={{
                              whiteSpace: 'nowrap',
                              fontWeight: 'bold',
                            }}>
                            DS nhân viên chưa làm báo cáo tuần
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            Có {missingEmployeeweeklyreport?.length} bản ghi
                          </div>
                        </Space>
                        <Space
                          style={{ width: '100%', flexDirection: 'column' }}>
                          <Row>
                            {missingEmployeeweeklyreport
                              ?.slice(0, visibleReports)
                              ?.map((data: any) => (
                                <div
                                  key={data.id}
                                  style={{
                                    position: 'relative',
                                    width: '100%',
                                  }}>
                                  <Link to={`/employeeweeklyreport`}>
                                    <Button
                                      style={{
                                        minHeight: '30px',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}>
                                      <div style={{ fontSize: '14px' }}>
                                        {data.company} - {data.name} -{' '}
                                        {data.code}
                                      </div>
                                    </Button>
                                  </Link>
                                </div>
                              ))}
                          </Row>
                        </Space>
                      </Col>
                      <Button
                        onClick={
                          handleClickLoadmoreEmployeeweeklyreport_missing
                        }
                        loading={loading}
                        className="btn_more"
                        style={{
                          width: '100%',
                          marginTop: '10px',
                          color: '#FF5151',
                          backgroundColor: '#FFEFE7',
                          borderBottomLeftRadius: '10px',
                          borderBottomRightRadius: '10px',
                        }}>
                        Xem thêm
                      </Button>
                    </Row>
                  </div>
                </Col>
              </Row>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default index;

const customStyles = {
  container: {
    backgroundColor: 'white',
    // backgroundColor: '#ccc',
  },
  card: {
    paddingTop: '8px',
    paddingBottom: '8px',
    backgroundColor: 'white',
  },
  heightFull: {
    height: '100%',
    backgroundColor: 'white',
  },
  gutterRow: {
    marginBottom: '16px',
  },

  bg: {
    height: '100%',
    backgroundColor: '#FFEFE7',
    borderRadius: '10px',
  },

  bgNew: {
    height: '100%',
    backgroundColor: '#E8F0FB',
    borderRadius: '10px',
  },

  bgExplanation: {
    height: '100%',
    backgroundColor: '#FDEBF9',
    borderRadius: '10px',
  },
  bgExplanation2: {
    height: '100%',
    backgroundColor: '#EAFFEE',
    borderRadius: '10px',
  },

  border: {
    border: '1px solid #E0E0E0',
    borderRadius: '10px',
  },

  px: {
    padding: '0 8px',
    backgroundColor: 'white',
  },
  number: {
    fontSize: '36px',
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: '28px',
    marginBottom: '16px',
  },
  title: {
    marginBottom: '16px',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: '28px',
  },

  date: {
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '24px',
    color: '#EE61CF',
  },

  text: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
  },

  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  subText: {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: '400',
    color: '#686868',
  },
  textt: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '400',
  },

  size24: {
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '42px',
  },

  size18Weight400: {
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: 400,
  },

  size18Weight500: {
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: 500,
  },

  size30Weight500: {
    fontSize: '30px',
    lineHeight: '28px',
    fontWeight: 500,
  },

  size36Weight500: {
    fontSize: '36px',
    lineHeight: '28px',
    fontWeight: 500,
  },

  size48Weight500: {
    fontSize: '48px',
    lineHeight: '28px',
    fontWeight: 500,
  },

  size16Weight400: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 400,
  },

  size12Weight400: {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 400,
  },

  size12Weight700: {
    fontSize: '12px',
    lineHeight: '28px',
    fontWeight: 700,
  },

  size12Weight400LineHeight28: {
    fontSize: '12px',
    lineHeight: '28px',
    fontWeight: 400,
  },

  size10Weight400: {
    fontSize: '10px',
    lineHeight: '14px',
    fontWeight: 400,
  },

  size10: {
    fontSize: '10px',
    lineHeight: '10px',
    fontWeight: 400,
  },
  size14Weight400: {
    fontSize: '14px',
    lineHeight: '15px',
    fontWeight: 500,
    color: '#662200',
  },
  size14Weight500: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 500,
  },

  linkRequest: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0',
    color: 'black',
    cursor: 'poiter',
  },
};
