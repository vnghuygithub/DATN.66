import React from 'react';
import { Button, Col, Form, Input } from 'antd';
import { useLocale } from '@/locales';
import MyPage from '@/components/business/page';
import { statusLeaveOptions } from '@/const/options';
import SelecLeaveType from '@/pages/components/selects/SelectTypeLeave';
const { Item: SearchItem } = MyPage.MySearch;
const SearchWorkLocation = () => {
  const { t } = useLocale();
  return (
    <>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Mã'}
          name="work_location_code"
          type="input"
          innerprops={{
            allowClear: true,
            // placeholder: t(
            //   { id: 'placeholder_input' },
            //   { msg: 'Mã' }
            // ),
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Tên địa điểm'}
          name="name"
          type="input"
          innerprops={{
            allowClear: true,
            // placeholder: t(
            //   { id: 'placeholder_input' },
            //   { msg: 'Tên nhân viên' }
            // ),
          }}
        />
      </Col>
     

     

    </>
  );
};

export default SearchWorkLocation;
