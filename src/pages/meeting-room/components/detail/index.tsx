import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import SelectEmployeeBookingMeetingRooms from '@/pages/components/selects/SelectEmployeeBookingMeetingRooms';
import SelectMeetingRooms from '@/pages/components/selects/SelectMeetingRooms';
import moment from 'moment';
interface Props {
  isCreatingForm: boolean;
}
const Detail = ({ isCreatingForm }: Props) => {
  const { t } = useLocale();
  
  return (
    <Row gutter={24}>
      <Col span={12}>
        <SelectEmployeeBookingMeetingRooms required />
      </Col>
      <Col span={12}>
        <SelectMeetingRooms required />
      </Col>
      <Col span={12}>
        <MyForm.Item
          label={'Ngày đặt'}
          name="req_date"
          type="datetime-local"
          initialValue={moment()}
          required
          innerprops={{
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'Ngày đặt' }
            ),
            format: 'DD/MM/YYYY',
          }}
        />
      </Col>
      <Col span={12}>
        <MyForm.Item
          label={'Bắt đầu'}
          name="date_from"
          // type="time-picker-input" 
          type="datetime-local-test" 
          required
          innerprops={{
            placeholder: t({ id: 'placeholder_input' }, { msg: 'Thời gian bắt đầu' }),
            format: 'DD/MM/YYYY',
          }}
        />
      </Col>
       
      <Col span={12}>
        <MyForm.Item
          label={'Kết thúc'}
          name="date_to"
          type="datetime-local-test"
          initialValue={''}
          required
          innerprops={{
            placeholder: t({ id: 'placeholder_input' }, { msg: 'Thời gian kết thúc' }),
            format: 'DD/MM/YYYY HH:mm:ss',
          }}
        />
      </Col>
      <Col span={12}>
        <MyForm.Item
          label={'Mục đích'}
          name="purpose"
          type="input"
          initialValue={''}
          required
          innerprops={{
            placeholder: t({ id: 'placeholder_input' }, { msg: 'Mục đích' }),
          }}
        />
      </Col>
      {/* <Col span={12}>
        <MyForm.Item
          label={'State'}
          name="state"
          type="input"
          initialValue={'waiting'}
          // required
          innerprops={{
            placeholder: t({ id: 'placeholder_input' }, { msg: 'State' }),
          }}
        />
      </Col> */}
    </Row>
  );
};

export default Detail;
