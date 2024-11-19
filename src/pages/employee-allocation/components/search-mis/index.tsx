import { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { useLocale } from '@/locales';
import {
  companyHoSearchOptions,
  departmentOptions,
  employeeOptions,
  userOptions,
} from '@/const/options';
import { useDispatch } from 'react-redux';
import { setSearchData } from '@/stores/search.store';
import moment from 'moment';
const SearchUserMis = () => {
  const [rows, setRows] = useState([
    { id: 1, name: '', fillter: 'ilike', valueSearch: '' },
  ]);

  const [department, setDepartment] = useState<{ label: any; value: any }[]>(
    []
  );

  const [currentDepartment, setCurrentDepartment] = useState<
    { label: any; value: any }[]
  >([]);

  const dispatch = useDispatch();
  const [dataCurrentCompany, setDataCurrentCompany] = useState<
    { label: any; value: any }[]
  >([]);
  const [dataCompany, setDataCompany] = useState<{ label: any; value: any }[]>(
    []
  );

  const [approved, setApproved] = useState<{ label: any; value: any }[]>([]);
  useEffect(() => {
    const fetchDataCurrentCompany = async () => {
      const result = await companyHoSearchOptions();
      setDataCurrentCompany(result);
      setDataCompany(result);
    };

    // const fetchDataCompany = async () => {
    //   const result = await companyHoSearchOptions();
    // };
    const fetchDataDepartment = async () => {
      const result = await departmentOptions();
      setDepartment(result);
      setCurrentDepartment(result);
    };
    // const fetchDataCurrentDepartment = async () => {
    //   const result = await departmentOptions();
    // };
    const fetchDataApproved = async () => {
      const result = await employeeOptions();
      setApproved(result);
    };

    const names = rows.map(row => row.name);
    // if (names.includes('current_company_id')) {
    fetchDataCurrentCompany();
    // }
    // if (names.includes('company_id')) {
    // fetchDataCompany();
    // }
    // if (names.includes('department_id')) {
    fetchDataDepartment();
    // }
    // if (names.includes('current_department_id')) {
    // fetchDataCurrentDepartment();
    // }
    // if (names.includes('approved_by')) {
    fetchDataApproved();
    // }
  }, []);

  const { Option } = Select;
  const state = [
    { value: 'chờ duyệt', label: 'Chờ duyệt' },
    { value: 'đã duyệt', label: 'Đã duyệt' },
    { value: 'hủy', label: 'Hủy' },
  ];

  const allocation_type = [
    {
      label: 'Công ty',
      value: 'công ty',
    },
    {
      label: 'Phòng ban',
      value: 'phòng ban',
    },
  ];
  const fieldLabels: any = [
    {
      Label: 'Trạng thái',
      value: 'state',
    },
    { Label: 'Ngày tạo', value: 'create_date' },
    { Label: 'Tên phiếu', value: 'name' },
    { Label: 'Loại phiếu', value: 'allocation_type' },
    { Label: 'Công ty hiện tại', value: 'current_company_id' },
    { Label: 'Công ty chuyển đến', value: 'company_id' },
    { Label: 'Tên nhân viên ', value: 'employee_name' },
    { Label: 'Phòng ban hiện tại', value: 'current_department_id' },
    { Label: 'Phòng ban chuyển đến', value: 'department_id' },
    { Label: 'Ngày bắt đầu làm việc', value: 'new_company_working_date' },
    { Label: 'Ngày kết thúc làm việc', value: 'severance_day_old_company' },
    { Label: 'Ngày duyệt', value: 'approved_date' },
    { Label: 'Người duyệt', value: 'approved_by' },
  ];

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
    const selectFill = [
      'state',
      'current_company_id',
      'company_id',
      'department_id',
      'current_department_id',
      'allocation_type',
      'approved_by',
    ];

    const stringFill = ['employee_name', 'name'];
    const dateFill = [
      'create_date',
      'new_company_working_date',
      'severance_day_old_company',
      'approved_date',
    ];

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
                {['employee_name', 'name'].includes(row.name) && (
                  <Input
                    placeholder="Nhập dữ liệu tìm kiếm"
                    onChange={e => handleFieldChange3(e.target.value, row.id)}
                    value={row.valueSearch || undefined}
                  />
                )}
                {[
                  'state',
                  'current_company_id',
                  'company_id',
                  'department_id',
                  'current_department_id',
                  'allocation_type',
                  'approved_by',
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
                    {row.name === 'current_company_id' &&
                      dataCurrentCompany.map(field => (
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

                    {row.name === 'allocation_type' &&
                      allocation_type.map(field => (
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

                    {row.name === 'current_department_id' &&
                      currentDepartment.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}

                    {row.name === 'approved_by' &&
                      approved.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}
                  </Select>
                )}

                {[
                  'create_date',
                  'new_company_working_date',
                  'severance_day_old_company',
                  'approved_date',
                ].includes(row.name) && (
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
