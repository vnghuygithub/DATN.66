import { ITreeNode } from '@/interface/weeklyreport/type';
import moment from 'moment';
import { isUndefined, isEmpty, first } from 'lodash';
import Item from 'antd/lib/list/Item';

export const copyTextToClipboard = (text: string) => {
  if ('clipboard' in navigator) {
    return navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
};

export const checkObjectExists = (arr: any, objToCheck: any) => {
  if (arr.length == 0) return false;
  for (var i = 0; i < arr.length; i++) {
    if (JSON.stringify(arr[i]) === JSON.stringify(objToCheck)) {
      return true;
    }
  }
  return false;
};
// Hàm cập nhật đối tượng trong mảng
function updateObjectInArray(arr: any, updatedObj: any) {
  for (var i = 0; i < arr.length; i++) {
    var obj = arr[i];
    var dayKey = updatedObj.date;

    if (obj.hasOwnProperty(dayKey)) {
      if (
        obj[dayKey].hasOwnProperty('employee_code') &&
        obj[dayKey].hasOwnProperty('date')
      ) {
        if (
          obj[dayKey].date === updatedObj.date &&
          obj[dayKey].employee_code === updatedObj.employee_code
        ) {
          obj[dayKey] = { ...updatedObj };
          // Object.assign(obj[dayKey], updatedObj);
          break; // Thoát khỏi vòng lặp sau khi cập nhật thành công
        }
      }
    }

    // Kiểm tra đệ quy cho các đối tượng con (nếu có)
    if (obj.children && obj.children.length > 0) {
      updateObjectInArray(obj.children, updatedObj);
    }
  }
}
export const updateObject = (obj: any, updatedArr: any) => {
  // Lặp qua mảng updatedArr và cập nhật mảng oldObj
  updatedArr.forEach(function (updatedObj: any) {
    updateObjectInArray(obj, updatedObj);
  });
  return obj;
};
export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getFormattedDate = (dateString: string) => {
  const date = moment(dateString, 'DD/MM/YYYY');
  const vietnameseDays = [
    'Chủ nhật',
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
  ];
  const formattedDay = vietnameseDays[date.day()];
  const formattedDate = date.format('DD/MM');
  return `${formattedDay} (${formattedDate})`;
};

// Xác định ngày dự vào ngày thứ bao nhiêu, tuần thứ bao nhiêu trong năm
export function getDateFromWeek(year: number, week: number, day: number) {
  const date = new Date(year, 0, 1); // Lấy ngày đầu tiên của năm

  let firstDayOfWeek = (date.getDay() + 6) % 7; // Lấy ngày đầu tiên của tuần trong năm
  if (firstDayOfWeek == 0) {
    firstDayOfWeek = 7;
  }
  // Điều chỉnh để đảm bảo tuần đầu tiên không bị sai
  const daysToAdd = week * 7 + day - firstDayOfWeek;

  date.setDate(date.getDate() + daysToAdd);

  return date;
}
export function isDuplicate(obj1: any, obj2: any) {
  if (
    obj1.old_value_text === obj2.old_value_text &&
    obj1.new_value_text === obj2.new_value_text &&
    obj1.create_date._i === obj2.create_date._i &&
    obj1.name === obj2.name &&
    obj1.field_description === obj2.field_description
  ) {
    return true;
  } else if (
    (!obj1.old_value_text && !obj1.new_value_text) ||
    (!obj2.old_value_text && !obj2.new_value_text)
  ) {
    return true;
  } else {
    return false;
  }
}
export function extractTextInSingleQuotes(input: string): string | null {
  const regex = /'([^']+)'/;
  const match = input.match(regex);

  if (match && match.length >= 2) {
    return match[1];
  } else {
    return input;
  }
}
export function convertToTimeFormat(input: string): string | null {
  const parts = input.split('-');

  if (parts.length === 5) {
    const hours = parseInt(parts[3]);
    const minutes = parseInt(parts[4]);

    if (!isNaN(hours) && !isNaN(minutes)) {
      const adjustedHours = hours + 7;
      const timeString = `${adjustedHours}:${minutes
        .toString()
        .padStart(2, '0')}`;
      return timeString;
    }
  }

  return null;
}
export function extractAndFormatDate(input: string): string | null {
  const parts = input.split('-');

  if (parts.length === 5) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    if (year.length === 4 && month.length === 2 && day.length === 2) {
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    }
  }

  return null;
}
export function removeDuplicates(objects: any) {
  const uniqueObjects: any = [];

  for (const obj of objects) {
    if (!uniqueObjects.some((uniqueObj: any) => isDuplicate(obj, uniqueObj))) {
      uniqueObjects.push(obj);
    }
  }

  return uniqueObjects;
}
export function formatDateSearch(inputDate: string) {
  const dateParts = inputDate.split('-'); // Tách chuỗi ngày tháng năm thành mảng các phần tử

  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}
