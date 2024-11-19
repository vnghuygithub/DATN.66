import { Button, Col, Drawer, FormInstance, Row, Spin, Space } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import moment, { Moment } from 'moment';
import {
  getExplainationById,
  putExplainationById,
} from '@/api/explanationRequest/explanationRequest.api';
import SelectHolidayStatus from '@/pages/components/selects/SelectHolidayStatus';
import { reasonOptions } from '@/const/options';
import SelectParentApplication from '@/pages/components/selects/SelectParentApplication';
import SelectEmployeeShiftRequest from '@/pages/components/selects/SelectEmployeeShiftRequest';
import SelectParentUpdate from '@/pages/components/selects/SelectParentUpdate';
import { putEmployeeById } from '@/api/employee/employee.api';
import { set } from 'lodash';
import SelectEmployeeGeneralManager from '@/pages/components/selects/SelectGeneralManager';
import SelectCompany from '@/pages/components/selects/SelectCompany';
import {
  getHolidayStatusById,
  getListHolidayStatus,
} from '@/api/employee/holidayStatus.api';
import { mobileResponsive } from '@/utils/mobileResponsive';
import { DownloadOutlined } from '@ant-design/icons';

interface IProps {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idApplication?: any;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  isView?: boolean;
  checkUpdate: boolean;
}

