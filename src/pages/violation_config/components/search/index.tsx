import React from 'react';
import { Button, Col, Form, Input } from 'antd';
import { useLocale } from '@/locales';
import MyPage from '@/components/business/page';
import { statusLeaveOptions } from '@/const/options';
import SelecLeaveType from '@/pages/components/selects/SelectTypeLeave';
const { Item: SearchItem } = MyPage.MySearch;
const SearchViolationConfig = () => {
  const { t } = useLocale();
  return (
    <>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Tên vi phạm'}
          name="name"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: t({ id: 'placeholder_input' }, { msg: 'Tên vi phạm' }),
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Hình thức xử lý'}
          name="default_violation_type"
          type="select"
          options={[
            {
              label: 'Trừ Tiền',
              value: '1',
            },
            {
              label: 'Tỷ lệ',
              value: '2',
            },
            {
              label: 'Đền bù',
              value: '3',
            },
            {
              label: 'Sa thải',
              value: '4',
            },
          ]}
          innerprops={{
            allowClear: true,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'Hình thức xử lý' }
            ),
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Mức độ vi phạm'}
          name="default_violation_level"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'Mức độ vi phạm' }
            ),
            format: 'DD/MM/YYYY',
          }}
        />
      </Col>
    </>
  );
};

export default SearchViolationConfig;
