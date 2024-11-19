import { createUser, getUserById, updateUser } from '@/api/user/user.api';
import MyForm from '@/components/core/form';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import { mobileResponsive } from '@/utils/mobileResponsive';
import { Button, Col, Drawer, FormInstance, Row, Spin, message } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface Props {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idUser?: number;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  isView?: boolean;
  isCreating?: boolean;
}

export const UserForm = ({
  onClose,
  showDrawer,
  open,
  idUser,
  setForceUpdate,
  forceUpdate,
  form,
  isView,
  isCreating,
}: Props) => {
  const { isMobile } = mobileResponsive();
  const [loading, setLoading] = useState(false);
  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    if (isCreating) {
      if (data) {
        setLoading(true);
        const res = await createUser(data);
        if (res) {
          setLoading(false);
          message.success('Thêm thành công');
          onClose?.();
          setForceUpdate?.(!forceUpdate);
          return res;
        } else {
          setLoading(false);
        }
      }
    } else {
      if (data) {
        setLoading(true);
        console.log(data);
        const res = await updateUser(data, idUser);
        if (res) {
          setLoading(false);
          message.success('Cập nhật thành công');
          onClose?.();
          setForceUpdate?.(!forceUpdate);
          return res;
        } else {
          setLoading(false);
        }
      }
    }
  };
  const fetchUserById = async (id: number) => {
    setLoading(true);
    const res = await getUserById(id);
    if (res) {
      setLoading(false);
      form?.setFieldsValue({
        name: res?.name !== false ? res?.name : null,
        login: res?.login !== false ? res?.login : null,
        email: res?.email !== false ? res?.email : null,
        company_id: res?.company_id.name ?? '',
        is_administrative:
          res?.is_administrative !== false ? res?.is_administrative : false,
      });
    }
  };
  useEffect(() => {
    if (idUser) {
      fetchUserById(idUser);
    }
    form?.resetFields();
  }, [idUser, open]);
  return (
    <>
      <Drawer
        key={idUser}
        title={idUser ? 'Thông tin người dùng' : 'Thêm người dùng'}
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
              <Col span={8}>
                <MyForm.Item
                  name="is_administrative"
                  label="Admin HO"
                  type="select"
                  innerprops={{
                    placeholder: 'Chọn',
                    allowClear: true,
                  }}
                  options={[
                    { label: 'Có', value: true },
                    { label: 'Không', value: false },
                  ]}
                />
              </Col>
              <Col span={8}>
                <MyForm.Item
                  name="name"
                  label="Tên"
                  type="input"
                  innerprops={{
                    placeholder: 'Nhập tên',
                    allowClear: true,
                  }}
                  required
                />
              </Col>
              <Col span={8}>
                <MyForm.Item
                  name="login"
                  label="Đăng nhập"
                  type="input"
                  innerprops={{
                    placeholder: 'Nhập đăng nhập',
                    allowClear: true,
                  }}
                  required
                />
              </Col>
              {isCreating && (
                <Col span={8}>
                  <SelectCompanyAll />
                </Col>
              )}
              <Col span={8}>
                <MyForm.Item
                  name="email"
                  label="Email"
                  type="input"
                  innerprops={{
                    placeholder: 'Nhập email',
                    allowClear: true,
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

export default UserForm;
