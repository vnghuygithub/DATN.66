import { Button, Col, Drawer, Form, Row, Spin } from 'antd';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import store from '@/stores';
import { message as $message } from 'antd';
import { setGlobalState } from '@/stores/global.store';
import { FormInstance } from 'antd/es/form/Form';
import { useLocale } from '@/locales';
import MyForm from '@/components/core/form';
import SelectCurrentCompany from '@/pages/components/selects/SelectCurrentCompany';
import SelectNewCompanyForm from '@/pages/components/selects/SelectNewCompanyForm';
import SelectSearchAllocationDepartmentForm from '@/pages/components/selects/SelectDepartmentAllocationForm';
import SelectMultipleEmployee from '@/pages/components/selects/SelectMultipleEmployee';
import {
  createEmployeeAllocatioV2,
  createEmployeeAllocation,
  getEmployeeAllocationById,
  updateAllocation,
} from '@/api/employee-allocation/employeeAllocation.api';
import moment from 'moment';
import { set } from 'lodash';
import SelectAllocation from './SelectAllocationtype';
import SelectCurrentDepartmentEmployee from '@/pages/components/selects/SelectCurrentDepartment';
import SelectDepartmentEmployeeNew from '@/pages/components/selects/SelectDepartmentEmployeeNew';
import SelectContractType from '@/pages/components/selects/SelectContractType';
import SelectMultipleEmployeeCurrent from '@/pages/components/selects/SelectMultipleEmployeeCurrent';
import SelectDepartmentEmployee from '@/pages/components/selects/SelectDepartmentEmployee';
import SelectCurrentDepartmentAllocation from '@/pages/components/selects/SelectCurrentDepartmentAllocation';
import SelectDepartmentAllocationNew from '@/pages/components/selects/SelectDepartmentAllocationNew';
import { getCompanyByDepartmentId, getListCompany } from '@/api/shift/company';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import SelectNewCompanyAllocation from '@/pages/components/selects/SelectNewCompanyAllocation';
import SelectMultipleEmployeeAllocation from '@/pages/components/selects/SelectMultiEmployeeAllocation';
import { getDepartmentById } from '@/api/department/department.api';
import SelectCompanyAllAllocation from '@/pages/components/selects/SelectCompanyAllAllocation';
import SelectJob from '@/pages/components/selects/SelectJob';
interface IProps {
  onClose?: () => void;
  isCreating?: boolean;
  form?: FormInstance<any>;
  open?: boolean;
  forceUpdate?: boolean;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  idAllocation?: number;
  showDrawer?: () => void;
  isView?: boolean;
}