export const convertVietnameseToEnglish = (text: string) => {
  const vietnameseLetters =
    'àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ';
  const englishLetters =
    'aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy';
  if (!text) return '';
  return text
    .split('')
    .map((char: string) => {
      const index = vietnameseLetters.indexOf(char);
      return index !== -1 ? englishLetters.charAt(index) : char;
    })
    .join('');
};
export const convertFloatToHourMinute = (floatValue: number) => {
  const hours = Math.floor(floatValue / 60);
  const minutes = Math.floor(floatValue % 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const result = `${hours}:${formattedMinutes}`;
  return result;
};
export const convertFloatToHourMinuteV2 = (floatValue: number) => {
  const hours = Math.floor(floatValue);
  const minutes = Math.floor(floatValue / 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const result = `${hours}:${formattedMinutes}`;
  return result;
};
export const convertDatetimeStringToHourMinute = (datetimeString: string) => {
  const date = new Date(datetimeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const result = `${hours}:${formattedMinutes}`;
  return result;
};
export function filterObjectsByNameAndCode(obj: any[], searchQuery: string) {
  const filteredObj = obj.filter(department => {
    const normalizeString = (str: string) => {
      return str
        ? str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
        : '';
    };

    const filteredChildren = department.children.filter((employee: any) => {
      const normalizedEmployeeName = normalizeString(
        employee.employee_name || ''
      );
      const normalizedEmployeeCode = normalizeString(
        employee.employee_code || ''
      );
      const normalizedSearchQuery = normalizeString(searchQuery);

      const isMatched =
        !searchQuery ||
        normalizedEmployeeName.includes(normalizedSearchQuery) ||
        normalizedEmployeeCode.includes(normalizedSearchQuery);

      return isMatched;
    });
    department.children = filteredChildren;

    return filteredChildren.length > 0;
  });

  return filteredObj;
}

export function convertToTreeDataSelector(obj: any): ITreeNode[] {
  const treeData: ITreeNode[] = [];
  for (const item of obj) {
    const treeItem: ITreeNode = {
      title: item.name,
      value: `${item.type}~${item.id}`,
      children: [],
    };
    if (item.data && item.data.length > 0) {
      treeItem.children = item.data.map((dataItem: any) => ({
        title: dataItem.name,
        value: `${item.type}~${item.id}~${dataItem.id}~${dataItem.coefficient}`,
      }));
    }
    treeData.push(treeItem);
  }
  return treeData;
}

export function groupKPIByCompany(kpiList: any[]) {
  const groupedKPI: any = {};
  let keyCounter = 1;
  for (const kpi of kpiList) {
    const company = kpi.company;
    if (!groupedKPI[company]) {
      groupedKPI[company] = { key: keyCounter++, children: [] };
    }
    groupedKPI[company].children.push(kpi);
  }
  console.log('groupedKPI', groupedKPI);
  return groupedKPI;
}

export function transformObject(oldObject: any) {
  const newObject: any[] = [];
  const departments: { [department: string]: any } = {};
  let keyCounter = 1;

  oldObject.forEach((item: any) => {
    const {
      department,
      employee_name,
      employee_code,
      shift_name,
      date,
      job_title,
      join_date,
      probation_wage_rate,
      probation_completion_wage,
    } = item;

    if (!departments[department]) {
      const departmentObj: any = {
        key: keyCounter,
        company: item.company,
        department: department,
        children: [],
      };
      departments[department] = departmentObj;
      newObject.push(departmentObj);
      keyCounter++;
    }

    const departmentChildren = departments[department].children;
    const employeeKey = keyCounter;
    keyCounter++;

    const employeeObj: any = {
      key: employeeKey,
      employee_name,
      employee_code,
      company: item.company,
      department: department,
      shift_name,
      date,
      job_title: item.job_title,
      join_date: item.join_date,
      probation_wage_rate: item.probation_wage_rate,
      probation_completion_wage: item.probation_completion_wage,
    };

    const dateObj: any = {
      ...item,
      employee_name,
      employee_code,
      company: item.company,
      department: department,
      shift_name,
      date,
      job_title: item.job_title,
      join_date: item.join_date,
      probation_wage_rate: item.probation_wage_rate,
      probation_completion_wage: item.probation_completion_wage,
    };

    const existingEmployee = departmentChildren.find(
      (child: any) => child.employee_code === employee_code
    );

    if (existingEmployee) {
      existingEmployee[date] = dateObj;
    } else {
      employeeObj[date] = dateObj;
      departmentChildren.push(employeeObj);
    }
  });

  for (let department_item of newObject) {
    if (department_item.department == null) {
      continue;
    }

    for (let employee_item of department_item.children) {
      let count_ph = 0;
      let count_ph_staff = 0;
      let count_split_shift = 0;
      let count_split_shift_staff = 0;
      let count_ot_normal = 0;
      let count_ot_normal_staff = 0;
      let count_ot_holiday = 0;
      let count_ot_holiday_staff = 0;
      let count_nh_holiday = 0;
      let count_nh_holiday_staff = 0;
      let count_nh_normal = 0;
      let count_nh_normal_staff = 0;
      for (let attendance_item in employee_item) {
        if (typeof employee_item[attendance_item] === 'object') {
          try {
            if (
              employee_item[attendance_item]?.hasOwnProperty('ph_day') &&
              employee_item[attendance_item]?.ph_day != null &&
              employee_item[attendance_item]?.check_job_trial == true
            ) {
              count_ph += employee_item[attendance_item].ph_day;
            }
            if (
              employee_item[attendance_item]?.hasOwnProperty('ph_day') &&
              employee_item[attendance_item]?.ph_day != null &&
              employee_item[attendance_item]?.check_job_trial == false
            ) {
              count_ph_staff += employee_item[attendance_item].ph_day;
            }
            if (
              employee_item[attendance_item]?.hasOwnProperty('split_shift') &&
              employee_item[attendance_item]?.split_shift != null &&
              employee_item[attendance_item]?.check_job_trial == true &&
              employee_item[attendance_item]?.split_shift == true
            ) {
              count_split_shift += 1;
            }

            if (
              employee_item[attendance_item]?.hasOwnProperty('split_shift') &&
              employee_item[attendance_item]?.split_shift != null &&
              employee_item[attendance_item]?.check_job_trial == false &&
              employee_item[attendance_item]?.split_shift == true
            ) {
              count_split_shift_staff += 1;
            }
            const otNormal = employee_item[attendance_item]?.ot_normal;
            const otHoliday = employee_item[attendance_item]?.ot_holiday;
            const nhNormal = employee_item[attendance_item]?.night_hours_normal;
            const nhHoliday =
              employee_item[attendance_item]?.night_hours_holiday;
            const isJobTrial = employee_item[attendance_item]?.check_job_trial;

            // Hàm để thêm giờ làm thêm (OT) vào biến đếm tương ứng
            const addOtToCount = (count: number, value: number | null) => {
              if (value != null) {
                count += value;
              }
            };

            // Kiểm tra và thêm giờ làm thêm (OT) vào biến đếm
            if (isJobTrial === true) {
              addOtToCount(count_ot_normal, otNormal);
              addOtToCount(count_ot_holiday, otHoliday);
              addOtToCount(count_nh_normal, nhNormal);
              addOtToCount(count_nh_holiday, nhHoliday);
            } else if (isJobTrial === false) {
              addOtToCount(count_ot_normal_staff, otNormal);
              addOtToCount(count_ot_holiday_staff, otHoliday);
              addOtToCount(count_nh_normal_staff, nhNormal);
              addOtToCount(count_nh_holiday_staff, nhHoliday);
            }
          } catch (err) {
            console.log(err, employee_item);
            break;
          }
        }

        employee_item.count_ph = count_ph;
        employee_item.count_ph_staff = count_ph_staff;
        employee_item.count_split_shift = count_split_shift;
        employee_item.count_split_shift_staff = count_split_shift_staff;

        employee_item.count_ot_normal = count_ot_normal;
        employee_item.count_ot_normal_staff = count_ot_normal_staff;
        employee_item.count_ot_holiday = count_ot_holiday;
        employee_item.count_ot_holiday_staff = count_ot_holiday_staff;
        employee_item.count_nh_normal = count_nh_normal;
        employee_item.count_nh_normal_staff = count_nh_normal_staff;
        employee_item.count_nh_holiday = count_nh_holiday;
        employee_item.count_nh_holiday_staff = count_nh_holiday_staff;
      }
    }
    for (let employee_item of department_item.children) {
      let employee_work_in_month = 0;
      let employee_work_in_month_probation = 0;
      let employee_work_in_month_staff = 0;
      let normal_working_days = 0;
      let normal_working_days_staff = 0;
      let amount_cl_reserve = 0;
      let amount_cl_reserve_staff = 0;
      let amount_al_reserve_staff = 0;
      let actual_paid_day = 0;

      for (let attendance_item in employee_item) {
        if (typeof employee_item[attendance_item] !== 'object') {
          continue;
        }
        try {
          const actual_total_work_time =
            employee_item[attendance_item]?.actual_total_work_time;
          if (actual_total_work_time != null) {
            employee_work_in_month += actual_total_work_time;
          }
        } catch (err) {
          console.log(err, employee_item);
          break;
        }

        try {
          const actual_total_work_time =
            employee_item[attendance_item]?.actual_total_work_time;
          const check_job_trial =
            employee_item[attendance_item]?.check_job_trial;

          if (
            actual_total_work_time != null &&
            check_job_trial != null &&
            check_job_trial === true
          ) {
            employee_work_in_month_staff += actual_total_work_time;
          }
          if (actual_total_work_time != null && check_job_trial === true) {
            employee_work_in_month_probation += actual_total_work_time;
          }
          if (
            actual_total_work_time != null &&
            check_job_trial != null &&
            check_job_trial === false
          ) {
            employee_work_in_month_staff += actual_total_work_time;
          }
          if (
            employee_work_in_month_probation != null &&
            employee_work_in_month_staff != null
          ) {
            actual_paid_day =
              employee_work_in_month_probation + employee_work_in_month_staff;
          }
          // console.log('Check công thực tế', actual_paid_day);

          if (
            employee_item[attendance_item]?.hasOwnProperty('total_work_time') &&
            employee_item[attendance_item]?.total_work_time != null &&
            employee_item[attendance_item]?.total_work_time > 0 &&
            check_job_trial === true
          ) {
            normal_working_days +=
              employee_item[attendance_item].total_work_time;
          }

          if (
            employee_item[attendance_item]?.hasOwnProperty('total_work_time') &&
            employee_item[attendance_item]?.total_work_time != null &&
            employee_item[attendance_item]?.total_work_time > 0 &&
            check_job_trial === false
          ) {
            normal_working_days_staff +=
              employee_item[attendance_item].total_work_time;
          }

          if (
            employee_item[attendance_item]?.hasOwnProperty(
              'amount_cl_reserve'
            ) &&
            employee_item[attendance_item]?.amount_al_reserve != null &&
            check_job_trial === true
          ) {
            amount_cl_reserve +=
              employee_item[attendance_item].amount_al_reserve;
          }
          if (
            employee_item[attendance_item]?.hasOwnProperty(
              'amount_cl_reserve'
            ) &&
            employee_item[attendance_item]?.amount_al_reserve != null &&
            check_job_trial === false
          ) {
            amount_cl_reserve_staff +=
              employee_item[attendance_item].amount_al_reserve;
          }

          if (
            employee_item[attendance_item]?.hasOwnProperty(
              'amount_al_reserve'
            ) &&
            employee_item[attendance_item]?.amount_cl_reserve != null &&
            check_job_trial === false
          ) {
            amount_al_reserve_staff +=
              employee_item[attendance_item].amount_cl_reserve;
          }
        } catch (err) {
          console.log(err, employee_item);
          break;
        }
      }
      employee_item.employee_work_in_month = employee_work_in_month;
      employee_item.employee_work_in_month_probation =
        employee_work_in_month_probation;
      employee_item.employee_work_in_month_staff = employee_work_in_month_staff;

      employee_item.actual_paid_day = actual_paid_day;

      employee_item.normal_working_days = normal_working_days;
      employee_item.normal_working_days_staff = normal_working_days_staff;

      employee_item.amount_cl_reserve = amount_cl_reserve;
      employee_item.amount_cl_reserve_staff = amount_cl_reserve_staff;

      employee_item.amount_al_reserve_staff = amount_al_reserve_staff;
    }

    for (let employee_item of department_item.children) {
      let count_ktl = 0;
      let count_ctl = 0;
      let count_ctl_staff = 0;
      for (let attendance_item in employee_item) {
        if (typeof employee_item[attendance_item] === 'object') {
          try {
            if (
              employee_item[attendance_item]?.hasOwnProperty('ktl_day') &&
              employee_item[attendance_item]?.ktl_day != null
            ) {
              count_ktl += employee_item[attendance_item].ktl_day;
            }
          } catch (err) {
            console.log(err, employee_item);
            break;
          }
        }
        if (typeof employee_item[attendance_item] === 'object') {
          try {
            if (
              employee_item[attendance_item]?.hasOwnProperty('ctl_day') &&
              employee_item[attendance_item]?.ctl_day != null &&
              employee_item[attendance_item]?.check_job_trial == false
            ) {
              count_ctl_staff += employee_item[attendance_item].ctl_day;
            }
          } catch (err) {
            console.log(err, employee_item);
            break;
          }
        }
        if (typeof employee_item[attendance_item] === 'object') {
          try {
            if (
              employee_item[attendance_item]?.hasOwnProperty('ctl_day') &&
              employee_item[attendance_item]?.ctl_day != null &&
              employee_item[attendance_item]?.check_job_trial == true
            ) {
              count_ctl += employee_item[attendance_item].ctl_day;
            }
          } catch (err) {
            console.log(err, employee_item);
            break;
          }
        }
        employee_item.count_ktl = count_ktl;
        employee_item.count_ctl_staff = count_ctl_staff;
        employee_item.count_ctl = count_ctl;
      }
    }

    for (let employee_item of department_item.children) {
      let count_off = 0;

      for (let attendance_item in employee_item) {
        if (typeof employee_item[attendance_item] === 'object') {
          try {
            if (
              employee_item[attendance_item]?.hasOwnProperty('shift_name') &&
              employee_item[attendance_item]?.shift_name != null
            ) {
              const shiftName = employee_item[attendance_item]?.shift_name;

              // Kiểm tra xem shift_name chứa "/OFF" hay không
              if (shiftName.includes('/OFF')) {
                count_off += 0.5; // Nếu có, cộng thêm 0.5
              } else if (shiftName === 'OFF') {
                count_off += 1;
              }
              // console.log('CHEKC OFFFFFF', count_off);
            }
          } catch (err) {
            console.log(err, employee_item);
            break;
          }
        }

        employee_item.count_off = count_off;
      }
    }

    for (let employee_item of department_item.children) {
      let totalStandardWorkingDay = 0;
      let countValidStandardWorkingDay = 0;

      for (let attendance_item in employee_item) {
        if (typeof employee_item[attendance_item] === 'object') {
          try {
            if (
              employee_item[attendance_item]?.hasOwnProperty(
                'standard_working_day'
              ) &&
              employee_item[attendance_item]?.standard_working_day != null &&
              employee_item[attendance_item]?.standard_working_day > 0
            ) {
              totalStandardWorkingDay +=
                employee_item[attendance_item].standard_working_day;
              countValidStandardWorkingDay += 1;
            }
          } catch (err) {
            console.log(err, employee_item);
            break;
          }
        }
      }
      // Tính trung bình cộng
      const averageStandardWorkingDay =
        countValidStandardWorkingDay > 0
          ? totalStandardWorkingDay / countValidStandardWorkingDay
          : 0;
      employee_item.averageStandardWorkingDay = averageStandardWorkingDay;
    }
  }

  // console.log('newObject', newObject);
  return newObject;
}

export function formatedHistoryShift(objects: any[]) {
  const groupedObj = [];
  for (const obj of objects) {
    var tempGroupedObj: any = {};
    const createDate = obj.create_date;
    const user = Object.values(obj.user_id)[1];
    console.log(user);
    // Kiểm tra nếu createDate chưa tồn tại trong groupedObj, thì tạo mới
    if (!tempGroupedObj['create_date']) {
      tempGroupedObj['create_date'] = '';
    }
    if (!tempGroupedObj['user']) {
      tempGroupedObj['user'] = [];
    }
    tempGroupedObj['create_date'] = obj.create_date;
    const tempValue = {
      old_value: obj.old_value_text,
      new_value: obj.new_value_text,
    };
    var tempObj: any = {
      name: '',
      value: [],
    };
    tempObj.name = obj.user_id[1];
    tempObj.value[0] = tempValue;
    tempGroupedObj['user'][0] = tempObj;
    if (groupedObj.length > 0) {
      const objCreatedDateIndex = groupedObj.findIndex(
        item => item.create_date === createDate
      );
      if (objCreatedDateIndex < 0) {
        groupedObj.push(tempGroupedObj);
      } else {
        const objeUserIndex = groupedObj[objCreatedDateIndex]['user'].findIndex(
          (item: any) => item.name === user
        );
        if (objeUserIndex < 0) {
          groupedObj[objCreatedDateIndex]['user'].push(tempObj);
        } else {
          groupedObj[objCreatedDateIndex]['user'][objeUserIndex]['value'].push(
            tempObj.value[0]
          );
        }
      }
    } else {
      groupedObj.push(tempGroupedObj);
    }
  }
  return groupedObj;
}

export function formatObjectLabelValue(objects: any[]) {
  var formatedObjectArr = [];
  for (const obj of objects) {
    var tempObj: any = {};
    if (!tempObj['label']) {
      tempObj['label'] = '';
    }
    if (!tempObj['value']) {
      tempObj['value'] = '';
    }
    tempObj['value'] = obj.id;
    tempObj['label'] = obj.name;
    formatedObjectArr.push(tempObj);
  }
  return formatedObjectArr;
}

export function formatLeaveArr(objects: any) {
  var formatedArr = [];
  for (const obj of objects) {
    formatedArr.push(obj.id);
  }
  return formatedArr.join();
}

export function isObjectDefined(obj?: any): boolean {
  // Kiểm tra xem đối tượng có phải là undefined không
  if (obj === undefined) {
    return false;
  }

  // Kiểm tra xem ít nhất một cặp key-value trong đối tượng có giá trị hay không
  return Object.values(obj).some(
    value => value !== undefined && value !== '' && value !== null
  );
}
