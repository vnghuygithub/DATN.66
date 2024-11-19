import {
  geEmployeeHeadOfDepartment,
  getEmployeeByCompanyId,
  getEmployeeGeneralManager,
  getEmployeeParent,
  getEmployeeParentNoArgs,
  getEmployeeParentNoArgsV2,
  getListEmployeCC,
  getListEmployeeV2,
  getListEmployeeV2Allocation,
  getListEmployeeV2AllocationCurrent,
} from '@/api/employee/employee.api';
import {
  CAR_REGISTRATION,
  CA_GAY,
  CERTIFICATE,
  GIO_TINH,
  HINH_THUC_NHAN_VIEN,
  LOAI_GIO_LAM_VIEC,
  MARIAL,
  STATUS_LEAVE,
  TRANG_THAI_KET_NOI,
} from './consts';
import {
  getCompanyByEmployeeId,
  getListCompaniesHo,
  getListCompany,
  getListCurrentCompany,
  getListNewCompany,
  getListNewCompanyAllocation,
  getListCompaniesBypass,
} from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import {
  getListAllocationDepartment,
  getListDepartment,
  getListDepartmentHO,
  getListNewDepartment,
  getListNewDepartmentForm,
  getListSubDepartment,
  getListDepartmentNoRight,
} from '@/api/timekeepingList/department.api';
import { getListJob, getListJobNoRight } from '@/api/employee/job.api';
import { getListWorkHour } from '@/api/employee/workHour.api';
import { getListCountry } from '@/api/employee/country.api';
import { getListCity } from '@/api/employee/city.api';
import { getListReiligion } from '@/api/employee/religion.api';
import { getListNation } from '@/api/employee/nation.api';
import { getListState } from '@/api/employee/state.api';
import { getListDistrict } from '@/api/employee/district.api';
import { getListWard } from '@/api/employee/ward.api';
import { getListContractType } from '@/api/contract/contractType.api';
import { getListHolidayStatus } from '@/api/employee/holidayStatus.api';
import { getListRoom } from '@/api/meeting_rooms/bookingrooms.api';
import {
  getCurrentShift,
  getListShifts,
  getNewShift,
} from '@/api/shift/shift.api';
import { IFilterShiftsParams } from '@/interface/employees/employee';
import { getKpiEmpConfig } from '@/api/kpi/kpi_config.api';
import { getViolation } from '@/api/kpi/violation.api';
import { getUsers, getUsersSelect } from '@/api/user/user.api';
import { IJobListArgs, getListJobs, getListJobs2 } from '@/api/job/job.api';
import { Label } from 'recharts';
import {
  getWorkLocation,
  getWorkLocationNoRight,
} from '@/api/workLocation/worklocation';
import { getBankList } from '@/api/employee/bank.api';
import { getJobTypes, getListRewardContent } from '@/api/reward/reward.api';
import { getApecGroupMail, IApecGroupMailSearch } from '@/api/apecGroupMail';
import { getEquipmentsByArgs } from '@/api/equipment_request/equipment_request.api';
import { IEquipments } from '@/interface/equipmentRequest/equipment-request';
export const loaiCuaHangOptions = [
  {
    label: 'Offline',
    value: TRANG_THAI_KET_NOI.OFFLINE,
  },
  {
    label: 'Online',
    value: TRANG_THAI_KET_NOI.ONLINE,
  },
];

export const caGayOptions = [
  {
    label: 'Có',
    value: CA_GAY.CO,
  },
  {
    label: 'Không',
    value: CA_GAY.KHONG,
  },
];

export const hinhThucNhanVienOptions = [
  {
    label: 'Nhân viên',
    value: HINH_THUC_NHAN_VIEN.NHANVIEN,
  },
  {
    label: 'Thực tập sinh',
    value: HINH_THUC_NHAN_VIEN.THUCTAP,
  },
];

