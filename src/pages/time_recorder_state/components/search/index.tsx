import MyPage from '@/components/business/page';
import { Col } from 'antd';
import MonthPicker from '../monthpicker';
import { useState } from 'react';
interface IMonthPicker {
  setMonth: (value: string) => void;
}
const { Item: SearchItem } = MyPage.MySearch;
const SearchTRState = (props: IMonthPicker) => {
  const { setMonth } = props;

  return (
    <>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Tháng'}
          name="month"
          innerprops={{
            allowClear: true,
            placeholder: 'Vui lòng chọn Tháng',
          }}>
          <MonthPicker setDate={setMonth} />
        </SearchItem>
      </Col>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Mã máy'}
          name="time_recorder_id"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: 'Vui lòng chọn Mã máy',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Tên máy'}
          name="work_address"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: 'Vui lòng chọn Tên máy',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Địa chỉ IP'}
          name="address_ip"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: 'Vui lòng chọn Địa chỉ IP',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Kết nối'}
          name="connection"
          type="input"
          innerprops={{
            allowClear: true,
            placeholder: 'Vui lòng chọn Kết nối',
          }}
        />
      </Col>
    </>
  );
};
export default SearchTRState;
