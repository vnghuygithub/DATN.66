import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import './style.css';
import { Input, Row, Col, Form, FormInstance } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  IGetAttendanceContentParams,
  IGetAttendanceParams,
} from '@/interface/weeklyreport/type';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import { getAttendanceReport } from '@/api/weeklyreport/weeklyreport';
import {
  filterObjectsByNameAndCode,
  transformObject,
  updateObject,
} from '@/utils/common';
import { setCellsActive } from '@/stores/common.store';
import MyButton from '@/components/basic/button';
import { useLocale } from '@/locales';
import { setListAttendance } from '@/stores/list-attendance-report.store';
interface SearchProps {
  setDataAttendant: any;
  dataAttendant: any;
  forceUpdate?: boolean;
  fromDate: string;
  toDate: string;
  children: ReactNode;
  setDataEmployee: any
}
interface FormValues {
  rangeTime?: string;
  name?: string;
  time_keeping_code?: string;
}
const Index = (props: SearchProps) => {
  const {
    children,
    setDataAttendant,
    dataAttendant,
    forceUpdate,
    fromDate,
    toDate,
    setDataEmployee
  } = props;
  const { t } = useLocale();
  const [form] = Form.useForm();
  const { UpdateScheduleList } = useSelector((state: any) => state.schedule);
  const formRef = useRef<FormInstance>(null);
  const [valueSearch, setValueSearch] = useState('');
  const dispatch = useDispatch();
  const _setListAttendance = (data: any) => dispatch(setListAttendance(data));
  const [formValues, setFormValues] = useState<FormValues>({});
  const { listAttendance } = useSelector((state: any) => state.listAttendance);
  console.log(valueSearch);
  

  const searchHandler = async () => {
    try {
      await form.validateFields();
      let updatedList = JSON.parse(listAttendance.toString()) ?? [];
      const data = await form?.getFieldsValue();

      if (data) {
        if (updatedList) {
          updatedList = filterObjectsByNameAndCode(
            updatedList,
            data.name,
            data.time_keeping_code
          );
          setValueSearch(data.time_keeping_code);
          setValueSearch(data.name);
        }
        setDataAttendant(updatedList);
      }
    } catch (error) {
      console.error('Error occurred during form submission:', error);
    }
  };
  const onSubmit = async () => {
    await searchHandler();
  };

  function handlekeypress(e: any) {
    onSubmit();
  }
  const getAttendance = useCallback(async () => {
    try {
      if (fromDate !== '' && toDate !== '') {
        const args: string[] = [fromDate, toDate, ''];
        const params: IGetAttendanceContentParams = {
          args,
        };
        const body: IGetAttendanceParams = {
          params,
        };

        store.dispatch(setGlobalState({ loading: true }));

        const { result } = (await getAttendanceReport(body)) as any;

        if (result) {
          setDataEmployee(result)
          const formattedObject = transformObject(result);
          setDataAttendant(formattedObject);
          _setListAttendance(JSON.stringify(formattedObject));
          store.dispatch(setGlobalState({ loading: false }));
        } else {
          console.log('Lỗi rồi!^^');
        }
        if (valueSearch !== '') {
          searchHandler();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [fromDate, toDate, setDataAttendant]);

  const handleFieldChange = (changedValues: FormValues) => {
    setFormValues(prevValues => ({
      ...prevValues,
      ...changedValues,
    }));
    if (changedValues.time_keeping_code === '' || changedValues.name === '') {
      searchHandler();
    }
  };
  useEffect(() => {
    var tempArr = dataAttendant;
    tempArr = updateObject(tempArr, UpdateScheduleList);
    setDataAttendant(tempArr);
    _setListAttendance(JSON.stringify(tempArr));
    setCellsActive(tempArr);
  }, [forceUpdate]);

  useEffect(() => {
    getAttendance();
  }, [fromDate, toDate]);

  return (
    <>
      <Form
        layout="vertical"
        ref={formRef}
        form={form}
        onValuesChange={handleFieldChange}>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Form.Item label={'Khoảng thời gian '} name="rangeTime">
              {children}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Form.Item label={'Họ và tên'} name="name">
              <Input
                size="middle"
                placeholder=" Vd: Nguyễn Văn A"
                onPressEnter={handlekeypress}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Form.Item label={'Id vân tay'} name="time_keeping_code">
              <Input
                size="middle"
                placeholder="Vd:2860"
                onPressEnter={handlekeypress}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row gutter={24}>
        <Col span={24} style={{ textAlign: 'right' }}>
          <MyButton type="primary" onClick={onSubmit}>
            {t({ id: 'search' })}
          </MyButton>
{/* 
          <MyButton onClick={() => form.resetFields()}>
            {t({ id: 'reset' })}
          </MyButton> */}
        </Col>
      </Row>
    </>
  );
};

export default Index;
