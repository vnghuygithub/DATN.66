import {
  createEmployeeRelative,
  createEmployeeRelativeParent,
  updateEmployeeRelative,
  updateEmployeeRelativeParent,
} from '@/api/employee/relative.api';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import {
  Button,
  Col,
  Drawer,
  FormInstance,
  Modal,
  Row,
  Spin,
  message as $message,
} from 'antd';
import moment from 'moment';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { mobileResponsive } from '@/utils/mobileResponsive';

interface Props {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idRelative?: number;
  form?: FormInstance<any>;
  forceUpdate?: boolean;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  isCreating?: boolean;
  isViewMode?: boolean;
  idRegisterNewEmployee: number;
  familyInfo: any;
  _getEmployeeRelativeByEmployeeId?: any;
}
const RelativeForm = ({
  onClose,
  showDrawer,
  open,
  idRelative,
  form,
  isViewMode,
  isCreating,
  idRegisterNewEmployee,
  forceUpdate,
  setForceUpdate,
  familyInfo,
  _getEmployeeRelativeByEmployeeId
}: Props) => {
  const { isMobile } = mobileResponsive();
  const [loading, setLoading] = useState(false);
  const { t } = useLocale();
  const setFamilyInfoById = (id: number) => {
    const data = familyInfo.find((item: any) => item.id === id);
    if (data) {
      form?.setFieldsValue({
        name: data?.name?.trim(),
        relationship: data.relationship,
        birthday: data.birthday ? moment(data.birthday) : null,
        job: data.job !== false ? data.job.trim() : null,
        phone: data.phone !== false ? data.phone.trim() : null,
        family_allowances: data.family_allowances,
        note: data.note !== false ? data.note : null,
      });
    }
  };
  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
    var numberRegex = /\d/;
    for (var i = 0; i < specialChars.length; i++) {
      if (data?.name?.indexOf(specialChars[i]) > -1 || numberRegex.test(data?.name?.trim())) {
        $message.error('Tên không được chứa ký tự đặc biệt hoặc số!');
        return;
      }
    }
    if (data?.name?.trim() === '') {
      $message.error('Tên không được để trống!');
      return;
    }
    if (data?.phone && data?.phone?.trim() !== "" && !/^\d+$/.test(data?.phone?.trim())) {
      $message.error('Số điện thoại chỉ được chứa số!');
      return;
    }
    if (isCreating) {
      if (data) {
        try {
          setLoading(true);
          const res = await createEmployeeRelativeParent({
            apec_register_employee_id: idRegisterNewEmployee,
            name: data?.name?.trim(),
            job: data?.job?.trim(),
            note: data?.note?.trim(),
            phone: data?.phone?.trim(),
            ...data,
          });
          if (res) {
            form?.resetFields();
            setLoading(false);
            $message.success('Thêm mới thành công');
            onClose && onClose();
            setForceUpdate && setForceUpdate(!forceUpdate);
            _getEmployeeRelativeByEmployeeId && _getEmployeeRelativeByEmployeeId(idRegisterNewEmployee);
            return res;
          }
        } catch (error) {
          setLoading(false);
          $message.error('Thêm mới thất bại');
        } finally {
          setLoading(false);
        }
      }
    } else {
      try {
        setLoading(true);
        if (idRelative) {
          const res = await updateEmployeeRelativeParent(idRelative, {
            ...data,
          });
          if (res) {
            setLoading(false);
            form?.resetFields();
            $message.success('Cập nhật thành công');
            onClose && onClose();
            setForceUpdate && setForceUpdate(!forceUpdate);
            _getEmployeeRelativeByEmployeeId && _getEmployeeRelativeByEmployeeId(idRegisterNewEmployee);
            return res;
          }
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    form?.resetFields();
    if (idRelative) {
      setFamilyInfoById(idRelative);
    }
  }, [open, idRelative]);

  return (
    <>
      <Modal
        key={idRelative}
        title={isCreating ? 'Thêm mới' : 'Chỉnh sửa'}
        width={isMobile ? '100%' : '80'}
        onCancel={onClose}
        confirmLoading={loading}
        // afterClose={onClose}
        open={open}
        destroyOnClose
        bodyStyle={
          {
            //   paddingBottom: 80
          }
        }
        footer={
          !isViewMode && (
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
            disabled={isViewMode}
            onFinish={onFinish}
            form={form}
            layout="vertical">
            <Row gutter={24}>
              <Col span={12}>
                <MyForm.Item
                  label="Họ và tên"
                  name="name"
                  type="input"
                  required
                  innerprops={{
                    allowClear: true,
                    placeholder: 'Nhập họ và tên',
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Quan hệ"
                  name="relationship"
                  type="select"
                  required
                  innerprops={{
                    allowClear: true,
                    placeholder: 'Chọn quan hệ',
                  }}
                  options={[
                    { label: 'Bố', value: 'dad' },
                    { label: 'Mẹ', value: 'mother' },
                    { label: 'Con', value: 'child' },
                    { label: 'Anh trai', value: "older brother" },
                    { label: 'Em trai', value: "younger brother" },
                    { label: 'Chị gái', value: "older sister" },
                    { label: 'Em gái', value: "younger sister" },
                    { label: 'Khác', value: 'other' },
                  ]}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Ngày sinh"
                  name="birthday"
                  type="date-picker"
                  required
                  innerprops={{
                    allowClear: true,
                    placeholder: 'Nhập ngày sinh',
                    format: 'DD/MM/YYYY',
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Nghề nghiệp"
                  name="job"
                  type="input"
                  innerprops={{
                    allowClear: true,
                    placeholder: 'Nhập nghề nghiệp',
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Điện thoại"
                  name="phone"
                  type="input"
                  innerprops={{
                    allowClear: true,
                    placeholder: 'Nhập điện thoại',
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Giảm trừ gia cảnh"
                  name="family_allowances"
                  type="select"
                  options={[
                    { label: 'Có', value: 'yes' },
                    { label: 'Không', value: 'no' },
                  ]}
                />
              </Col>
              <Col span={24}>
                <MyForm.Item
                  label="Ghi chú"
                  name="note"
                  type="input-textarea"
                  innerprops={{
                    allowClear: true,
                    placeholder: 'Nhập ghi chú',
                  }}
                />
              </Col>
            </Row>
          </MyForm>
        </Spin>
      </Modal>
    </>
  );
};

export default RelativeForm;
