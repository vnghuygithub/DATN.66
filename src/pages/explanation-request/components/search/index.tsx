import MyPage from '@/components/business/page';
import {
  invalidTypeOptions,
  reasonOptions,
  validatedOptions,
} from '@/const/options';
import { IInvalidTimesheet } from '@/interface/weeklyreport/type';
import { useLocale } from '@/locales';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';
import { Col } from 'antd';

const { Item: SearchItem } = MyPage.MySearch;
const SearchExplainRequest = () => {
  const { t } = useLocale();
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  return (
    <>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Tên nhân viên'}
          name="employee_name"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: 'Tên nhân viên',
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
        <SearchItem
          label={'Phòng ban'}
          name="department"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: 'Phòng ban',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Vị trí'}
          name="position"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: 'Vị trí',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Loại giải trình'}
          name="invalid_type"
          type="select"
          options={invalidTypeOptions}
          innerprops={{
            allowClear: true,
            placeholder: 'Loại giải trình',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Lý do'}
          name="reason"
          type="select"
          options={reasonOptions}
          innerprops={{
            allowClear: true,
            placeholder: 'Lý do',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Người duyệt'}
          name="reviewer"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: 'Người duyệt',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Ngày vi phạm'}
          name="invalid_date"
          type="date-picker"
          innerprops={{
            format: 'DD/MM/YYYY',
            allowClear: true,
            inputReadOnly: true,
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Đã duyệt'}
          name="validated"
          type="select"
          options={validatedOptions}
          innerprops={{
            allowClear: true,
            placeholder: 'Đã duyệt',
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

export default SearchExplainRequest;