export const loaiGioLamViecOptions = [
  {
    label: 'Cố định',
    value: LOAI_GIO_LAM_VIEC.CODINH,
  },
  {
    label: 'Linh động',
    value: LOAI_GIO_LAM_VIEC.LINHDONG,
  },
];

export const giotinhOptions = [
  {
    label: 'Nam',
    value: GIO_TINH.NAM,
  },
  {
    label: 'Nữ',
    value: GIO_TINH.NU,
  },
  {
    label: 'Khác',
    value: GIO_TINH.KHAC,
  },
];

export const tinhTrangHonNhanOptions = [
  {
    label: 'Độc thân',
    value: MARIAL.CHUAKETHON,
  },
  {
    label: 'Đã kết hôn',
    value: MARIAL.DAKETHON,
  },
  {
    label: 'Góa',
    value: MARIAL.GOA,
  },
  {
    label: 'Ly hôn',
    value: MARIAL.LYHON,
  },
];
export const bangCapCaoNhatOptions = [
  {
    label: 'Khác',
    value: CERTIFICATE.KHAC,
  },
  {
    label: 'Cử nhân',
    value: CERTIFICATE.CUNHAN,
  },
  {
    label: 'Thạc sỹ',
    value: CERTIFICATE.THACSY,
  },
  {
    label: 'Tiến sỹ',
    value: CERTIFICATE.TIENSY,
  },
];
export const dangKyGuiXeOptions = [
  {
    label: 'Có',
    value: CAR_REGISTRATION.CO,
  },
  {
    label: 'Không',
    value: CAR_REGISTRATION.KHONG,
  },
];
export const statusLeaveOptions = [
  {
    label: 'Đã duyệt',
    value: STATUS_LEAVE.APPROVED,
  },
  {
    label: 'Từ chối',
    value: STATUS_LEAVE.DENIED,
  },
  {
    label: 'Chờ duyệt',
    value: STATUS_LEAVE.PENDING,
  },
  {
    label: 'Đã duyệt cấp 1',
    value: STATUS_LEAVE.LV1,
  },
];
export const invalidTypeOptions = [
  // {
  //   label: 'Về sớm',
  //   value: "1"
  // },
  // {
  //   label: 'Đi muộn',
  //   value: "2"
  // },
  {
    label: 'Ra ngoài',
    value: '5',
  },
];
export const contractStateOptions = [
  {
    label: 'Mới',
    value: 'draft',
  },
  {
    label: 'Đang chạy',
    value: 'open',
  },
  {
    label: 'Sắp hết hạn',
    value: 'almost',
  },
  {
    label: 'Đã hết hạn',
    value: 'close',
  },
  {
    label: 'Đã hủy',
    value: 'cancel',
  },
];
export const employeeAllocationStateOptions = [
  {
    label: 'Chờ duyệt',
    value: 'chờ duyệt',
  },
  {
    label: 'Đã duyệt',
    value: 'đã duyệt',
  },
  {
    label: 'Hủy',
    value: 'hủy',
  },
];

