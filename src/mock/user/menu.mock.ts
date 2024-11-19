import { MenuList } from '@/interface/layout/menu.interface';
import { mock, intercepter } from '../config';
import { icons } from 'antd/lib/image/PreviewGroup';
import path from 'path';
const mockMenuList: MenuList = [
  {
    code: 'employeemanagement',
    label: {
      en_US: 'Quản lý nhân sự',
      vi_VN: 'Quản lý nhân sự',
    },
    icon: 'employee',
    path: '/employee',
    children: [
      {
        code: 'employeelist',
        label: {
          en_US: 'Danh sách nhân viên',
          vi_VN: 'Danh sách nhân viên',
        },
        icon: 'employee',
        path: '/employeelist',
      },
    ],
  },
  {
    code: 'report',
    label: {
      en_US: 'Quản lý công, ca',
      vi_VN: 'Quản lý công, ca',
    },
    icon: 'weeklyreport',
    path: '/weeklyreport',
    children: [
      {
        code: 'scheduling',
        label: {
          en_US: 'Phân ca',
          vi_VN: 'Phân ca',
        },
        icon: 'scheduling',
        path: '/scheduling',
        children: [],
      },
    ],
  },

  // {
  //   code: 'insurance',
  //   label: {
  //     en_US: 'Bảo hiểm',
  //     vi_VN: 'Bảo hiểm',
  //   },
  //   icon: 'insurancelist',
  //   path: '/insurance',
  //   children: [],
  // },
  // {
  //   code: 'explainationmanagement',
  //   label: {
  //     en_US: 'Phép & bù',
  //     vi_VN: 'Phép & bù',
  //   },
  //   icon: 'timekeeping',
  //   path: '/timekeepinglist',
  //   children: [],
  // },
  {
    code: 'rewardcontent',
    label: {
      en_US: 'Đãi ngộ nhân viên',
      vi_VN: 'Đãi ngộ nhân viên',
    },
    icon: 'rewardcontent',
    path: '/rewardcontent',
  },
  // {
  //   code: 'export&importmanagement',
  //   label: {
  //     en_US: 'Báo cáo',
  //     vi_VN: 'Báo cáo',
  //   },
  //   icon: 'export',
  //   path: '/exportexcel',
  //   children: [],
  // },
  {
    code: 'employeeweeklyreport',
    label: {
      en_US: 'Viết báo cáo tuần',
      vi_VN: 'Viết báo cáo tuần',
    },
    icon: 'employeeweeklyreport',
    path: '/employeeweeklyreport',
    children: [
      {
        code: 'employeeweeklyreport',
        label: {
          en_US: 'Báo cáo tuần',
          vi_VN: 'Báo cáo tuần',
        },
        icon: 'employeeweeklyreport',
        path: '/employeeweeklyreport',
      },
    ],
  },
];
let employee_ho_check = localStorage.getItem('employee_ho');
let is_general_manager = localStorage.getItem('is_general_manager');
let is_head_of_department = localStorage.getItem('is_head_of_department');
let is_department_secretary = localStorage.getItem('is_department_secretary');
let is_administrative = localStorage.getItem('is_administrative');
let sub_admin_role = localStorage.getItem('sub_admin_role');
let it_ho_check = localStorage.getItem('it_ho_check');
let it_branch_check = localStorage.getItem('it_branch_check');


  const reportmenu = mockMenuList.find(menu => menu.code === 'report');
  // Chuyển đổi employee_ho_check và is_administrative về boolean
  const isEmployeeHoCheck = employee_ho_check === 'true';
  const isAdministrative = is_administrative === 'true';

  if (reportmenu?.children) {
    const additionalMenus = [
      {
        code: 'applicationmanagement',
        label: {
          en_US: 'Đơn và giải trình',
          vi_VN: 'Đơn và giải trình',
        },
        path: '/applicationlist',
        icon: 'explanationrequest',
        children: [],
      },
      {
        code: 'attendance',
        label: {
          en_US: 'Chấm công',
          vi_VN: 'Chấm công',
        },
        icon: 'weeklyreport',
        path: '/attendance',
        children: [
          {
            code: 'weeklyyreport',
            label: {
              en_US: 'Theo tuần',
              vi_VN: 'Theo tuần',
            },
            icon: 'weeklyreport',
            path: '/weeklyreport',
          },
          {
            code: 'monthlyreport',
            label: {
              en_US: 'Theo tháng',
              vi_VN: 'Theo tháng',
            },
            icon: 'monthlyreport',
            path: '/monthlyreport',
          },
          {
            code: 'personalTimekeeping',
            label: {
              en_US: 'chấm công cá nhân',
              vi_VN: 'chấm công cá nhân',
            },
            icon: 'employee',
            path: '/personal-timekeeping',
          },
        ],
      },
    ];

    // Nếu điều kiện isEmployeeHoCheck hoặc isAdministrative là true, thêm các mục báo cáo version 2
    if (isAdministrative) {
      const attendanceMenu = additionalMenus.find(
        menu => menu.code === 'attendance'
      );
      if (attendanceMenu?.children) {
        attendanceMenu.children.push(
          {
            code: 'report',
            label: {
              en_US: 'theo tuần version 2',
              vi_VN: 'theo tuần version 2',
            },
            icon: 'weeklyreport',
            path: '/weeklyreport-test',
          },
          {
            code: 'report',
            label: {
              en_US: 'theo tháng version 2',
              vi_VN: 'theo tháng version 2',
            },
            icon: 'monthlyreport',
            path: '/monthlyreport-test',
          }
        );
      }
    }
    if (
      is_department_secretary === 'true' ||
      is_head_of_department === 'true'
    ) {
      const attendanceMenu = additionalMenus.find(
        menu => menu.code === 'attendance'
      );
      if (attendanceMenu?.children) {
        attendanceMenu.children.push({
          code: 'report',
          label: {
            en_US: 'theo tháng version 2',
            vi_VN: 'theo tháng version 2',
          },
          icon: 'monthlyreport',
          path: '/monthlyreport-test',
        });
      }
    }
    // Nếu điều kiện isEmployeeHoCheck là true, ẩn các mục weeklyyreport và monthlyreport
    if (isEmployeeHoCheck && !isAdministrative) {
      const attendanceMenu = additionalMenus.find(
        menu => menu.code === 'attendance'
      );
      if (attendanceMenu?.children) {
        attendanceMenu.children = attendanceMenu.children.filter(
          item => item.code !== 'weeklyyreport' && item.code !== 'monthlyreport'
        );
      }
    }

    // Thêm các mục menu vào reportmenu.children
    reportmenu.children.push(...additionalMenus);
  }

