import { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { useLocale } from '@/locales';
import {
  companyHoSearchOptions,
  contractTypeOptions,
  departmentOptions,
  employeeOptions,
  jobTypeOptions,
  workHourOptions,
} from '@/const/options';
import { useDispatch } from 'react-redux';
import { setSearchData } from '@/stores/search.store';
import moment from 'moment';
const SearchLeaveManagementMis = () => {
  const [rows, setRows] = useState([
    { id: 1, name: '', fillter: 'ilike', valueSearch: '' },
  ]);

  const [department, setDepartment] = useState<{ label: any; value: any }[]>(
    []
  );

  const [dataCompany, setDataCompany] = useState<{ label: any; value: any }[]>(
    []
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDataCompany = async () => {
      const result = await companyHoSearchOptions();
      setDataCompany(result);
    };

    const fetchDataDepartment = async () => {
      const result = await departmentOptions();
      setDepartment(result);
    };

    const names = rows.map(row => row.name);

    // if (names.includes('department_id')) {
    fetchDataDepartment();
    // }

    // if (names.includes('company_id')) {
    fetchDataCompany();
    // }
  }, []);
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const { Option } = Select;

  const fieldLabels: any = [
    { Label: 'Ngày tính phép', value: 'date_calculate_leave' },
    (is_administrative === 'true' || sub_admin_role !== 'none') && {
      Label: 'Công ty',
      value: 'company_id',
    },
    { Label: 'Năm', value: 'year' },

    { Label: 'Tên nhân viên ', value: 'employee_name' },
    { Label: 'Mã nhân viên ', value: 'employee_code' },
    { Label: 'Phòng ban', value: 'department_id' },
    { Label: 'Chức vụ', value: 'job_title' },
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
    dispatch(setSearchData(rows));
  };

  const getOptions = (name: string) => {
    const selectFill = ['department_id', 'company_id'];

    const stringFill = ['employee_name', 'employee_code', 'job_title', 'year'];
    const dateFill = ['date_calculate_leave'];

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
                  'employee_name',
                  'job_title',
                  'year',
                ].includes(row.name) && (
                  <Input
                    placeholder="Nhập dữ liệu tìm kiếm"
                    onChange={e => handleFieldChange3(e.target.value, row.id)}
                    value={row.valueSearch}
                  />
                )}

                {['department_id', 'company_id'].includes(row.name) && (
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
                    {row.name === 'department_id' &&
                      department.map(field => (
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
                  </Select>
                )}
                {['date_calculate_leave'].includes(row.name) && (
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

export default SearchLeaveManagementMis;
