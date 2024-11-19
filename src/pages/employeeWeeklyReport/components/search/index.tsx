import MyPage from '@/components/business/page';
import { useLocale } from '@/locales';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';
import SelectDepartmentEmployee from '@/pages/components/selects/SelectDepartmentEmployee';
import SelectEmployeeContractSearch from '@/pages/components/selects/SelectEmployeeContractSearch';
import { Col } from 'antd';

const { Item: SearchItem } = MyPage.MySearch;

const EmployeeWeeklyReportSearch = () => {
  const { t } = useLocale();
  return (
    <>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectEmployeeContractSearch />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectDepartmentEmployee />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Ngày gửi báo cáo'}
          name="date"
          type="date-picker"
          innerprops={{
            allowClear: true,
            placeholder: 'Ngày gửi báo cáo',
            format: 'DD/MM/YYYY',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem 
          label="Tháng"
          name="month"
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
          label="Trạng thái"
          name="state"
          type="select"
          options={[
            { label: 'Đúng giờ', value: 'đúng giờ' },
            { label: 'Muộn giờ', value: 'muộn giờ ' },
            { label: 'Chưa gửi', value: 'chưa gửi' },
          ]}
          innerprops={{
            allowClear: true,
            placeholder: 'Trạng thái',
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
            placeholder: 'Chức vụ',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectCompanyHO />
      </Col>
    </>
  );
};

export default EmployeeWeeklyReportSearch;
