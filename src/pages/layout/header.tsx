import { createElement, FC, useEffect, useState } from 'react';
import {
  LogoutOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Layout,
  Dropdown,
  Menu,
  Tooltip,
  Typography,
  Avatar,
  Select,
  Space,
  Form,
  Button,
  message,
  Spin,
  Checkbox,
  Upload,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import AvatarAccount from '@/assets/header/higod.png';
import { LocaleFormatter, useLocale } from '@/locales';
import Union from '@/assets/logo/Union.svg';
import DropdownIcon from '@/assets/common/dropdown.svg';
import { logoutAsync, setUserItem } from '@/stores/user.store';
import { useDispatch, useSelector } from 'react-redux';
import { setGlobalState } from '@/stores/global.store';
import useLocalStorage from '@/hooks/useLocalStorage';
import { message as $message } from 'antd';
import SelectCompanyAll from '../components/selects/SelectCompanyAll';
import { companyOptionsAll } from '@/const/options';
import { Label } from 'recharts';
import {
  getAllowedCompany,
  updateAllowedCompany,
} from '@/api/allowedCompany/allowedCompany.api';
import store from '@/stores';
import MyForm from '@/components/core/form';
import { Col, Modal, Row } from 'antd';
import { getUserById, updateUser } from '@/api/user/user.api';
import { FormInstance } from 'antd/es/form/Form';
import { Input } from 'antd';
import { mobileResponsive } from '@/utils/mobileResponsive';

const { TextArea } = Input;

const { Header } = Layout;
const { Title } = Typography;

interface HeaderProps {
  collapsed: boolean;
  toggle: () => void;
}

interface ResetInfo {
  password?: string;
  name: string;
  login: string;
  image_1920: string;
}
type Action = 'userInfo' | 'userSetting' | 'logout';

const HeaderComponent: FC<HeaderProps> = ({ collapsed, toggle }) => {
  const { isMobile } = mobileResponsive();
  const { device } = useSelector(state => state.user);
  const { storedValue: token } = useLocalStorage('token');
  const { theme } = useSelector(state => state.global);
  const { name } = useSelector(state => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useLocale();
  const [company, setCompany] = useState<any[]>([]);
  // const [resultCompany, setResultCompany] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(true);
  const [selectedCompanies, setSelectedCompanies] = useState<any[]>([]);
  const is_general_manager = localStorage.getItem('is_general_manager');
  const employee_ho = localStorage.getItem('employee_ho');
  const is_administrative = localStorage.getItem('is_administrative');
  const [loading, setLoading] = useState(false);
  const [form] = MyForm.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [allowedCompanies, setAllowedCompanies] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    companyOptionsAll().then(res => {
      if (isMounted) setCompany(res);
    });
    return () => {
      setIsMounted(false);
    };
  }, []);

  const handleChange = (value: any[]) => {
    setSelectedCompanies(value);
  };
  const _getAllowedCompany = async () => {
    const res = await getAllowedCompany();
    if (res && res.result[0] && res.result[0].company_ids) {
      setAllowedCompanies(
        res.result[0].company_ids.map((item: any) => item?.name)
      );
    }
    return res;
  };
  useEffect(() => {
    _getAllowedCompany();
  }, [selectedCompanies]);
  const handleClick = async () => {
    let comp_string_list = selectedCompanies?.join(',');
    localStorage.setItem('ho_selected', comp_string_list);
    try {
      store.dispatch(setGlobalState({ loading: true }));
      const res = await updateAllowedCompany(selectedCompanies);

      if (res) {
       
        return res;
      }
    } catch (error) {
      console.log(error);
    } finally {
      store.dispatch(setGlobalState({ loading: false }));
      window.location.reload();
    }
  };
  const onActionClick = async (action: Action) => {
    switch (action) {
      case 'logout':
        await logoutAsync();
        navigate('/login');
      case 'userInfo':
        setModalVisible(true);
        break;
    }
  };

  const toLogin = () => {
    navigate('/login');
  };

  const onChangeTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('theme', newTheme);
    dispatch(
      setGlobalState({
        theme: newTheme,
      })
    );
  };
  const handleCancel = () => {
    setModalVisible(false);
    setVisible(false);
  };
  let userId = Number(localStorage.getItem('user_id'));
  const fetchUserById = async (id: number) => {
    const res = await getUserById(id);
    if (res) {
      form.setFieldsValue({
        name: res?.name,
        login: res?.login,
      });
      return res;
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
    form?.resetFields();
  }, [userId, modalVisible]);
  const [fileAvatar, setFileAvatar] = useState<any>(null);
  const customRequestAvatar = async ({ file, onSuccess, onError }: any) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileAvatar({
          data: reader.result,
          name: file.name,
          type: file.type,
        });
        onSuccess(reader.result);
      };
      reader.onerror = onError;
      reader.readAsDataURL(file);
    } else {
      onError('No file selected');
    }
  };
  const handleOk = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();

    if (data) {
      setLoading(true);

      // Kiểm tra và loại bỏ phần 'data:image/jpeg;base64,' nếu tồn tại
      let base64Image = fileAvatar?.data;
      if (base64Image?.startsWith('data:image/jpeg;base64,') || base64Image?.startsWith('data:image/png;base64,') || base64Image?.startsWith('data:image/jpg;base64,') ) {
        base64Image = base64Image?.replace(
          'data:image/jpeg;base64,',
          ''
        );
        base64Image = base64Image?.replace(
          'data:image/png;base64,',
          ''
        );
        base64Image = base64Image?.replace(
          'data:image/jpg;base64,',
          ''
        );
      }
      else {
        message.error('Vui lòng chọn ảnh đúng định dạng (jpg, jpeg, png)');
      }
      const updateData: ResetInfo = {
        name: data.name,
        login: data.login,
        image_1920: base64Image,
      };

      if (data.password) {
        updateData.password = data.password;
      }
      const res = await updateUser(updateData, userId);

      if (res) {
        setForceUpdate(!forceUpdate);
        setLoading(false);
        setModalVisible(false);
        message.success('Cập nhật thành công');
        return res;
      } else {
        setLoading(false);
      }
    }
  };

  const menu = (
    <>
      <Modal
        title="Thông tin cá nhân"
        open={modalVisible}
        onCancel={handleCancel}
        forceRender={forceUpdate}
        key={userId}
        onOk={handleOk}
        bodyStyle={{
          padding: '20px',
        }}
        width={isMobile ? '100%' : '80%'}
        confirmLoading={loading}
        destroyOnClose
        footer={
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Button key={1} onClick={handleCancel}>
              Hủy
            </Button>
            <Button key={2} onClick={handleOk} type="primary" loading={loading}>
              Lưu
            </Button>
          </div>
        }>
        <Spin spinning={loading}>
          <MyForm<any> form={form} layout="vertical">
            <Row gutter={24}>
              <Col span={12}>
                <MyForm.Item
                  label="Tên"
                  type="input"
                  name="name"
                  innerprops={{
                    placeholder: 'Nhập họ và tên',
                    allowClear: true,
                    disabled: true,
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Tên đăng nhập"
                  type="input"
                  name="login"
                  required
                  innerprops={{
                    placeholder: 'Nhập tên đăng nhập',
                    allowClear: true,
                  }}
                />
              </Col>
              <Col span={24}>
                <MyForm.Item
                  label="Mật khẩu mới"
                  type="input"
                  name="password"
                  innerprops={{
                    placeholder: 'Nhập mật khẩu',
                    allowClear: true,
                  }}
                />
              </Col>
              <Col span={24}>
                <MyForm.Item
                  name="file_avatar"
                  label="Ảnh chân dung&nbsp;&nbsp;&nbsp;&nbsp;">
                  <Upload
                    className="upload"
                    maxCount={1}
                    accept="image/*"
                    customRequest={customRequestAvatar}>
                    <Button style={{ width: '100%' }} icon={<UploadOutlined />}>
                      Upload
                    </Button>
                  </Upload>
                </MyForm.Item>
              </Col>
            </Row>
          </MyForm>
        </Spin>
      </Modal>
      <Menu>
        <Menu.Item key="0" onClick={() => onActionClick('userInfo')}>
          <span>
            <UserOutlined style={{ marginRight: 8 }} />
            <span>
              <LocaleFormatter id="header.avator.account" />
            </span>
          </span>
        </Menu.Item>
        <Menu.Item key="2" onClick={() => onActionClick('logout')}>
          <span>
            <LogoutOutlined style={{ marginRight: 8 }} />
            <span>
              <LocaleFormatter id="header.avator.logout" />
            </span>
          </span>
        </Menu.Item>
      </Menu>
    </>
  );
  const [visible, setVisible] = useState(false);
  const handleClickCompany = () => {
    setVisible(true);
  };
  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedCompanies(checked ? company.map(item => item.value) : []);
  };
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  return (
    <Header className="layout-page-header bg-2">
      {device !== 'MOBILE' && (
        <div
          className="logo"
          style={{ width: collapsed ? 80 : 200, gap: '10px' }}>
          {collapsed ? (
            <img
              src={Union}
              alt=""
              style={{ marginRight: collapsed ? '2px' : '20px' }}
            />
          ) : (
            // <h1>LOGO</h1>
            <>
              <Title level={4}>HAPPY HRM</Title>
            </>
          )}
        </div>
      )}
      <div className="layout-page-header-main" style={{ overflowX: 'scroll' }}>
        <div onClick={toggle}>
          <span id="sidebar-trigger">
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </div>
        <div className="actions">
          {token ? (
            <>
              {((is_general_manager === 'true' && employee_ho === 'true') ||
                is_administrative === 'true' ||
                (sub_admin_role !== 'none' && sub_admin_role !== "false")) && (
                <>
                  <Button
                    style={{ fontWeight: 'bold', fontSize: 20 }}
                    type="primary"
                    onClick={handleClickCompany}>
                    Công ty cho phép
                  </Button>
                  <Modal
                    destroyOnClose
                    title="Công ty đã chọn"
                    open={visible}
                    onCancel={handleCancel}
                    footer={
                      <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button key={1} onClick={handleCancel} type="primary">
                          Ok
                        </Button>
                      </div>
                    }>
                    <TextArea
                      style={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 16,
                        marginBottom: 10,
                      }}
                      size="large"
                      rows={20}
                      disabled
                      value={allowedCompanies.join('\n')}
                    />
                  </Modal>
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      marginRight: -15,
                    }}>
                    Công ty
                  </span>
                  <div style={{ width: 500 }}>
                    <Select
                      showSearch
                      loading={!company.length}
                      placeholder="Chọn công ty"
                      mode="multiple"
                      allowClear
                      options={company}
                      onChange={handleChange}
                      style={{ width: '100%' }}
                      value={
                        selectAll
                          ? company.map(item => item.value)
                          : selectedCompanies
                      }
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </div>
                  <div>
                    <Checkbox
                      onChange={e => handleSelectAllChange(e.target.checked)}
                      checked={selectAll}>
                      Chọn hết
                    </Checkbox>
                  </div>
                  <div>
                    <Button
                      type="primary"
                      onClick={handleClick}
                      style={{ marginLeft: -24 }}>
                      Xác nhận
                    </Button>
                  </div>
                </>
              )}

              <Dropdown overlay={menu}>
                <span className="user-action">
                

                  <Avatar
                    style={{
                      backgroundColor: '#B98868',
                      color: '#fff',
                      marginRight: 5,
                    }}
                    src={`${localStorage.getItem('image_1920')}`}
                  ></Avatar>
                  <h3 style={{ marginBottom: 0 }}>
                    {localStorage.getItem('username')}
                    <img
                      src={DropdownIcon}
                      alt=""
                      style={{ marginLeft: '17px' }}
                    />
                  </h3>
                </span>
              </Dropdown>
            </>
          ) : (
            <span style={{ cursor: 'pointer' }} onClick={toLogin}>
              {t({ id: 'gloabal.tips.login' })}
            </span>
          )}
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;
