import MyPage from '@/components/business/page';
import { Col } from 'antd';
import SelectEmployeeBookingMeetingRooms from '@/pages/components/selects/SelectEmployeeBookingMeetingRooms';
import SelectMeetingRooms from '@/pages/components/selects/SelectMeetingRooms';

const { Item: SearchItem } = MyPage.MySearch;
const SearchBookingRooms = () => {
  return (
    <>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectEmployeeBookingMeetingRooms />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SelectMeetingRooms />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Ngày đặt'}
          name="req_date"
          type="date-picker"
          innerprops={{
            allowClear: true,
            placeholder: 'Vui lòng chọn Ngày đặt',
            format: 'DD/MM/YYYY',
          }}
        />
      </Col>
      {/* <Col span={8}>
        <SearchItem
          label={'Date From'}
          name="date_from"
          type="date-picker-time"
          innerprops={{
            allowClear: true,
            placeholder: 'Vui lòng chọn Date From',
            format: 'DD/MM/YYYY - HH:mm:ss',
          }}
        />
      </Col>
      <Col span={8}>
        <SearchItem
          label={'Date To'}
          name="date_to"
          type="date-picker-time"
          innerprops={{
            allowClear: true,
            placeholder: 'Vui lòng chọn Date To',
            format: 'DD/MM/YYYY - HH:mm:ss',
          }}
        />
      </Col> */}
    </>
  );
};
export default SearchBookingRooms;
