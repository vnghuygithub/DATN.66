import MyPage from '@/components/business/page';
import { useLocale } from '@/locales';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import SelectCompanyAllSearch from '@/pages/components/selects/SelectCompanyAllSearch';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';
import SelectDepartmentManager from '@/pages/components/selects/SelectDepartmentManager';
import SelectParentDepartment from '@/pages/components/selects/SelectParentDepartment';
import { Col, Row } from 'antd';

const { Item: SearchItem } = MyPage.MySearch;

const SearchDepartment = () => {
  const { t } = useLocale();
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const employee_ho = localStorage.getItem('employee_ho');
  return (
    <Row>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Tên phòng ban'}
          name="name"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: 'Tên phòng ban',
          }}
        />
      </Col>
      {(is_administrative === 'true' || sub_admin_role !== "none") && (
        <Col xs={24} sm={24} md={12} lg={7}>
          <SelectCompanyHO />
        </Col>
      )}
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectDepartmentManager />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectParentDepartment />
      </Col>
    </Row>
  );
};

export default SearchDepartment;
