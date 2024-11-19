import { IInsuranceArgs, getInsurance } from '@/api/insurance/insurance.api';
import { IIsurance } from '@/api/insurance/transform';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { useLocale } from '@/locales';
import { Button, Form, Space } from 'antd';
import { FC, useState } from 'react';
// import SearchInsurance from "../search";
import { EyeOutlined } from '@ant-design/icons';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import FileForm from '../components/FileForm';
import SearchInsuranceMis from '../search-mis';

const InsuranceList: FC = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [idInsurance, setIdInsurance] = useState<any>(null);
  const [isView, setIsView] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setImportOpen(false);
  };
  const _getInsuranceList = async (args: IInsuranceArgs) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getInsurance(args);
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };

  const showDrawerImport = () => {
    setImportOpen(true);
  };

  const tableColumns: MyPageTableOptions<IIsurance> = [
    {
      title: '#',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      align: 'center',
    },
    {
      title: 'Mã NV',
      dataIndex: 'employee_code',
      key: 'employee_code',
      width: 100,
      align: 'center',
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'employee_name',
      key: 'employee_name',
      width: 150,
      align: 'center',
    },
    {
      title: 'Nơi LV',
      dataIndex: 'company_name',
      key: 'company_name',
      width: 150,
      align: 'center',
    },
    {
      title: 'Vị trí',
      dataIndex: 'job_name',
      key: 'job_name',
      width: 150,
      align: 'center',
    },
    {
      title: 'Lương BHXH',
      dataIndex: 'insurance_wage',
      key: 'insurance_wage',
      width: 150,
      align: 'center',
    },
    {
      title: 'Bắt đầu tham gia BHXH',
      dataIndex: 'date_start_insurance',
      key: 'date_start_insurance',
      width: 150,
      align: 'center',
    },
    {
      title: 'Tham gia BHXH',
      dataIndex: 'have_insurance',
      key: 'have_insurance',
      width: 150,
      align: 'center',
    },
    {
      title: 'BHXH',
      dataIndex: 'social_insurance_company',
      key: 'social_insurance_company',
      width: 150,
      align: 'center',
    },
    {
      title: 'BHYT',
      dataIndex: 'health_insurance_company',
      key: 'health_insurance_company',
      width: 150,
      align: 'center',
    },
    {
      title: 'BHTN',
      dataIndex: 'unemployed_insurance_company',
      key: 'unemployed_insurance_company',
      width: 150,
      align: 'center',
    },
    {
      title: 'BHTNLD',
      dataIndex: 'unemployed_insurance_working_company',
      key: 'unemployed_insurance_working_company',
      width: 150,
      align: 'center',
    },
    {
      title: 'Tổng BHBB do DN đóng',
      dataIndex: 'total_insurance_company',
      key: 'total_insurance_company',
      width: 150,
      align: 'center',
    },
    {
      title: 'BHXH',
      dataIndex: 'social_insurance_employee',
      key: 'social_insurance_employee',
      width: 150,
      align: 'center',
    },
    {
      title: 'BHYT',
      dataIndex: 'health_insurance_employee',
      key: 'health_insurance_employee',
      width: 150,
      align: 'center',
    },
    {
      title: 'BHTN',
      dataIndex: 'unemployed_insurance_employee',
      key: 'unemployed_insurance_employee',
      width: 150,
      align: 'center',
    },
    {
      title: 'Tổng BHBB do NLĐ đóng',
      dataIndex: 'total_insurance_employee',
      key: 'total_insurance_employee',
      width: 150,
      align: 'center',
    },
    {
      title: 'Tổng tiền BHXH',
      dataIndex: 'total_social_insurance',
      key: 'total_social_insurance',
      width: 150,
      align: 'center',
    },
    {
      title: 'Tổng tiền BHYT',
      dataIndex: 'total_health_insurance',
      key: 'total_health_insurance',
      width: 150,
      align: 'center',
    },
    {
      title: 'Tổng tiền BHTN',
      dataIndex: 'total_unemployed_insurance',
      key: 'total_unemployed_insurance',
      width: 150,
      align: 'center',
    },
    {
      title: 'Tổng tiền BHTNLĐ',
      dataIndex: 'total_unemployed_insurance_working',
      key: 'total_unemployed_insurance_working',
      width: 150,
      align: 'center',
    },
    {
      title: 'Tổng tiền phải nộp',
      dataIndex: 'total_insurance',
      key: 'total_insurance',
      width: 150,
      align: 'center',
    },
    {
      title: 'Khoản công ty phải đóng thêm',
      dataIndex: 'bonus_company_paid',
      key: 'bonus_company_paid',
      width: 150,
      align: 'center',
    },
    {
      title: 'Khoản phải truy thu từ NV',
      dataIndex: 'total_taken_from_employee',
      key: 'total_taken_from_employee',
      width: 150,
      align: 'center',
    },
    {
      title: 'Tổng tiền - final',
      dataIndex: 'total_final',
      key: 'total_final',
      width: 150,
      align: 'center',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 150,
      align: 'center',
    },
    {
      title: t({ id: 'action' }),
      key: 'id',
      dataIndex: 'id',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: item => (
        <Space size="middle">
          <EyeOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleView(item)}
          />
        </Space>
      ),
    },
  ];
  const handleView = (id: any) => {
    showDrawer();
    setIdInsurance(id);
    setIsView(true);
  };
  const handleImport = () => {
    showDrawerImport();
  };
  const is_administrative = localStorage.getItem('is_administrative');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  return (
    <>
      <MyPage
        title="Danh sách lương BHXH nhân viên"
        rowkey="id"
        pageApi={_getInsuranceList}
        tableOptions={tableColumns}
        searchRender={<SearchInsuranceMis />}
        slot={
          (is_administrative === 'true' || sub_admin_role !== 'none') && (
            <>
              <Button type="primary" onClick={handleImport}>
                Import
              </Button>
            </>
          )
        }
      />
      <FileForm
        onClose={onClose}
        showDrawerImport={showDrawerImport}
        importOpen={importOpen}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        form={form}
      />
    </>
  );
};

export default InsuranceList;
