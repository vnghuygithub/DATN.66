import {
  createConfigLock,
  getConfigLockById,
  updateConfigLock,
} from '@/api/configLockFeature/configLock.api';
import MyForm from '@/components/core/form';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import { mobileResponsive } from '@/utils/mobileResponsive';
import {
  Button,
  Checkbox,
  Col,
  Drawer,
  FormInstance,
  Row,
  Spin,
  message,
} from 'antd';
import moment from 'moment';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface IProps {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idConfigLock?: number;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  isView?: boolean;
  isCreating?: boolean;
}

export const ConfigLockForm = ({
  onClose,
  showDrawer,
  open,
  idConfigLock,
  setForceUpdate,
  forceUpdate,
  form,
  isView,
  isCreating,
}: IProps) => {
  const { isMobile } = mobileResponsive();
  const [loading, setLoading] = useState(false);
  const [scheduledRun, setScheduledRun] = useState<boolean>(false);
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const onFinish = async () => {
    if (isCreating) {
      await form?.validateFields();
      const data = await form?.getFieldsValue();
      const compare_date_start = moment(data.start_lock_date)
        .toDate()
        .setSeconds(0, 0);
      const compare_date_end = moment(data.end_lock_date)
        .toDate()
        .setSeconds(0, 0);
      if (compare_date_start >= compare_date_end) {
        message.error(
          'Ngày bắt đầu không được lớn hơn hoặc bằng ngày kết thúc'
        );
        return;
      }

      const res = await createConfigLock({
        name: data.name,
        model_lock: data.model_lock,
        start_lock_date: data.start_lock_date
          ? moment(data.start_lock_date).format('YYYY-MM-DD HH:mm:ss')
          : '',
        end_lock_date: data.end_lock_date
          ? moment(data.end_lock_date).format('YYYY-MM-DD HH:mm:ss')
          : '',
        scheduled_run: data.scheduled_run,
        scheduled_run_mode: data.scheduled_run_mode,
        active: data.active,
        company_id: data.company_id
          ? data.company_id
          : Number(localStorage.getItem('company_id')),
          lock_create: data.lock_create,
          lock_edit: data.lock_edit,
          lock_delete: data.lock_delete,
      });
      if (data.model_lock === 'hr.apec.attendance.report') {
        const resv2 = await createConfigLock({
          name: 'Khoá dữ liệu phép, bù ',
          model_lock: 'hr.al.cl.report',
          start_lock_date: data.start_lock_date
            ? moment(data.start_lock_date).format('YYYY-MM-DD HH:mm:ss')
            : '',
          end_lock_date: data.end_lock_date
            ? moment(data.end_lock_date).format('YYYY-MM-DD HH:mm:ss')
            : '',
          company_id: data.company_id
            ? data.company_id
            : Number(localStorage.getItem('company_id')),
          active: false,
          scheduled_run: false,
          scheduled_run_mode: data.scheduled_run_mode,
          lock_create: data.lock_create,
          lock_edit: data.lock_edit,
          lock_delete: data.lock_delete,
        });
        setLoading(true);
        if (res && resv2) {
          setLoading(false);
          setForceUpdate && setForceUpdate(!forceUpdate);
          onClose && onClose();
          message.success('Thêm mới thành công');
          form?.resetFields();
          return res;
        }
      } else {
        setLoading(true);
        if (res) {
          setLoading(false);
          setForceUpdate && setForceUpdate(!forceUpdate);
          onClose && onClose();
          message.success('Thêm mới thành công');
          form?.resetFields();
          return res;
        }
      }
      message.error('Thêm mới thất bại');
      setLoading(false);
      return;
    } else {
      await form?.validateFields();
      const data = await form?.getFieldsValue();
      const compare_date_start = moment(data.start_lock_date)
        .toDate()
        .setSeconds(0, 0);
      const compare_date_end = moment(data.end_lock_date)
        .toDate()
        .setSeconds(0, 0);
      if (compare_date_start >= compare_date_end) {
        message.error(
          'Ngày bắt đầu không được lớn hơn hoặc bằng ngày kết thúc'
        );
        setLoading(false);
        return;
      }

      const res = await updateConfigLock(
        {
          name: data.name,
          model_lock:
            data.model_lock === 'Khóa dữ liệu phép, bù'
              ? 'hr.al.cl.report'
              : data.model_lock,
          start_lock_date: data.start_lock_date
            ? moment(data.start_lock_date).format('YYYY-MM-DD HH:mm')
            : '',
          end_lock_date: data.end_lock_date
            ? moment(data.end_lock_date).format('YYYY-MM-DD HH:mm')
            : '',
          scheduled_run: data.scheduled_run,
          scheduled_run_mode: data.scheduled_run_mode,
          active: data.active,
          company_id: data.company_id
            ? data.company_id
            : Number(localStorage.getItem('company_id')),
            lock_create: data.lock_create,
          lock_edit: data.lock_edit,
          lock_delete: data.lock_delete,
        },
        idConfigLock
      );
      setLoading(true);
      if (res) {
        setLoading(false);
        setForceUpdate && setForceUpdate(!forceUpdate);
        onClose && onClose();
        message.success('Cập nhật thành công');
        form?.resetFields();
        return res;
      } else {
        message.error('Cập nhật thất bại');
        setLoading(false);
        return;
      }
    }
  };
  const fetchConfigLockById = async (id: number) => {
    const res = await getConfigLockById(id);
    console.log(res);
    if (res) {
      form?.resetFields();
      form?.setFieldsValue({
        name: res.name,
        model_lock:
          res.model_lock === 'hr.al.cl.report'
            ? 'Khóa dữ liệu phép, bù'
            : res.model_lock,
        start_lock_date: res.start_lock_date
          ? moment(res.start_lock_date, 'YYYY-MM-DD HH:mm')
          : '',
        end_lock_date: res.end_lock_date
          ? moment(res.end_lock_date, 'YYYY-MM-DD HH:mm')
          : '',
        scheduled_run: res.scheduled_run,
        scheduled_run_mode: res.scheduled_run_mode,
        active: res.active,
        company_id: res.company_id,
        lock_create: res.lock_create,
        lock_edit: res.lock_edit,
        lock_delete: res.lock_delete,
      });
      setScheduledRun(res.scheduled_run);
    }
  };
  useEffect(() => {
    form?.resetFields();
    if (idConfigLock) {
      fetchConfigLockById(idConfigLock);
    }
  }, [open, idConfigLock, forceUpdate]);

  const handleOnChangeSheduledRun = (value: boolean) => {
    setScheduledRun(value);
  };
  return (
    <>
      <Drawer
        key={idConfigLock}
        title={idConfigLock ? 'Thông tin chi tiết' : 'Thêm mới'}
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
              <Col span={12}>
                <MyForm.Item
                  label="Tên"
                  name="name"
                  type="input"
                  innerprops={{
                    allowClear: true,
                    placeholder: 'Tên',
                    disabled: !isCreating,
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Chức năng"
                  name="model_lock"
                  type="select"
                  options={[
                    {
                      value: 'hr.apec.attendance.report',
                      label: 'Báo cáo chấm công theo tuần, tháng',
                    },
                    { value: 'hr.leave', label: 'Quản lý đơn yêu cầu' },
                    {
                      value: 'hr.invalid.timesheet',
                      label: 'Quản lý giải trình',
                    },
                    {
                      value: 'hr.upload.attendance',
                      label: 'File báo cáo',
                    },
                    // { value: "hr.al.cl.report", label: "Khoá dữ liệu phép, bù"}
                  ]}
                  innerprops={{
                    allowClear: true,
                    placeholder: 'Chức năng',
                    showSearch: true,
                    disabled: !isCreating,
                  }}
                  required
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Ngày bắt đầu"
                  name="start_lock_date"
                  type="date-picker-time"
                  innerprops={{
                    allowClear: true,
                    placeholder: 'Ngày bắt đầu',
                    format: 'DD/MM/YYYY HH:mm',
                    disabled: !isCreating,
                  }}
                  required
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Ngày kết thúc"
                  name="end_lock_date"
                  type="date-picker-time"
                  innerprops={{
                    allowClear: true,
                    placeholder: 'Ngày kết thúc',
                    format: 'DD/MM/YYYY HH:mm',
                    disabled: !isCreating,
                  }}
                  required
                />
              </Col>
              {(is_administrative == 'true' || sub_admin_role !== 'none') && (
                <Col span={12}>
                  <SelectCompanyAll disabled={!isCreating} />
                </Col>
              )}
              <Col span={12}>
                <MyForm.Item
                  label="Trạng thái"
                  name="active"
                  type="switch"
                  valuePropName="checked"
                  initialValue={true}
                  innerprops={{
                    checkedChildren: 'Đang hoạt động',
                    unCheckedChildren: 'Không hoạt động',
                  }}
                />
              </Col>
              { idConfigLock && (
  <>
    <Col span={8}>
      <MyForm.Item
        label={"Khoá tạo"}
        name="lock_create"
        valuePropName="checked"
      >
        <Checkbox>Khoá tạo</Checkbox>
      </MyForm.Item>
    </Col>
    <Col span={8}>
      <MyForm.Item
        label={'Khóa sửa'}
        name="lock_edit"
        valuePropName="checked"
      >
        <Checkbox>Khóa sửa</Checkbox>
      </MyForm.Item>
    </Col>
    <Col span={8}>
      <MyForm.Item
        label={'Khóa xóa'}
        name="lock_delete"
        valuePropName="checked"
      >
        <Checkbox>Khóa xóa</Checkbox>
      </MyForm.Item>
    </Col>
  </>
)}

              
            </Row>
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};
