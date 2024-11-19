import { Button, Checkbox, Col, Drawer, FormInstance, Row, Spin, TimePicker } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import { getListShifts } from '@/api/weeklyreport/weeklyreport';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import RadioCaGay from '@/pages/components/radios/RadioCaGay';
import { createShift, getShiftById, updateShift } from '@/api/shift/shift.api';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import SelectCompany from '@/pages/components/selects/SelectCompany';
import SelectListLeaveType from '@/pages/components/selects/SelectListLeaveType';
import moment from 'moment';
import SelectCompanyShifts from '@/pages/components/selects/SelectCompanyShifts';
import { mobileResponsive } from '@/utils/mobileResponsive';
import SelectCompanyAllAllocation from '@/pages/components/selects/SelectCompanyAllAllocation';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import { min } from 'lodash';
import type { CheckboxProps } from 'antd';

interface Props {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idShift?: string;
  setFoceUpdate?: Dispatch<SetStateAction<boolean>>;
  foceUpdate?: boolean;
  form?: FormInstance<any>;
  isView?: boolean;
}
const FormShift: FC<Props> = ({
  onClose,
  open,
  idShift,
  foceUpdate,
  setFoceUpdate,
  isView,
  form,
}) => {
  const onChange: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const { t } = useLocale();
  const { isMobile } = mobileResponsive();
  const [loading, setLoading] = useState(false);
  const [shiftName, setShiftName] = useState<string>('');
  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    let convert_decimal = (timestring: string) => {
      const [hours, minutes] = timestring.split(':').map(Number);
      return hours + minutes / 60;
    };

    if (data.rest_shift_id == undefined) {
      data.rest_shift_id = null;
    }

    let start_work_time = convert_decimal(data.start_work_time.format('HH:mm'));
    let end_work_time = convert_decimal(data.end_work_time.format('HH:mm'));
    let start_rest_time = convert_decimal(data.start_rest_time.format('HH:mm'));
    let end_rest_time = convert_decimal(data.end_rest_time.format('HH:mm'));
    let sub_admin_role = localStorage.getItem('sub_admin_role');
    if (!data.night) {
      if (start_work_time > end_work_time) {
        $message.error('Thời gian bắt đầu làm phải nhỏ hơn hoặc bằng thời gian kết thúc làm');
        return;
      }
      if (start_rest_time > end_rest_time) {
        $message.error('Thời gian bắt đầu nghỉ phải nhỏ hơn hoặc bằng thời gian kết thúc nghỉ');
        return;
      }
    }
    if (!data.night) {
      if (
        end_rest_time < start_work_time
      ) {
        $message.error('Thời gian kết thúc nghỉ không được phép nhỏ hơn thời gian bắt đầu làm');
        return;
      }
      if (start_rest_time > end_work_time) {
        $message.error('Thời gian bắt đầu nghỉ không được phép lớn hơn thời gian kết thúc làm');
        return;
      }
      if (start_rest_time < start_work_time) {
        $message.error('Thời gian bắt đầu nghỉ không được phép nhỏ hơn thời gian bắt đầu làm');
        return;
      }
    }
    if (data.night_ph_efficiency_factor < data.efficiency_factor) {
      $message.error('Hệ số ca đêm ngày lễ không được nhỏ hơn hệ số chuyển đổi thành quỹ');
      return;
    }
    if (data.company_id == false) {
      $message.error('Vui lòng chọn công ty');
      return;
    }

    if (data.name == false) {
      $message.error('Vui lòng nhập tên ca');
      return;
    }
    const onChange: CheckboxProps['onChange'] = (e) => {
      console.log(`checked = ${e.target.checked}`);
    };

    let new_data = {
      name: data.name,
      company_id: (is_administrative === "true" || sub_admin_role === "administration" || sub_admin_role === "recruitment") ? (data?.company_id.value ?? data?.company_id.id ?? data?.company_id) : Number(localStorage.getItem('company_id')),
      start_work_time: start_work_time,
      end_work_time: end_work_time,
      start_rest_time: start_rest_time,
      end_rest_time: end_rest_time,
      fix_rest_time: data.fix_rest_time,
      night: data.night,
      rest_shifts: data.rest_shifts,
      is_ho_shift: data.is_ho_shift,
      breakfast: data.breakfast,
      lunch: data.lunch,
      dinner: data.dinner,
      rest_shift_id: data.rest_shift_id,
      number_of_attendance: data.number_of_attendance,
      day_work_value: data.day_work_value,
      night_eat: data.night_eat,
      efficiency_factor: data.efficiency_factor,
      salary_coefficient: data.salary_coefficient,
      minutes_working_not_reduced: data.minutes_working_not_reduced,
      night_ph_efficiency_factor: data.night_ph_efficiency_factor,
    };

    let jsonbody = {
      params: {
        data: new_data,
      },
    };

    if (idShift == null || idShift == undefined) {
      const res = await getListShifts((is_administrative === "true" || sub_admin_role === "administration" || sub_admin_role === "recruitment") ? (data?.company_id.value ?? data?.company_id.id ?? data?.company_id) : Number(localStorage.getItem('company_id')));
      for (let item of res.result) {
        if (item.name == new_data.name) {
          $message.error('Ca làm việc đã tồn tại');
          return;
        }
      }
    }

    if (new_data) {
      try {
        setLoading(true);
        const res = idShift
          ? await updateShift(jsonbody, idShift)
          : await createShift(jsonbody);

        if (res) {
          $message.success('Thành công');
          setFoceUpdate && setFoceUpdate(!foceUpdate);
          onClose && onClose();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  function set_data_type_date(property: string, res: any) {
    let string_props = null;
    if (res) {
      if (
        res[property] != false &&
        res[property] != null &&
        res[property] != undefined
      ) {
        string_props = res[property];
        form &&
          form.setFieldsValue({
            [property]: moment(string_props) ?? '',
          });
      } else {
        string_props = '';
        form &&
          form.setFieldsValue({
            [property]: undefined,
          });
      }
    }
  }

  const getfetchByIdShift = async (id: number) => {
    if (!idShift) {
      return;
    }
    try {
      setLoading(true);
      const res = await getShiftById(id);
      if (res) {
        setEfficiencyFactor(res.efficiency_factor);
        form?.setFieldsValue({
          start_work_time:
            res.start_work_time != null && res.start_work_time != undefined
              ? moment(res.c_start_work_time, 'HH:mm')
              : '',
          end_work_time:
            res.end_work_time != null && res.end_work_time != undefined
              ? moment(res.c_end_work_time, 'HH:mm')
              : '',
          start_rest_time:
            res.start_rest_time != null && res.start_rest_time != undefined
              ? moment(res.c_start_rest_time, 'HH:mm')
              : '',
          end_rest_time:
            res.end_rest_time != null && res.end_rest_time != undefined
              ? moment(res.c_end_rest_time, 'HH:mm')
              : '',
          fix_rest_time: res.fix_rest_time,
          night: res.night ?? '',
          rest_shifts: res.rest_shifts ?? '',
          is_ho_shift: res.is_ho_shift ?? '',
          breakfast: res.breakfast ?? '',
          lunch: res.lunch ?? '',
          dinner: res.dinner ?? '',
          rest_shift_id: res.rest_shift_id.value ?? '',
          number_of_attendance: res.number_of_attendance ?? '',
          company_id: res.company_id ?? '',
          name: res.name ?? '',
          night_eat: res.night_eat ?? '',
          efficiency_factor: res.efficiency_factor ?? '',
          salary_coefficient: res.salary_coefficient ?? '',
          minutes_working_not_reduced: res.minutes_working_not_reduced ?? '',
          night_ph_efficiency_factor: res.night_ph_efficiency_factor ?? '',
        });
        setShiftName(res.name ?? '');
      }
      setOnchangeReadonly();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form?.resetFields();
    if (idShift) {
      getfetchByIdShift(Number(idShift));
    }
  }, [idShift, open]);

  const [readOnlyState, setReadonlystate] = useState<boolean>(true);
  const [nightDisabled, setNightDisabled] = useState<boolean>(false);
  const [restShiftDisabled, setRestShiftDisabled] = useState<boolean>(false);
  const [fixRestTimeDisabled, setFixRestTimeDisabled] =
    useState<boolean>(false);
  const [efficiencyFactor, setEfficiencyFactor] = useState<number>(0);
  const setOnchangeReadonly = () => {
    const data = form?.getFieldsValue();

    if (
      data.start_work_time == null ||
      data.start_work_time == undefined ||
      data.end_work_time == undefined ||
      data.end_work_time == null
    ) {
      setReadonlystate(true);
    } else {
      setReadonlystate(false);
    }
  };

  const setOnchangeNight = () => {
    const data = form?.getFieldsValue();
    if (data.night) {
      setRestShiftDisabled(true);
      setFixRestTimeDisabled(true);
    } else {
      setRestShiftDisabled(false);
      setFixRestTimeDisabled(false);
    }
  };
  const setOnchangeRestShift = () => {
    const data = form?.getFieldsValue();
    if (data.rest_shifts) {
      setNightDisabled(true);
      setFixRestTimeDisabled(true);
    } else {
      setNightDisabled(false);
      setFixRestTimeDisabled(false);
    }
  };
  const setOnchangeFixRestTime = () => {
    const data = form?.getFieldsValue();
    if (data.fix_rest_time) {
      setNightDisabled(true);
      setRestShiftDisabled(true);
    } else {
      setNightDisabled(false);
      setRestShiftDisabled(false);
    }
  };

  const handleChangeShiftName = (value: string) => {
    setShiftName(value);
  };
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  useEffect(() => {
    setOnchangeReadonly();
  }, [open]);
  return (
    <>
      <Drawer
        key={idShift}
        title={idShift ? t({ id: 'update' }) : t({ id: 'create' })}
        width={isMobile ? '100%' : '720'}
        onClose={onClose}
        open={open}
        destroyOnClose
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          !isView && (
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button key={1} onClick={onClose}>
                Hủy
              </Button>
              <Button
                key={2}
                onClick={onFinish}
                type="primary"
                loading={loading}>
                Lưu
              </Button>
            </div>
          )
        }>
        <Spin spinning={loading}>
          <MyForm<any>
            onFinish={onFinish}
            form={form}
            layout="vertical"
            disabled={isView}>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={12}>
                <MyForm.Item
                  innerprops={{
                    placeholder: t(
                      { id: 'placeholder_input' },
                      { msg: 'tên ca' }
                    ),
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                      handleChangeShiftName(event.target.value),
                  }}
                  rules={[
                    {
                      max: 150,
                      message: 'Tên ca không được vượt quá 150 ký tự',
                    },
                    {
                      required: true,
                      message: 'Vui lòng nhập tên ca',
                    },
                  ]}
                  label={'Tên ca'}
                  name="name"
                  type="input"
                />
              </Col>
              {(is_administrative === "true" || sub_admin_role !== "none") ? (
                <Col xs={24} sm={24} md={12}>
                  <SelectCompanyAll />
                </Col>
              ) : (
                <Col xs={24} sm={24} md={12}>
                  <SelectCompanyShifts />
                </Col>
              )}

              <Col xs={24} sm={24} md={12}>
                <MyForm.Item
                  label={'Thời gian bắt đầu làm'}
                  name="start_work_time"
                  type="time-picker"
                  required
                  innerprops={{
                    format: 'HH:mm',
                    // inputReadOnly:true,
                    onChange: setOnchangeReadonly,
                  }}
                />
              </Col>
              <Col xs={24} sm={24} md={12}>
                <MyForm.Item
                  label={'Thời gian kết thúc làm'}
                  name="end_work_time"
                  type="time-picker"
                  required
                  innerprops={{
                    format: 'HH:mm',
                    // inputReadOnly:true,
                    onChange: setOnchangeReadonly,
                  }}
                />
              </Col>

              <Col xs={24} sm={24} md={12}>
                <MyForm.Item
                  label={'Thời gian bắt đầu Nghỉ'}
                  name="start_rest_time"
                  type="time-picker"
                  required
                  innerprops={{
                    format: 'HH:mm',
                    disabled: readOnlyState,
                  }}
                />
              </Col>
              <Col xs={24} sm={24} md={12}>
                <MyForm.Item
                  label={'Thời gian kết thúc Nghỉ'}
                  name="end_rest_time"
                  type="time-picker"
                  required
                  innerprops={{
                    format: 'HH:mm',
                    disabled: readOnlyState,
                  }}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <MyForm.Item
                  options={[
                    { label: 'có', value: true },
                    { label: 'không', value: false },
                  ]}
                  label={'Ca Nghỉ'}
                  name="rest_shifts"
                  type="radio"
                  required
                  innerprops={{
                    disabled: restShiftDisabled,
                    onChange: setOnchangeRestShift,
                  }}
                  initialValue={false}
                />
              </Col>

              <Col span={8}>
                <MyForm.Item
                  options={[
                    { label: 'có', value: true },
                    { label: 'không', value: false },
                  ]}
                  label={'Ca đêm'}
                  name="night"
                  type="radio"
                  required
                  innerprops={{
                    disabled: nightDisabled,
                    onChange: setOnchangeNight,
                  }}
                  initialValue={false}
                />
              </Col>

              <Col span={8}>
                <RadioCaGay
                  disabled={fixRestTimeDisabled}
                  onChange={setOnchangeFixRestTime}
                />
              </Col>

              {/* </Row> */}
            </Row>

            <Row gutter={24}>
              <Col span={6}>
                <MyForm.Item
                  options={[
                    { label: 'có', value: true },
                    { label: 'không', value: false },
                  ]}
                  label={'Ăn sáng'}
                  name="breakfast"
                  type="radio"
                  required
                  initialValue={false}
                />
              </Col>

              <Col span={6}>
                <MyForm.Item
                  options={[
                    { label: 'có', value: true },
                    { label: 'không', value: false },
                  ]}
                  label={'Ăn trưa'}
                  name="lunch"
                  type="radio"
                  required
                  initialValue={false}
                />
              </Col>

              <Col span={6}>
                <MyForm.Item
                  options={[
                    { label: 'có', value: true },
                    { label: 'không', value: false },
                  ]}
                  label={'Ăn tối'}
                  name="dinner"
                  type="radio"
                  required
                  initialValue={false}
                />
              </Col>

              <Col span={6}>
                <MyForm.Item
                  options={[
                    { label: 'có', value: true },
                    { label: 'không', value: false },
                  ]}
                  label="Ăn đêm"
                  name="night_eat"
                  type="radio"
                  required
                  initialValue={false}
                />
              </Col>
            </Row>
            <Col span={24}>
              <MyForm.Item
                options={[
                  { label: 'có', value: true },
                  { label: 'không', value: false },
                ]}
                label={'Làm việc theo giờ hội sở'}
                name="is_ho_shift"
                type="radio"
                required
                // innerprops={{
                //   disabled: restShiftDisabled,
                //   onChange: setOnchangeRestShift,
                // }}
                initialValue={false}
              />
              {/* <Checkbox onChange={onChange}>Làm việc theo chế độ của hội sở</Checkbox> */}
            </Col>
            {/* <Row gutter={24} style={{ marginTop: '12px' }}>
              <Col span={8}>
                <SelectListLeaveType />
              </Col>
              <Col span={8}>
                <MyForm.Item
                  label={'Số lần chấm công'}
                  name="number_of_attendance"
                  type="input"
                  initialValue={2}
                />
              </Col>
              {shiftName && shiftName === 'PH' && (
                <Col span={8}>
                  <MyForm.Item
                    label={'Hệ số chuyển đổi thành quỹ'}
                    name="efficiency_factor"
                    type="input-number"
                    initialValue={3}
                    innerprops={{
                      allowClear: true,
                      placeholder: 'Hệ số chuyển đổi thành quỹ',
                      min: 0,
                      onChange: (value: number) => {
                        setEfficiencyFactor(value);
                      }
                    }}
                  />
                </Col>
              )}
              <Col span={8}>
                <MyForm.Item
                  label={'Số phút làm không giảm suất'}
                  name="minutes_working_not_reduced"
                  type="input-number"
                  innerprops={{
                    allowClear: true,
                    placeholder: 'Số phút làm không giảm suất',
                  }}
                />
              </Col>
              {shiftName && shiftName === 'PH' && (
                <Col span={8}>
                  <MyForm.Item
                    label={'Hệ số ca đêm ngày lễ'}
                    name="night_ph_efficiency_factor"
                    type="input-number"
                    innerprops={{
                      allowClear: true,
                      placeholder: 'Hệ số ca đêm ngày lễ',
                      min: efficiencyFactor,
                    }}
                    initialValue={3}
                  />
                </Col>
              )}

            </Row> */}
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default FormShift;
