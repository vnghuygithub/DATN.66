import React from 'react';
import { Button, Col, Form, Input } from 'antd';
import { useLocale } from '@/locales';
import MyPage from '@/components/business/page';
import { statusLeaveOptions } from '@/const/options';
import SelecLeaveType from '@/pages/components/selects/SelectTypeLeave';
const { Item: SearchItem } = MyPage.MySearch;
const SearchKpiCtrl = () => {
  const { t } = useLocale();
  return (
    <>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Mã nhân viên'}
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
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Tên nhân viên'}
          name="employee_name"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'Tên nhân viên' }
            ),
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Số biên bản'}
          name="report_serial"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: t({ id: 'placeholder_input' }, { msg: 'Số biên bản' }),
          }}
        />
      </Col>

      {/* <Col span={8}>
        <SearchItem label={'Ngày biên bản'} name="report_date" type="date-picker"
          innerprops={{
            allowClear: true,
            placeholder: t({ id: 'placeholder_input' }, { msg: 'ngày biên bản' }),
            format: 'DD/MM/YYYY',
          }}
        />
      </Col>
      <Col span={8}>
        <SearchItem label={'Ngày áp dụng'} name="date_apply" type="date-picker"
          innerprops={{
            allowClear: true,
            placeholder: t({ id: 'placeholder_input' }, { msg: 'ngày áp dụng' }),
            format: 'DD/MM/YYYY',
          }}
        />
      </Col> */}
    </>
  );
};

export default SearchKpiCtrl;