const FormAllocation = ({
  isCreating,
  form,
  open,
  forceUpdate,
  setForceUpdate,
  idAllocation,
  onClose,
  showDrawer,
  isView,
}: IProps) => {
  const [new_department_working_date, setNew_department_working_date] =
    useState<any>(null);
    const [severance_day_old_department, setSeverance_day_old_department] =
    useState<any>(null);
    severance_day_old_department
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [selectedAllcationType, setSelectedAllcationType] = useState<
    string | null
  >(null);
  const [selectedCurrentDepartmentId, setSelectedCurrentDepartmentId] =
    useState<number | null>(null);
  const [selectedCurrentCompanyId, setSelectedCurrentCompanyId] = useState<
    number | null
  >(null);
  const [currentCompanyId, setCurrentCompanyId] = useState<number | null>(null);
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const handleCurrentDepartmentChange = (value: number) => {
    setSelectedCurrentDepartmentId(value);
    fetchCompany(value);
  };
  const handleCompanyChange = (value: number) => {
    setSelectedCompanyId(value);
  };
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

  let sub_admin_role = localStorage.getItem('sub_admin_role');
  const handleAllocationChange = (value: string) => {
    setSelectedAllcationType(value);
    if (value === 'công ty') {
      if (is_administrative !== 'true' || sub_admin_role !== 'none') {
        form?.setFieldValue(
          'current_company_id',
          Number(localStorage.getItem('company_id'))
        );
      }
    }
  };
  const fetchCompany = async (id: number) => {
    const res = await getDepartmentById(id);
    if (res) {
      setCurrentCompanyId(res.company_id);
      return res;
    }
  };
  const handleSelectedCurrentCompany = async (value: number) => {
    setSelectedCurrentCompanyId(value);
  };
  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    if (isCreating) {
      setLoading(true);
      try {
        if (data) {
          if (data.allocation_type === 'công ty') {
            console.log('data', data);
            const res = await createEmployeeAllocatioV2({
              ...data,
              company_id: data.company_id,
              current_company_id:
                is_administrative === 'true' || sub_admin_role !== 'none'
                  ? data.current_company_id
                  : Number(localStorage.getItem('company_id')) ?? '',
              department_id: data.department_id,
              employee_ids: data.employee_ids.map((item: any) => {
                return item;
              }),
              current_department_id: data.current_department_id,
              contract_type_id: data.contract_type_id,
              job_id: data.job_id,
              new_company_working_date: data?.new_company_working_date
                ? moment(data?.new_company_working_date).format('YYYY-MM-DD')
                : null,
              severance_day_old_company: data?.severance_day_old_company
                ? moment(data?.severance_day_old_company).format('YYYY-MM-DD')
                : null,
            });
            if (res) {
              $message.success('Tạo thành công');
              onClose && onClose();
              setForceUpdate && setForceUpdate(!forceUpdate);
              setLoading(false);
              form?.resetFields();
            }
          } else {
            if (!data.department_allocation_new_id) {
              setLoading(false);
              $message.error('Vui lòng chọn phòng ban');
              return;
            }
            const res = await createEmployeeAllocatioV2({
              name: data.name,
              allocation_type: data.allocation_type,
              company_id:
                is_administrative === 'true' || sub_admin_role !== 'none'
                  ? currentCompanyId
                  : Number(localStorage.getItem('company_id')) ?? '',
              current_company_id:
                is_administrative === 'true' || sub_admin_role !== 'none'
                  ? currentCompanyId
                  : Number(localStorage.getItem('company_id')) ?? '',
              department_id: data.department_allocation_new_id,
              employee_ids: data.employee_ids.map((item: any) => {
                return item;
              }),
              current_department_id: data.current_department_id,
              new_department_working_date: data.new_department_working_date
                ? moment(data.new_department_working_date).format('YYYY-MM-DD')
                : null,
              severance_day_old_department: data.severance_day_old_department
                ? moment(data.severance_day_old_department).format('YYYY-MM-DD')
                : null,
              job_id: data.job_id,
            });
            if (res) {
              $message.success('Tạo thành công');
              onClose && onClose();
              setForceUpdate && setForceUpdate(!forceUpdate);
              setLoading(false);
              form?.resetFields();
              return res;
            }
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        onClose && onClose();
      }
    } else {
      setLoading(true);
      onClose && onClose();
      try {
        if (data) {
          let updateData = { ...data };
          if (data.allocation_type === 'công ty') {
            updateData = {
              name: data.name,
              allocation_type: data.allocation_type,
              company_id:
                data?.company_id?.value ??
                data?.company_id?.id ??
                data?.company_id ??
                '',
              current_company_id:
                data.current_company_id?.value ??
                data?.current_company_id?.id ??
                data?.current_company_id ??
                '',
              department_id:
                data?.department_allocation_new_id?.value ??
                data?.department_allocation_new_id?.id ??
                data?.department_allocation_new_id ??
                '',
              employee_ids: data?.employee_ids.map((item: any) => {
                return item?.value ?? item.id ?? item ?? '';
              }),
              current_department_id: data?.current_department_id
                ? data?.current_department_id?.value
                : data?.current_department_id?.id ?? '',
              new_department_working_date: data?.new_department_working_date
                ? moment(data?.new_department_working_date).format('YYYY-MM-DD')
                : null,
              severance_day_old_department: data?.severance_day_old_department
                ? moment(data?.severance_day_old_department).format(
                    'YYYY-MM-DD'
                  )
                : null,
              job_id:
                data?.job_id?.value ?? data?.job_id?.id ?? data?.job_id ?? '',
              new_company_working_date: data?.new_company_working_date
                ? moment(data?.new_company_working_date).format('YYYY-MM-DD')
                : null,
              severance_day_old_company: data?.severance_day_old_company
                ? moment(data?.severance_day_old_company).format('YYYY-MM-DD')
                : null,
            };
          } else {
            updateData = {
              name: data.name,
              allocation_type: data.allocation_type,
              department_id:
                data?.department_allocation_new_id?.value ??
                data?.department_allocation_new_id?.id ??
                data?.department_allocation_new_id ??
                '',
              employee_ids: data?.employee_ids.map((item: any) => {
                return item?.value ?? item.id ?? item ?? '';
              }),
              current_department_id: data?.current_department_id
                ? data?.current_department_id?.value
                : data?.current_department_id?.id ?? '',
              new_department_working_date: data?.new_department_working_date
                ? moment(data?.new_department_working_date).format('YYYY-MM-DD')
                : null,
              severance_day_old_department: data?.severance_day_old_department
                ? moment(data?.severance_day_old_department).format(
                    'YYYY-MM-DD'
                  )
                : null,
              job_id:
                data?.job_id?.value ?? data?.job_id?.id ?? data?.job_id ?? '',
              new_company_working_date: data?.new_company_working_date
                ? moment(data?.new_company_working_date).format('YYYY-MM-DD')
                : null,
              severance_day_old_company: data?.severance_day_old_company
                ? moment(data?.severance_day_old_company).format('YYYY-MM-DD')
                : null,
            };
          }
          if (idAllocation) {
            const res = await updateAllocation(updateData, idAllocation);
            if (res) {
              $message.success('Cập nhật thành công');
              onClose && onClose();
              setForceUpdate && setForceUpdate(!forceUpdate);
              setLoading(false);
              form?.resetFields();
              return res;
            }
          }
        }
      } catch (error) {
        console.log(error);
        onClose && onClose();
        setLoading(false);
      }
    }
  };
  const fetchAllocationById = async (id?: number) => {
    if (!id) {
      return;
    }
    try {
      setLoading(true);
      const res = await getEmployeeAllocationById(id);
      if (res) {
        set_data_type_date('severance_day_old_company', res);
        set_data_type_date('new_company_working_date', res);
        // set_data_type_date('new_department_working_date', res);
        form?.setFieldsValue({
          new_department_working_date: res.new_department_working_date,
        });
        setNew_department_working_date(res.new_department_working_date);
       // set_data_type_date('severance_day_old_department', res);
       form?.setFieldsValue({
        severance_day_old_department: res.severance_day_old_department,
      });
      setSeverance_day_old_department(res.severance_day_old_department);
        set_data_type_date('date_end', res);
        set_data_type_date('date_sign', res);
        setSelectedAllcationType(res.allocation_type);
        setSelectedCurrentDepartmentId(res.current_department_id.id);
        setDepartmentId(res.department_id.id);
        setSelectedCompanyId(res.company_id ? res.company_id.id : null);
        form &&
          form.setFieldsValue({
            key: res.id,
            name: res.name ?? '',
            company_id: {
              value: res.company_id.id ?? '',
              label: res.company_id.name ?? '',
            },
            current_company_id: {
              value: res.current_company_id.id ?? '',
              label: res.current_company_id.name ?? '',
            },
            current_department_id: {
              value: res.current_department_id.id ?? '',
              label: res.current_department_id.name ?? '',
            },
            department_allocation_new_id: {
              value: res.department_id.id ?? '',
              label: res.department_id.name ?? '',
            },
            contract_type_id: {
              value: res.contract_type_id.id ?? '',
              label: res.contract_type_id.name ?? '',
            },
            allocation_type: res.allocation_type ?? '',
            state: res.state ?? '',
            employee_ids: res.employee_ids.map((item: any) => {
              return {
                value: item.id ?? '',
                label: item.name + ' - ' + item.code,
              };
            }),
            contract_name: res.contract_name ?? '',
            department_id: {
              value: res.department_id.id ?? '',
              label: res.department_id.name ?? '',
            },
            job_id: {
              value: res.job_id.id ?? '',
              label: res.job_id.name ?? '',
            },
          });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    form?.resetFields();
    setSelectedAllcationType(null);
    setSelectedCurrentDepartmentId(null);
    setSelectedCompanyId(null);
    fetchAllocationById(idAllocation);
  }, [idAllocation, open]);
  const is_administrative = localStorage.getItem('is_administrative');
  const handleDepartmentChange = (value: number) => {
    setDepartmentId(value);
  };
  return (
    <>
      <Drawer
        key={idAllocation}
        title={isCreating ? 'Tạo phiếu mới' : 'Sửa thông tin phiếu'}
        width={720}
        open={open}
        onClose={onClose}
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
                <SelectAllocation onChange={handleAllocationChange} />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  innerprops={{
                    placeholder: t(
                      { id: 'placeholder_input' },
                      { msg: 'Tên phiếu' }
                    ),
                  }}
                  label={'Tên phiếu'}
                  name="name"
                  type="input"
                  initialValue={''}
                />
              </Col>
              {selectedAllcationType && selectedAllcationType == 'công ty' ? (
                <>
                  {is_administrative === 'true' || sub_admin_role !== 'none' ? (
                    <Col span={12}>
                      <SelectCompanyAllAllocation
                        onChange={handleSelectedCurrentCompany}
                      />
                    </Col>
                  ) : (
                    <Col span={12}>
                      <SelectCurrentCompany />
                    </Col>
                  )}
                  {is_administrative === 'true' || sub_admin_role !== 'none' ? (
                    <Col span={12}>
                      <SelectMultipleEmployeeAllocation
                        selectedCurrentCompanyId={selectedCurrentCompanyId}
                      />
                    </Col>
                  ) : (
                    <Col span={12}>
                      <SelectMultipleEmployeeCurrent />
                    </Col>
                  )}
                  {is_administrative === 'true' || sub_admin_role !== 'none' ? (
                    <Col span={12}>
                      <SelectNewCompanyAllocation
                        onChange={handleCompanyChange}
                        selectedCurrentCompanyId={selectedCurrentCompanyId}
                      />
                    </Col>
                  ) : (
                    <Col span={12}>
                      <SelectNewCompanyForm onChange={handleCompanyChange} />
                    </Col>
                  )}
                  <Col span={12}>
                    <SelectSearchAllocationDepartmentForm
                      selectedCompanyId={selectedCompanyId}
                      onChange={handleDepartmentChange}
                    />
                  </Col>
                  <Col span={12}>
                    <SelectJob selectedDepartmentId={departmentId} />
                  </Col>

                  <Col span={12}>
                    <MyForm.Item
                      label="Ngày kết thúc công việc công ty cũ"
                      name="severance_day_old_company"
                      type="date-picker"
                      innerprops={{
                        placeholder: t(
                          { id: 'placeholder_input' },
                          { msg: 'ngày kết thúc công việc công ty cũ' }
                        ),
                        format: 'DD/MM/YYYY',
                      }}
                      required
                    />
                  </Col>
                  <Col span={12}>
                    <MyForm.Item
                      label="Ngày vào làm công ty mới"
                      name="new_company_working_date"
                      type="date-picker"
                      innerprops={{
                        placeholder: t(
                          { id: 'placeholder_input' },
                          { msg: 'ngày vào làm công ty mới' }
                        ),
                        format: 'DD/MM/YYYY',
                      }}
                      required
                    />
                  </Col>
                  {/* <Col span={12}>
                                            <MyForm.Item label={'Tên hợp đồng'} name="contract_name" type="input" innerprops={{
                                                placeholder: t(
                                                    { id: 'placeholder_input' },
                                                    { msg: 'Tên hợp đồng' }
                                                ),

                                            }}
                                                required
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <SelectContractType />
                                        </Col>
                                        <Col span={12}>
                                            <MyForm.Item
                                                label="Ngày ký hợp đồng"
                                                name="date_sign"
                                                type="date-picker"
                                                innerprops={{
                                                    placeholder: t(
                                                        { id: 'placeholder_input' },
                                                        { msg: 'ngày ký hợp đồng' }
                                                    ),
                                                    format: 'DD/MM/YYYY',
                                                }}
                                                required
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <MyForm.Item
                                                label="Ngày kết thúc hợp đồng mới"
                                                name="date_end"
                                                type="date-picker"
                                                innerprops={{
                                                    placeholder: t(
                                                        { id: 'placeholder_input' },
                                                        { msg: 'ngày kết thúc hợp đồng' }
                                                    ),
                                                    format: 'DD/MM/YYYY',
                                                }}
                                                required
                                            />
                                        </Col> */}
                </>
              ) : selectedAllcationType &&
                selectedAllcationType == 'phòng ban' ? (
                <>
                  <Col span={12}>
                    <SelectCurrentDepartmentAllocation
                      onChange={handleCurrentDepartmentChange}
                    />
                  </Col>
                  {selectedCurrentDepartmentId && (
                    <Col span={12}>
                      <SelectMultipleEmployee
                        selectedCurrentDepartmentId={
                          selectedCurrentDepartmentId
                        }
                      />
                    </Col>
                  )}
                  {selectedCurrentDepartmentId ? (
                    <Col span={12}>
                      <SelectDepartmentAllocationNew
                        selectedCurrentDepartmentId={
                          selectedCurrentDepartmentId
                        }
                        onChange={handleDepartmentChange}
                      />
                    </Col>
                  ) : null}
                  {departmentId && (
                    <Col span={12}>
                      <SelectJob selectedDepartmentId={departmentId} />
                    </Col>
                  )}
                  <Col span={12}>
                    <MyForm.Item
                      label="Ngày vào làm phòng ban mới"
                      name="new_department_working_date"
                      type="time-picker-input"
                      innerprops={{
                        placeholder: t(
                          { id: 'placeholder_input' },
                          { msg: 'ngày vào làm phòng ban mới' }
                        ),
                        format: 'DD/MM/YYYY',
                      }}
                      required
                    />
                  </Col>
                  <Col span={12}>
                    <MyForm.Item
                      label="Ngày kết thúc công việc phòng ban cũ"
                      name="severance_day_old_department"
                      type="time-picker-input"
                      innerprops={{
                        placeholder: t(
                          { id: 'placeholder_input' },
                          { msg: 'ngày kết thúc công việc phòng ban cũ' }
                        ),
                        format: 'DD/MM/YYYY',
                      }}
                      required
                    />
                  </Col>
                </>
              ) : (
                <></>
              )}
            </Row>
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};
export default FormAllocation;
