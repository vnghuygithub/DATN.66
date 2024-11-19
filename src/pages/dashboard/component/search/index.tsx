import MyPage from '@/components/business/page';
import { useLocale } from '@/locales';
import { Col } from 'antd';

const { Item: SearchItem } = MyPage.MySearch;

const DashBoardFilter = () => {
  const { t } = useLocale();
  return (
    <>
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
    </>
  );
};

export default DashBoardFilter;
// EmployeeWeeklyReportSearch