export const validatedOptions = [
  {
    label: 'Từ chối',
    value: '3',
  },
  {
    label: 'Đã duyệt',
    value: '2',
  },
  {
    label: 'Chưa duyệt',
    value: '1',
  },
];
export const reasonOptions = [
  {
    label: 'Cá nhân',
    value: '1',
  },
  {
    label: 'Công việc',
    value: '2',
  },
];
export const companyOptionsAll = async () => {
  const listcomp = await getListCompany();
  let objarr = [];
  for (let item of listcomp.result) {
    objarr.push({
      label:
        item.mis_id == false ? item.name : '(' + item.mis_id + ')' + item.name,
      value: item.id,
    });
  }
  return objarr;
};
export const userOptions = async () => {
  const listUser = await getUsersSelect();
  let objarr = [];
  for (let item of listUser.result) {
    objarr.push({
      label: item.name + ' - ' + item.login,
      value: item.id,
    });
  }
  return objarr;
};
export const companyOptions = async () => {
  const listcomp = await getListNewCompany();
  let objarr = [];
  for (let item of listcomp.result) {
    objarr.push({
      label:
        item.mis_id == false ? item.name : '(' + item.mis_id + ')' + item.name,

      value: item.id,
    });
  }
  return objarr;
};
export const companyOptionsByEmployeeId = async (id: number) => {
  if (id) {
    const listcomp = await getCompanyByEmployeeId(id);
    let objarr = [];
    for (let item of listcomp.result.result) {
      objarr.push({
        label:
          item.mis_id == false
            ? item.name
            : '(' + item.mis_id + ')' + item.name,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};
export const newCompanyOptions = async () => {
  const listcomp = await getListNewCompany();
  let objarr = [];
  for (let item of listcomp.result) {
    objarr.push({
      label: item.name,
      value: item.id,
    });
  }
  return objarr;
};
export const newShift = async (id: number) => {
  if (id) {
    const listcomp = await getNewShift(id);
    let objarr = [];
    for (let item of listcomp.result) {
      objarr.push({
        label:
          item.name +
          ' - ' +
          item.c_start_work_time +
          ' -> ' +
          item.c_end_work_time,

        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};
export const currentCompanyOptions = async () => {
  const listcomp = await getListCurrentCompany();
  let objarr = [];
  for (let item of listcomp.result) {
    objarr.push({
      label: item.name,
      value: item.id,
    });
  }
  return objarr;
};
export const holidayStatusOptions = async () => {
  const listcomp = await getListHolidayStatus();
  let objarr = [];
  for (let item of listcomp.result) {
    objarr.push({
      label: item.name,
      value: item.id,
    });
  }
  return objarr;
};

export const ccOptions = async () => {
  const listCC = await getListEmployeCC();
  let objarr = [];

  for (let item of listCC.result) {
    if (item?.name && item?.email && item?.employee_id) {
      objarr.push({
        label: item.name + ' - ' + item.email,
        value: item.employee_id,
        email: item.email,
      });
    }
  }
  return objarr;
};
export const groupMailOptions = async (params: IApecGroupMailSearch) => {
  const listCC = await getApecGroupMail(params);
  let objarr = [];
  for (let item of listCC?.results.data) {
    if (item?.name && item?.id && item?.email) {
      objarr.push({
        label: item.name + ' - ' + item.email,
        value: item.id,
      });
    }
  }
  return objarr;
};

export const ccOptions2 = async () => {
  const listCC = await getListEmployeCC();
  let objarr = [];

  for (let item of listCC.result) {
    if (item?.name && item?.email && item?.employee_id) {
      objarr.push({
        label: item.name + ' - ' + item.email + ' - ' + item.employee_code,
        value: item.id,
        email: item.email,
      });
    }
  }
  return objarr;
};
export const parentOptions = async (employee_id: any) => {
  const listParent = await getEmployeeParent(employee_id);
  let objarr = [];
  for (let item of listParent.result) {
    objarr.push({
      label: item.name + ' - ' + item.code,
      value: item.id,
      parent_id: item.parent_id.id,
      parent_name: item.parent_id.name,
    });
  }
  return objarr;
};

export const parentOptionsNoArgs = async (employeeId: any) => {
  const listParent = await getEmployeeParentNoArgs(employeeId);
  let objarr = [];
  for (let item of listParent.result) {
    objarr.push({
      label: item?.name + ' - ' + item?.code + ' - ' + item?.company_id?.name,
      value: item?.id,
    });
  }
  return objarr;
};
export const departmentOptions = async (id?: any, company_id?: any) => {
  const listDepartment = await getListDepartmentHO(id, company_id);
  let objarr = [];
  if (listDepartment) {
    for (let item of listDepartment?.result) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};

export const testOptions = async () => {
  const listDepartment = await getEquipmentsByArgs();
  console.log('listDepartment', listDepartment);
  
  let objarr = [];
  if (listDepartment) {
    for (let item of listDepartment?.results?.data as any) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};

export const departmentOptionsNoRight = async (company_id?: any) => {
  const listDepartment = await getListDepartmentNoRight(company_id);
  let objarr = [];
  if (listDepartment) {
    for (let item of listDepartment) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};

export const subDepartmentOptions = async (id?: number) => {
  const listDepartment = await getListSubDepartment(id);
  let objarr = [];
  if (listDepartment) {
    for (let item of listDepartment.result) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
  }
  return objarr;
};
export const departmentOptionsNew = async () => {
  const listDepartment = await getListDepartment();
  let objarr = [];
  for (let item of listDepartment.result) {
    objarr.push({
      label: item.name,
      value: item.id,
    });
  }
  return objarr;
};
export const departmentOptionsNewForm = async (id: number) => {
  const listDepartment = await getListNewDepartmentForm(id);
  let objarr = [];
  for (let item of listDepartment.result) {
    objarr.push({
      label: item.name,
      value: item.id,
    });
  }
  return objarr;
};

export const departmentAllocationSearchOptions = async (company_id: number) => {
  const listDepartment = await getListAllocationDepartment(company_id);
  let objarr = [];
  if (listDepartment) {
    for (let item of listDepartment.result) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
  }
  return objarr;
};

export const contractTypeOptions = async () => {
  const listContractType = await getListContractType();
  let objarr = [];
  for (let item of listContractType.result) {
    objarr.push({
      label: item.name,
      value: item.id,
    });
  }
  return objarr;
};
export const currentShiftOptions = async () => {
  const listShift = await getCurrentShift();
  let objarr = [];
  for (let item of listShift.result) {
    objarr.push({
      label: item.name,
      value: item.id,
    });
  }
  return objarr;
};

export const violationOptions = async () => {
  const listViolation = await getViolation();
  if (!listViolation) {
    return [];
  } else {
    console.log(listViolation);
    let objarr = [];
    let objfull = [];
    for (let item of listViolation.result) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
      objfull.push({
        name: item.name,
        id: item.id,
        default_violation_type: item.default_violation_type,
        default_violation_level: item.default_violation_level,
      });
    }
    return [objarr, objfull];
  }
};
export const secretaryOptions = async () => {
  const listSecretary = await getEmployeeParentNoArgsV2();
  let objArr = [];
  for (let item of listSecretary.result) {
    objArr.push({
      label: item.name + ' - ' + item.code,
      value: item.id,
    });
  }
  return objArr;
};

export const employeeOptions = async (id?: any, domain_search?: any) => {
  const listEmployee = await getListEmployeeV2(id, domain_search);
  console.log(listEmployee);
  let objarr = [];
  if (listEmployee) {
    for (let item of listEmployee.result.result) {
      objarr.push({
        label: item.name + ' - ' + item.code + ' - ' + item.mis_id,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};



export const meetingRoomOptions = async () => {
  const listMeetingRoom = await getListRoom();
  console.log(listMeetingRoom);
  let objarr = [];
  if (listMeetingRoom) {
    for (let item of listMeetingRoom.result.result) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};
export const employeeOptionsAllocations = async (id: number) => {
  const listEmployee = await getListEmployeeV2Allocation(id);
  let objarr = [];
  if (listEmployee) {
    for (let item of listEmployee.result.result) {
      objarr.push({
        label: item.name + ' - ' + item.code,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};
export const employeeOptionsAllocationsCurrent = async () => {
  const listEmployee = await getListEmployeeV2AllocationCurrent();
  let objarr = [];
  if (listEmployee) {
    for (let item of listEmployee.result.result) {
      objarr.push({
        label: item.name + ' - ' + item.code,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};
export const jobOptions = async (args?: IJobListArgs) => {
  const listJob = await getListJobs2(args);
  let objarr = [];
  if (listJob?.results?.data) {
    for (let item of listJob?.results?.data) {
      objarr.push({
        label: item.name + ' - ' + item.level,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};

export const jobOptionsNoRight = async (department_id: any) => {
  const listJob = await getListJobNoRight(department_id);
  let objarr = [];
  if (listJob) {
    for (let item of listJob) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};

export const workLocationOptions = async () => {
  const listWorkLocation = await getWorkLocation({
    name: null,
    work_location_code: null,
    company_id: null,
  });
  let objarr = [];
  if (listWorkLocation?.results?.data) {
    for (let item of listWorkLocation?.results?.data) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};
export const workLocationOptionsNoRight = async () => {
  const listWorkLocation = await getWorkLocationNoRight();
  let objarr = [];
  console.log('listWorkLocation', listWorkLocation);
  if (listWorkLocation) {
    for (let item of listWorkLocation) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};

export const workHourOptions = async () => {
  const listWorkHour = await getListWorkHour();
  let objarr = [];
  let namesSet = new Set();
  if (listWorkHour) {
    for (let item of listWorkHour.result) {
      if (![1, 2, 3, 4].includes(item.id) && !namesSet.has(item.name)) {
        objarr.push({
          label: item.name,
          value: item.id,
        });
        namesSet.add(item.name);
      }
    }
    return objarr;
  }
  return [];
};

export const countryOptions = async () => {
  const listCountry = await getListCountry();
  let objarr = [];
  if (listCountry) {
    for (let item of listCountry.result) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};

export const cityOptions = async () => {
  const listCity = await getListCity();
  let objarr = [];
  if (listCity) {
    for (let item of listCity.result) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};
export const religionOptions = async () => {
  const listReligion = await getListReiligion();
  let objarr = [];
  if (listReligion) {
    for (let item of listReligion.result) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};
export const nationOptions = async () => {
  const listNation = await getListNation();
  let objarr = [];
  if (listNation) {
    for (let item of listNation.result) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};
export const stateOptions = async () => {
  const listState = await getListState();
  let objarr = [];
  if (listState) {
    for (let item of listState.result) {
      objarr.push({
        label: item.name,
        value: item.id,
        country_id: item.country_id.id,
      });
    }
    return objarr;
  }
  return [];
};
export const stateOptions2 = async () => {
  const listState = await getListState();
  let objarr = [];
  if (listState) {
    for (let item of listState.result) {
      objarr.push({
        label: item.name,
        value: item.id,
        country_id: {
          country_id: item.country_id.id,
          country_name: item.country_id.name,
        },
      });
    }
    return objarr;
  }
  return [];
};
export const districtOptions = async () => {
  const listDistrict = await getListDistrict();
  let objarr = [];
  if (listDistrict) {
    for (let item of listDistrict.result) {
      objarr.push({
        label: item.name,
        value: item.id,
        state_id: item.state_id.id,
      });
    }
    return objarr;
  }
  return [];
};
export const wardOptions = async () => {
  const listWard = await getListWard();
  let objarr = [];
  if (listWard) {
    for (let item of listWard.result) {
      objarr.push({
        label: item.name,
        value: item.id,
        district_id: item.district_id.id,
      });
    }
    return objarr;
  }
  return [];
};
export const leaveTypeOptions = async () => {
  const listleavetype = await getListLeaveType();
  let objarr = [];
  for (let item of listleavetype.result) {
    objarr.push({
      label: item.name,
      value: item.id,
    });
  }

  return objarr;
};

export const departmentNameOptions = async () => {
  const listleavetype = await getListDepartment();
  let objarr = [];
  for (let item of listleavetype.result) {
    objarr.push({
      label: item.name,
      value: item.name,
    });
  }
  return objarr;
};

export const employeeGeneralOptions = async () => {
  const listGeneral = await getEmployeeGeneralManager();
  let objarr = [];
  for (let item of listGeneral.result.result) {
    objarr.push({
      label: item.name + ' - ' + item.code,
      value: item.id,
    });
  }
  return objarr;
};
export const kpiConfigOptions = async () => {
  const listKpiConfig = await getKpiEmpConfig();
  let objarr = [];
  if (listKpiConfig) {
    for (let item of listKpiConfig.result) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
  }
  return objarr;
};

export const employeeHeadOfDepartmentOptions = async () => {
  const listHeadOfDepartment = await geEmployeeHeadOfDepartment();
  let objarr = [];
  for (let item of listHeadOfDepartment.result.result) {
    objarr.push({
      label: item.name,
      value: item.id,
    });
  }
  return objarr;
};

export const equipmentOptions = async () => {
  const listDepartment = await getListDepartment();
  let objarr = [];
  if (listDepartment) {
    for (let item of listDepartment.result) {
      objarr.push({
        label: item.name,
        value: item.id,
      });
    }
    return objarr;
  }
  return [];
};

export const departmentAllocationOptions = async (
  department_id?: number,
  company_id?: number
) => {
  const listDepartment = await getListDepartmentHO(department_id, company_id);
  let objarr = [];
  for (let item of listDepartment?.result) {
    objarr.push({
      label: item.name + ' - ' + item.company_id[1],
      value: item.id,
    });
  }
  return objarr;
};

export const newCompanyAllocationOptions = async (id: number) => {
  const listCompany = await getListNewCompanyAllocation(id);
  let objarr = [];
  for (let item of listCompany.result) {
    console.log(item);
    objarr.push({
      label:
        item.mis_id == false ? item.name : '(' + item.mis_id + ')' + item.name,
      value: item.id,
    });
  }
  return objarr;
};

export const employeeMultipleAllocationOptions = async (id: number) => {
  const listEmployee = await getEmployeeByCompanyId(id);
  let objarr = [];
  for (let item of listEmployee.result) {
    objarr.push({
      label: item.name + ' - ' + item.code,
      value: item.id,
    });
  }
  return objarr;
};
export const companyHoSearchOptions = async () => {
  const listCompanies = await getListCompaniesHo();
  let objarr = [];
  for (let item of listCompanies.result) {
    objarr.push({
      label:
        item.mis_id == false ? item.name : '(' + item.mis_id + ')' + item.name,
      value: item.id,
    });
  }
  return objarr;
};

export const companyAllNoRightOptions = async () => {
  const listCompanies = await getListCompaniesBypass();
  let objarr = [];
  for (let item of listCompanies) {
    objarr.push({
      label:
        item.mis_id == false ? item.name : '(' + item.mis_id + ')' + item.name,

      value: item.id,
    });
  }
  return objarr;
};

export const bankOptions = async () => {
  const listBanks = await getBankList();
  let objarr = [];
  for (let item of listBanks?.result) {
    objarr.push({
      label: item.name + ' - ' + item.short_name,
      value: item.id,
      shortName: item.short_name,
    });
  }
  return objarr;
};

export const rewardContentOptions = async () => {
  const rewardContents = await getListRewardContent();
  let objarr = [];
  for (let item of rewardContents.result.sort(
    (a: any, b: any) => a.reward_type - b.reward_type
  )) {
    objarr.push({
      label:
        item.name +
        ' - ' +
        (item.reward_type === '1'
          ? 'CHẾ ĐỘ ƯU ĐÃI KHI SỬ DỤNG DỊCH VỤ TẠI CÁC KHÁCH SẠN THUỘC TẬP ĐOÀN'
          : 'CHẾ ĐỘ ƯU ĐÃI KHI CÔNG TÁC TẠI TỈNH/THÀNH PHỐ CÓ KHÁCH SẠN CỦA TẬP ĐOÀN'),
      value: item.id,
    });
  }
  return objarr;
};

export const jobTypeOptions = async () => {
  const jobTypes = await getJobTypes();
  let objarr = [];
  for (let item of jobTypes.result) {
    objarr.push({
      label: item.name,
      value: item.id,
    });
  }
  return objarr;
};
