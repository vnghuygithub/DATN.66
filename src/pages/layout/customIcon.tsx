import { FC } from 'react';
import { ReactComponent as GuideSvg } from '@/assets/menu/guide.svg';
import { ReactComponent as PermissionSvg } from '@/assets/menu/permission.svg';
import { ReactComponent as HomeSvg } from '@/assets/menu/home.svg';
import { ReactComponent as AccountSvg } from '@/assets/menu/account.svg';
import { ReactComponent as DocumentationSvg } from '@/assets/menu/documentation.svg';
import { ReactComponent as SystemSvg } from '@/assets/menu/system.svg';
import { ReactComponent as MerchantSvg } from '@/assets/menu/merchant.svg';
import { ReactComponent as TransactionSvg } from '@/assets/menu/transaction.svg';
import { ReactComponent as SysvarSvg } from '@/assets/menu/sysvar.svg';
import { ReactComponent as VoucherSvg } from '@/assets/menu/voucher.svg';
import { ReactComponent as BeneficiarySvg } from '@/assets/menu/beneficiary.svg';
import { ReactComponent as EmployeeeSvg } from '@/assets/menu/ic_employee.svg';
import { ReactComponent as ShiftSvg } from '@/assets/menu/ic_shift.svg';
import { ReactComponent as TimeKeepingSvg } from '@/assets/menu/ic_timekeeping.svg';
import { ReactComponent as MonthltReportSvg } from '@/assets/menu/ic_month_report.svg';
import { ReactComponent as WeeklyReportSvg } from '@/assets/menu/ic_weeklyreport.svg';
import { ExportOutlined, OrderedListOutlined, CalendarOutlined, CalendarFilled, FormOutlined, TeamOutlined, IdcardOutlined, AuditOutlined, BookOutlined, ProjectOutlined, DeliveredProcedureOutlined, UserOutlined, ScheduleOutlined, FieldTimeOutlined, ToolOutlined, ThunderboltOutlined, ContainerOutlined, InsuranceFilled, InsuranceOutlined, ToolFilled, CloudServerOutlined, GiftOutlined, CopyOutlined, UserSwitchOutlined, MailOutlined, SolutionOutlined } from '@ant-design/icons';
interface CustomIconProps {
  type: string;
}

export const CustomIcon: FC<CustomIconProps> = props => {
  const { type } = props;
  let com = <GuideSvg />;

  if (type === 'guide') {
    com = <GuideSvg />;
  } else if (type === 'permission') {
    com = <PermissionSvg />;
  } else if (type === 'dashboard') {
    com = <HomeSvg />;
  } else if (type === 'account') {
    com = <AccountSvg />;
  } else if (type === 'documentation') {
    com = <DocumentationSvg />;
  } else if (type === 'system') {
    com = <SystemSvg />;
  } else if (type === 'transaction') {
    com = <TransactionSvg />;
  } else if (type === 'sysvar') {
    com = <SysvarSvg />;
  } else if (type === 'employee') {
    com = <EmployeeeSvg />
  }
  else if (type === 'shift') {
    com = <ShiftSvg />
  }
  else if (type === 'timekeeping') {
    com = <TimeKeepingSvg />
  }
  else if (type === 'monthlyreport') {
    com = <MonthltReportSvg />
  }
  else if (type === 'weeklyreport') {
    com = <WeeklyReportSvg />
  }
  else if (type === 'export') {
    com = <ExportOutlined />
  }
  else if (type === 'employeeallocation') {
    com = <AuditOutlined />
  }
  else if (type === 'employeePositionAppointment') {
    com = <SolutionOutlined />
  }
  else if (type === 'applicationlist') {
    com = <OrderedListOutlined />
  }
  else if (type == "leavemanagement") {
    com = <CalendarOutlined />
  }
  else if (type === "employeebyleave") {
    com = <CalendarFilled />
  }
  else if (type === "contract") {
    com = <FormOutlined />
  }
  else if (type === "department") {
    com = <TeamOutlined />
  }
  else if (type === "job") {
    com = <IdcardOutlined />
  }
  else if (type === "employeeweeklyreport") {
    com = <BookOutlined />
  }
  else if (type === "projectmanagement") {
    com = <ProjectOutlined />
  }
  else if (type === "shiftrequest") {
    com = <DeliveredProcedureOutlined />
  }
  else if (type === "userlist") {
    com = <UserOutlined />
  }
  else if (type === "meetingroom") {
    com = <ScheduleOutlined />
  }
  else if (type === "configlock") {
    com = <ToolOutlined />
  }
  else if (type === "holidayLeaves") {
    com = <ScheduleOutlined />
  }
  else if (type === "timerecorderstate") {
    com = <ThunderboltOutlined />
  }
  else if (type === "equipmentrequest") {
    com = <CloudServerOutlined />
  }
  else if (type === "applicationlistapprovalonly") {
    com = <OrderedListOutlined />
  }
  else if (type === "applicationlistapprovalonlyhr") {
    com = <OrderedListOutlined />
  }
  else if (type === "insurancelist") {
    com = <InsuranceOutlined />
  }
  else if (type === "insuranceconfig") {
    com = <ToolFilled />
  }
  else if (type === "rewardcontent") {
    com = <GiftOutlined />
  }
  else if (type === 'copycompanydata') {
    com = <CopyOutlined />
  }
  else if (type === 'approvalchangerequest') {
    com = <UserSwitchOutlined /> 
  }
  else if (type === 'apecgroupmaillist') {
    com = <MailOutlined />
  }
  else {
    com = <GuideSvg />;
  }

  return <span className="anticon">{com}</span>;
};