if (sub_admin_role === 'recruitment' || sub_admin_role === 'administration') {
  const employeemanagementMenu = mockMenuList.find(
    menu => menu.code === 'report'
  );
  if (employeemanagementMenu?.children) {
    const attendanceMenu = employeemanagementMenu.children.find(
      menu => menu.code === 'attendance'
    );
    if (attendanceMenu?.children) {
      attendanceMenu?.children.unshift(
      
          {
            code: 'monthlyreport',
            label: {
              en_US: 'Theo tháng',
              vi_VN: 'Theo tháng',
            },
            icon: 'monthlyreport',
            path: '/monthlyreport',
          },
        
      );
    }
  }
}

if (sub_admin_role === 'recruitment' || is_general_manager === 'true') {
  const employeemanagementMenu = mockMenuList.find(
    menu => menu.code === 'employeemanagement'
  );
  if (employeemanagementMenu?.children) {
    employeemanagementMenu.children.unshift({
      code: 'contract',
      label: {
        en_US: 'Quản lý hợp đồng',
        vi_VN: 'Quản lý hợp đồng',
      },
      icon: 'contract',
      path: '/contract',
    });
  }
}
if (
  is_general_manager === 'true' ||
  is_administrative === 'true' ||
  sub_admin_role === 'recruitment'
) {
  const employeemanagementMenu = mockMenuList.find(
    menu => menu.code === 'employeemanagement'
  );
  if (employeemanagementMenu?.children) {
    employeemanagementMenu.children.push({
      code: 'worklocation',
      label: {
        en_US: 'Địa điểm làm việc',
        vi_VN: 'Địa điểm làm việc',
      },
      icon: 'worklocation',
      path: '/worklocation',
    });
    if (
      is_administrative === 'true' ||
      is_general_manager === 'true' ||
      sub_admin_role === 'recruitment'
    ) {
      employeemanagementMenu.children.push({
        code: 'registerNewEmployee',
        label: {
          en_US: 'Register New Employee',
          vi_VN: 'Đăng ký nhân viên',
        },
        icon: 'registerNewEmployee',
        path: '/registerNewEmployee',
        children: [
          {
            code: 'registerNewEmployeeChildren1',
            label: {
              en_US: 'Register New Employee',
              vi_VN: 'Đăng ký nhân viên mới',
            },
            icon: 'registerNewEmployee',
            path: '/registerNewEmployee/Children1',
          },
          {
            code: 'registerNewEmployeeChildren2',
            label: {
              en_US: 'Application for new employee change',
              vi_VN: 'Đơn đổi thông tin nhân viên',
            },
            icon: 'registerNewEmployee',
            path: '/registerNewEmployee/Children2',
          },
          {
            code: 'registerNewEmployeeChildren3',
            label: {
              en_US: 'Application for new employee change',
              vi_VN: 'Thủ tục nhân sự',
            },
            icon: 'registerNewEmployee',
            path: '/resignationletter',
          },
        ],
      });
    }
  }
} else {
  const employeemanagementMenu = mockMenuList.find(
    menu => menu.code === 'employeemanagement'
  );
  if (employeemanagementMenu?.children) {
    employeemanagementMenu.children.push({
      code: 'registerNewEmployee',
      label: {
        en_US: 'Register New Employee',
        vi_VN: 'Đăng ký nhân viên',
      },
      icon: 'registerNewEmployee',
      path: '/registerNewEmployee',
      children: [
        {
          code: 'registerNewEmployeeChildren2',
          label: {
            en_US: 'Application for new employee change',
            vi_VN: 'Đơn đổi thông tin nhân viên',
          },
          icon: 'registerNewEmployee',
          path: '/registerNewEmployee/Children2',
        },

        {
          code: 'registerNewEmployeeChildren3',
          label: {
            en_US: 'Application for leave',
            vi_VN: 'Đơn xin nghỉ việc',
          },
          icon: 'registerNewEmployee',
          path: '/resignationletter',
        },
      ],
    });
  }
}

