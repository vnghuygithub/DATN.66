import React from 'react';
import { Button, Col, Form, Input } from 'antd';
import { useLocale } from '@/locales';
import MyPage from '@/components/business/page';
import { statusLeaveOptions } from '@/const/options';
import SelecLeaveType from '@/pages/components/selects/SelectTypeLeave';
import moment from 'moment';
import SelectDepartment from '@/pages/components/selects/selectDepartment';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';
import SelectHolidayStatus from '@/pages/components/selects/SelectHolidayStatus';
const { Item: SearchItem } = MyPage.MySearch;
const SearchApplicationList = () => {
  const { t } = useLocale();
  const currentDate = moment();
  const defaultFromDate = moment(currentDate, 'DD/MM/YYYY');
  const defaultToDate = moment(currentDate, 'DD/MM/YYYY');
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
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
        <SelectDepartment />
      </Col>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label="Khoảng thời gian"
          name="dateRange"
          type="date-picker-range"
          innerprops={{
            allowClear: true,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'Khoảng thời gian' }
            ),
            format: 'DD/MM/YYYY',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Ngày tạo đơn'}
          name="create_date"
          type="date-picker"
          innerprops={{
            allowClear: true,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'ngày tạo đơn' }
            ),
            format: 'DD/MM/YYYY',
          }}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SelectHolidayStatus
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={8}>
        <SearchItem
          label={'Trạng thái đơn'}
          name="state"
          type="select"
          options={statusLeaveOptions}
          innerprops={{
            allowClear: true,
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'trạng thái đơn' }
            ),
          }}
        />
      </Col>
      {
        (is_administrative === "true" || sub_admin_role !== "none") && (
          <Col xs={24} sm={24} md={12} lg={8}>
            <SelectCompanyHO />
          </Col>
        )
      }
    </>
  );
};

export default SearchApplicationList;
