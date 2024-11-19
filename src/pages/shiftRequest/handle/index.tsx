import { getEmployeeById } from '@/api/employee/employee.api';
import {
  createShiftRequest,
  getShiftRequestById,
  updateShiftRequest,
} from '@/api/shiftRequest/shiftRequest.api';
import MyForm from '@/components/core/form';
import SelectCompanyByEmployeeId from '@/pages/components/selects/SelectCompanyByEmployeeId';
import SelectCurrentShift from '@/pages/components/selects/SelectCurrentShift';
import SelectEmployeeContractSearch from '@/pages/components/selects/SelectEmployeeContractSearch';
import SelectEmployeeShiftRequest from '@/pages/components/selects/SelectEmployeeShiftRequest';
import SelectNewShift from '@/pages/components/selects/SelectNewShift';
import { Button, Col, Drawer, FormInstance, Row, Spin } from 'antd';
import moment from 'moment';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import SelectMondayShift from '@/pages/components/selects/SelectMondayShift';
import SelectTuesdayShift from '@/pages/components/selects/SelectTuesday';
import SelectWednesdayShift from '@/pages/components/selects/SelectWednesdayShift';
import SelectThursdayShift from '@/pages/components/selects/SelectThursdayShift';
import SelectFridayShift from '@/pages/components/selects/SelectFriday';
import SelectSaturdayShift from '@/pages/components/selects/SelectSaturdayShift';
import SelectSundayShift from '@/pages/components/selects/SelectSunday';
import { getShiftById } from '@/api/shift/shift.api';
import { getShiftByIds } from '../../../api/shift/shift.api';
import { mobileResponsive } from '@/utils/mobileResponsive';