const weeklyReportMenu = mockMenuList.find(menu => menu.code === 'report');
if (weeklyReportMenu?.children) {
  const applicationmanagementMenu = weeklyReportMenu?.children.find(
    menu => menu.code === 'applicationmanagement'
  );
  if (applicationmanagementMenu?.children) {
    applicationmanagementMenu.children.push(
      {
        code: 'applicationlist',
        label: {
          en_US: 'Duyệt đơn',
          vi_VN: 'Duyệt đơn',
        },
        icon: 'applicationlist',
        path: '/applicationlist',
      },
      // {
      //   code: 'applicationlistapprovalonly',
      //   label: {
      //     en_US: 'Duyệt đơn nhân viên (c1)',
      //     vi_VN: 'Duyệt đơn nhân viên (c1)',
      //   },
      //   icon: 'applicationlistapprovalonly',
      //   path: '/applicationlistapprovalonly',
      // }
    );
    if (is_general_manager === 'true' || is_administrative === 'true') {
      applicationmanagementMenu.children.push(
    //     {
    //       code: 'applicationlistapprovalonlyhr',
    //       label: {
    //         en_US: 'Duyệt Đơn yêu cầu cấp 2',
    //         vi_VN: 'Duyệt Đơn yêu cầu cấp 2',
    //       },
    //       icon: 'applicationlistapprovalonlyhr',
    //       path: '/applicationlistapprovalonlyhr',
    //     },
        {
          code: 'approvalchangerequest',
          label: {
            en_US: 'Đơn xin đổi quản lý',
            vi_VN: 'Đơn xin đổi quản lý',
          },
          icon: 'approvalchangerequest',
          path: '/approvalchangerequest',
        }
      );
    }
  }
  const explainationmanagementMenu = mockMenuList.find(
    menu => menu.code === 'explainationmanagement'
  );
  if (explainationmanagementMenu?.children) {
    explainationmanagementMenu.children.push(
      {
        code: 'leave',
        label: {
          en_US: 'Quản lý phép',
          vi_VN: 'Quản lý phép',
        },
        icon: 'leavemanagement',
        path: '/leavemanagement',
      },
      {
        code: 'employeebyleave',
        label: {
          en_US: 'Quản lý bù',
          vi_VN: 'Quản lý bù',
        },
        icon: 'employeebyleave',
        path: '/employeebyleave',
      }
    );
  }
}

