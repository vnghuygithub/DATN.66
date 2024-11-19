import MyPage from '@/components/business/page';
import { useLocale } from '@/locales';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';
import SelectEmployeeContractSearch from '@/pages/components/selects/SelectEmployeeContractSearch';
import SelectDepartment from '@/pages/components/selects/selectDepartment';
import { Col, DatePicker, Form } from 'antd';
import moment from 'moment';

const { Item: SearchItem } = MyPage.MySearch;
const SearchLeaveManagement = ({ onChangeDate }: any) => {
  const { t } = useLocale();

  return (
    <>
      <Col xs={24} sm={24} md={12} lg={7}>
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
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectEmployeeContractSearch />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectDepartment />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label="Mã nhân viên"
          name="employee_code"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'Mã nhân viên' }
            ),
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label="Chức vụ"
          name="job_title"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: t({ id: 'placeholder_input' }, { msg: 'Chức vụ' }),
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label="Ngày tính phép"
          name="date_calculate_leave"
          type="date-picker"
          innerprops={{
            allowClear: true,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'Ngày tính phép' }
            ),
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
          <SelectCompanyHO />
      </Col>
    </>
  );
};
export default SearchLeaveManagement;
