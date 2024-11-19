import { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useLocale } from '@/locales';
import { companyHoSearchOptions } from '@/const/options';
import { useDispatch } from 'react-redux';
import { setSearchData } from '@/stores/search.store';
const SearchUserMis = () => {
  const [rows, setRows] = useState([
    { id: 1, name: '', fillter: 'ilike', valueSearch: '' },
  ]);
  const [dataCompany, setDataCompany] = useState<{ label: any; value: any }[]>(
    []
  );
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchDataCompany = async () => {
      const result = await companyHoSearchOptions();
      setDataCompany(result);
    };
    const names = rows.map(row => row.name);
    // if (names.includes('company_id')) {
    fetchDataCompany();
    // }
  }, []);

  const { Option } = Select;
  const state = [
    { Label: 'Chưa từng kết nối', value: 'new' },
    { Label: 'Đã xác nhận', value: 'active' },
  ];
  const fieldLabels: any = [
    (is_administrative === 'true' || sub_admin_role !== 'none') && {
      Label: 'Công ty',
      value: 'company_id',
    },
    { Label: 'Tên nhân viên', value: 'name' },
    { Label: 'Tài khoản đăng nhập', value: 'login' },
    { Label: 'Trạng thái', value: 'state' },
  ].filter(Boolean);

  const optionWithString = [
    { Label: 'có chứa', value: 'ilike' },
    { Label: 'không chứa', value: 'not ilike' },
    { Label: 'bằng', value: '=' },
    { Label: 'khác', value: '!=' },
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
  const isButtonDisabled = rows.some(row => !row.name || !row.valueSearch);
  const getOptions = (name: string) => {
    const selectFill = ['company_id', 'state'];
    const stringFill = ['name', 'login'];
    if (stringFill.includes(name)) {
      return optionWithString;
    }
    if (selectFill.includes(name)) {
      return optionWithSelect;
    }
    return optionWithString;
  };
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
                {['name', 'login'].includes(row.name) && (
                  <Input
                    placeholder="Nhập dữ liệu tìm kiếm"
                    onChange={e => handleFieldChange3(e.target.value, row.id)}
                    value={row.valueSearch || undefined}
                  />
                )}
                {['company_id', 'state'].includes(row.name) && (
                  <Select
                    placeholder="Nhập dữ liệu tìm kiếm"
                    onChange={value => handleFieldChange3(value, row.id)}
                    showSearch={true}
                    filterOption={(input, option: any) =>
                      option?.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={row.valueSearch || undefined}>
                    {row.name === 'company_id' &&
                      dataCompany.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.label}
                        </Option>
                      ))}
                    {row.name === 'state' &&
                      state.map(field => (
                        <Option key={field.value} value={field.value}>
                          {field.Label}
                        </Option>
                      ))}
                  </Select>
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