if (
  is_administrative === 'true' ||
  (employee_ho_check === 'true' &&
    sub_admin_role !== 'recruitment' &&
    sub_admin_role !== 'administration')
) {
  const weeklyReportMenu = mockMenuList.find(menu => menu.code === 'report');
  if (weeklyReportMenu?.children) {
    const applicationmanagementMenu = weeklyReportMenu?.children.find(
      menu => menu.code === 'applicationmanagement'
    );
    if (applicationmanagementMenu?.children) {
      applicationmanagementMenu.children.push({
        code: 'shiftrequest',
        label: {
          en_US: 'Đơn xin đổi ca',
          vi_VN: 'Đơn xin đổi ca',
        },
        icon: 'shiftrequest',
        path: '/shiftrequest',
      });
    }
  }
}

if (is_administrative === 'true' || is_general_manager === 'true' || sub_admin_role === 'recruitment') {
  const phanCaMenu = mockMenuList.find(
    menu => menu.code === 'export&importmanagement'
  );
  if (phanCaMenu?.children) {
    phanCaMenu.children.unshift({
      code: 'exportexcel',
      label: {
        en_US: 'Xuất báo cáo',
        vi_VN: 'Xuất báo cáo',
      },
      icon: 'export',
      path: '/exportexcel',
    });
  }
}
if (
  is_administrative === 'true' ||
  is_general_manager === 'true' ||
  is_department_secretary === 'true' ||
  is_head_of_department === 'true'
) {
  const phanCaMenu = mockMenuList.find(
    menu => menu.code === 'export&importmanagement'
  );
  const weeklyReportMenu = mockMenuList.find(menu => menu.code === 'report');
  const schedulingMenu = weeklyReportMenu?.children?.find(
    menu => menu.code === 'scheduling'
  );

  if (schedulingMenu?.children) {
    schedulingMenu.children.push(
      {
        code: 'shiftslist',
        label: {
          en_US: 'Danh sách ca',
          vi_VN: 'Danh sách ca',
        },
        icon: 'shift',
        path: '/shiftslist',
      },
      // {
      //   code: 'importshift',
      //   label: {
      //     en_US: 'Phân ca nhân viên',
      //     vi_VN: 'Phân ca nhân viên',
      //   },
      //   icon: 'export',
      //   path: '/importshift',
      // }
    );
  }
}

