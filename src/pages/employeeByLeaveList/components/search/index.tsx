import MyPage from '@/components/business/page';
import { useLocale } from '@/locales';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';
import SelectContractTypeSearch from '@/pages/components/selects/SelectContractTypeSearch';
import SelectEmployeeContractSearch from '@/pages/components/selects/SelectEmployeeContractSearch';
import SelectDepartment from '@/pages/components/selects/selectDepartment';
import { Col, Form } from 'antd';
import moment from 'moment';

const { Item: SearchItem } = MyPage.MySearch;
const SearchEmployeeByLeave = () => {
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  return (
    <>
      <Col span={7}>
        <SearchItem
          label={'Năm'}
          name="year"
          type="date-picker"
          innerprops={{
            allowClear: true,
            placeholder: 'Năm',
            picker: 'year',
          }}
        />
      </Col>
      <Col span={7}>
        <SelectContractTypeSearch />
      </Col>
      <Col span={7}>
        <SearchItem
          label="Ngày tính"
          name="date_calculate"
          type="date-picker"
          innerprops={{
            allowClear: true,
            placeholder: 'Ngày tính',
          }}
        />
      </Col>
      <Col span={7}>
        <SelectEmployeeContractSearch />
      </Col>
      <Col span={7}>
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
      <Col span={7}>
        <SelectDepartment />
      </Col>
      <Col span={7}>
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
      {
        (is_administrative === "true" || sub_admin_role !== "none") && (
          <Col span={7}>
            <SelectCompanyHO />
          </Col>
        )
      }
    </>
  );
};
export default SearchEmployeeByLeave;
