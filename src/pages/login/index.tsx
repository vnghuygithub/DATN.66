import {useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  message as $message,
} from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ILoginForm } from '@/interface/user/login';
import { loginAsync } from '@/stores/user.store';

import useLocalStorage from '@/hooks/useLocalStorage';
import './index.less';
import { useLocale } from '@/locales';
import MyForm from '@/components/core/form';
import moment from 'moment';
import { request } from '@/api/request';
import RegisterForm from '@/pages/login/register';

const initialValues: ILoginForm = {
  login: '',
  password: '',
};

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const { t } = useLocale();
  const { storedValue: token } = useLocalStorage('token');
  const [form] = Form.useForm();

  const handleOpenFormResetPassword = () => {
    setOpen(true);
  };
  const handleOpenFormRegister = () => {
    setOpenRegister(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setOpenRegister(false);
  };
  useEffect(() => {
    form?.resetFields();
  }, [open]);
  const handleResetPassword = async () => {
    let url = '/reset_password';
    await form?.validateFields();
    const data = form?.getFieldsValue();
    if (data) {
      const formData = new FormData();
      formData.append('email', data?.email);
      formData.append('birthday', moment(data?.birthday).format('YYYY-MM-DD'));
      const res = await request('post', url, formData);
      if (res) {
        if (res?.error?.code && res?.error?.code == 400) {
          $message.error(res?.error?.message);
          return;
        } else {
          $message.success(res?.success);
          setOpen(false);
          return res;
        }
      } else {
        $message.error('Reset password failed !');
        return;
      }
    }
  };
  const onFinished = async (form: ILoginForm) => {
    setLoading(true);
    localStorage.clear();
    const res = (await dispatch(await loginAsync(form))) as any;
    console.log(res);
    console.log(form);
    
    
    if (!!res) {
      localStorage.setItem('username', res?.display_name);
      localStorage.setItem('company_id', res?.company_id);
      localStorage.setItem('user_id', res?.user_id);
      localStorage.setItem('department_id', res?.department_id);
      localStorage.setItem('is_general_manager', res?.is_general_manager);
      localStorage.setItem('is_head_of_department', res?.is_head_of_department);
      localStorage.setItem(
        'is_department_secretary',
        res?.is_department_secretary
      );
      localStorage.setItem('employee_ho', res?.employee_ho);
      localStorage.setItem('is_administrative', res?.is_administrative);
      localStorage.setItem('employee_id', res?.employee_id);
      localStorage.setItem('company_name', res?.company_name);
      localStorage.setItem('sub_admin_role', res?.sub_admin_role);
      localStorage.setItem('image_1920', res?.image_1920);
      localStorage.setItem('it_ho_check', res?.it_ho_check);
      localStorage.setItem('it_branch_check', res?.it_branch_check);
      // localStorage.setItem('employeeCode', res?.employee_code);
      setLoading(false);
      navigate('/');
      window.location.reload();
    }
  };
  const styleInput = { borderRadius: '10px', height: '45px' };

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token]);

  return (
    <div className="login-page">
      {/* <img
        src={Union}
        alt=""
        style={{ width: 300, marginBottom: 50, zIndex: 1 }}
      /> */}
      <Form<ILoginForm>
        onFinish={onFinished}
        className="login-page-form"
        initialValues={initialValues}
        style={{
          backgroundColor: 'rgba(192,192,192,0.3)',
          padding: '20px',
          boxShadow:
            'rgb(50 50 93 / 25%) 0px 13px 27px -5px, rgb(0 0 0 / 30%) 0px 8px 16px -8px',
        }}
        layout="vertical">
        <h2>{t({ id: 'login' })}</h2>
        <Row>
          <Col span={24}>
            <Form.Item
              name="login"
              label={t({ id: 'login_name' })}
              rules={[
                {
                  required: true,
                  message: t(
                    { id: 'placeholder_input' },
                    { msg: t({ id: 'login_name' }) }
                  ),
                  validator: (_, login) => {
                    if (login?.trim() === '') {
                      return Promise.reject(new Error('missing_login_name'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}>
              <Input
                placeholder={t(
                  { id: 'placeholder_input' },
                  { msg: t({ id: 'login_name' }) }
                )}
                style={styleInput}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="password"
              label={t({ id: 'login_password' })}
              rules={[
                {
                  required: true,
                  message: t(
                    { id: 'placeholder_input' },
                    { msg: t({ id: 'login_password' }) }
                  ),
                },
              ]}>
              <Input.Password
                placeholder={t(
                  { id: 'placeholder_input' },
                  { msg: t({ id: 'login_password' }) }
                )}
                type="password"
                style={styleInput}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            className="login-page-form_button"
            style={styleInput}
            // loading={loading}
          >
            Đăng nhập
          </Button>
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <a
            type="primary"
            style={{ textDecoration: 'underline' }}
            onClick={handleOpenFormResetPassword}>
            Quên mật khẩu ?
          </a>

          <a
            type="primary"
            style={{ textDecoration: 'underline' }}
            onClick={handleOpenFormRegister}>
            Tài khoản mới
          </a>
        </div>
      </Form>
      {/* <div className="img-bg">
        <img src={AvatarAccount} alt="" className="box bounce" />
      </div> */}
      <Modal
        open={open}
        title="Reset Password"
        destroyOnClose
        onCancel={handleCancel}
        footer={
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Button key={1} onClick={handleCancel} type="primary">
              Cancel
            </Button>
            <Button
              key={2}
              onClick={handleResetPassword}
              type="primary"
              htmlType="submit">
              Reset
            </Button>
          </div>
        }>
        <MyForm form={form} onFinish={handleResetPassword}>
          <Row gutter={24}>
            <Col span={12}>
              <MyForm.Item
                name="email"
                label="Email"
                type="input"
                required
                innerprops={{
                  placeholder: 'Nhập email',
                  allowClear: true,
                }}></MyForm.Item>
            </Col>
            <Col span={12}>
              <MyForm.Item
                name="birthday"
                label="Ngày sinh"
                type="date-picker"
                required
                innerprops={{
                  placeholder: 'Nhập ngày sinh',
                  allowClear: true,
                  format: 'DD/MM/YYYY',
                }}></MyForm.Item>
            </Col>
          </Row>
        </MyForm>
      </Modal>
      <RegisterForm
        open={openRegister}
        handleCancel={handleCancel}
        form={form}
      />
    </div>
  );
};

export default LoginForm;