// if (is_general_manager === 'true' || is_administrative === 'true') {
//   const phanCaMenu = mockMenuList.find(
//     menu => menu.code === 'export&importmanagement'
//   );
//   const weeklyReportMenu = mockMenuList.find(menu => menu.code === 'report');
//   if (weeklyReportMenu?.children) {
//     weeklyReportMenu.children.push({
//       code: 'KPI',
//       label: {
//         en_US: 'KPIs',
//         vi_VN: 'KPIs',
//       },
//       icon: 'export',
//       path: '/exportexcel',
//       children: [
//         {
//           code: 'kpictrl',
//           label: {
//             en_US: 'KPI Kiểm Soát',
//             vi_VN: 'KPI Kiểm Soát',
//           },
//           icon: 'employeeweeklyreport',
//           path: '/kpictrl',
//         },
//         {
//           code: 'kpihr',
//           label: {
//             en_US: 'KPI HR',
//             vi_VN: 'KPI HR',
//           },
//           icon: 'employeeweeklyreport',
//           path: '/kpihr',
//         },
//         {
//           code: 'kpi_weekly_report_summary',
//           label: {
//             en_US: 'KPI Weekly Report Summary',
//             vi_VN: 'KPI Báo Cáo Tuần',
//           },
//           icon: 'employeeweeklyreport',
//           path: '/kpi_weekly_report_summary',
//         },
//       ],
//     });
//   }
// }

if (
  is_general_manager === 'true' ||
  is_head_of_department === 'true' ||
  is_department_secretary === 'true'
) {
  const employeemanagementMenu = mockMenuList.find(
    menu => menu.code === 'report'
  );
  if (employeemanagementMenu?.children) {
    const attendanceMenu = employeemanagementMenu.children.find(
      menu => menu.code === 'attendance'
    );
    const weeklyReportItem = employeemanagementMenu.children.find(
      item => item.code === 'weeklyyreport'
    );
    // if (attendanceMenu?.children) {
    //   const index = employeemanagementMenu.children.indexOf(attendanceMenu);

    //   attendanceMenu?.children.push({
    //     code: 'timekeepinglist',
    //     label: {
    //       en_US: 'Danh sách chấm công',
    //       vi_VN: 'Danh sách chấm công',
    //     },
    //     icon: 'timekeeping',
    //     path: '/timekeepinglist',
    //   });
    // }
  }
}
if (
  is_general_manager === 'true' ||
  is_administrative === 'true' ||
  sub_admin_role === 'recruitment'
) {
  const employeemanagementMenu = mockMenuList.find(
    menu => menu.code === 'employeemanagement'
  );
  if (employeemanagementMenu?.children) {
    employeemanagementMenu.children.unshift(
      {
        code: 'departmentlist',
        label: {
          en_US: 'Danh sách phòng ban',
          vi_VN: 'Danh sách phòng ban',
        },
        icon: 'department',
        path: '/departmentlist',
      },
      {
        code: 'jobid',
        label: {
          en_US: 'Danh sách chức vụ',
          vi_VN: 'Danh sách chức vụ',
        },
        icon: 'employeeweeklyreport',
        path: '/jobid',
      }
    );
  }
  const weeklyReportMenu = mockMenuList.find(menu => menu.code === 'report');
  const schedulingMenu = weeklyReportMenu?.children?.find(
    menu => menu.code === 'scheduling'
  );
  const phanCaMenu = mockMenuList.find(
    menu => menu.code === 'export&importmanagement'
  );
  // if (schedulingMenu?.children) {
  //   schedulingMenu.children.push({
  //     code: 'showreport',
  //     label: {
  //       en_US: 'Báo cáo tổng hợp',
  //       vi_VN: 'Báo cáo tổng hợp',
  //     },
  //     icon: 'export',
  //     path: '/showreport',
  //   });
  // }
}

