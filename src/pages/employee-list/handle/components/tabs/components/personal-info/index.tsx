import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import SelectGender from '@/pages/components/selects/SelectGender';
import SelectMarial from '@/pages/components/selects/SelectMarital';
import { Col, Divider, Row, Typography, FormInstance, Input } from 'antd';
import { useState, FC, useEffect } from 'react';
import './style.css';
import SelectCertificate from '@/pages/components/selects/SelectCertificate';
import SelectCarRegistration from '@/pages/components/selects/SelectCarRegistration';
import SelectCountry from '@/pages/components/selects/SelectCountry';
import SelectCity from '@/pages/components/selects/SelectCity';
import SelectReligion from '@/pages/components/selects/SelectReligion';
import SelectNation from '@/pages/components/selects/SelectNation';
import SelectState from '@/pages/components/selects/SelectState';
import SelectDistrict from '@/pages/components/selects/SelectDistrict';
import SelectWard from '@/pages/components/selects/SelectWard';
import SelectIssuedByIdentification from '@/pages/components/selects/SelectIssuedByIdentification';
import SelectBank from '@/pages/components/selects/SelectBank';
import { stateOptions2 } from '@/const/options';
import type { DatePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';


interface Props {
  form?: FormInstance<any>;
  idEmployee: number;
  countryId: number;
  districtId: number;
  wardId: number;
}
const index: FC<Props> = ({ form, idEmployee, countryId, districtId, wardId }) => {
  const { t } = useLocale();
  const { Title } = Typography;
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  const [stateOptionsData, setStateOptionsData] = useState<any[]>([]);
  const [typePersonalId, setTypePersonalId] = useState<string | null>(null);


  const updateTypePersonalId = (value: string) => {
    setTypePersonalId(value)
  }

  useEffect(() => {
    if (typePersonalId == "2") {
      stateOptions2().then((res) => {
        // for (const item in res){
        //   console.log()
        // }
        console.log(res)
        setStateOptionsData(res.filter((item) => item.country_id.country_name == 'Vietnam'));
      });

    }
    else {
      setStateOptionsData([
        { value: 'Cục Cảnh Sát Quản Lý Hành Chính Về Trật Tự Xã Hội', label: 'Cục Cảnh Sát Quản Lý Hành Chính Về Trật Tự Xã Hội' },
        { value: 'Cục Cảnh Sát ĐKQL Cư Trú và DLQG Về Dân Cư', label: 'Cục Cảnh Sát ĐKQL Cư Trú và DLQG Về Dân Cư' },
        // { value: '', label: '' },
      ]);
    }

  }, [typePersonalId]);

  useEffect(() => {
    setSelectedCountryId(countryId);
    setSelectedStateId(districtId);
    setSelectedDistrictId(wardId);
  }, [idEmployee])
  const handleCountryChange = (value: number) => {
    if (!value) {
      handleClearCountry();
    }
    else {
      setSelectedCountryId(value)
    }
  }
  const handleClearCountry = () => {
    form?.setFieldsValue([{ name: 'state_vietnam_id', value: null }, { name: 'district_vietnam_id', value: null }, { name: 'ward_vietnam_id', value: null }]);
  }
  const handleStateChange = (value: number) => {
    if (!value) {
      handleClearState();
    }
    else {
      setSelectedStateId(value)
    }
  }
  const handleClearState = () => {
    form?.setFieldsValue([{ name: 'district_vietnam_id', value: null }, { name: 'ward_vietnam_id', value: null }]);
  }
  const handleDistrictChange = (value: number) => {
    if (!value) {
      handleClearDistrict();
    }
    else {
      setSelectedDistrictId(value)
    }
  }
  const handleClearDistrict = () => {
    form?.setFieldsValue([{ name: 'ward_vietnam_id', value: null }]);
  }

  return (
    <>
      {/* Thông tin chung */}
      <Row gutter={24}>
        <Col span={24}>
          <Title level={5}>THÔNG TIN CHUNG</Title>
          <Divider />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t({ id: 'placeholder_input' }, { msg: 'nơi sinh' }),
            }}
            label={'Nơi sinh'}
            name="place_of_birth"
            type="input"
            required
          />
        </Col>
        <Col span={12}>
          <MyForm.Item
            label={'Ngày sinh'}
            name="birthday"
            type="time-picker-input"
            required
            innerprops={{
              placeholder: t({ id: 'placeholder_input' }, { msg: 'ngày sinh' }),
              format: 'DD/MM/YYYY',
            }}

          />
        </Col>
        <Col span={12}>
          <SelectGender />
        </Col>
        <Col span={12}>
          <MyForm.Item
            label="Địa chỉ thường trú"
            name="permanent_address"
            type="input"
            required
            innerprops={{
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'địa chỉ thường trú' }
              ),
            }}
          />
        </Col>

        <Col span={12}>
          <SelectCountry onChange={handleCountryChange} />
        </Col>
        <Col span={12}>
          <SelectNation />
        </Col>
        <Col span={12}>
          <SelectReligion />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              // disabled: cannot_edit,
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'Mã số thuế cá nhân' }
              ),
            }}
            label={'Mã số thuế cá nhân'}
            name="tax_id"
            type="input"
          />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t({ id: 'placeholder_input' }, { msg: 'số CMND' }),
            }}
            label={'Số CMND/CCCD'}
            name="identification_id"
            type="input"
            required
          />
        </Col>
        <Col span={4}>
          <MyForm.Item
            label="loại"
            type="radio"
            required
            options={[
              { value: '1', label: 'CCCD/CMND' },
              { value: '2', label: 'CMT' },
              { value: '3', label: 'Khác' }
              // { value: '', label: '' }, 
            ]}
            innerprops={{
              onChange: (e: any) => {
                updateTypePersonalId(e.target.value)
              }
            }}
          />
        </Col>
        {typePersonalId == "3" ? (<Col span={8}>
          <MyForm.Item
            label="Nơi cấp CMND/CCCD"
            name="issued_by_identification_text"
            type="input"
            // options={stateOptionsData}
            required
            innerprops={{
              allowClear: true,
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'nơi cấp CMND/CCCD' }
              ),
            }}
          />
        </Col>) : (<Col span={8}>
          <MyForm.Item
            label="Nơi cấp CMND/CCCD"
            name="issued_by_identification_text"
            type="select"
            options={stateOptionsData}
            required
            innerprops={{
              allowClear: true,
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'nơi cấp CMND/CCCD' }
              ),
            }}
          />
        </Col>)
        }
        <Col span={12}>
          <MyForm.Item
            label="Ngày cấp CMND/CCCD"
            name="issued_by_identification_day"
            type="time-picker-input"
            required
            innerprops={{
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'ngày cấp CMND/CCCD' }
              ),
              format: 'DD/MM/YYYY',
            }}
          />
        </Col>
        {/* <Col span={12}>
          <SelectIssuedByIdentification />
        </Col> */}
        <Col span={12}>
          <SelectState onChange={handleStateChange} selectedCountryId={selectedCountryId} selectedStateId={selectedStateId} />
        </Col>
        <Col span={12}>
          <SelectDistrict selectedStateId={selectedStateId} onChange={handleDistrictChange} selectedDistrictId={selectedDistrictId} />
        </Col>
        <Col span={12}>
          <SelectWard selectedDistrictId={selectedDistrictId} />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'email cá nhân' }
              ),
            }}
            required
            label={'Email cá nhân'}
            name="personal_email"
            type="input"
          />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'nơi ở hiện tại' }
              ),
            }}
            required
            label={'Nơi ở hiện tại'}
            name="current_place_of_residence"
            type="input"
          />
        </Col>
        <Col span={12}>
          <SelectMarial />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t({ id: 'placeholder_input' }, { msg: 'STK' }),
            }}
            label={'STK'}
            name="bank_account_number"
            type="input"
          />
        </Col>
        <Col span={12}>
          <SelectBank />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t({ id: 'placeholder_input' }, { msg: 'chi nhánh' }),
            }}
            label={'Chi nhánh'}
            name="bank_branch"
            type="input"
          />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t({ id: 'placeholder_input' }, { msg: 'Số BHXH' }),
            }}
            label={'Số BHXH'}
            name="social_insurance_number"
            type="input"
          />
        </Col>
      </Row>
      {/* Học vấn */}
      <Row gutter={24}>
        <Col span={24}>
          <Title level={5}>HỌC VẤN</Title>
          <Divider />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <SelectCertificate />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'trường đào tạo' }
              ),
            }}
            label={'Trường đào tạo'}
            name="study_school"
            type="input"
          />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t({ id: 'placeholder_input' }, { msg: 'chứng chỉ' }),
            }}
            label={'Chứng chỉ'}
            name="highest_degree"
            type="input"
          />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'chuyên ngành' }
              ),
            }}
            label={'Chuyên ngành'}
            name="study_field"
            type="input"
          />
        </Col>
      </Row>
      {/* Phương tiện */}
      <Row gutter={24}>
        <Col span={24}>
          <Title level={5}>PHƯƠNG TIỆN</Title>
          <Divider />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'loại xe' }
              ),
            }}
            label={'Loại xe'}
            name="range_of_vehicle"
            type="input"
          />
        </Col>
        <Col span={12}>
          <SelectCarRegistration />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'biển số xe' }
              ),
            }}
            label={'Biển số xe'}
            name="license_plates"
            type="input"
          />
        </Col>
        <Col span={12}>
          <MyForm.Item
            innerprops={{
              placeholder: t(
                { id: 'placeholder_input' },
                { msg: 'màu xe' }
              ),
            }}
            label={'Màu xe'}
            name="car_color"
            type="input"
          />
        </Col>
      </Row>
    </>
  );
};

export default index;
