import MyPage from '@/components/business/page';
import { useLocale } from '@/locales';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';
import { Col } from 'antd';

const { Item: SearchItem } = MyPage.MySearch;
const SearchShift = () => {
  const { t } = useLocale();
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  return (
    <>
      <Col xs={12} lg={7}>
        <SearchItem
          label={t({ id: 'name' })}
          name="name"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: t({ id: 'placeholder_input' }, { msg: 'Tên ca' }),
          }}
        />
      </Col>
      {
        (is_administrative === "true" || sub_admin_role !== "none") && (
          <Col xs={12} lg={7}>
            <SelectCompanyHO />
          </Col>
        )
      }
    </>
  );
};

export default SearchShift;
