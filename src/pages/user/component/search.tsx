import MyPage from '@/components/business/page';
import { useLocale } from '@/locales';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';
import { Col } from 'antd';
const { Item: SearchItem } = MyPage.MySearch;
const SearchUser = () => {
  const { t } = useLocale();
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  return (
    <>
      <Col span={7}>
        <SearchItem
          label="Tên"
          name="name"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: t({ id: 'placeholder_input' }, { msg: 'Tên' }),
          }}
        />
        <Col span={10}></Col>
      </Col>
      {(is_administrative === 'true' || sub_admin_role !== 'none') && (
        <Col span={7}>
          <SelectCompanyHO />
        </Col>
      )}
    </>
  );
};

export default SearchUser;
