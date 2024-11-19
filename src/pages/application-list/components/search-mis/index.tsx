import { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { useLocale } from '@/locales';
import {
  companyHoSearchOptions,
  departmentOptions,
  employeeGeneralOptions,
  employeeOptions,
  holidayStatusOptions,
} from '@/const/options';
import { useDispatch } from 'react-redux';
import { setSearchData } from '@/stores/search.store';
import moment from 'moment';
import { convertVietnameseToEnglish } from '@/utils/common';
import { useLocation } from 'react-router-dom';
const SearchUserMis = () => {
  const [rows, setRows] = useState([
    { id: 1, name: '', fillter: 'ilike', valueSearch: '' },
  ]);

  const [department, setDepartment] = useState<{ label: any; value: any }[]>(
    []
  );
  const [holiday, setHoliday] = useState<{ label: any; value: any }[]>([]);
  const [employeeParent, setEmployeeParent] = useState<
    { label: any; value: any }[]
  >([]);
  const [employeeManenger, setEmployeeManenger] = useState<
    { label: any; value: any }[]
  >([]);
  const dispatch = useDispatch();

  const [dataCompany, setDataCompany] = useState<{ label: any; value: any }[]>(
    []
  );

  const { RangePicker } = DatePicker;
  useEffect(() => {
    const fetchDataCompany = async () => {
      const result = await companyHoSearchOptions();
      setDataCompany(result);
    };
    const fetchDataHoliday = async () => {
      const result = await holidayStatusOptions();
      setHoliday(result);
    };

    const fetchDataDepartment = async () => {
      const result = await departmentOptions();
      setDepartment(result);
    };

    const fetchDataEmployeeManenger = async () => {
      const result = await employeeGeneralOptions();
      setEmployeeManenger(result);
    };
    const fetchDataEmployeeParent = async () => {
      const result = await employeeOptions();
      setEmployeeParent(result);
    };
    const names = rows.map(row => row.name);
    // if (names.includes('employee_company_id')) {
    fetchDataCompany();
    // }
    // if (names.includes('holiday_status_id')) {
    fetchDataHoliday();
    // }
    // if (names.includes('department_id')) {
    fetchDataDepartment();
    // }

    // if (names.includes('hr_approval_name')) {
    fetchDataEmployeeManenger();
    // }
    // if (names.includes('employee_parent_id')) {
    fetchDataEmployeeParent();
    // }
  }, []);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const employee_code = queryParams.get('employee_code');
  const holiday_status_name = queryParams.get('holiday_status_name');
  const request_date_from = queryParams.get('request_date_from');
  const stateFromDashboard = queryParams.get('state');

  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const { Option } = Select;
  const state = [
    { value: 'confirm', label: 'Chờ duyệt' },
    { value: 'refuse', label: 'Từ chối' },
    { value: 'validate1', label: 'Đã duyệt cấp 1' },
    { value: 'validate', label: 'Đã duyệt' },
  ];

  const for_reasons = [
    { value: '1', label: 'Cá nhân' },
    { value: '2', label: 'Công việc' },
  ];
  const fieldLabels: any = [
    {
      Label: 'Trạng thái',
      value: 'state',
    },
    { Label: 'Tên nhân viên ', value: 'employee_name_unaccent' },
    { Label: 'Mã nhân viên ', value: 'employee_code' },
    { Label: 'Phòng ban', value: 'department_id' },
    { Label: 'Chức vụ', value: 'employee_job_title' },
    (is_administrative === 'true' || sub_admin_role !== 'none') && {
      Label: 'Công ty',
      value: 'employee_company_id',
    },
    { Label: 'Loại đơn', value: 'holiday_status_id' },
    { Label: 'Vì lý do', value: 'for_reasons' },
    { Label: 'Ngày tạo', value: 'create_date' },
    { Label: 'Lý do', value: 'reasons' },
    { Label: 'Số phút ', value: 'minutes' },
    { Label: 'Người duyệt ', value: 'employee_parent_id' },
    { Label: 'HCNS duyệt', value: 'hr_approval_name' },
    { Label: 'Ngày duyệt', value: 'approval_date' },
    { Label: 'Từ ngày => Đến ngày', value: 'dateRanger' },
  ].filter(Boolean);

  const optionWithString = [
    { Label: 'có chứa', value: 'ilike' },
    { Label: 'không chứa', value: 'not ilike' },
    { Label: 'bằng', value: '=' },
    { Label: 'khác', value: '!=' },
  ];
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
  const optionWithSelect = [{ Label: 'bằng', value: '=' }];

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
      'state',
      'department_id',
      'employee_company_id',
      'holiday_status_id',
      'hr_approval_name',
      'for_reasons',
      'employee_parent_id',
    ];

    const stringFill = [
      'employee_name_unaccent',
      'employee_code',
      'employee_job_title',
      'reasons',
    ];
    const numberFill = ['minutes'];
    const dateFill = ['create_date', 'approval_date', 'dateRanger'];

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

  useEffect(() => {
    if (stateFromDashboard) {
      setRows(prevRows =>
        prevRows.map(row =>
          row.id === 1
            ? { ...row,fillter:"=", valueSearch: stateFromDashboard, name: 'state' }
            : row
        )
      );
    }
  }, [stateFromDashboard]);
  useEffect(() => {
    const check = rows.some(row => row.valueSearch === '');
    if (stateFromDashboard && !check) {
      setTimeout(() => dispatch(setSearchData(rows)), 1000);
    }
  }, [rows]);
  const isButtonDisabled = rows.some(row => !row.name || !row.valueSearch);
  useEffect(() => {
    if (employee_code) {
      setRows((prevRows: any) =>
        prevRows
          .map((row: any) =>
            row.id === 1
              ? {
                  ...row,
                  valueSearch: employee_code.trim(),
                  name: 'employee_code',
                }
              : row
          )
          .concat(
            holiday_status_name
              ? {
                  id: prevRows.length + 1,
                  valueSearch: holiday_status_name.trim(),
                  name: 'holiday_status_id',
                  fillter: '=',
                }
              : [],

            request_date_from
              ? {
                  id: prevRows.length + 2,
                  valueSearch: [request_date_from, request_date_from],
                  name: 'dateRanger',
                  fillter: '=',
                }
              : []
          )
      );
    }
  }, [employee_code, holiday_status_name, request_date_from]);

  useEffect(() => {
    const check = rows.some(row => row.valueSearch === '');
    if (employee_code && !check) {
      setTimeout(() => dispatch(setSearchData(rows)), 1500);
    }
  }, [rows]);
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
                  style={{
                    visibility:
                      row.name === 'dateRanger' ? 'hidden' : 'visible',
                  }}
                  value={ row.fillter}
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
                  'employee_code',
                  'employee_name_unaccent',
                  'employee_job_title',
                  'reasons',
                ].includes(row.name) && (
                  <Input
                    placeholder="Nhập dữ liệu tìm kiếm"
                    onChange={e => handleFieldChange3(e.target.value, row.id)}
                    value={row.valueSearch || undefined}
                  />
                )}
                {[
                  'state',
                  'department_id',
                  'employee_company_id',
                  'holiday_status_id',
                  'hr_approval_name',
                  'for_reasons',
                  'employee_parent_id',
                ].includes(row.name) && (
                  <Select
                  showSearch={true}
                  filterOption={(input, option: any) =>
                    option?.children
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                    placeholder="Nhập dữ liệu tìm kiếm"
                    onChange={value => handleFieldChange3(value, row.id)}
                    value={row.valueSearch || undefined}>
                    {row.name === 'state' &&
                      state.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}
                    {row.name === 'employee_parent_id' &&
                      employeeParent.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}
                    {row.name === 'department_id' &&
                      department.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}
                    {row.name === 'employee_company_id' &&
                      dataCompany.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}
                    {row.name === 'holiday_status_id' &&
                      holiday.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}
                    {row.name === 'hr_approval_name' &&
                      employeeManenger.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}
                    {row.name === 'for_reasons' &&
                      for_reasons.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}
                  </Select>
                )}
                {['minutes'].includes(row.name) && (
                  <Input
                    type="number"
                    min={0}
                    placeholder="Nhập dữ liệu tìm kiếm"
                    onChange={e => handleFieldChange3(e.target.value, row.id)}
                    value={row.valueSearch || undefined}
                  />
                )}
                {['create_date', 'approval_date'].includes(row.name) && (
                  <DatePicker
                    style={{ width: '300px' }}
                    placeholder="Nhập dữ liệu tìm kiếm"
                    onChange={(date, dateString) =>
                      handleFieldChange3(dateString, row.id)
                    }
                    value={row.valueSearch ? moment(row.valueSearch) : null}
                    // format={'DD-MM-YYYY'}
                  />
                )}
                {['dateRanger'].includes(row.name) && (
                  <RangePicker
                    style={{ width: '300px' }}
                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                    onChange={(dates, dateStrings) =>
                      handleFieldChange3(dateStrings, row.id)
                    }
                    value={
                      row.valueSearch && row.valueSearch.length === 2
                        ? [
                            moment(row.valueSearch[0]),
                            moment(row.valueSearch[1]),
                          ]
                        : undefined
                    }
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

export default SearchUserMis;
