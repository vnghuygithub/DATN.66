import { Button, Col, DatePicker, Drawer, FormInstance, Row, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message, Space } from 'antd';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import moment, { Moment } from 'moment';

import { getListEmployeeKPI } from '@/api/employee/employee.api';
import { get, set, toInteger } from 'lodash';
import {
  getKpiEmpConfigById,
  createKpiEmpConfig,
  updateKpiEmpConfig,
} from '@/api/kpi/kpi_config.api';
import {
  departmentOptions,
  violationOptions,
  kpiConfigOptions,
  companyOptionsAll,
} from '@/const/options';
import { mobileResponsive } from '@/utils/mobileResponsive';
interface IProps {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idKpi?: any;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  updateState?: boolean;
}

const KpiConfigForm = ({
  onClose,
  showDrawer,
  open,
  idKpi,
  setForceUpdate,
  forceUpdate,
  form,
  updateState,
}: IProps) => {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const { isMobile } = mobileResponsive();

  const onFinish = async () => {
    console.log('err');

    await form?.validateFields();
    const data = await form?.getFieldsValue();
    console.log('data update read ', data)
    if (data && idKpi != -1) {
      console.log(data);
      // setLoading(true);
      const res = await updateKpiEmpConfig(idKpi, {
        name: data?.name,
        employee_level: data?.employee_level,
        late_compensation_under: data?.late_compensation_under,
        late_compensation_over: data?.late_compensation_over,
        base_weekly_report_compensation: data?.base_weekly_report_compensation,
        missing_review_book_compensation: data?.missing_review_book_compensation,
        use_percentage_weekly_report: data?.use_percentage_weekly_report ? true : false,
      });

      if (res) {
        $message.success('Thành công');
        setForceUpdate && setForceUpdate(!forceUpdate);
        onClose && onClose();
        setLoading(false);
      }
    } else if (data && idKpi == -1) {
      // setLoading(true);
      console.log('data is in ', data);
      const company_id = parseInt(localStorage.getItem('company_id') || '');

      const form_data = new FormData();
      form_data.append('name', data?.name);
      form_data.append('employee_level', data?.employee_level);
      form_data.append(
        'late_compensation_under',
        data?.late_compensation_under
      );
      form_data.append('late_compensation_over', data?.late_compensation_over);
      form_data.append(
        'base_weekly_report_compensation',
        data?.base_weekly_report_compensation
      );
      form_data.append(
        'missing_review_book_compensation',
        data?.missing_review_book_compensation
      );
      form_data.append('use_percentage_weekly_report', data?.use_percentage_weekly_report ? 'true' : 'false');
      console.log(form_data);
      const res = await createKpiEmpConfig(form_data);
      if (res) {
        $message.success('Thành công');
        setForceUpdate && setForceUpdate(!forceUpdate);
        onClose && onClose();
        setLoading(false);
      }
    }
  };

  const fetchKpi = async (id: number) => {
    console.log('id is ', id);
    if (!id || id == -1) {
      const company_int = parseInt(localStorage.getItem('company_id') || '');
      form?.setFieldsValue({
        name: '',
        employee_level: '',
        late_compensation_under: '',
        late_compensation_over: '',
        base_weekly_report_compensation: '',
        missing_review_book_compensation: '',
        use_percentage_weekly_report: false,
      });
      return;
    }
    try {
      setLoading(true);
      const res = await getKpiEmpConfigById(idKpi);
      if (res) {
        console.log(res.use_percentage_weekly_report, 'use_percentage_weekly_report')
        form?.setFieldsValue({
          name: res.name ?? '',
          employee_level: res.employee_level ?? '',
          late_compensation_under: res.late_compensation_under ?? '',
          late_compensation_over: res.late_compensation_over ?? '',
          base_weekly_report_compensation:res.base_weekly_report_compensation ?? '',
          missing_review_book_compensation:res.missing_review_book_compensation ?? '',
          // use_percentage_weekly_report: res.use_percentage_weekly_report ?? "false",
          use_percentage_weekly_report: res.use_percentage_weekly_report ?? true,
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
        title={'Sửa cấu hình Kpi'}
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
                <MyForm.Item label="Tên cấp" type="input" name="name" />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Cấp nhân viên"
                  type="input-number"
                  name="employee_level"
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Phạt đi muộn dưới 5 phút"
                  type="input-number"
                  name="late_compensation_under"
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Phạt đi muộn trên 5 phút"
                  type="input-number"
                  name="late_compensation_over"
                />
              </Col>

              <Col span={12}>
                <MyForm.Item
                  label="Phạt báo cáo tuần"
                  type="input-number"
                  name="base_weekly_report_compensation"
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Phạt thiếu review sách"
                  type="input-number"
                  name="missing_review_book_compensation"
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  name="use_percentage_weekly_report"
                  label="Tính phần trăm"
                  type="radio"
                  options={[
                    { label: 'có', value: true },
                    { label: 'không', value: false },
                  ]}
                />
              </Col>
            </Row>
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default KpiConfigForm;
