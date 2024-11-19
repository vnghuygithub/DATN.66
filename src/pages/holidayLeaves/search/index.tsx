import MyPage from '@/components/business/page';
import MyForm from '@/components/core/form';
import SelectCompany from '@/pages/components/selects/SelectCompany';
import { Col } from 'antd';

const { Item: SearchItem } = MyPage.MySearch;

const SearchHolidayLeaves = () => {
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  return (
    <>
      <Col xs={12} lg={7}>
        <SearchItem
          name="name"
          type="input"
          label="Tên ngày lễ"
          innerprops={{
            allowClear: true,
            placeholder: 'Tên ngày lễ',
          }}
        />
      </Col>
      {(is_administrative === "true" || sub_admin_role !== "none") && (
        <Col span={7}>
          <SelectCompany />
        </Col>
      )}
    </>
  );
};

export default SearchHolidayLeaves;
