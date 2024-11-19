import {
  Button,
  Col,
  Divider,
  Form,
  message,
  Modal,
  Row,
  Spin,
  Typography,
} from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { FormInstance } from 'antd/lib/form/Form';
import './style.css';
import moment from 'moment';
import { message as $message } from 'antd';
import { useSelector } from 'react-redux';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
interface IBaseFormProps {
  showAddUpdate: boolean;
  title: string;
  setShowAddUpdate: (value: boolean) => void;
  children: ReactNode;
  showExplainForm: boolean;
  setShowExplainForm: (value: boolean) => void;
  form: FormInstance;
  isHideFooter?: boolean;
  onFinish: (formData: any) => void;
  isView?: boolean;
  detailAttendanceSelected?: any;
  compensatoryFund?: any;
  loading: boolean;
  clickable?: boolean;
}

const index = (props: IBaseFormProps) => {
  const {
    showAddUpdate,
    setShowAddUpdate,
    title,
    onFinish,
    children,
    isHideFooter,
    form,
    isView,
    detailAttendanceSelected,
    compensatoryFund,
    loading,
    clickable,
  } = props;
  const { Text } = Typography;
  const {
    employee_code,
    employee_name,
    company,
    department,
    job_title,
    date,
    mis_id,
  } = useSelector(state => state.weekly);
  //===============================
  // State
  // ==============================
  // const [formError, setFormError] = useState(false);
  // ===============================
  // Handler
  // ===============================
  // const onFinish = async () => {
  //   console.log("onFinish");
  //   try {
  //     await form?.validateFields();
  //     onSubmit(await form?.getFieldsValue());
  //   } catch (error) {
  //     console.log("Lỗi xảy ra trong quá trình xử lý:", error);
  //     // Xử lý lỗi tại đây (ví dụ: hiển thị thông báo lỗi cho người dùng)
  //   }
  // };

  const currentDate = moment().format('DD/MM/YYYY');
  const invalidDate = moment(detailAttendanceSelected?.invalid_date).format(
    'DD/MM/YYYY'
  );
  const create_date = moment(detailAttendanceSelected?.created_date).format(
    'DD/MM/YYYY'
  );

  const is_administrative = localStorage.getItem('is_administrative');
  const is_general_manager = localStorage.getItem('is_general_manager');
  const is_head_of_department = localStorage.getItem('is_head_of_department');

  //  dateText = moment(detailAttendanceSelected?.created_date).format('DD/MM/YYYY');

  const handleCancel = () => {
    if (!clickable) {
      message.error('Vui lòng chờ hành động tạo đơn được hoàn thành!');
      return;
    }
    store.dispatch(
      setGlobalState({
        loading: false,
      })
    );
    setShowAddUpdate(false);
  };

  // console.log("detailAttendanceSelected", detailAttendanceSelected);

  // if (detailAttendanceSelected === null) {

  //   }
  // else {
  //  const dateText = moment(detailAttendanceSelected?.created_date).format('DD/MM/YYYY');
  // }  // const handleFormChange = () => {
  //   const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
  //   setFormError(hasErrors);
  // };
  //   =============================
  // Hooks
  // ===============================

  return (
    <Modal
      confirmLoading={loading}
      open={showAddUpdate}
      onCancel={handleCancel}
      maskClosable={false}
      title={title}
      footer={null} //} Ẩn nút "Cancel" và "OK"
      className="base-form">
      <Form
        layout="vertical"
        form={form}
        disabled={isHideFooter}
        onFinish={onFinish}>
        {/* Thông tin nhân viên */}
        <Row gutter={24}>
          <Col
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text className="date-moment"> {create_date}</Text>
            <Text style={{textAlign:"left"}}>{mis_id}</Text>
            <Text style={{textAlign:"left"}}>{department}</Text>
          </Col>
          <Col
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text className="text-label text-value">{employee_name}</Text>
            <Text style={{textAlign:"left"}}>{employee_code}</Text>
            <Text style={{textAlign:"left"}}>
              {job_title ?? job_title?.en_US}
            </Text>
          </Col>

          {/* <Text className="date-moment">
              Ngày làm việc: {moment(date)?.format('DD/MM/YYYY')}
            </Text> */}
        </Row>
        {children}
        {/* <Divider /> */}
        {
          <Form.Item className="form-footer" style={{position:"fixed" ,right:"20px" , bottom:"30px"}}>
            <Button key={1} onClick={handleCancel} disabled={!clickable}>
              Hủy bỏ
            </Button>
            <Button key={2} type="primary" htmlType="submit" disabled={!clickable}>
              Cập nhật
            </Button>
          </Form.Item>
        }
      </Form>
    </Modal>
  );
};

export default index;
