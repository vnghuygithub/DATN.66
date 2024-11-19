import MyPage from '@/components/business/page';

import { Col } from 'antd';
import SelectDepartment from '@/pages/components/selects/selectDepartment';
import { employeeAllocationStateOptions } from '@/const/options';
import SelectCompany from '@/pages/components/selects/SelectCompany';
import SelectNewCompany from '@/pages/components/selects/SelectNewCompany';
import SelectSearchAllocationDepartment from '@/pages/components/selects/SelectSearchAllocationDepartment';
import { useState } from 'react';
import SelectMultipleEmployeeSearch from '@/pages/components/selects/SelectMultipleEmployeeSearch';
import SelectCurrentCompanySearch from '@/pages/components/selects/SelectCurrentCompanySearch';
import SelectDepartmentEmployee from '@/pages/components/selects/SelectDepartmentEmployee';
import SelectCurrentDepartmentEmployee from '@/pages/components/selects/SelectCurrentDepartment';
import SelectCurrentDepartmentEmployeeSearch from '@/pages/components/selects/SelectCurrentDepartmentSearch';

const { Item: SearchItem } = MyPage.MySearch;
const SearchEmployeeAllocation = () => {
  const [clearDepartment, setClearDepartment] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [selectCurrentCompany, setSelectedCurrentCompany] = useState<
    number | null
  >(null);
  const handleCompanyChange = (value: number) => {
    setSelectedCompanyId(value);
  };
  const handleCurrentCompanyChange = (value: number) => {
    setSelectedCurrentCompany(value);
  };
  return (
    <>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Tên phiếu'}
          name="name"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: 'Tên phiếu',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Loại phiếu'}
          name="allocation_type"
          type="select"
          options={[
            {
              label: 'Công ty',
              value: 'công ty',
            },
            {
              label: 'Phòng ban',
              value: 'phòng ban',
            },
          ]}
          innerprops={{
            allowClear: true,
            placeholder: 'Loại phiếu',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Ngày tạo'}
          name="create_date"
          type="date-picker"
          innerprops={{
            allowClear: true,
            placeholder: 'Ngày tạo',
            format: 'DD/MM/YYYY',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Ngày duyệt'}
          name="approved_date"
          type="date-picker"
          innerprops={{
            allowClear: true,
            placeholder: 'Ngày duyệt',
            format: 'DD/MM/YYYY',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectMultipleEmployeeSearch />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Trạng thái'}
          name="state"
          type="select"
          innerprops={{
            allowClear: true,
            placeholder: 'Trạng thái',
          }}
          options={employeeAllocationStateOptions}
        />
      </Col>
    </>
  );
};
export default SearchEmployeeAllocation;
