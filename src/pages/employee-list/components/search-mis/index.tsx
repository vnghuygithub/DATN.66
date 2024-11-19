import { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { useLocale } from '@/locales';
import {
  bangCapCaoNhatOptions,
  companyHoSearchOptions,
  companyOptions,
  departmentOptions,
  employeeOptions,
  giotinhOptions,
  jobOptions,
  subDepartmentOptions,
  tinhTrangHonNhanOptions,
  workHourOptions,
  workLocationOptions,
} from '@/const/options';
import { useDispatch } from 'react-redux';
import { setSearchData } from '@/stores/search.store';
import moment from 'moment';
import { convertVietnameseToEnglish } from '@/utils/common';
import { useLocation } from 'react-router-dom';
const SearchEmployeeList = () => {
  const [rows, setRows] = useState([
    { id: 1, name: '', fillter: 'ilike', valueSearch: '' },
  ]);
  const [dataCompany, setDataCompany] = useState<{ label: any; value: any }[]>(
    []
  );
  const [dataManager, setDataManager] = useState<{ label: any; value: any }[]>(
    []
  );
  const [subcompanny, setSubcompany] = useState<{ label: any; value: any }[]>(
    []
  );
  const [department, setDepartment] = useState<{ label: any; value: any }[]>(
    []
  );
  const [job, setJob] = useState<{ label: any; value: any }[]>([]);
  const [workTime, setWorkTime] = useState<{ label: any; value: any }[]>([]);
  const [subDepartment, setSubDepartment] = useState<
    { label: any; value: any }[]
  >([]);
  const [workLocation, setWorkLocation] = useState<
    { label: any; value: any }[]
  >([]);
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDataCompany = async () => {
      const result = await companyHoSearchOptions();
      setDataCompany(result);
    };
    const fetchDataManenger = async () => {
      const result = await employeeOptions();
      setDataManager(result);
    };

    const fetchDataSubCompany = async () => {
      const result = await companyOptions();
      setSubcompany(result);
    };

    const fetchDataDepartment = async () => {
      const result = await departmentOptions();
      setDepartment(result);
    };
    const fetchDataJob = async () => {
      const result = await jobOptions();
      setJob(result);
    };

    const fetchDataWorkTime = async () => {
      const result = await workHourOptions();
      setWorkTime(result);
    };
    const fetchDataSubDepartment = async () => {
      const result = await subDepartmentOptions();
      setSubDepartment(result);
    };
    const fetchDataWorkLocation = async () => {
      const result = await workLocationOptions();
      setWorkLocation(result);
    };
    const names = rows.map(row => row.name);
    // if (names.includes('company_id')) {
    fetchDataCompany();
    // }
    // if (names.includes('parent_id')) {
    fetchDataManenger();
    // }
    // if (names.includes('part_time_company_id')) {
    fetchDataSubCompany();
    // }
    // if (names.includes('department_id')) {
    fetchDataDepartment();
    // }
    // if (names.includes('job_id')) {
    fetchDataJob();
    // }
    // if (names.includes('resource_calendar_id')) {
    fetchDataWorkTime();
    // }
    // if (names.includes('part_time_department_id')) {
    fetchDataSubDepartment();
    // }
    // if (names.includes('work_location')) {
    fetchDataWorkLocation();
    // }
  }, []);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const employee_code = queryParams.get('employee_code');

  useEffect(() => {
    if (employee_code) {
      setRows(prevRows =>
        prevRows.map(row =>
          row.id === 1
            ? { ...row, valueSearch: employee_code, name: 'code' }
            : row
        )
      );
    }
  }, [employee_code]);
  useEffect(() => {
    const check = rows.some(row => row.valueSearch === '');
    if (employee_code && !check) {
      dispatch(setSearchData(rows));
    }
  }, [rows]);
  const status = [
    { label: 'Đang làm việc', value: 'working' },
    { label: 'Đã nghỉ việc', value: 'resigned' },
  ];
  const { Option } = Select;
  const fieldLabels: any = [
    { Label: 'Trạng thái làm việc', value: 'working_status' },
    { Label: 'Mã nhân viên', value: 'code' },

    { Label: 'Ngày vào làm', value: 'workingday' },
    { Label: 'Id vân tay', value: 'time_keeping_code' },
    { Label: 'Tên nhân viên', value: 'employee_name_unaccent' },
    (is_administrative === 'true' || sub_admin_role !== 'none') && {
      Label: 'Công ty',
      value: 'company_id',
    },
    { Label: 'Công ty kiêm nhiệm', value: 'part_time_company_id' },
    { Label: 'Phòng ban', value: 'department_id' },
    { Label: 'Chức vụ', value: 'job_id' },
    { Label: 'Cấp nhân sự', value: 'level' },
    { Label: 'Số lần chấm công', value: 'time_keeping_count' },
    { Label: 'Số điện thoại cá nhân', value: 'mobile_phone' },
    { Label: 'Số điện thoại công việc', value: 'work_phone' },
    { Label: 'Giờ làm việc', value: 'resource_calendar_id' },
    { Label: 'Email', value: 'work_email' },
    { Label: 'Ngày thôi việc', value: 'severance_day' },
    { Label: 'Người quản lý', value: 'parent_id' },
    { Label: 'Phòng ban kiêm nhiệm', value: 'part_time_department_id' },
    {
      Label: 'Ngày hết hạn hợp đồng thử việc',
      value: 'probationary_contract_termination_date',
    },
    {
      Label: 'Ngày hết hạn hợp đồng hiện tại ',
      value: 'official_contract_end_date',
    },
    { Label: 'Mã số thuế cá nhân', value: 'tax_id' },
    { Label: 'Nơi làm việc', value: 'work_location' },
    { Label: 'Nơi sinh', value: 'place_of_birth' },
    { Label: 'Ngày sinh', value: 'birthday' },
    { Label: 'Giới tính', value: 'gender' },
    { Label: 'Số CMND', value: 'identification_id' },
    { Label: 'Tình trạng hôn nhân', value: 'marital' },
    { Label: 'STK ngân hàng', value: 'bank_account_number' },
    { Label: 'Số BHXH', value: 'social_insurance_number' },
    { Label: 'Bằng cấp cao nhất', value: 'certificate' },
  ].filter(Boolean);
  const optionWithString = [
    { Label: 'có chứa', value: 'ilike' },
    { Label: 'không chứa', value: 'not ilike' },
    { Label: 'bằng', value: '=' },
    { Label: 'khác', value: '!=' },
  ];
  const optionWithSelect = [{ Label: 'bằng', value: '=' }];
  const optionWithNumber = [
    { Label: 'bằng', value: '=' },
    { Label: 'không bằng', value: '!=' },
    { Label: 'lớn hơn', value: '>' },
    { Label: 'nhỏ hơn', value: '<' },
    { Label: 'Lớn hơn hoặc bằng', value: '>=' },
    { Label: 'Nhỏ hơn hoặc bằng', value: '<=' },
  ];

  const optionWithDate = [
    { Label: 'bằng', value: '=' },
    { Label: 'không bằng', value: '!=' },
    { Label: 'Lớn hơn hoặc bằng', value: '>=' },
    { Label: 'Nhỏ hơn hoặc bằng', value: '<=' },
  ];

  const { t } = useLocale();
  const addRow = () => {
    const newId = rows.length ? rows[rows.length - 1].id + 1 : 1;
    setRows([
      ...rows,
      {
        id: newId,
        name: '',
        fillter: '=',
        valueSearch: '',
      },
    ]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleFieldChange = (value: any, id: any) => {
    const newSelects = rows.map(select => {
      if (select.id === id) {
        return { ...select, name: value, valueSearch: '' };
      }
      return select;
    });
    setRows(newSelects);
  };
  const handleFieldChange2 = (value: any, id: any) => {
    const newSelects = rows.map(select => {
      if (select.id === id) {
        return { ...select, fillter: value };
      }
      return select;
    });
    setRows(newSelects);
  };
  const handleFieldChange3 = (value: any, id: any) => {
    const newSelects = rows.map(select => {
      if (select.id === id) {
        return { ...select, valueSearch: value };
      }
      return select;
    });
    setRows(newSelects);
  };
  const handleSubmitForm = async () => {
    const searchData = rows.map(row => {
      if (row.name === 'employee_name_unaccent') {
        const valueConvert = convertVietnameseToEnglish(
          row.valueSearch.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        ).trim();

        return { ...row, valueSearch: valueConvert };
      } else {
        return { ...row, valueSearch: row.valueSearch };
      }
    });

    dispatch(setSearchData(searchData));
  };

  const getOptions = (name: string) => {
    const selectFill = [
      'company_id',
      'part_time_company_id',
      'department_id',
      'job_id',
      'resource_calendar_id',
      'parent_id',
      'part_time_department_id',
      'work_location',
      'gender',
      'marital',
      'certificate',
      'working_status',
    ];

    const dateFill = [
      'workingday',
      'severance_day',
      'probationary_contract_termination_date',
      'birthday',
      'official_contract_end_date',
    ];
    const numberFill = ['time_keeping_count', 'level'];
    const stringFill = [
      'code',
      'time_keeping_code',
      'mobile_phone',
      'work_phone',
      'tax_id',
      'place_of_birth',
      'identification_id',
      'bank_account_number',
      'social_insurance_number',
      'work_email',
      'employee_name_unaccent',
    ];

    if (stringFill.includes(name)) {
      return optionWithString;
    }
    if (numberFill.includes(name)) {
      return optionWithNumber;
    }
    if (selectFill.includes(name)) {
      return optionWithSelect;
    }

    if (dateFill.includes(name)) {
      return optionWithDate;
    }

    return optionWithString;
  };
  const isButtonDisabled = rows.some(row => !row.name || !row.valueSearch);
  return (
    <div
      style={{ display: 'flex', alignContent: 'center' }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmitForm();
        }
      }}>
      <Button onClick={addRow} style={{ marginRight: '8px' }}>
        <h2 style={{ fontSize: '30px', marginTop: '-15px' }}>+</h2>
      </Button>
      <Row
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'center',
          flexDirection: 'column',
        }}>
        {rows.map(row => (
          <div
            key={row.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
            <Col span={10} style={{ width: '300px' }}>
              <Form.Item style={{ flex: 1, marginRight: '8px' }}>
                <Select
                  placeholder="Nhập trường tìm kiếm"
                  onChange={value => handleFieldChange(value, row.id)}
                  value={row.name || undefined}>
                  {fieldLabels.map((field: any) => (
                    <Option key={field.value} value={field.value}>
                      {field.Label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={10} style={{ width: '200px' }}>
              <Form.Item style={{ flex: 1, marginRight: '8px' }}>
                <Select
                  value={row.fillter}
                  placeholder="Nhập điều kiện tìm kiếm"
                  onChange={value => handleFieldChange2(value, row.id)}>
                  {getOptions(row.name).map(field => (
                    <Option key={field.value} value={field.value}>
                      {field.Label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={10} style={{ width: '200px' }}>
              <Form.Item style={{ flex: 1, marginRight: '8px' }}>
                {[
                  'code',
                  'time_keeping_code',
                  'mobile_phone',
                  'work_phone',
                  'tax_id',
                  'place_of_birth',
                  'identification_id',
                  'bank_account_number',
                  'social_insurance_number',
                  'work_email',
                  'employee_name_unaccent',
                ].includes(row.name) && (
                  <Input
                    placeholder="Nhập dữ liệu tìm kiếm"
                    onChange={e => handleFieldChange3(e.target.value, row.id)}
                    value={row.valueSearch || undefined}
                  />
                )}

                {[
                  'company_id',
                  'part_time_company_id',
                  'department_id',
                  'job_id',
                  'resource_calendar_id',
                  'parent_id',
                  'part_time_department_id',
                  'work_location',
                  'gender',
                  'marital',
                  'certificate',
                  'working_status',
                ].includes(row.name) && (
                  <Select
                  showSearch={true}
                  filterOption={(input, option: any) =>
                    option?.children
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                    placeholder="Nhập giá trị tìm kiếm"
                    value={row.valueSearch || undefined}
                    onChange={value => handleFieldChange3(value, row.id)}
                    disabled={!row.name}>
                    {row.name === 'company_id' &&
                      dataCompany.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    {row.name === 'parent_id' &&
                      dataManager.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    {row.name === 'part_time_company_id' &&
                      subcompanny.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    {row.name === 'department_id' &&
                      department.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    {row.name === 'job_id' &&
                      job.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    {row.name === 'resource_calendar_id' &&
                      workTime.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    {row.name === 'part_time_department_id' &&
                      subDepartment.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    {row.name === 'work_location' &&
                      workLocation.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    {row.name === 'gender' &&
                      giotinhOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    {row.name === 'marital' &&
                      tinhTrangHonNhanOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    {row.name === 'certificate' &&
                      bangCapCaoNhatOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    {row.name === 'working_status' &&
                      status.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                  </Select>
                )}

                {[
                  'workingday',
                  'severance_day',
                  'probationary_contract_termination_date',
                  'birthday',
                  'official_contract_end_date',
                ].includes(row.name) && (
                  <DatePicker
                    style={{ width: '300px' }}
                    placeholder="Nhập dữ liệu tìm kiếm"
                    onChange={(date, dateString) =>
                      handleFieldChange3(dateString, row.id)
                    }
                    value={row.valueSearch ? moment(row.valueSearch) : null}
                  />
                )}

                {['time_keeping_count', 'level'].includes(row.name) && (
                  <Input
                    type="number"
                    min={0}
                    placeholder="Nhập dữ liệu tìm kiếm"
                    onChange={e => handleFieldChange3(e.target.value, row.id)}
                    value={row.valueSearch || undefined}
                  />
                )}
              </Form.Item>
            </Col>

            {rows.length > 1 && (
              <Button
                onClick={() => removeRow(row.id)}
                style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '30px', marginTop: '-15px' }}>-</h2>
              </Button>
            )}
          </div>
        ))}
        <Button
          onClick={handleSubmitForm}
          type="primary"
          disabled={isButtonDisabled}
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '40px',
            zIndex: 999,
          }}>
          {t({ id: 'search' })}
        </Button>
      </Row>
    </div>
  );
};

export default SearchEmployeeList;
