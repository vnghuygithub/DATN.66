import { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { useLocale } from '@/locales';
import {
  companyHoSearchOptions,
  departmentOptions,
  employeeOptions,
} from '@/const/options';
import dayjs from 'dayjs';
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
  const dispatch = useDispatch();
  const [dataCompany, setDataCompany] = useState<{ label: any; value: any }[]>(
    []
  );
  const [reviewer, setReviewer] = useState<{ label: any; value: any }[]>([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stateFromDashboard = queryParams.get('state');

  useEffect(() => {
    if (stateFromDashboard) {
      setRows(prevRows =>
        prevRows.map(row =>
          row.id === 1
            ? {
                ...row,
                fillter: '=',
                valueSearch: stateFromDashboard,
                name: 'validated',
              }
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

  useEffect(() => {
    const fetchDataCompany = async () => {
      const result = await companyHoSearchOptions();
      setDataCompany(result);
    };

    const fetchDataDepartment = async () => {
      const result = await departmentOptions();
      setDepartment(result);
    };

    const fetchDataReviewer = async () => {
      const result = await employeeOptions();
      setReviewer(result);
    };
    const names = rows.map(row => row.name);

    // if(names.includes('reviewer')){

    fetchDataReviewer();
    // }

    // if (names.includes('company_id')) {
    fetchDataCompany();
    // }

    // if (names.includes('department_id')) {
    fetchDataDepartment();
    // }
  }, []);

  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const { Option } = Select;
  const state = [
    { value: '1', label: 'Chờ duyệt' },
    { value: '2', label: 'Đã duyệt' },
  ];
  const reason = [
    { value: '1', label: 'Cá nhân' },
    { value: '2', label: 'Công việc' },
  ];

  const invalid_type = [
    { value: '1', label: 'Về sớm' },
    { value: '2', label: 'Đi muộn' },
    { value: '5', label: 'Ra ngoài' },
  ];
  const month = [
    { value: '01', label: '01' },
    { value: '02', label: '02' },
    { value: '03', label: '03' },
    { value: '04', label: '04' },
    { value: '05', label: '05' },
    { value: '06', label: '06' },
    { value: '07', label: '07' },
    { value: '08', label: '08' },
    { value: '09', label: '09' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
  ];
  const fieldLabels: any = [
    {
      Label: 'Tháng',
      value: 'month',
    },
    {
      Label: 'Trạng thái',
      value: 'validated',
    },
    { Label: 'Tên nhân viên ', value: 'employee_name_unaccent' },
    { Label: 'Mã nhân viên ', value: 'employee_code' },
    { Label: 'Vị trí', value: 'position' },
    (is_administrative === 'true' || sub_admin_role !== 'none') && {
      Label: 'Công ty',
      value: 'company_id',
    },
    { Label: 'Phòng ban', value: 'department_id' },
    { Label: 'Ngày vi phạm', value: 'invalid_date' },
    { Label: 'Loại giải trình', value: 'invalid_type' },
    { Label: 'Lý do', value: 'reason' },
    { Label: 'Người duyệt', value: 'reviewer' },
  ].filter(Boolean);

  const optionWithString = [
    { Label: 'có chứa', value: 'ilike' },
    { Label: 'không chứa', value: 'not ilike' },
    { Label: 'bằng', value: '=' },
    { Label: 'khác', value: '!=' },
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
      'validated',
      'department_id',
      'company_id',
      'invalid_type',
      'reason',
      'reviewer',
      'month',
    ];

    const stringFill = ['employee_name_unaccent', 'employee_code', 'position'];
    const dateFill = ['invalid_date'];

    if (stringFill.includes(name)) {
      return optionWithString;
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
                  style={{
                    visibility: row.name === 'month' ? 'hidden' : 'visible',
                  }}
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
                  'employee_code',
                  'employee_name_unaccent',
                  'position',
                  'employee_job_title',
                ].includes(row.name) && (
                  <Input
                    placeholder="Nhập dữ liệu tìm kiếm"
                    onChange={e => handleFieldChange3(e.target.value, row.id)}
                    value={row.valueSearch || undefined}
                  />
                )}
                {[
                  'validated',
                  'department_id',
                  'company_id',
                  'invalid_type',
                  'reason',
                  'reviewer',
                  'month',
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
                    {row.name === 'validated' &&
                      state.map(field => (
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
                    {row.name === 'month' &&
                      month.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}
                    {row.name === 'company_id' &&
                      dataCompany.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}
                    {row.name === 'invalid_type' &&
                      invalid_type.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}

                    {row.name === 'reason' &&
                      reason.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}
                    {row.name === 'reviewer' &&
                      reviewer.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}
                  </Select>
                )}

                {['invalid_date'].includes(row.name) && (
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
