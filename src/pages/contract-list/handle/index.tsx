import { Button, Col, Drawer, FormInstance, Row, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import Detail from '../components/detail';
import { mobileResponsive } from '@/utils/mobileResponsive';
import {
  createContractByArgs,
  getContractById,
  updateContract,
} from '@/api/contract/contract.api';

import moment from 'moment';
import { getEmployeeById } from '@/api/employee/employee.api';

interface Props {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idContract?: number;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  isView?: boolean;
  isCreating?: boolean;
}

const FormContract: FC<Props> = ({
  onClose,
  showDrawer,
  open,
  idContract,
  setForceUpdate,
  forceUpdate,
  form,
  isView,
  isCreating,
}) => {
  const { isMobile } = mobileResponsive();
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [indefinite, setIndefinite] = useState(false);
  const [date_sign, setDateSign] = useState<any>(null);
  const [date_start, setDateStart] = useState<any>(null);
  const [date_end, setDateEnd] = useState<any>(null);
  useEffect(() => {
    if (isCreating) {
      setIsCreatingForm(true);
    } else {
      setIsCreatingForm(false);
    }
  }, [isCreating]);

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
  const [loading, setLoading] = useState(false);
  const onFinish = async () => {
    if (isCreating) {
      await form?.validateFields();
      const data = await form?.getFieldsValue();
      if (data.employee_id.value == false && data.employee_id.label == false) {
        $message.error('Vui lòng chọn nhân viên!');
        return;
      }
      if (
        data.resource_calendar_id.value == false &&
        data.resource_calendar_id.label == false
      ) {
        $message.error('Vui lòng chọn lịch làm việc!');
        return;
      }
      if (data.date_end < data.date_start) {
        $message.error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu!');
        return;
      }
      if (data.date_end < data.date_sign) {
        $message.error('Ngày ký không được lớn hơn ngày kết thúc!');
        return;
      }
      if (data) {
        setLoading(true);
        let date_sign = data.date_sign ? moment(data.date_sign).format('YYYY-MM-DD') : data.date_sign;
        let date_start = data.date_start ? moment(data.date_start).format('YYYY-MM-DD') : data.date_start;
        let date_end = data.date_end ? moment(data.date_end).format('YYYY-MM-DD') : data.date_end;

        // date_sign = moment(date_sign).add(1, 'days');
        // date_start = moment(date_start).add(1, 'days');
        // date_end = moment(date_end).add(1, 'days');
        const res = await createContractByArgs({
          name: data.name,
          employee_id: data.employee_id,
          salary_rate: data.salary_rate,
          date_sign: date_sign,
          date_start: date_start,
          date_end: data.indefinite_contract ? moment(date_end).add(60 * 365, 'days') : date_end,
          contract_type_id: data.contract_type_id,
          resource_calendar_id: data.resource_calendar_id,
          wage: data.wage,
          minutes_per_day: data.minutes_per_day,
          start_end_attendance: data.start_end_attendance,
          depend_on_shift_time:data.depend_on_shift_time,
          by_hue_shift:data.by_hue_shift,
        });
        if (res?.result?.error?.code && res?.result?.error?.code == 400) {
          $message.error(res.result.error.message);
          setLoading(false);
        } else {
          $message.success('Tạo mới thành công!');
          form?.resetFields();
          setForceUpdate && setForceUpdate(!forceUpdate);
          setLoading(false);
          onClose && onClose();
        }
      }
    } else {
      await form?.validateFields();
      const data = await form?.getFieldsValue();
      if (data.employee_id.value == false && data.employee_id.label == false) {
        $message.error('Vui lòng chọn nhân viên!');
        return;
      }
      if (
        data.resource_calendar_id.value == false &&
        data.resource_calendar_id.label == false
      ) {
        $message.error('Vui lòng chọn lịch làm việc!');
        return;
      }
      if (data.date_end < data.date_start) {
        $message.error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu!');
        return;
      }
      if (data.date_end < data.date_sign) {
        $message.error('Ngày ký không được lớn hơn ngày kết thúc!');
        return;
      }
      if (data) {
        try {
          let date_sign = data.date_sign;
          let date_start = data.date_start;
          let date_end = data.date_end;
          date_sign = moment(date_sign).add(7, 'hours');
          date_start = moment(date_start).add(7, 'hours');
          date_end = moment(date_end).add(7, 'hours');

          setLoading(true);
          if (idContract) {
            let resource_calendar_id =
              data?.resource_calendar_id?.value ?? data.resource_calendar_id;
            let contract_type_id =
              data?.contract_type_id?.value ?? data.contract_type_id;
            const res = await updateContract({
              id: idContract,
              name: data.name,
              salary_rate: data.salary_rate,
              date_sign: date_sign,
              date_start: date_start,
              date_end: date_end,
              contract_type_id: contract_type_id,
              resource_calendar_id: resource_calendar_id,
              wage: data.wage,
              indefinite_contract: data.indefinite_contract,
              minutes_per_day: data.minutes_per_day,
              start_end_attendance: data.start_end_attendance,
              depend_on_shift_time:data.depend_on_shift_time,
              by_hue_shift:data.by_hue_shift
            });
            if (res) {
              $message.success('Cập nhật thành công!');
              setForceUpdate && setForceUpdate(!forceUpdate);
              onClose && onClose();
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    }
  };
  const fetchContractById = async (id?: number) => {
    if (!id) {
      return;
    }
    try {
      setLoading(true);
      const res = await getContractById(id);
      if (res) {
        //set_data_type_date('date_start', res);
        form?.setFieldsValue({
          date_start:res.date_start
        })
        setDateStart(res.date_start);
        //set_data_type_date('date_end', res);
        form?.setFieldsValue({
          date_end:res.date_end
        })
        setDateEnd(res.date_end);
        //set_data_type_date('date_sign', res);
        form?.setFieldsValue({
          date_sign:res.date_sign
        })
        setDateSign(res.date_sign);
        form &&
          form.setFieldsValue({
            key: res.id,
            name: res.name,
            employee_id: {
              value: res.employee_id?.id ?? '',
              label: res.employee_id?.name ?? '',
            },
            employee_code: res.employee_code,
            department_id: {
              value: res.department_id?.id ?? '',
              label: res.department_id?.name ?? '',
            },
            resource_calendar_id: {
              value: res.resource_calendar_id?.id ?? '',
              label: res.resource_calendar_id?.name ?? '',
            },
            contract_type_id: {
              value: res.contract_type_id?.id ?? '',
              label: res.contract_type_id?.name ?? '',
            },
            job_title: res.job_title,
            salary_rate: res.salary_rate,
            wage: res.wage,
            indefinite_contract: res.indefinite_contract ?? false,
            minutes_per_day: res.minutes_per_day,
            start_end_attendance: res.start_end_attendance,
            depend_on_shift_time:res.depend_on_shift_time,
            by_hue_shift:res.by_hue_shift,
          });
        if (res?.indefinite_contract) {
          // setTest(!test)
          setIndefinite(true);
        } else {
          setIndefinite(false);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (idContract !== undefined) {
      fetchContractById(idContract);
    }
    form?.resetFields();
  }, [idContract]);
  return (
    <Drawer
      key={idContract}
      title={idContract && 'Thông tin chi tiết'}
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
            <Button key={2} onClick={onFinish} type="primary" loading={loading}>
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
          <Detail isCreatingForm={isCreatingForm} indefinite={indefinite} />
        </MyForm>
      </Spin>
    </Drawer>
  );
};

export default FormContract;
