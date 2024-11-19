import MyPage from '@/components/business/page';
import SelectEmployee from '@/pages/components/selects/selectEmployee';
import { Col } from 'antd';
import SelectEmployeeContract from '../../../components/selects/SelectEmployeeContract';
import SelectDepartment from '@/pages/components/selects/selectDepartment';
import SelectContractType from '@/pages/components/selects/SelectContractType';
import { contractStateOptions } from '@/const/options';
import SelectEmployeeContractSearch from '@/pages/components/selects/SelectEmployeeContractSearch';
import SelectContractTypeSearch from '@/pages/components/selects/SelectContractTypeSearch';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';

const { Item: SearchItem } = MyPage.MySearch;
const SearchContract = () => {
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  return (
    <>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Tên hợp đồng'}
          name="name"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: 'Tên hợp đồng',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Mã nhân viên'}
          name="employee_code"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: 'Mã nhân viên',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectEmployeeContractSearch />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectDepartment />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Chức vụ'}
          name="job_title"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: 'Chức vụ',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectContractTypeSearch />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Trạng thái'}
          name="state"
          type="select"
          options={contractStateOptions}
          innerprops={{
            allowClear: true,
            placeholder: 'Trạng thái',
          }}
        />
      </Col>
      {
        (is_administrative === "true" || sub_admin_role !== "none") && (
          <Col xs={24} sm={24} md={12} lg={7}>
        <SelectCompanyHO />
      </Col>
          )
      }
    </>
  );
};
export default SearchContract;
