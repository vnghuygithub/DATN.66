import { Button, Col, DatePicker, Drawer, FormInstance, Row, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message, Upload, Space } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import moment, { Moment } from 'moment';
import {
  getKpiCtrlById,
  updateKpiCtrl,
  createKpiCtrl,
  getLinkKpiCtrl,
} from '@/api/kpi/kpi_ctrl.api';
import SelectHolidayStatus from '@/pages/components/selects/SelectHolidayStatus';
import { reasonOptions } from '@/const/options';
import SelectEmployeeContractSearch from '@/pages/components/selects/SelectEmployeeContractSearch';
import { getListEmployeeV2 } from '@/api/employee/employee.api';
import { get } from 'lodash';

interface IProps {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idKpi?: any;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  // employee: any[];
  updateState?: boolean;
}

const ControlKpiForm = ({
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
  const [fileList, setFileList] = useState<any>();
  const [employee, setEmployee] = useState<any[]>([]);
  const [downloadLink, setDownloadLink] = useState<any>();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);

    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    getListEmployeeV2().then(res => {
      setEmployee(res.result.result);
    });
  }, []);

  const customRequest = async ({
    file,
    onSuccess,
    onError,
    onProgress,
    onRemove,
  }: any) => {
    if (file) {
      setFileList(file);

      onSuccess('ok');
    }
  };

  const onChangeEmployee = (value: any) => {
    for (let i = 0; i < employee.length; i++) {
      if (form?.getFieldValue('employee_id') == employee[i].id) {
        form?.setFieldsValue({
          employee_code: employee[i].code,
          company: employee[i].company_id[1],
          department: employee[i].department_id[1],
        });
      }
    }
  };

  const handleOnclick = () => {
    const link = document.createElement('a');
    link.href = downloadLink.url;
    link.click();
  };

  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    const ymDate_apply = data?.date_apply.format('YYYY-MM');
    const ymViolation_date = data?.violation_date.format('YYYY-MM');

    if (ymDate_apply < ymViolation_date) {
      $message.error('Thời gian vi phạm không được lớn hơn thời gian áp dụng');
      return;
    }

    if (data && idKpi != -1) {
      setLoading(true);
      const res = await updateKpiCtrl(idKpi, {
        // "employee_name": data?.employee_id?.value,
        report_serial: data?.report_serial,
        report_date: moment(data?.report_date).format('YYYY-MM-DD'),
        violation_level: data?.violation_level,
        violation_type: data?.violation_type,
        date_apply: moment(data?.date_apply).format('YYYY-MM-DD'),
        violation_date: moment(data?.violation_date).format('YYYY-MM-DD'),
        // "attachment_ids" : "",
      });
      if (res) {
        $message.success('Thành công');
        setForceUpdate && setForceUpdate(!forceUpdate);
        onClose && onClose();
        setLoading(false);
      }
    } else if (data && idKpi == -1) {
      setLoading(true);

      const form_data = new FormData();
      form_data.append('employee_name', data?.employee_id);
      form_data.append('report_serial', data?.report_serial);
      form_data.append(
        'report_date',
        moment(data?.report_date).format('YYYY-MM-DD')
      );
      form_data.append('violation_level', data?.violation_level);
      form_data.append('violation_type', data?.violation_type);
      form_data.append(
        'date_apply',
        moment(data?.date_apply).format('YYYY-MM-DD')
      );
      form_data.append(
        'violation_date',
        moment(data?.violation_date).format('YYYY-MM-DD')
      );
      form_data.append('attachment_ids', fileList);
      const res = await createKpiCtrl(form_data);
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
      form?.setFieldsValue({
        employee_id: '',
        employee_code: '',
        company: '',
        department: '',
        report_serial: '',
        report_date: moment(),
        violation_level: '',
        violation_type: '',
        date_apply: '',
        violation_date: '',
      });
      return;
    }
    try {
      setLoading(true);

      const res = await getKpiCtrlById(idKpi);
      const link = await getLinkKpiCtrl(idKpi);

      if (res) {
        form?.setFieldsValue({
          employee_id:
            { value: res.employee_name.id, label: res.employee_name.name } ??
            '',
          employee_code: res.employee_code ? res.employee_code : '',
          company: res.company.name ?? '',
          department: res.department.name ?? '',
          report_serial: res.report_serial ?? '',
          report_date: res.report_date
            ? moment(res.report_date, 'YYYY-MM-DD')
            : '',
          violation_level: res.violation_level ?? '',
          violation_type: res.violation_type ?? '',
          date_apply: res.date_apply
            ? moment(res.date_apply, 'YYYY-MM-DD')
            : '',
          violation_date: res.violation_date
            ? moment(res.violation_date, 'YYYY-MM-DD')
            : '',
        });
      }
      if (link) {
        setDownloadLink(link[0]);
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
        title={'Sửa Kpi'}
        width={isMobile ? '100%' : '50%'}
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
                <SelectEmployeeContractSearch
                  label="Tên Nhân viên"
                  onChange={onChangeEmployee}
                  disabled={updateState}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Mã nhân viên"
                  type="input"
                  name="employee_code"
                  innerprops={{
                    disabled: true,
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Công ty"
                  type="input"
                  name="company"
                  innerprops={{
                    disabled: true,
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Phòng ban"
                  type="input"
                  name="department"
                  innerprops={{
                    disabled: true,
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Số biên bản"
                  type="input"
                  name="report_serial"
                  innerprops={{
                    placeholder: 'Nhập số biên bản',
                  }}
                  required
                />
              </Col>

              <Col span={12}>
                <MyForm.Item
                  label="Ngày biên bản"
                  type="date-picker"
                  name="report_date"
                  innerprops={{
                    format: 'DD/MM/YYYY',
                    placeholder: 'Chọn ngày biên bản',
                  }}
                  required
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Loại vi phạm"
                  type="select"
                  name="violation_type"
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
                  name="violation_level"
                  innerprops={{
                    placeholder: 'Nhập mức độ vi phạm',
                  }}
                  required
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Tháng áp dụng"
                  name="date_apply"
                  innerprops={{
                    placeholder: 'Chọn tháng áp dụng',
                  }}
                  required>
                  <DatePicker
                    picker="month"
                    format={'MM/YYYY'}
                    style={{ width: '100%' }}
                  />
                </MyForm.Item>
              </Col>

              <Col span={12}>
                <MyForm.Item
                  label="Tháng vi phạm"
                  name="violation_date"
                  innerprops={{
                    placeholder: 'Chọn tháng vi phạm',
                  }}
                  required>
                  <DatePicker
                    picker="month"
                    format={'MM/YYYY'}
                    style={{ width: '100%' }}
                  />
                </MyForm.Item>
              </Col>

              <Col span={12}>
                <MyForm.Item
                  label=" "
                  name="download"
                  style={{ width: '100%' }}>
                  <Button
                    style={{ width: '100%' }}
                    onClick={handleOnclick}
                    disabled={!updateState}
                    icon={<DownloadOutlined />}>
                    Tải xuống
                  </Button>
                </MyForm.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Space direction="vertical">
                  <MyForm.Item
                    label="Đính kèm file"
                    name="attachment_ids"
                    style={{ width: '100%' }}
                    required={!updateState}>
                    <Upload
                      style={{ width: '100%' }}
                      customRequest={customRequest}
                      maxCount={1}>
                      <Button
                        style={{ width: '100%' }}
                        disabled={updateState}
                        icon={<UploadOutlined />}>
                        Tải lên
                      </Button>
                    </Upload>
                  </MyForm.Item>
                </Space>
              </Col>
            </Row>
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default ControlKpiForm;
