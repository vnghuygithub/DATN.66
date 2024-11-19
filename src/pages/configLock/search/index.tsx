import MyPage from '@/components/business/page';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import SelectCompanyAllSearch from '@/pages/components/selects/SelectCompanyAllSearch';
import { Col } from 'antd';

const { Item: SearchItem } = MyPage.MySearch;
export const ConfigSearch = () => {
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  return (
    <>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Chức năng'}
          name="model_lock"
          type="select"
          innerprops={{
            allowClear: true,
            showSearch: true,
            placeholder: 'Chọn chức năng',
          }}
          options={[
            {
              value: 'hr.apec.attendance.report',
              label: 'Báo cáo chấm công theo tuần, tháng',
            },
            { value: 'hr.leave', label: 'Quản lý đơn yêu cầu' },
            { value: 'hr.invalid.timesheet', label: 'Quản lý giải trình' },
            { value: 'hr.al.cl.report', label: 'Báo cáo tổng hợp phép, bù' },
          ]}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={7}>
        <SearchItem
          label={'Trạng thái'}
          name="active"
          type="select"
          innerprops={{
            allowClear: true,
            showSearch: true,
            placeholder: 'Chọn trạng thái',
          }}
          options={[
            { value: true, label: 'Đang hoạt động' },
            { value: false, label: 'Không hoạt động' },
          ]}
        />
      </Col>
      {(is_administrative == 'true' || sub_admin_role !== "none") && (
        <Col span={7}>
          <SelectCompanyAllSearch />
        </Col>
      )}
    </>
  );
};
