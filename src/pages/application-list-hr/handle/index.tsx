import { Button, Col, Drawer, FormInstance, Row, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import moment, { Moment } from 'moment';
import {
  getExplainationById,
  putExplainationById,
} from '@/api/explanationRequest/explanationRequest.api';
import SelectHolidayStatus from '@/pages/components/selects/SelectHolidayStatus';
import { reasonOptions } from '@/const/options';
import SelectParentApplication from '@/pages/components/selects/SelectParentApplication';
import SelectEmployeeShiftRequest from '@/pages/components/selects/SelectEmployeeShiftRequest';
import SelectParentUpdate from '@/pages/components/selects/SelectParentUpdate';
import { putEmployeeById } from '@/api/employee/employee.api';
import { set } from 'lodash';
import SelectEmployeeGeneralManager from '@/pages/components/selects/SelectGeneralManager';
import SelectCompany from '@/pages/components/selects/SelectCompany';
import {
  getHolidayStatusById,
  getListHolidayStatus,
} from '@/api/employee/holidayStatus.api';
import { mobileResponsive } from '@/utils/mobileResponsive';

interface IProps {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idApplication?: any;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  isView?: boolean;
  checkUpdate: boolean;

}

const ApplicationFormApprovalHr = ({
  onClose,
  showDrawer,
  open,
  idApplication,
  setForceUpdate,
  forceUpdate,
  form,
  checkUpdate,
  isView,
}: IProps) => {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const { isMobile } = mobileResponsive();
  const [employeeId, setEmployeeId] = useState<any>(null);
  const [holidayDayStatus, setHolidayDayStatus] = useState<any>(null);
  const [holidayStatusType, setHolidayStatusType] = useState<any>(null);
  const [state, setState] = useState<any>('');

  let is_general_manager = localStorage.getItem('is_general_manager');
  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    if (data) {
      setLoading(true);
      const res = await putExplainationById(idApplication, {
        for_reasons: data?.for_reasons,
        reasons: data?.reasons,
        minutes: data?.minutes,
        holiday_status_id: data?.holiday_status_id,
        date_from: moment(data?.from_date).format('YYYY-MM-DD HH:mm'),
        date_to: moment(data?.date_to).format('YYYY-MM-DD HH:mm'),
        employee_parent_id: data?.employee_parent_id,
        hr_approval_id: data?.hr_manager,
        state: state,

      });
      if (data.employee_parent_id) {
        await putEmployeeById(employeeId, {
          params: {
            data: {
              parent_id: data?.employee_parent_id,
              hr_manager: data?.hr_manager,
            },
          },
        });
      }

      if (res) {
        $message.success('Thành công');
        setState('');

        setForceUpdate && setForceUpdate(!forceUpdate);
        onClose && onClose();
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const fetchApplicationById = async (id: number) => {
    if (!id) {
      return;
    }
    try {
      setLoading(true);
      const res = await getExplainationById(idApplication);
      if (res) {
        setState(res?.state);
        const from_date = moment(res?.date_from, 'YYYY-MM-DD-HH-mm').format('YYYY-MM-DD') ?? '';
        const date_to = moment(res?.date_to, 'YYYY-MM-DD-HH-mm').format('YYYY-MM-DD') ?? '';
        form?.setFieldsValue({
          for_reasons: res?.for_reasons ?? '',
          reasons: res?.reasons ?? '',
          minutes: res?.minutes ?? '',
          holiday_status_id: res?.holiday_status_id ?? '',
          from_date: from_date ?? '',
          date_to: date_to ?? '',
          employee_parent_id: res?.employee_parent_id ?? '',
          multiplier_work_time: res?.multiplier_work_time ?? '',
          multiplier_wage: res?.multiplier_wage ?? '',
          hr_manager: res?.hr_approval_id ?? '',
          company_id: res?.work_trip_location,
        });
        setEmployeeId(res?.employee_id);
        setHolidayDayStatus(res?.holiday_status_id);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApplicationById(idApplication);
  }, [idApplication, open]);
  const handleHolidayStatusChange = (value: any) => {
    setHolidayDayStatus(value);
  };
  const _getHolidayStatusById = async (id: number) => {
    const res = await getHolidayStatusById(id);
    if (res) {
      setHolidayStatusType(res?.code);
      return res?.code;
    }
  };
  useEffect(() => {
    _getHolidayStatusById(holidayDayStatus);
  }, [holidayDayStatus]);
  return (
    <>
      <Drawer
        key={idApplication}
        title={'Sửa đơn'}
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
            disabled={isView}
            onFinish={onFinish}
            form={form}
            layout="vertical">
            <Row gutter={24}>
            <Col span={12}>
                <SelectParentUpdate
                  employeeId={employeeId}
                  checkUpdate={checkUpdate}
                />
              </Col>
              {(holidayStatusType === 'TC' || holidayStatusType === 'TCC') && (
                <Col span={12}>
                  <SelectEmployeeGeneralManager checkUpdate={checkUpdate} />
                </Col>
              )}
              <Col span={12}>
                <SelectHolidayStatus
                  onChange={handleHolidayStatusChange}
                  checkUpdate={checkUpdate}
                />
              </Col>
              {holidayStatusType === 'CT' && (
                <Col span={12}>
                  <SelectCompany checkUpdate={checkUpdate} />
                </Col>
              )}
              <Col span={12}>
                <MyForm.Item
                  innerprops={{
                    disabled: isView,
                  }}
                  label="Vì lí do"
                  type="select"
                  options={[
                    {
                      label: 'Cá nhân',
                      value: '1',
                    },
                    {
                      label: 'Công việc',
                      value: '2',
                    },
                  ]}
                  name="for_reasons"
                  required
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Lí do"
                  type="input"
                  name="reasons"
                  innerprops={{
                    disabled: isView || checkUpdate,
                  }}
                  required
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Số phút"
                  type="input-number"
                  name="minutes"
                  required
                  innerprops={{
                    disabled: isView || checkUpdate,
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Từ ngày"
                  type="time-picker-input" //date-picker
                  name="from_date"
                  innerprops={{
                    format: 'DD/MM/YYYY',
                    disabled: isView || checkUpdate,
                  }}
                  required
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Đến ngày"
                  type="time-picker-input"
                  name="date_to"
                  innerprops={{
                    format: 'DD/MM/YYYY',
                    disabled: isView || checkUpdate,
                  }}
                  required
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Hệ số công"
                  type="input"
                  name="multiplier_work_time"
                  innerprops={{
                    min: 0,
                    allowClear: true,
                    disabled: isView || checkUpdate,
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Hệ số lương"
                  type="input"
                  name="multiplier_wage"
                  innerprops={{
                    min: 0,
                    allowClear: true,
                    disabled: isView || checkUpdate,
                  }}
                />
              </Col>
            </Row>
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default ApplicationFormApprovalHr;
