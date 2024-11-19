import { Button, Col, Drawer, FormInstance, Row, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import moment, { Moment } from 'moment';
import DepartmentForm from './departmentForm';
import {
  createDepartment,
  getDepartmentById,
  updateDepartment,
} from '@/api/department/department.api';
import { mobileResponsive } from '@/utils/mobileResponsive';

interface Props {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  isView?: boolean;
  idDepartment?: string;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  isCreating: boolean;
}
const FormDepartment: FC<Props> = ({
  onClose,
  showDrawer,
  open,
  idDepartment,
  setForceUpdate,
  forceUpdate,
  form,
  isCreating,
  isView,
}) => {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const { isMobile } = mobileResponsive();
  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    let employee_ho = localStorage.getItem('employee_ho');
    let is_administrative = localStorage.getItem('is_administrative');
    let sub_admin_role = localStorage.getItem('sub_admin_role');
    let is_general_manager = localStorage.getItem('is_general_manager');
    let value_company = Number(localStorage.company_id);
    setLoading(true);
    if (isCreating) {
      if (data) {
        if (is_administrative === 'true' || sub_admin_role !== "none") {
          value_company = data.company_id;
        }
        try {
          const res = await createDepartment({
            company_id: value_company,
            parent_id: data.parent_id,
            manager_id: data.manager_id,
            secretary_id: data.secretary_id,
            ...data,
          });
          if (res) {
            $message.success('Tạo phòng ban thành công');
            setForceUpdate && setForceUpdate(!forceUpdate);
            isCreating = false;
            onClose && onClose();
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    } else {
      if (data) {
        let value_company = Number(localStorage.company_id);
        if (employee_ho === 'true') {
          value_company = data.company_id;
        }
        try {
          const res = await updateDepartment(Number(idDepartment), {
            company_id: value_company,
            parent_id: data.parent_id ?? false,
            manager_id: data.manager_id ?? false,
            secretary_id: data.secretary_id ?? false,
            name: data.name ?? '',
            ...data,
          });
          if (res) {
            $message.success('Cập nhật phòng ban thành công');
            setForceUpdate && setForceUpdate(!forceUpdate);
            onClose && onClose();
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    }
  };
  const FetchDepartmentById = async (id: number) => {
    if (!id) {
      return;
    }
    setLoading(true);
    try {
      const res = await getDepartmentById(id);
      if (res) {
        console.log(res);
        form?.setFieldsValue({
          ...res,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    FetchDepartmentById(Number(idDepartment));
  }, [idDepartment]);
  return (
    <>
      <Drawer
        key={idDepartment}
        title={idDepartment ? 'Thông tin chi tiết' : t({ id: 'create' })}
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
              <Col span={24}>
                <DepartmentForm />
              </Col>
            </Row>
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};
export default FormDepartment;
