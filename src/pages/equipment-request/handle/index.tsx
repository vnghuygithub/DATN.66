import { Button, Drawer, FormInstance, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import Detail from '../components/detail';

import moment from 'moment';

import { createEquipmentrequest, getEquipmentRequestById, updateEquipmentRequest } from '@/api/equipment_request/equipment_request.api';

interface Props {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idEquipmentRequest?: number;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  isViewMode?: boolean;
  isCreating?: boolean;
}

const FormEquipmentRequest: FC<Props> = ({
  onClose,
  open,
  idEquipmentRequest,
  setForceUpdate,
  forceUpdate,
  form,
  isViewMode,
  isCreating,
}) => {
  const [isCreatingForm, setIsCreatingForm] = useState(false);
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
  function set_data_type_date_time(property: string, res: any) {
    if (res && res[property] != null && res[property] !== undefined) {
      const formattedDate = moment(res[property], 'YYYY-MM-DD-HH-mm');
      form &&
        form.setFieldsValue({
          [property]: formattedDate.isValid() ? formattedDate : null,
        });
    } else {
      form &&
        form.setFieldsValue({
          [property]: undefined,
        });
    }
  }

  const [loading, setLoading] = useState(false);
  const onFinish = async () => {
    if (isCreating) {
      console.log("create",isCreating);

      await form?.validateFields();
      const data = await form?.getFieldsValue();

      if (data.employee == false) {
        $message.error('Vui lòng chọn nhân viên!');
        return;
      }
      if (data) {
        console.log(data);
      
        setLoading(true);
        const res = await createEquipmentrequest({
          room: data.room,
          employee: data.employee,
          req_date: data.req_date,         
          purpose: data.purpose,
        }); console.log(res)
        if (res) {
          console.log(res);
          $message.success('Tạo mới thành công!');
          form?.resetFields();
          setForceUpdate && setForceUpdate(!forceUpdate);
          setLoading(false);
          onClose && onClose();
        } else {
          setLoading(false);
        }
      }
    } else {
      await form?.validateFields();
      const data = await form?.getFieldsValue();
      // if (data.employee.value == false && data.employee.label == false) {
      //   $message.error('Vui lòng chọn nhân viên!');
      //   return;
      // }
      console.log("data" ,data);

      if (data) {
        try {
          let employee_name_id = data.employee;
          let department_name_id = data.department;
          let create_date = data.create_date;
          let purpose = data?.purpose;
          let employee = data?.employee;
          if (typeof employee_name_id !== 'number') {
            employee_name_id = data.employee.value;
          }
          if (typeof department_name_id !== 'number') {
            department_name_id = data.department.value;
          }
          setLoading(true);
          if (idEquipmentRequest) {

            const res = await updateEquipmentRequest({
              id: idEquipmentRequest,
              employee_name_id: employee_name_id,
              department_name_id: department_name_id,
              create_date: data.create_date,
              purpose: data.purpose,
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
  const fetchEquipmentRequestById = async (id?: number) => {
    if (!id) {
      return;
    }
    try {
      setLoading(true);
      const res = await getEquipmentRequestById(id);
      console.log("res",res);
      if (res) {

     

        form &&
          form.setFieldsValue({
            key: res.id,
            employee: {
              value: res.employee_name_id?.id ?? '',
              label: res.employee_name_id?.name ?? '',
            },
            department: {
              value: res.department_name_id?.id ?? '',
              label: res.department_name_id?.name ?? '',  
            },
            req_date:res.create_date,
            purpose: res.purpose,
            state: res.state,
          });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (idEquipmentRequest !== undefined) {
      console.log('idEquipmentRequest', idEquipmentRequest);
      fetchEquipmentRequestById(idEquipmentRequest);
    }
    form?.resetFields();
  }, [idEquipmentRequest]);
  return (
    <Drawer
      key={idEquipmentRequest}
      title={idEquipmentRequest && 'Thông tin chi tiết'}
      width={650}
      onClose={onClose}
      open={open}
      destroyOnClose
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        !isViewMode && (
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
        <MyForm<any> onFinish={onFinish} form={form} layout="vertical" disabled={isViewMode}>
          <Detail isCreatingForm={isCreatingForm} />
        </MyForm>
      </Spin>
    </Drawer>
  );
};

export default FormEquipmentRequest;