if (
  is_administrative === 'true' ||
  is_general_manager === 'true' ||
  is_head_of_department === 'true' ||
  is_department_secretary === 'true' ||
  sub_admin_role === 'recruitment'
) {
  const employeemanagementMenu = mockMenuList.find(
    menu => menu.code === 'employeemanagement'
  );
  if (employeemanagementMenu?.children) {
    employeemanagementMenu.children.push({
      code: 'employeedecision',
      label: {
        en_US: 'Quyết định nhân sự',
        vi_VN: 'Quyết định nhân sự',
      },
      icon: 'employeedecision',
      path: '/employeedecision',
      children: [],
    });
    const employeeDecisionMenu = employeemanagementMenu.children.find(
      item => item.code === 'employeedecision'
    );
    if (employeeDecisionMenu?.children) {
      employeeDecisionMenu.children.push({
        code: 'employeeallocation',
        label: {
          en_US: 'Điều chuyển nhân viên',
          vi_VN: 'Điều chuyển nhân viên',
        },
        icon: 'employeeallocation',
        path: '/employeeallocation',
      },
      );
      if (is_administrative === 'true') {
        employeeDecisionMenu.children.push(
          {
            code: 'employeePositionAppointment',
            label: {
              en_US: 'Bổ nhiệm chức vụ',
              vi_VN: 'Bổ nhiệm chức vụ',
            },
            icon: 'employeePositionAppointment',
            path: '/employeePositionAppointment',
          }
        )
      }
    }
  }
}
if (is_administrative === 'true' || employee_ho_check === 'true') {
  const employeemanagementMenu = mockMenuList.find(
    menu => menu.code === 'employeemanagement'
  );
  const weeklyReportMenu = mockMenuList.find(menu => menu.code === 'report');
  if (weeklyReportMenu?.children) {
    const applicationListMenu = weeklyReportMenu?.children.find(
      menu => menu.code === 'applicationmanagement'
    );
    if (applicationListMenu?.children) {

      applicationListMenu.children.splice(1, 0, 
        {
          code: 'explanationrequest',
          label: {
            en_US: 'Duyệt giải trình',
            vi_VN: 'Duyệt giải trình',
          },
          icon: 'explanationrequest',
          path: '/explanationrequest',
        }
        
      )
    }
  }
}
if (
  (is_general_manager === 'true' && employee_ho_check === 'true') ||
  is_administrative === 'true' ||
  sub_admin_role === 'recruitment'
) {
  const employeemanagementMenu = mockMenuList.find(
    menu => menu.code === 'employeemanagement'
  );
  if (employeemanagementMenu?.children) {
    employeemanagementMenu.children.unshift({
      code: 'userlist',
      label: {
        en_US: 'Danh sách người dùng',
        vi_VN: 'Danh sách người dùng',
      },
      icon: 'userlist',
      path: '/userlist',
    });
  }
}

if (sub_admin_role !== 'administration' && sub_admin_role !== 'recruitment') {
  mockMenuList.unshift({
    code: 'employeemanagement',
    label: {
      en_US: 'DashBoard',
      vi_VN: 'DashBoard',
    },
    icon: 'employee',
    path: '/dashboard',
  });
}

mock.mock('/user/menu', 'get', intercepter(mockMenuList));