interface Props {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idRequest?: number;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  isCreating?: boolean;
  isView?: boolean;
}
type Shift = {
  name: string;
};
const ShiftRequestForm: FC<Props> = ({
  onClose,
  showDrawer,
  open,
  isView,
  idRequest,
  setForceUpdate,
  forceUpdate,
  form,
  isCreating,
}) => {
  const [loading, setLoading] = useState(false);
  const { isMobile } = mobileResponsive();
  const [from_date, setFrom_date] = useState<any>(null);
  const [to_date, setTo_date] = useState<any>(null);

  const [selectedCurrentEmployeeId, setSelectedCurrentEmployeeId] = useState<
    number | null
  >(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  // const [employeeCode, setEmployeeCode] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const is_administrative = localStorage.getItem('is_administrative');
  const is_general_manager = localStorage.getItem('is_general_manager');
  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    if (data?.from_date > data?.to_date) {
      $message.error('Ngày kết thúc không thể nhỏ hơn ngày bắt đầu!');
      return;
    }
    if (isCreating) {
      setLoading(true);
      if (data) {
        const daysOfWeek = [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
        ];
        const shiftResults = await getShiftByIds(
          daysOfWeek.map(day => [day, data[day]])
        );
        const formattedFromDate = data.from_date
          ? moment(data.from_date).format('YYYY-MM-DD')
          : null;
        const formattedToDate = data.to_date
          ? moment(data.to_date).format('YYYY-MM-DD')
          : moment(data.from_date).add(5, 'years').format('YYYY-MM-DD');
        const shiftResultsObject = shiftResults.reduce(
          (acc: any, [day, shiftId]: any) => {
            acc[day] = shiftId;
            return acc;
          },
          {}
        );


        let saturday: Shift | false = false;
        if (data.saturday) {
          saturday = await getShiftById(data.saturday);
        }


        const shiftRequestData = {
          employee_id: data.employee_id,
          company_id: data.company_id,
          new_shift_id: data.new_shift_id,
          from_date: formattedFromDate,
          to_date: formattedToDate,
          ...shiftResultsObject,
          saturday: saturday ? saturday?.name : 'OFF',
          sunday: 'OFF',
        };
        const res = await createShiftRequest(shiftRequestData);
        if (res) {
          setLoading(false);
          $message.success('Tạo mới thành công!');
          onClose && onClose();
          setForceUpdate && setForceUpdate(!forceUpdate);
        } else {
          setLoading(false);
          $message.error('Tạo mới thất bại!');
          return;
        }
      }
    } else {
      setLoading(true);
      if (data) {
        const daysOfWeek = [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ];
        // const shiftResults = await getShiftByIds(
        //   daysOfWeek.map(day => [day, data[day]])
        // );

        const formattedFromDate = data.from_date
          ? moment(data.from_date).format('YYYY-MM-DD')
          : null;
        const formattedToDate = data.to_date
          ? moment(data.to_date).format('YYYY-MM-DD')
          : null;
        // const shiftResultsObject = shiftResults.reduce(
        //   (acc: any, [day, shiftId]: any) => {
        //     acc[day] = shiftId;
        //     return acc;
        //   },
        //   {}
        // );
        const saturday = await getShiftById(data.saturday);
        const shiftRequestData = {
          employee_id: data.employee_id,
          company_id: data.company_id,
          new_shift_id: data.new_shift_id,
          from_date: formattedFromDate,
          to_date: formattedToDate,
          saturday: saturday?.name,
          // ...shiftResultsObject,
        };
        const res = await updateShiftRequest(idRequest, shiftRequestData);
        if (res) {
          setLoading(false);
          $message.success('Cập nhật thành công!');
          onClose && onClose();
          setForceUpdate && setForceUpdate(!forceUpdate);
        } else {
          setLoading(false);
          $message.error('Cập nhật thất bại!');
          return;
        }
      }
    }
  };
  const handleEmployeeChange = (value: any) => {
    if (value) {
      fetchEmployeeById(value);
      setSelectedCurrentEmployeeId(value);
    }
  };
  const handleCompanyChange = (value: any) => {
    if (value) {
      setSelectedCompanyId(value);
    }
  };
  const fetchEmployeeById = async (id: string) => {
    if (!id) {
      return;
    }
    setLoading(true);
    const res = await getEmployeeById(id);
    if (res) {
      setLoading(false);
      // setEmployeeCode(res.code);
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
  const fetchShiftRequestById = async (id: number) => {
    if (!id) {
      return;
    }
    setLoading(true);
    const res = await getShiftRequestById(id);
    if (res) {
      setLoading(false);
      //set_data_type_date('from_date', res);
      form?.setFieldsValue({
        from_date: res.from_date
      })
      setFrom_date(res.from_date);
      // set_data_type_date('to_date', res);
      form?.setFieldsValue({
        to_date: res.to_date
      })
      setTo_date(res.to_date);
      form &&
        form.setFieldsValue({
          key: res.id,
          employee_code: res.employee_code,
          current_shift_id: res.current_shift_id,
          company_id: res.company_id,
          new_shift_id: res.new_shift_id,
          employee_id: res.employee_id,
          monday: res.monday,
          tuesday: res.tuesday,
          wednesday: res.wednesday,
          thursday: res.thursday,
          friday: res.friday,
          saturday: res.saturday,
          sunday: res.sunday,
        });
      setSelectedShift(res.new_shift_id);
      setSelectedCompanyId(res.company_id);
      setSelectedCurrentEmployeeId(res.employee_id);
    }
  };
  useEffect(() => {
    if (idRequest) {
      form?.resetFields();
      fetchShiftRequestById(idRequest);
    }
  }, [idRequest]);
  useEffect(() => {
    form?.resetFields();
    setSelectedShift(null);
    setSelectedCompanyId(null);
    setSelectedCurrentEmployeeId(null);
    // setEmployeeCode(null);
  }, [isCreating, onClose]);

  const handleNewShiftChange = (value: any) => {
    if (value) {
      setSelectedShift(value);
    }
  };
  // useEffect(() => {
  //   if (employeeCode) {
  //     form?.setFieldsValue({
  //       employee_code: employeeCode,
  //     });
  //   }
  // }, [employeeCode, form]);
  useEffect(() => {
    if (selectedShift) {
      form?.setFieldsValue({
        monday: selectedShift,
        tuesday: selectedShift,
        wednesday: selectedShift,
        thursday: selectedShift,
        friday: selectedShift,
      });
    }
  }, [selectedShift]);
  return (
    <>
      <Drawer
        key={idRequest}
        title={idRequest ? 'Thông tin chi tiết' : 'Thêm mới'}
        width={isMobile ? '100%' : '80%'}
        onClose={onClose}
        open={open}
        destroyOnClose
        bodyStyle={{
          // padding: '0px',
          // paddingBottom: 80
        }}
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
            disabled={isView}
            onFinish={onFinish}
            form={form}
            layout="vertical">
            <Row gutter={28}>
              <Col span={8}>
                {
                  is_administrative == "true" || is_general_manager == "true" ? (

                    <SelectEmployeeShiftRequest onChange={handleEmployeeChange} />
                  ) : (
                    <SelectEmployeeShiftRequest onChange={handleEmployeeChange} domain_search={[["id", "=", Number(localStorage.getItem("employee_id"))]]} />

                  )
                }
              </Col>
              {/* {employeeCode && (
                <Col span={8}>
                  <MyForm.Item
                    label="Mã nhân viên"
                    name="employee_code"
                    type="input"
                    initialValue={employeeCode}
                    innerprops={{
                      disabled: true,
                    }}
                  />
                </Col>
              )}
              {!isCreating && (
                <>
                  <Col span={8}>
                    <MyForm.Item
                      label="Mã nhân viên"
                      name="employee_code"
                      type="input"
                      innerprops={{
                        disabled: true,
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <SelectCurrentShift />
                  </Col>
                </>
              )} */}
              <Col span={8}>
                <SelectCompanyByEmployeeId
                  employeeId={selectedCurrentEmployeeId}
                  onChange={handleCompanyChange}
                />
              </Col>
              <Col span={8}>
                <SelectNewShift
                  companyId={selectedCompanyId}
                  onChange={handleNewShiftChange}
                />
              </Col>
              <Col span={8}>
                <MyForm.Item
                  label="Từ ngày"
                  name="from_date"
                  type="time-picker-input"
                  innerprops={{
                    allowClear: true,
                    format: 'DD/MM/YYYY',
                  }}
                  required
                />
              </Col>
              <Col span={8}>
                <MyForm.Item
                  label="Đến ngày"
                  name="to_date"
                  type="time-picker-input"
                  innerprops={{
                    allowClear: true,
                    format: 'DD/MM/YYYY',
                  }}
                />
              </Col>
              {(isCreating || (idRequest && !isView)) ? (
                <Col span={8}>
                  <SelectSaturdayShift
                    companyId={selectedCompanyId}
                    selectedShift={selectedShift}
                  />
                </Col>
              ) :
                (
                  <Col span={8}>
                    <MyForm.Item
                      label="Thứ 7"
                      name="saturday"
                      type="input"
                      // initialValue={"OFF"}
                      innerprops={{
                        allowClear: true,
                        placeholder: "Thứ 7",
                      }}
                    />
                  </Col>
                )
              }


            </Row>
            {selectedShift && (
              <>
                <Row gutter={24} style={{ visibility: 'hidden' }}>
                  <Col span={3}>
                    <SelectMondayShift
                      companyId={selectedCompanyId}
                      selectedShift={selectedShift}
                    />
                  </Col>
                  <Col span={3}>
                    <SelectTuesdayShift
                      companyId={selectedCompanyId}
                      selectedShift={selectedShift}
                    />
                  </Col>
                  <Col span={3}>
                    <SelectWednesdayShift
                      companyId={selectedCompanyId}
                      selectedShift={selectedShift}
                    />
                  </Col>
                  <Col span={3}>
                    <SelectThursdayShift
                      companyId={selectedCompanyId}
                      selectedShift={selectedShift}
                    />
                  </Col>
                  <Col span={3}>
                    <SelectFridayShift
                      companyId={selectedCompanyId}
                      selectedShift={selectedShift}
                    />
                  </Col>
                  <Col span={3}>
                    <SelectSundayShift
                      companyId={selectedCompanyId}
                      selectedShift={selectedShift}
                    />
                  </Col>
                </Row>
              </>
            )}
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default ShiftRequestForm;
