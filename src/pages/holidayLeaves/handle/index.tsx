import {
  createHolidayLeaves,
  getHolidayLeavesById,
  updateHolidayLeaves,
} from '@/api/holidayLeaves/holiday.leave.api';
import MyForm from '@/components/core/form';
import SelectCompany from '@/pages/components/selects/SelectCompany';
import { mobileResponsive } from '@/utils/mobileResponsive';
import { Button, DatePicker, Drawer, FormInstance, Spin, message } from 'antd';
import moment from 'moment';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface Props {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idHolidayLeaves?: number;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  isView?: boolean;
  isCreating?: boolean;
}

const HolidayLeavesForm = ({
  onClose,
  showDrawer,
  open,
  idHolidayLeaves,
  setForceUpdate,
  forceUpdate,
  form,
  isView,
  isCreating,
}: Props) => {
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState(false);
  const { isMobile } = mobileResponsive();
  const is_administrative = localStorage.getItem('is_administrative');
  const [dateRange, setDateRange] = useState<string[]>([]);
  const onCalendarChange = (dates: any, dateStrings: string[]) => {
    setDateRange(dateStrings);
  };
  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    setLoading(true);
    if (isCreating) {
      const res = await createHolidayLeaves({
        name: data.name,
        date_from: dateRange[0]
          ? moment(dateRange[0], 'DD/MM/YYYY').format('YYYY-MM-DD')
          : undefined,
        date_to: dateRange[1]
          ? moment(dateRange[1], 'DD/MM/YYYY').format('YYYY-MM-DD')
          : undefined,
        company_id: data.company_id
          ? data.company_id
          : Number(localStorage.getItem('company_id')),
      });
      if (res) {
        setLoading(false);
        onClose && onClose();
        setForceUpdate && setForceUpdate(!forceUpdate);
        setDateRange([]);
        message.success('Thêm mới thành công');
        form?.resetFields();
        return res;
      }
    }
    if (idHolidayLeaves) {
      const res = await updateHolidayLeaves(
        {
          name: data.name,
          date_from: dateRange[0]
            ? moment(dateRange[0], 'DD/MM/YYYY').format('YYYY-DD-MM')
            : undefined,
          date_to: dateRange[1]
            ? moment(dateRange[1], 'DD/MM/YYYY').format('YYYY-DD-MM')
            : undefined,
          company_id: data.company_id
            ? data.company_id
            : Number(localStorage.getItem('company_id')),
        },
        idHolidayLeaves
      );
      if (res) {
        setLoading(false);
        onClose && onClose();
        setForceUpdate && setForceUpdate(!forceUpdate);
        setDateRange([]);
        message.success('Cập nhật thành công');
        form?.resetFields();
        return res;
      }
    }
  };
  const fetchHolidayLeavesById = async () => {
    if (idHolidayLeaves) {
      const res = await getHolidayLeavesById(idHolidayLeaves);
      if (res) {
        form?.setFieldsValue({
          name: res.name,
          company_id: res.company_id,
          holidayLeavesDay: [
            moment(res.date_from, 'YYYY/MM/DD'),
            moment(res.date_to, 'YYYY/MM/DD'),
          ],
        });
        return res;
      }
    }
  };
  useEffect(() => {
    form?.resetFields();
    if (idHolidayLeaves) {
      fetchHolidayLeavesById();
    }
  }, [idHolidayLeaves]);
  let sub_admin_role = localStorage.getItem('sub_admin_role');
  return (
    <>
      <Drawer
        key={idHolidayLeaves}
        title={
          isView
            ? 'Xem chi tiết ngày lễ'
            : isCreating
            ? 'Thêm mới ngày lễ'
            : 'Chỉnh sửa ngày lễ'
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
            disabled={isView}
            onFinish={onFinish}
            form={form}
            layout="vertical">
            <MyForm.Item
              label="Tên ngày lễ"
              name="name"
              type="input"
              required
              innerprops={{
                placeholder: 'Nhập tên ngày lễ',
                allowClear: true,
              }}
            />
            {(is_administrative === "true" || sub_admin_role !== "none") && <SelectCompany />}
            <MyForm.Item
              label="Thời gian nghỉ lễ"
              name="holidayLeavesDay"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn khoảng thời gian',
                },
              ]}>
              <RangePicker
                format={'DD/MM/YYYY'}
                style={{ width: '100%' }}
                onCalendarChange={onCalendarChange}
              />
            </MyForm.Item>
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default HolidayLeavesForm;
