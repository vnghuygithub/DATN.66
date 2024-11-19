import { FC, lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import { Navigate, RouteObject } from 'react-router';
import LoginPage from '@/pages/login';
import LayoutPage from '@/pages/layout';
import EmployeeList from '@/pages/employee-list/list';
import WeeklyReport from '@/pages/weekly-report';
import MonthlyReport from '@/pages/monthly-report';
import TimeKeepingList from '@/pages/timekeeping-list/list';
import ShiftsList from '@/pages/shifts-list/list';
import ExplanationRequest from '@/pages/explanation-request/list';
import WrapperRouteComponent from './config';
import ExportExcel from '@/pages/export-excel';
import ShowReport from '@/pages/show-report/table/index';
import ApplicationList from '@/pages/application-list/list';
import LeaveManagement from '@/pages/leave-management/list';
import EmployeeByLeave from '@/pages/employeeByLeaveList/list';
import ContractList from '@/pages/contract-list/list';
import DepartmentList from '@/pages/department-list/list';
import { IdcardOutlined } from '@ant-design/icons';
import EmployeeAllocationList from '@/pages/employee-allocation/list';
import ImportShift from '@/pages/import-shift';
import EmployeeWeeklyReportList from '@/pages/employeeWeeklyReport/list';
import MeetingRoom from '@/pages/meeting-room/list';
import ProjectManagment from '@/pages/project';
import KpiCtrlList from '@/pages/kpi_ctrl/list/list';
import ShiftRequest from '@/pages/shiftRequest/list';
import KpiHrList from '@/pages/kpi_hr/list/list';
import ViolationList from '@/pages/violation_config/list/list';
import UserList from '@/pages/user/list';
import TimeRecorderState from '@/pages/time_recorder_state/list';
import { ConfigLockList } from '@/pages/configLock/list';
import Joblist from '@/pages/jobid-list/list/list';
import KpiConfig from '@/pages/kpiConfig-list/list/list';
import HolidayLeaves from '@/pages/holidayLeaves/list';
import EquipmentRequest from '@/pages/equipment-request/list';
import KpiWeeklyReportSummary from '@/pages/kpi-weekly-report-summary/list/list';
import DashBoard from '@/pages/dashboard/table/index';
import ApplicationListApprovalOnly from '@/pages/application-list-approval/list';
import ApplicationFormApprovalHr from '@/pages/application-list-hr/handle';
import ApplicationListApprovalOnlyHr from '@/pages/application-list-hr/list';
import InsuranceList from '@/pages/insurance/list';
import InsuranceConfigList from '@/pages/insurance-config/list';
import WorkLocation from '@/pages/work_location/list';
import RewardContentList from '@/pages/reward/list';
import RegisterNewEmployee from '@/pages/registerNewEmployee/list';
import CopyCompanyData from '@/pages/copyCompanyData';
import RegisterSuccessPage from '@/pages/registerSuccessPage';
import ApprovalChangeRequest from '@/pages/approval-change-request/list';
import WeeklyreportTest from '@/pages/weeklyreport-test';
import MonthlyReportTest from '@/pages/monthly-report-test';
import RegisterNewEmployeeVer2 from '@/pages/registerNewEmployeeVer2/list';
import RegisterNewEmployeeVer3 from '@/pages/registerNewEmployeeVer3/list';
import PersonalTimekeeping from '@/pages/personalTimekeeping';
import ApecGroupMailList from '@/pages/apec-group-mail-list/list';
import jobAllocation from '../pages/jobAllocation/list/index';
import JobAllocation from '../pages/jobAllocation/list/index';
const NotFound = lazy(
  () => import(/* webpackChunkName: "404'"*/ '@/pages/404')
);

const Guide = lazy(
  () => import(/* webpackChunkName: "guide'"*/ '@/pages/guide')
);
// const RoutePermission = lazy(
//   () =>
//     import(/* webpackChunkName: "route-permission"*/ '@/pages/permission/route')
// );
const FormPage = lazy(
  () => import(/* webpackChunkName: "form'"*/ '@/pages/components/form')
);
const TablePage = lazy(
  () => import(/* webpackChunkName: "table'"*/ '@/pages/components/table')
);
const TabsPage = lazy(
  () => import(/* webpackChunkName: "tabs'"*/ '@/pages/components/tabs')
);
const AsidePage = lazy(
  () => import(/* webpackChunkName: "aside'"*/ '@/pages/components/aside')
);
const RadioCardsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "radio-cards'"*/ '@/pages/components/radio-cards'
    )
);
const BusinessBasicPage = lazy(
  () => import(/* webpackChunkName: "basic-page" */ '@/pages/business/basic')
);
const BusinessWithSearchPage = lazy(
  () =>
    import(/* webpackChunkName: "with-search" */ '@/pages/business/with-search')
);
const BusinessWithAsidePage = lazy(
  () =>
    import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-aside')
);
const BusinessWithRadioCardsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "with-aside" */ '@/pages/business/with-radio-cards'
    )
);
const BusinessWithTabsPage = lazy(
  () => import(/* webpackChunkName: "with-tabs" */ '@/pages/business/with-tabs')
);

