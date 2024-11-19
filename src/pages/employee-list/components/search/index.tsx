import MyPage from '@/components/business/page';
import { workLocationOptions } from '@/const/options';
import { useLocale } from '@/locales';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import SelectCompanyAllSearch from '@/pages/components/selects/SelectCompanyAllSearch';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';
import SelectDepartmentEmployee from '@/pages/components/selects/SelectDepartmentEmployee';
import SelectUser from '@/pages/components/selects/SelectUser';
import { Col } from 'antd';
import { useEffect, useState } from 'react';

const { Item: SearchItem } = MyPage.MySearch;
const SearchEmployeee = () => {
  const { t } = useLocale();
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const [workLocation, setWorkLocation] = useState<any>([]);
  useEffect(() => {
    workLocationOptions().then((res) => {
      setWorkLocation(res);
    });
  }, []);
  return (
    <>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={t({ id: 'name' })}
          name="name"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: t({ id: 'searchEmployees' }) }
            ),
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Mã nhân viên'}
          name="code"
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
          label={'ID vân tay'}
          name="time_keeping_code"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: t({ id: 'placeholder_input' }, { msg: 'ID vân tay' }),
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectDepartmentEmployee />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Chức vụ'}
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
          label={'Ngày thôi việc'}
          name="severance_day"
          type="date-picker"
          innerprops={{
            allowClear: true,
            placeholder: t({ id: 'placeholder_input' }, { msg: 'ngày' }),
            format: 'DD/MM/YYYY',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={t({ id: 'email' })}
          name="work_email"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: t({ id: 'searchMail' }) }
            ),
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={t({ id: 'phone' })}
          name="mobile_phone"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: t({ id: 'searchPhone' }) }
            ),
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label="Có tài khoản"
          name="user_id"
          type="select"
          innerprops={{
            allowClear: true,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'Có tài khoản' }
            ),
          }}
          options={[
            {
              label: 'Có',
              value: 'Yes',
            },
            {
              label: 'Không',
              value: 'No',
            },
          ]}
        />
      </Col>
      {(is_administrative === 'true' || sub_admin_role !== 'none') && (
        <Col xs={24} sm={24} md={12} lg={7}>
          <SelectCompanyHO />
        </Col>
      )}
      <Col xs={12}
        sm={12}
        md={6}
        lg={7}>
        <SearchItem
          label="Nơi làm việc"
          name="work_location"
          type="select"
          options={workLocation}
          innerprops={{
            allowClear: true,
            placeholder: "Vui lòng chọn",
          }}
        />
      </Col>
    </>
  );
};

export default SearchEmployeee;
