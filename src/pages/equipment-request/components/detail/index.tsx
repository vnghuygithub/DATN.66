import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import { Col, Row } from 'antd';
import moment from 'moment';
import SelectEmployeeEquipmentRequest from '@/pages/components/selects/SelectEmployeeEquipmentRequest';
import SelectDepartmentEquipment from '@/pages/components/selects/selectDepartmentEquipment';
import { useEffect } from 'react';
import { getEquipmentsByArgs } from '@/api/equipment_request/equipment_request.api';
import SelectItEquipmentRequest from '@/pages/components/selects/SelectItEquipmentRequest';
interface Props {
  isCreatingForm: boolean;
}
const Detail = ({ isCreatingForm }: Props) => {
  const { t } = useLocale();
  
  return (
    <Row gutter={24}>
      <Col span={12}>
        <SelectEmployeeEquipmentRequest required/>
      </Col>
      <Col span={12}>
        <SelectDepartmentEquipment required/>
      </Col>
      <Col span={12}>
        <SelectItEquipmentRequest/>

        
      </Col>
      <Col span={12}>
        <MyForm.Item
          label={'Ngày tạo'}
          name="req_date"
          type="time-picker-input"
          initialValue={moment()}
          required
          innerprops={{
            placeholder: t(
              { id: 'placeholder_input' },
              { msg: 'Ngày tạo' }
            ),
            format: 'DD/MM/YYYY',
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
    </Row>
  );
};

export default Detail;