const routeList: RouteObject[] = [
  {
    path: '/login',
    element: (
      <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />
    ),
  },
  {
    path: '/registersuccess',
    element: (
      <WrapperRouteComponent element={<RegisterSuccessPage />} titleId="title.registersuccess" noauth={true} />
    ),
  },
  {
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} titleId="" auth />,
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" />,
      },
      {
        path: 'leavemanagement',
        element: (
          <WrapperRouteComponent
            element={<LeaveManagement />}
            titleId="title.leavemanagement"
          />
        ),
      },
      {
        path: 'bookingmeetingroom',
        element: (
          <WrapperRouteComponent
            element={<MeetingRoom />}
            titleId="title.bookingmeetingroom"
          />
        ),
      },
      {
        path: 'equipmentrequest',
        element: (
          <WrapperRouteComponent
            element={<EquipmentRequest />}
            titleId="title.equipmentrequest"
          />
        ),
      },
      {
        path: 'kpictrl',
        element: (
          <WrapperRouteComponent
            element={<KpiCtrlList />}
            titleId="KPI Control"
          />
        ),
      },
      {
        path: 'kpihr',
        element: (
          <WrapperRouteComponent element={<KpiHrList />} titleId="KPI Hr" />
        ),
      },

      {
        path: 'kpi_weekly_report_summary',
        element: (
          <WrapperRouteComponent
            element={<KpiWeeklyReportSummary />}
            titleId="title.kpi_weekly_report_summary"
          />
        ),
      },

      {
        path: 'violation_config',
        element: (
          <WrapperRouteComponent
            element={<ViolationList />}
            titleId="violation"
          />
        ),
      },

      {
        path: 'employeebyleave',
        element: (
          <WrapperRouteComponent
            element={<EmployeeByLeave />}
            titleId="title.employeebyleave"
          />
        ),
      },
      {
        path: 'contract',
        element: (
          <WrapperRouteComponent
            element={<ContractList />}
            titleId="title.contract"
          />
        ),
      },
      {
        path: 'employeelist',
        element: (
          <WrapperRouteComponent
            element={<EmployeeList />}
            titleId="title.employeelist"
          />
        ),
      },
      {
        path: 'employeeallocation',
        element: (
          <WrapperRouteComponent
            element={<EmployeeAllocationList />}
            titleId="title.employeeallocation"
          />
        ),
      },
      {
        path: 'employeePositionAppointment',
        element: (
          <WrapperRouteComponent
            element={<JobAllocation />}
            titleId="title.employeePositionAppointment"
          />
        ),
      },
      {
        path: 'departmentlist',
        element: (
          <WrapperRouteComponent
            element={<DepartmentList />}
            titleId="title.department"
          />
        ),
      },
      {
        path: 'weeklyreport',
        element: (
          <WrapperRouteComponent
            element={<WeeklyReport />}
            titleId="title.weeklyreport"
          />
        ),
      },
      {
        path: 'weeklyreport-test',
        element: (
          <WrapperRouteComponent
            element={<WeeklyreportTest/>}
            titleId="title.weeklyreport-test"
          />
        ),
      },
      {
        path: 'personal-timekeeping',
        element: (
          <WrapperRouteComponent
            element={<PersonalTimekeeping/>}
            titleId="title.personal-timekeeping"
          />
        ),
      },
      {
        path: 'monthlyreport',
        element: (
          <WrapperRouteComponent
            element={<MonthlyReport />}
            titleId="title.monthlyreport"
          />
        ),
      },
      {
        path: 'monthlyreport-test',
        element: (
          <WrapperRouteComponent
            element={<MonthlyReportTest/>}
            titleId="title.monthlyreport-test"
          />
        ),
      },
      {
        path: 'shiftslist',
        element: (
          <WrapperRouteComponent
            element={<ShiftsList />}
            titleId="title.shiftslist"
          />
        ),
      },
      {
        path: 'timekeepinglist',
        element: (
          <WrapperRouteComponent
            element={<TimeKeepingList />}
            titleId="title.timekeepinglist"
          />
        ),
      },
      {
        path: 'timerecorderstate',
        element: (
          <WrapperRouteComponent
            element={<TimeRecorderState />}
            titleId="title.timerecorderstate"
          />
        ),
      },
      {
        path: 'explanationrequest',
        element: (
          <WrapperRouteComponent
            element={<ExplanationRequest />}
            titleId="title.explanationrequest"
          />
        ),
      },
      {
        path: 'exportexcel',
        element: (
          <WrapperRouteComponent
            element={<ExportExcel />}
            titleId="title.exportexcel"
          />
        ),
      },
      {
        path: 'dashboard',
        element: (
          <WrapperRouteComponent
            element={<DashBoard />}
            titleId="title.dashboard"
          />
        ),
      },
      {
        path: 'showreport',
        element: (
          <WrapperRouteComponent
            element={<ShowReport />}
            titleId="Báo cáo tổng hợp"
          />
        ),
      },

      {
        path: 'dashboard',
        element: (
          <WrapperRouteComponent element={<DashBoard />} titleId="DashBoard" />
        ),
      },

      {
        path: 'worklocation',
        element: (
          <WrapperRouteComponent
            element={<WorkLocation />}
            titleId="title.worklocation"
          />
        ),
      },

      // {
      //   path: 'importshift',
      //   element: (
      //     <WrapperRouteComponent
      //       element={<ImportShift />}
      //       titleId="Phân ca nhân viên"
      //     />
      //   ),
      // },
      {
        path: 'applicationlist',
        element: (
          <WrapperRouteComponent
            element={<ApplicationList />}
            titleId="title.applicationlist"
          />
        ),
      },
      {
        path: 'employeeweeklyreport',
        element: (
          <WrapperRouteComponent
            element={<EmployeeWeeklyReportList />}
            titleId="title.employeeweeklyreport"
          />
        ),
      },
      {
        path: 'projectmanagement',
        element: (
          <WrapperRouteComponent
            element={<ProjectManagment />}
            titleId="title.projectmanagement"
          />
        ),
      },
      {
        path: 'shiftrequest',
        element: (
          <WrapperRouteComponent
            element={<ShiftRequest />}
            titleId="title.shiftrequest"
          />
        ),
      },
      {
        path: 'userlist',
        element: (
          <WrapperRouteComponent
            element={<UserList />}
            titleId="title.userlist"
          />
        ),
      },
      {
        path: 'configlock',
        element: (
          <WrapperRouteComponent
            element={<ConfigLockList />}
            titleId="title.configlock"
          />
        ),
      },
      {
        path: 'jobid',
        element: (
          <WrapperRouteComponent element={<Joblist />} titleId="title.jobid" />
        ),
      },
      {
        path: 'kpi_config',
        element: (
          <WrapperRouteComponent
            element={<KpiConfig />}
            titleId="title.kpiconfig"
          />
        ),
      },
      {
        path: 'holidayLeaves',
        element: (
          <WrapperRouteComponent
            element={<HolidayLeaves />}
            titleId="title.holidayLeaves"
          />
        ),
      },
      {
        path: 'applicationlistapprovalonly',
        element: (
          <WrapperRouteComponent
            element={<ApplicationListApprovalOnly />}
            titleId="title.applicationlistapprovalonly"
          />
        )
      },
      {
        path: 'applicationlistapprovalonlyhr',
        element: (
          <WrapperRouteComponent
            element={<ApplicationListApprovalOnlyHr />}
            titleId="title.applicationlistapprovalonlyhr"
          />
        ),
      },
      {
        path: 'approvalchangerequest',
        element: (
          <WrapperRouteComponent
            element={<ApprovalChangeRequest />}
            titleId="title.approvalchangerequest"
          />
        ),
      },
      {
        path: 'insurancelist',
        element: (
          <WrapperRouteComponent
            element={<InsuranceList />}
            titleId="title.insurancelist"
          />
        ),
      },
      {
        path: 'insuranceconfig',
        element: (
          <WrapperRouteComponent
            element={<InsuranceConfigList />}
            titleId="title.insuranceconfig"
          />
        ),
      },
      {
        path: 'rewardcontent',
        element: (
          <WrapperRouteComponent
            element={<RewardContentList />}
            titleId="title.rewardcontent"
          />
        ),
      },
      {
        path: '/registerNewEmployee/Children1',
        element: (
          <WrapperRouteComponent
            element={<RegisterNewEmployee />}
            titleId="title.registernewemployee-children1"
          />
        ),
      },
      {
        path: '/registerNewEmployee/Children2',
        element: (
          <WrapperRouteComponent
            element={<RegisterNewEmployeeVer2/>}
            titleId="title.registernewemployee-children2"
          />
        ),
      },
      {
        path: '/resignationletter',
        element: (
          <WrapperRouteComponent
            element={<RegisterNewEmployeeVer3/>}
            titleId="title.registernewemployee-children3"
          />
        ),
      },
      {
        path: 'copycompanydata',
        element: (
          <WrapperRouteComponent
            element={<CopyCompanyData />}
            titleId="title.copycompanydata"
          />
        ),
      },
      {
        path: 'apecgroupmaillist',
        element: (
          <WrapperRouteComponent
            element={<ApecGroupMailList />}
            titleId="title.apecgroupmaillist"
          />
        ),
      },
      {
        path: 'guide',
        element: (
          <WrapperRouteComponent element={<Guide />} titleId="title.guide" />
        ),
      },
      {
        path: 'component/form',
        element: (
          <WrapperRouteComponent
            element={<FormPage />}
            titleId="title.account"
          />
        ),
      },
      {
        path: 'component/table',
        element: (
          <WrapperRouteComponent
            element={<TablePage />}
            titleId="title.account"
          />
        ),
      },

      {
        path: 'component/tabs',
        element: (
          <WrapperRouteComponent
            element={<TabsPage />}
            titleId="title.account"
          />
        ),
      },
      {
        path: 'component/aside',
        element: (
          <WrapperRouteComponent
            element={<AsidePage />}
            titleId="title.account"
          />
        ),
      },
      {
        path: 'component/radio-cards',
        element: (
          <WrapperRouteComponent
            element={<RadioCardsPage />}
            titleId="title.account"
          />
        ),
      },
      {
        path: 'business/basic',
        element: (
          <WrapperRouteComponent
            element={<BusinessBasicPage />}
            titleId="title.account"
          />
        ),
      },
      {
        path: 'business/with-search',
        element: (
          <WrapperRouteComponent
            element={<BusinessWithSearchPage />}
            titleId="title.account"
          />
        ),
      },
      {
        path: 'business/with-aside',
        element: (
          <WrapperRouteComponent
            element={<BusinessWithAsidePage />}
            titleId="title.account"
          />
        ),
      },
      {
        path: 'business/with-radio-cards',
        element: (
          <WrapperRouteComponent
            element={<BusinessWithRadioCardsPage />}
            titleId="title.account"
          />
        ),
      },
      {
        path: 'business/with-tabs',
        element: (
          <WrapperRouteComponent
            element={<BusinessWithTabsPage />}
            titleId="title.account"
          />
        ),
      },
      {
        path: '*',
        element: (
          <WrapperRouteComponent
            element={<NotFound />}
            titleId="title.notFount"
          />
        ),
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);

  return element;
};

export default RenderRouter;