const ApplicationForm = ({
  onClose,
  showDrawer,
  open,
  idApplication,
  setForceUpdate,
  forceUpdate,
  form,
  isView,
  checkUpdate,
}: IProps) => {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const { isMobile } = mobileResponsive();
  const [employeeId, setEmployeeId] = useState<any>(null);
  const [holidayDayStatus, setHolidayDayStatus] = useState<any>(null);
  const [holidayStatusType, setHolidayStatusType] = useState<any>(null);
  const [responseAttachments, setResponseAttachments] = useState<any[]>([]);
  const [state, setState] = useState<any>('');
  let is_general_manager = localStorage.getItem('is_general_manager');

  const fetchApplicationById = async (id: number) => {
    if (!id) {
      return;
    }
    try {
      setLoading(true);
      const res = await getExplainationById(idApplication);
      console.log(res);
      
      if (res) {
        setState(res?.state);
        const from_date =
          moment(res?.date_from, 'YYYY-MM-DD-HH-mm').format('YYYY-MM-DD') ?? '';
        const date_to =
          moment(res?.date_to, 'YYYY-MM-DD-HH-mm').format('YYYY-MM-DD') ?? '';
        setResponseAttachments([]);
        if (
          res.holiday_request_url_ids &&
          res.holiday_request_url_ids.length > 0
        ) {
          let updatedResponseAttachments: any[] = [];
          res?.holiday_request_url_ids?.forEach((item: any) => {
            const itemExists = updatedResponseAttachments.some(
              existingItem => existingItem.name === item.name
            );
            if (!itemExists) {
              updatedResponseAttachments.push(item);
            }
          });
          setResponseAttachments(updatedResponseAttachments);
        }
        form?.setFieldsValue({
          for_reasons: res?.for_reasons ?? '',
          reasons: res?.reasons ?? '',
          minutes: res?.minutes ?? '',
          holiday_status_id: res?.holiday_status_id ?? '',
          from_date: from_date ?? '',
          date_to: date_to ?? '',

          employee_parent_id: res?.employee_parent_id ?? '',
          hr_manager: res?.hr_approval_id ?? '',
          multiplier_work_time: res?.multiplier_work_time ?? '',
          multiplier_wage: res?.multiplier_wage ?? '',
          company_id: res?.work_trip_location,
          attendance_missing_from: res?.attendance_missing_from ? moment(res?.attendance_missing_from, 'YYYY-MM-DD-HH-mm-ss') : null,
          attendance_missing_to: res?.attendance_missing_to ? moment(res?.attendance_missing_to, 'YYYY-MM-DD-HH-mm-ss') : null
        });
        setEmployeeId(res?.employee_id);
        setHolidayDayStatus(res?.holiday_status_id);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchApplicationById2 = async (id: number) => {
    if (!id) {
      return;
    }
    try {
      setLoading(true);
      const res = await getExplainationById(idApplication);
      console.log(res);
      
      if (res) {
        return res?.state
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();
    if (data) {
      console.log(data);
      
      if (data?.from_date > data?.date_to) {
        $message.error('Ngày bắt đầu không thể lớn hơn ngày kết thúc');
        return;
      }


        const res_state = await fetchApplicationById2(idApplication);
      
      
      if (res_state) {
        setLoading(true);

        const dataToSend: any = {
          for_reasons: data?.for_reasons,
          reasons: data?.reasons,
          minutes: data?.minutes,
          holiday_status_id: data?.holiday_status_id,
          date_from: moment(data?.from_date).format('YYYY-MM-DD HH:mm'),
          date_to: moment(data?.date_to).format('YYYY-MM-DD HH:mm'),
          employee_parent_id: data?.employee_parent_id,
          hr_approval_id: data?.hr_manager,
          multiplier_work_time:data?.multiplier_work_time,
          multiplier_wage:data?.multiplier_wage,
          state: res_state,
          attendance_missing_from: data?.attendance_missing_from ? moment(data?.attendance_missing_from).format('YYYY-MM-DD HH:mm:ss') : null,
          attendance_missing_to: data?.attendance_missing_to ? moment(data?.attendance_missing_to).format('YYYY-MM-DD HH:mm:ss') : null,
        };

        const res = await putExplainationById(idApplication, dataToSend);
          console.log(res);
          
        if (data.employee_parent_id) {
          await putEmployeeById(employeeId, {
            params: {
              data: {
                parent_id: data?.employee_parent_id,
                hr_manager: data?.hr_manager,
                multiplier_work_time:data?.multiplier_work_time,
                 multiplier_wage:data?.multiplier_wage,
              },
            },
          });
        }

        if (res) {
          setState('');
          $message.success('Thành công');
          setForceUpdate && setForceUpdate(!forceUpdate);
          onClose && onClose();
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    if (idApplication) {
      fetchApplicationById(idApplication);
    }
  }, [idApplication]);
  const handleHolidayStatusChange = (value: any) => {
    setHolidayDayStatus(value);
  };
  const _getHolidayStatusById = async (id: number) => {
    const res = await getHolidayStatusById(id);
    if (res) {
      setHolidayStatusType(res?.code);
      return res?.code;
    }
  };
  useEffect(() => {
    _getHolidayStatusById(holidayDayStatus);
  }, [holidayDayStatus]);
  const handleDownloadFile = (url: string, name: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.click();
      })
      .catch(console.error);
  };
  return (
    <>
      <Drawer
        key={idApplication}
        title={'Sửa đơn'}
        width={isMobile ? '100%' : '820'}
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
          <MyForm<any> onFinish={onFinish} form={form} layout="vertical">
            <Row gutter={24}>
              <Col span={12}>
                <SelectParentUpdate
                  employeeId={employeeId}
                  checkUpdate={isView}
                />
              </Col>
              {(holidayStatusType === 'TC' || holidayStatusType === 'TCC') && (
                <Col span={12}>
                  <SelectEmployeeGeneralManager checkUpdate={isView} />
                </Col>
              )}
              <Col span={12}>
                <SelectHolidayStatus
                  onChange={handleHolidayStatusChange}
                  checkUpdate={checkUpdate}
                />
              </Col>
              {holidayStatusType === 'CT' && (
                <Col span={12}>
                  <SelectCompany checkUpdate={isView} />
                </Col>
              )}
              <Col span={12}>
                <MyForm.Item
                  innerprops={{
                    disabled: isView,
                  }}
                  label="Vì lí do"
                  type="select"
                  options={[
                    {
                      label: 'Cá nhân',
                      value: '1',
                    },
                    {
                      label: 'Công việc',
                      value: '2',
                    },
                  ]}
                  name="for_reasons"
                  required
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Lí do"
                  type="input"
                  name="reasons"
                  innerprops={{
                    disabled: isView || checkUpdate,
                  }}
                  required
                />
              </Col>

              <Col span={12}>
                <MyForm.Item
                  label="Số phút"
                  type="input-number"
                  name="minutes"
                  required
                  innerprops={{
                    disabled: isView,
                  }}
                />
              </Col>
              {
                holidayStatusType === "TCC" && (
                  <>
                    <Col span={12}>
                      <MyForm.Item
                        label="Thiếu chấm công từ"
                        type="time-picker"
                        name="attendance_missing_from"
                        innerprops={{
                          format: 'DD/MM/YYYY HH:mm:ss',
                          disabled: isView,
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <MyForm.Item
                        label="Thiếu chấm công đến"
                        type="time-picker"
                        name="attendance_missing_to"
                        innerprops={{
                          format: 'DD/MM/YYYY HH:mm:ss',
                          disabled: isView,
                        }}
                      />
                    </Col>
                  </>
                )
              }
              {
                holidayStatusType === "TCCV" && (
                  <Col span={12}>
                      <MyForm.Item
                        label="Thời gian vào"
                        type="time-picker"
                        name="attendance_missing_from"
                        innerprops={{
                          format: 'DD/MM/YYYY HH:mm:ss',
                          disabled: isView,
                        }}
                      />
                    </Col>
                )
              }
              {
                holidayStatusType === "TCCR" && (
                  <Col span={12}>
                      <MyForm.Item
                        label="Thời gian ra"
                        type="time-picker"
                        name="attendance_missing_to"
                        innerprops={{
                          format: 'DD/MM/YYYY HH:mm:ss',
                          disabled: isView,
                        }}
                      />
                    </Col>
                )
              }
              <Col span={12}>
                <MyForm.Item
                  label="Từ ngày"
                  type="time-picker-input" //date-picker
                  name="from_date"
                  innerprops={{
                    format: 'DD/MM/YYYY',
                    disabled: isView,
                  }}
                  required
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Đến ngày"
                  type="time-picker-input"
                  name="date_to"
                  innerprops={{
                    format: 'DD/MM/YYYY',
                    disabled: isView,
                  }}
                  required
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Hệ số công"
                  type="input"
                  name="multiplier_work_time"
                  innerprops={{
                    min: 0,
                    allowClear: true,
                    disabled: isView ,
                  }}
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Hệ số lương"
                  type="input"
                  name="multiplier_wage"
                  innerprops={{
                    min: 0,
                    allowClear: true,
                    disabled: isView ,
                  }}
                />
              </Col>
              {responseAttachments?.length > 0 && (
                <Col span={12}>
                  <span>File đính kèm</span>
                  <Space
                    direction="vertical"
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                    {responseAttachments?.map((item: any) => {
                      return (
                        <Button
                          key={item.id}
                          style={{ marginTop: 8, width: '100%' }}
                          type="primary"
                          onClick={() => {
                            handleDownloadFile(item.url, item.name);
                          }}
                          icon={<DownloadOutlined />}>
                          {item.name}
                        </Button>
                      );
                    })}
                  </Space>
                </Col>
              )}
            </Row>
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default ApplicationForm;