if (is_administrative === 'true') {
  mockMenuList.push({
    code: 'copycompanydata',
    label: {
      en_US: 'Sao chép dữ liệu công ty',
      vi_VN: 'Sao chép dữ liệu công ty',
    },
    icon: 'copycompanydata',
    path: '/copycompanydata',
  });
}
mockMenuList.push(
  {
    code: 'applicationmanagement2',
    label: {
      en_US: 'Hành chính',
      vi_VN: 'Hành chính',
    },
    icon: 'meetingroom',
    path: '/applicationmanagement2',
    children: [],
  },
  // {
  //   code: 'configurations',
  //   label: {
  //     en_US: 'Cấu hình',
  //     vi_VN: 'Cấu hình',
  //   },
  //   icon: 'configlock',
  //   path: '/configurations',
  //   children: [],
  // }
);
if (is_general_manager === 'true' || is_administrative === 'true') {
  const configurationMenu = mockMenuList.find(
    menu => menu.code === 'configurations'
  );
  if (configurationMenu?.children) {
    configurationMenu.children.push(
      {
        code: 'configlock',
        label: {
          en_US: 'Cấu hình khóa',
          vi_VN: 'Cấu hình khóa',
        },
        icon: 'configlock',
        path: '/configlock',
      },
      {
        code: 'holidayLeaves',
        label: {
          en_US: 'Cấu hình ngày lễ',
          vi_VN: 'Cấu hình ngày lễ',
        },
        icon: 'holidayLeaves',
        path: '/holidayLeaves',
      },
      {
        code: 'kpiconfig',
        label: {
          en_US: 'KPI Config',
          vi_VN: 'Cấu Hình KPI',
        },
        icon: 'employeeweeklyreport',
        path: '/kpi_config',
      },
      {
        code: 'violation_config',
        label: {
          en_US: 'Violation Config',
          vi_VN: 'Cấu Hình Vi Phạm',
        },
        icon: 'employeeweeklyreport',
        path: '/violation_config',
      },
      {
        code: 'timerecorderstate',
        label: {
          en_US: 'Trạng thái máy chấm công',
          vi_VN: 'Trạng thái máy chấm công',
        },
        icon: 'timerecorderstate',
        path: '/timerecorderstate',
      }
    );
  }
}
if (sub_admin_role !== 'recruitment') {
  const applicationManagementMenu = mockMenuList.find(
    menu => menu.code === 'applicationmanagement2'
  );
  if (applicationManagementMenu?.children) {
    applicationManagementMenu.children.push(
      // {
      //   code: 'equipmentrequest',
      //   label: {
      //     en_US: 'Đơn xin văn phòng phẩm',
      //     vi_VN: 'Đơn xin văn phòng phẩm',
      //   },
      //   icon: 'equipmentrequest',
      //   path: '/equipmentrequest',
      // },
      {
        code: 'bookingmeetingroom',
        label: {
          en_US: 'Đặt phòng họp',
          vi_VN: 'Đặt phòng họp',
        },
        icon: 'meetingroom',
        path: '/bookingmeetingroom',
      }
    );
  }
}
// if (
//   is_administrative === 'true' &&
//   sub_admin_role !== 'recruitment' &&
//   sub_admin_role !== 'administration'
// ) {
//   const configurationMenu = mockMenuList.find(
//     menu => menu.code === 'configurations'
//   );
//   if (configurationMenu?.children) {
//     configurationMenu.children.push({
//       code: 'insuranceconfig',
//       label: {
//         en_US: 'Cấu hình BHXH',
//         vi_VN: 'Cấu hình BHXH',
//       },
//       icon: 'insuranceconfig',
//       path: '/insuranceconfig',
//     });
//   }
//   const insuranceMenu = mockMenuList.find(menu => menu.code === 'insurance');
//   if (insuranceMenu?.children) {
//     insuranceMenu.children.push({
//       code: 'insurancelist',
//       label: {
//         en_US: 'Bảo hiểm xã hội',
//         vi_VN: 'Bảo hiểm xã hội',
//       },
//       icon: 'insurancelist',
//       path: '/insurancelist',
//     });
//   }
// }
// if (
//   is_administrative === 'true' ||
//   is_general_manager === 'true' ||
//   sub_admin_role === 'recruitment' ||
//   it_ho_check === 'true' ||
//   it_branch_check === 'true'
// ) {
//   mockMenuList.push({
//     code: 'apecgroupmaillist',
//     label: {
//       en_US: 'Quản lý Group Mail APEC',
//       vi_VN: 'Quản lý Group Mail APEC',
//     },
//     icon: 'apecgroupmaillist',
//     path: '/apecgroupmaillist',
//   });
// }

mock.mock('/user/menu', 'get', intercepter(mockMenuList));
