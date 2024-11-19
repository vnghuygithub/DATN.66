import { Button, Col, DatePicker, Drawer, FormInstance, Row, Spin } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { message as $message, Upload, Space } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import SelectHolidayStatus from '@/pages/components/selects/SelectHolidayStatus';
import { reasonOptions } from '@/const/options';
import SelectEmployeeContractSearch from '@/pages/components/selects/SelectEmployeeContractSearch';
import { getListEmployeeV2 } from '@/api/employee/employee.api';
import { get } from 'lodash';
import {createWorkLocation ,  updateWorkLocation, updateWorkLocation2} from '@/api/workLocation/worklocation'
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAllNoRight';
import SelectCompanyAllCopy from '@/pages/components/selects/SelectCompanyAllNoRight copy';
import SelectCompanyAllSearch from '@/pages/components/selects/SelectCompanyAllSearch';


interface IProps {
  onClose?: () => void;
  showDrawer?: () => void;
  open?: boolean;
  idWorkLocation?: any;
  setForceUpdate?: Dispatch<SetStateAction<boolean>>;
  forceUpdate?: boolean;
  form?: FormInstance<any>;
  // employee: any[];
  updateState?: boolean;
}

const WorkLocationForm = ({
  onClose,
  showDrawer,
  open,
  idWorkLocation,
  setForceUpdate,
  forceUpdate,
  form,
  updateState,
}: IProps) => {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any>();
  const [employee, setEmployee] = useState<any[]>([]);
  const [downloadLink, setDownloadLink] = useState<any>();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);

    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onFinish = async () => {
    await form?.validateFields();
    const data = await form?.getFieldsValue();

    if (data && idWorkLocation != -1) {
      setLoading(true);
      const params = {
        "params": {
            "data": {
                "name": data.name ?? "",
                "work_location_code": data.work_location_code ?? "",
                "company_id": data.company_id ?? ""
            
            
            }
        }
    }
    console.log(idWorkLocation)
      const res = await updateWorkLocation2(idWorkLocation?.id,params);
      if (res) {
        $message.success('Thành công');
        setForceUpdate && setForceUpdate(!forceUpdate);
        onClose && onClose();
        setLoading(false);
      }
    }
    // } else 
    if (data && idWorkLocation == -1) {
      setLoading(true);

        const params = {
            "params": {
                "args": [{
                    "name": data.name ?? "",
                    "work_location_code": data.work_location_code ?? "",
                    "company_id": data.company_id ?? ""
                
                
                }]
            }
        }
        
        const res = await createWorkLocation(params);
      if (res == "success") {
        $message.success('Thành công');
        setForceUpdate && setForceUpdate(!forceUpdate);
        onClose && onClose();
        setLoading(false);
      }
      else if (res == "error"){
        setLoading(false);
      
      }
    }
  };

  const fetchKpi = async (id: any) => {
    if (!id || id == -1) {
      form?.setFieldsValue({
        name: "",
        work_location_code: "",
        company_id: "",
      });
      return;
    }
    else {
        form?.setFieldsValue({
            name: id.name  ?? "",
            work_location_code: id.work_location_code ?? "",
            company_id: id.company_id.id ?? id.company_id ??  "",
        });
    } 
  };
  useEffect(() => {
    fetchKpi(idWorkLocation);
  }, [idWorkLocation, open]);



  return (
    <>
      <Drawer
        key={idWorkLocation}
        title={idWorkLocation == -1 ? 'Tạo nơi làm việc' :'Sửa nơi làm việc'}
        width={isMobile ? '100%' : '50%'}
        onClose={onClose}
        open={open}
        destroyOnClose
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Button key={1} onClick={onClose}>
              Hủy
            </Button>
            <Button key={2} onClick={onFinish} type="primary" loading={loading}>
              Lưu
            </Button>
          </div>
        }>
        <Spin spinning={loading}>
          <MyForm<any> onFinish={onFinish} form={form} layout="vertical">
            <Row gutter={24}>
            <Col span={12}>
                <MyForm.Item
                  label="Nơi làm việc"
                  type="input"
                  name="name"
                />
              </Col>
              <Col span={12}>
                <MyForm.Item
                  label="Mã"
                  type="input"
                  name="work_location_code"
                />
              </Col>
              <Col span={12}>
                <SelectCompanyAllSearch />
              </Col>
            </Row>
          </MyForm>
        </Spin>
      </Drawer>
    </>
  );
};

export default WorkLocationForm;
