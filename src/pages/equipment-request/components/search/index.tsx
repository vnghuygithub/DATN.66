import MyPage from '@/components/business/page';
import { Col } from 'antd';
import SelectEmployeeEquipmentRequest from '@/pages/components/selects/SelectEmployeeEquipmentRequest';
import SelectDepartmentEquipment from '@/pages/components/selects/selectDepartmentEquipment';

const { Item: SearchItem } = MyPage.MySearch;
const SearchBookingRooms = () => {
  return (
    <>
      <Col span={8}>
        <SelectEmployeeEquipmentRequest />
      </Col>
      <Col span={8}>
        <SelectDepartmentEquipment />
      </Col>
      <Col span={8}>
        <SearchItem
          label={'Ngày tạo'}
          name="create_date"
          type="date-picker"
          innerprops={{
            allowClear: true,
            placeholder: 'Vui lòng chọn Ngày tạo',
            format: 'DD/MM/YYYY',
          }}
        />
      </Col>
    </>
  );
};
export default SearchBookingRooms;
