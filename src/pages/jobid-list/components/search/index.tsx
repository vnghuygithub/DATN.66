import React from 'react';
import { Button, Col, Form, Input } from 'antd';
import { useLocale } from '@/locales';
import MyPage from '@/components/business/page';
import { statusLeaveOptions } from '@/const/options';
import SelecLeaveType from '@/pages/components/selects/SelectTypeLeave';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import SelectDepartmentEmployee from '@/pages/components/selects/SelectDepartmentEmployee';
import SelectCompanyAllSearch from '@/pages/components/selects/SelectCompanyAllSearch';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';
const { Item: SearchItem } = MyPage.MySearch;
const SearchJobs = () => {
  const { t } = useLocale();
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  return (
    <>
      <Col span={8}>
        <SearchItem
          label="Tên"
          name="name"
          type="input"
          innerprops={{
            placeholder: t({ id: 'placeholder_input' }, { msg: 'Tên' }),
          }}
        />
      </Col>
      {(is_administrative === "true" || sub_admin_role !== "none") && (
        <Col span={8}>
          <SelectCompanyHO />
        </Col>
      )}
      <Col span={8}>
        <SelectDepartmentEmployee />
      </Col>
      <Col span={8}>
        <SearchItem
          label="Cấp bậc"
          name="level"
          type="input-number"
          innerprops={{
            placeholder: t({ id: 'placeholder_input' }, { msg: 'Cấp bậc' }),
          }}
        />
      </Col>
    </>
  );
};

export default SearchJobs;
