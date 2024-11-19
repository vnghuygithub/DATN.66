import { Button, Col, Drawer, FormInstance, Row, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import moment, { Moment } from 'moment';
// import { getKpiHrById , updateKpiHr , createViolation} from '@/api/kpi/kpi_hr.api';
import {
  getViolationById,
  updateViolation,
  createViolation,
} from '@/api/kpi/violation.api';
import SelectHolidayStatus from '@/pages/components/selects/SelectHolidayStatus';
import { reasonOptions } from '@/const/options';
import SelectEmployeeContractSearch from '@/pages/components/selects/SelectEmployeeContractSearch';
import { mobileResponsive } from '@/utils/mobileResponsive';

import { get, set } from 'lodash';
import { violationOptions } from '@/const/options';
import { getViolation } from '@/api/kpi/violation.api';
import useLocalStorage from '@/hooks/useLocalStorage';

interface IProps {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idKpi?: any;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
}

const ViolationConfigForm = ({
  onClose,
  showDrawer,
  open,
  idKpi,
  setForceUpdate,
  forceUpdate,
  form,
}: IProps) => {
  const { t } = useLocale();
  const { isMobile } = mobileResponsive();
  const [loading, setLoading] = useState(false);
  const [violations, setViolations] = useState<any[]>([]);
  const [violationList, setViolationList] = useState<any[]>([]);
  const [employee, setEmployee] = useState<any[]>([]);

  useEffect(() => {}, []);

  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    if (data && idKpi != -1) {
      setLoading(true);
      const res = await updateViolation(idKpi, {
        name: data?.name,
        default_violation_level: data?.default_violation_level,
        default_violation_type: data?.default_violation_type,
      });
      if (res) {
        $message.success('Thành công');
        setForceUpdate && setForceUpdate(!forceUpdate);
        onClose && onClose();
        setLoading(false);
      }
    } else if (data && idKpi == -1) {
      setLoading(true);
      console.log(data?.employee_id);
      const res = await createViolation({
        name: data?.name,
        default_violation_level: data?.default_violation_level,
        default_violation_type: data?.default_violation_type,
        company: Number(localStorage.getItem('company_id')),
      });
      if (res) {
        $message.success('Thành công');
        setForceUpdate && setForceUpdate(!forceUpdate);
        onClose && onClose();
        setLoading(false);
      }
    }
  };

  const fetchKpi = async (id: number) => {
    if (!id || id == -1) {
      console.log(id);
      form?.setFieldsValue({
        employee_id: '',
        employee_code: '',
        report_serial: '',
        report_date: '',
        violation_level: '',
        violation_type: '',
        apply_date: '',
        violation: '',
      });
      return;
    }
    try {
      setLoading(true);
      const res = await getViolationById(idKpi);
      if (res) {
        form?.setFieldsValue({
          name: res.name ?? '',
          default_violation_level: res.default_violation_level ?? '',
          default_violation_type: res.default_violation_type ?? '',
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchKpi(idKpi);
  }, [idKpi, open]);
  return (
    <>
      <Drawer
        key={idKpi}
        title={'Sửa Cấu hình vi phạm'}
        width={isMobile ? '100%' : '720'}
        onClose={onClose}
        open={open}
        destroyOnClose
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Button key={1} onClick={onClose}>
              Hủy
            </Button>
            <Button key={2} onClick={onFinish} type="primary" loading={loading}>
              Lưu
            </Button>
          </div>
        }>
        <Spin spinning={loading}>
          <MyForm<any> onFinish={onFinish} form={form} layout="vertical">
            <Row gutter={24}>
              <Col span={12}>
                <MyForm.Item
                  label="Tên vi phạm"
                  type="input"
                  name="name"
                  innerprops={{
                    placeholder: 'Nhập tên vi phạm',
                  }}
                  // innerprops = {{disabled: true}}

                  // style={{ display: 'none' }}
                />
              </Col>

              <Col span={12}>
                <MyForm.Item
                  label="Hình thức xử lý"
                  type="select"
                  name="default_violation_type"
                  options={[
                    {
                      label: 'Trừ Tiền',
                      value: '1',
                    },
                    {
                      label: 'Tỷ lệ',
                      value: '2',
                    },
                    {
                      label: 'Đền bù',
                      value: '3',
                    },
                    {
                      label: 'Sa thải',
                      value: '4',
                    },
                  ]}
                  innerprops={{
                    placeholder: 'Chọn hình thức xử lý',
                  }}
                  required
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Mức độ vi phạm"
                  type="input-number"
                  name="default_violation_level"
                  innerprops={{
                    placeholder: 'Nhập mức độ vi phạm',
                  }}
                  required
                />
              </Col>
            </Row>
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default ViolationConfigForm;
