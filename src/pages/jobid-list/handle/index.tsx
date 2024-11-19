import { Button, Col, DatePicker, Drawer, FormInstance, Row, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message, Space } from 'antd';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import moment, { Moment } from 'moment';

import { getListEmployeeKPI } from '@/api/employee/employee.api';
import { get, set, toInteger } from 'lodash';
import { createJob, updateJob, getJobById, newJob } from '@/api/job/job.api';
import {
  departmentOptions,
  violationOptions,
  kpiConfigOptions,
  companyOptionsAll,
  departmentAllocationSearchOptions,
} from '@/const/options';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import SelectSearchAllocationDepartment from '@/pages/components/selects/SelectSearchAllocationDepartment';
import { mobileResponsive } from '@/utils/mobileResponsive';
import SelectJobType from '@/pages/components/selects/SelectJobType';

interface IProps {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idKpi?: any;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  updateState?: boolean;
  isView?: boolean;
}

const JobidForm = ({
  onClose,
  showDrawer,
  open,
  idKpi,
  setForceUpdate,
  forceUpdate,
  form,
  updateState,
  isView,
}: IProps) => {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const { isMobile } = mobileResponsive();
  const [employee, setEmployee] = useState<any[]>([]);
  const [kpiConfigOption, setKpiConfigOption] = useState<any>();
  const [selectCompanyId, setSelectCompanyId] = useState<any>();
  const handleCompanyChange = (value: any) => {
    form?.setFieldsValue({
      department_id: '',
    });
    setSelectCompanyId(value);
  };
  // useEffect(() => {
  //   kpiConfigOptions().then(res => {
  //     if (res) {
  //       setKpiConfigOption(res);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   getListEmployeeKPI().then(res => {
  //     setEmployee(res.result.result);
  //   });
  // }, []);

  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    const name = data?.name ? data?.name.trim() : '';
    if (!name) {
      $message.error('Vui lòng nhập tên chức vụ');
      return;
    }

    if (data && idKpi != -1) {
      const res = await updateJob(idKpi.id, {
        name: data?.name ? data?.name.trim() : '',
        department_id: data?.department_id?.value ?? data?.department_id ?? "",
        level: data?.level,
        company_id:
          data?.company_id.value ?? data?.company_id ?? Number(localStorage.getItem('company_id')),
        is_hazardous_environment: data?.is_hazardous_environment,
        job_type_id: data?.job_type_id?.value ?? data?.job_type_id ?? "",
      });

      if (res) {
        $message.success('Thành công');
        setForceUpdate && setForceUpdate(!forceUpdate);
        onClose && onClose();
        setLoading(false);
      }
    } else if (data && idKpi == -1) {
      // const company_id = parseInt(localStorage.getItem('company_id') || '')
      // const form_data = new FormData();
      // form_data.append("name", data?.name);
      // form_data.append("company_id", company_id.toString());
      // form_data.append("kpi_config", data?.kpi_config);
      // form_data.append("department_id", data?.department || '');
      // console.log(form_data)
      // const res = await createJob(form_data)
      // if (res) {
      //     $message.success('Thành công');
      //     setForceUpdate && setForceUpdate(!forceUpdate);
      //     onClose && onClose();
      //     setLoading(false);
      // }
      const res = await newJob({
        name: data?.name ? data?.name.trim() : '',
        department_id: data?.department_id?.value ?? data?.department_id ?? "",
        level: data?.level,
        company_id:
          data?.company_id.value ?? data?.company_id ?? Number(localStorage.getItem('company_id')),
        is_hazardous_environment: data?.is_hazardous_environment,
        job_type_id: data?.job_type_id?.value ?? data?.job_type_id ?? "",
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
      if (is_administrative !== "true" && sub_admin_role !== "administration" && sub_admin_role !== "recruitment") {

        const company_int = parseInt(localStorage.getItem('company_id') || '');
        setSelectCompanyId(company_int);
        form?.setFieldsValue({
          name: '',
          kpi_config: '',
          company_id: company_int,
          department_id: '',
          level: '',
          is_hazardous_environment: false,
          job_type_id: '',
        });
        return;
      }
      else {
        form?.setFieldsValue({
          name: '',
          kpi_config: '',
          company_id: '',
          department_id: '',
          level: '',
          is_hazardous_environment: false,
          job_type_id: '',
        });
      }
    }
    try {
      setLoading(true);
      setSelectCompanyId(null);
      const res = await getJobById(idKpi.id);
      if (res) {
        console.log(res)
        form?.setFieldsValue({
          name: res.name ?? '',
          company_id: {
            value: res.company_id?.id ?? '',
            label: res.company_id?.name ?? '',
          },
          department_id: {
            value: res.department_id?.id ?? '',
            label: res.department_id?.name ?? '',
          },
          // kpi_config: res.kpi_config ?? '',
          level: res.level ?? '',
          is_hazardous_environment: res.is_hazardous_environment,
          job_type_id: {
            value: res.job_type_id?.id ?? '',
            label: res.job_type_id?.name ?? '',
          },
        });
        setSelectCompanyId(res.company_id?.id ?? '');

      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    form?.resetFields();
    fetchKpi(idKpi);
  }, [idKpi, open]);
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const disabled = (is_administrative === "true" || sub_admin_role !== "none") ? false : true;
  return (
    <>
      <Drawer
        key={idKpi}
        title={
          idKpi == -1
            ? 'Thêm mới chức vụ'
            : isView
              ? 'Xem chức vụ'
              : 'Cập nhật chức vụ'
        }
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
              <Col span={12}>
                <MyForm.Item
                  label="Tên chức vụ"
                  type="input"
                  name="name"
                  required
                />
              </Col>

              <Col span={12}>
                <SelectCompanyAll
                  disabled={disabled}
                  onChange={handleCompanyChange}
                />
              </Col>

              {selectCompanyId && (
                <Col span={12}>
                  <SelectSearchAllocationDepartment
                    required={true}
                    selectedCompanyId={selectCompanyId}
                  />
                </Col>
              )}
              <Col span={12}>
                <MyForm.Item
                  label="Cấp bậc"
                  type="input-number"
                  name="level"
                  required
                />
                {/* <MyForm.Item
                                    label="Cấu hình KPI"
                                    type="select"
                                    name="level"
                                    options={
                                        kpiConfigOption
                                        
                                    }
                                    
                                /> */}
              </Col>
              {/* <Col span={12}>
                <MyForm.Item
                  label="Môi trường độc hại"
                  type="select"
                  name="is_hazardous_environment"
                  innerprops={{
                    options: [
                      { value: true, label: 'Có' },
                      { value: false, label: 'Không' }
                    ]
                  }}
                />
              </Col> */}
              <Col span={12}>
                <SelectJobType />
              </Col>
            </Row>
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default JobidForm;
