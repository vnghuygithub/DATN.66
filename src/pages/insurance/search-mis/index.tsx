import MyPage from '@/components/business/page';
import { useLocale } from '@/locales';
import SelectCompany from '@/pages/components/selects/SelectCompany';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';
import SelectDepartmentEmployee from '@/pages/components/selects/SelectDepartmentEmployee';
import SelectEmployeeContractSearch from '@/pages/components/selects/SelectEmployeeContractSearch';
import SelectJob from '@/pages/components/selects/SelectJob';
import SelectDepartment from '@/pages/components/selects/selectDepartment';
import { Button, Col, Select } from 'antd';
import { useState } from 'react';

const { Item: SearchItem } = MyPage.MySearch;
const { Option } = Select;
const fieldLabels: any = {
  employee_id: 'Nhân viên',
  employee_code: 'Mã nhân viên',
  department_id: 'Phòng ban',
  job_id: 'Chức vụ',
};
const SearchInsuranceMis = () => {
  const { t } = useLocale();
  const employee_ho = localStorage.getItem('employee_ho');

  const [selects, setSelects] = useState([
    { id: 1, selectedField: null, searchValue: '' },
  ]);
  const defaultSelectedField = Object.keys(fieldLabels)[0];
  const [selectedField, setSelectedField] = useState<null | string>(null);
  const [searchValues, setSearchValues] = useState(selects.map(() => ''));
  const [lastSearchValueHasValue, setLastSearchValueHasValue] = useState(false);
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');

  const handleAddSelect = () => {
    const newSelects = [
      ...selects,
      { id: selects.length + 1, selectedField: null, searchValue: '' },
    ];
    const lastSelect = newSelects[newSelects.length - 1];
    if (lastSelect && lastSelect.selectedField) {
      setLastSearchValueHasValue(true);
      console.log('true');
    } else if (lastSelect && lastSelect.searchValue?.trim()) {
      setLastSearchValueHasValue(true);
      console.log('true');
    } else {
      setLastSearchValueHasValue(false);
      console.log('false');
    }
    setSelects(newSelects);
    setSelectedField(null);
  };

  const handleDeleteSelect = (id: any) => {
    setSelectedField(defaultSelectedField);
    const newSelects = selects.filter(select => select.id !== id);
    setSelects(newSelects);
    const lastSelect = newSelects[newSelects.length - 1];
    if (lastSelect && lastSelect.searchValue?.trim()) {
      setLastSearchValueHasValue(true);
    } else {
      setLastSearchValueHasValue(false);
    }
  };

  const handleFieldChange = (value: any, id: any) => {
    setSelectedField(value);
    const newSelects = selects.map(select => {
      if (select.id === id) {
        return { ...select, selectedField: value };
      }
      return select;
    });
    setSelects(newSelects);
  };

  const handleSearchValueChange = (e: any, id: any) => {
    // Kiểm tra xem biến 'e' có tồn tại và có thuộc tính 'target' không
    if (e === undefined) {
      e = '';
    }
    if (e != undefined || e?.target != undefined) {
      const { value } = e?.target ?? e;
      console.log(value);

      const newSelects = selects.map(select => {
        if (select.id === id) {
          return { ...select, searchValue: value };
        }
        return select;
      });
      setSelects(newSelects);
      setSearchValues(newSelects.map(select => select.searchValue));

      if (id === selects.length && value?.trim()) {
        setLastSearchValueHasValue(true);
      } else if (id === selects.length && !value?.trim()) {
        setLastSearchValueHasValue(false);
      }
    }
  };

  const handleSearchValueSelectChange = (e: any, id: any) => {
    // if (!e) {
    //   e = '';
    // }
    // console.log(e);
    // if (e != undefined || e?.target != undefined) {
    //   const { value } = e?.target ?? e;
    //   const newSelects = selects.map(select => {
    //     if (select.id === id) {
    //       return { ...select, searchValue: value };
    //     }
    //     return select;
    //   });
    //   setSelects(newSelects);
    //   setSearchValues(newSelects.map(select => select.searchValue));
    //   if (e) {
    //     console.log(1);
    //     setLastSearchValueHasValue(true);
    //   } else {
    //     setLastSearchValueHasValue(false);
    //     console.log(3);
    //   }
    // }
    // console.log(e);
  };

  return (
    <>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label="Tháng"
          name="date"
          type="date-picker"
          innerprops={{
            allowClear: true,
            placeholder: 'Tháng',
            format: 'MM/YYYY',
            picker: 'month',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label="Tham gia BHXH"
          name="have_insurance"
          type="select"
          options={[
            { label: 'Có', value: true },
            { label: 'Không', value: false },
          ]}
        />
      </Col>
      {(is_administrative === 'true' || sub_admin_role !== 'none') && (
        <Col xs={24} sm={24} md={12} lg={7}>
          <SelectCompanyHO />
        </Col>
      )}
      <Button onClick={selectedField ? handleAddSelect : undefined}>
        <h2 style={{ fontSize: '30px', marginTop: '-15px' }}>+</h2>
      </Button>
      {selects.length > 1 && !lastSearchValueHasValue && (
        <Button
          onClick={() => handleDeleteSelect(selects[selects.length - 1].id)}>
          <h1 style={{ fontSize: '40px', marginTop: '-25px' }}>-</h1>
        </Button>
      )}

      {selects.map(({ id, selectedField, searchValue }) => (
        <div
          key={id}
          style={{
            width: '100%',
            display: 'flex',
            margin: '0px',
            padding: '0px',
          }}>
          <Col xs={12} sm={12} md={6} lg={7}>
            <Select
              placeholder="Chọn trường tìm kiếm"
              style={{ width: '100%' }}
              onChange={value => handleFieldChange(value, id)}>
              {Object.keys(fieldLabels).map(field => (
                <Option key={field} value={field}>
                  {fieldLabels[field]}
                </Option>
              ))}
            </Select>
          </Col>
          {selectedField !== 'job_id' &&
            selectedField !== 'employee_id' &&
            selectedField !== 'department_id' &&
            selectedField && (
              <Col
                xs={12}
                sm={12}
                md={6}
                lg={7}
                // xs={24} sm={24} md={12} lg={10}
              >
                <SearchItem
                  label={`Nhập`}
                  name={selectedField}
                  type="input"
                  innerprops={{
                    allowClear: true,
                    placeholder: t({ id: fieldLabels[selectedField] }),
                    value: searchValue,
                    onChange: (e: any) => handleSearchValueChange(e, id),
                  }}
                />
              </Col>
            )}

          {selectedField === 'employee_id' && (
            <Col xs={24} sm={24} md={12} lg={7}>
              <SelectEmployeeContractSearch
                onSelect={handleSearchValueSelectChange}
                onChange={handleSearchValueSelectChange}
              />
            </Col>
          )}
          {selectedField === 'department_id' && (
            <Col xs={24} sm={24} md={12} lg={7}>
              <SelectDepartmentEmployee
                onSelect={handleSearchValueSelectChange}
                onChange={handleSearchValueSelectChange}
              />
            </Col>
          )}
          {selectedField === 'job_id' && (
            <Col xs={24} sm={24} md={12} lg={7}>
              <SelectJob
                onSelect={handleSearchValueSelectChange}
                onChange={handleSearchValueSelectChange}
              />
            </Col>
          )}
        </div>
      ))}
    </>
  );
};
export default SearchInsuranceMis;
