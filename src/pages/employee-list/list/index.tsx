//@ts-ignore
import { Button, Form, Space, Tag } from 'antd';
import { FC, useState } from 'react';
import { message as $message } from 'antd';
import SearchEmployeeeMis from '../components/search-mis';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { useLocale } from '@/locales';
import {
  IEmployeeeArgsResult,
  IFilterEmployeesArgs,
} from '@/interface/employees/employee';
import {
  createUserFromEmployee,
  deleteEmployee,
  getEmployeeByArgs,
  getEmployeeLogs,
} from '@/api/employee/employee.api';
import FormEmployee from '../handle';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
  HistoryOutlined,
  LockOutlined,
} from '@ant-design/icons';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import ChangePasswordForm from '../handle/changePassword';
import EmployeeLog from '../handle/log';
import UpdateAlClAdvancedForm from '../handle/updateAlClAdvanced';
import EmployeeWorkHistory from './employee-work-history';
import moment from 'moment';
import { useLocation } from 'react-router-dom';

const ListEmployee: FC = () => {
  const [form] = Form.useForm();
  const [foceUpdate, setFoceUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [idEmployee, setIdEmployee] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [idHistoryEmployee, setIdHistoryEmployee] = useState('');
  const [showLog, setShowLog] = useState<boolean>(false);
  const [showAlClAdvanced, setShowAlClAdvanced] = useState<boolean>(false);

  const [isModalInfoEmployeeVisible, setIsModalInfoEmployeeVisible] =
    useState(false);

  const [employees, setEmployees] = useState<any[]>([]);
  const { t } = useLocale();

  const handleView = (id: string) => {
    setIsViewMode(true);
    setIdEmployee(id);
    showDrawer();
  };
  const showDrawerChangePassword = () => {
    setChangePassword(true);
  };
  const updateshowAlClAdvanced = () => {
    setShowAlClAdvanced(true);
  };
  const handleDelete = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 nhân viên');
      return;
    }
    store.dispatch(setGlobalState({ loading: true }));
    const ids = selectedRowArr.map((item: any) => item.key);
    for (const key of ids) {
      try {
        const res = await deleteEmployee(key);
        if (res) {
          $message.success('Xoá nhân viên thành công');
          setFoceUpdate(!foceUpdate);
          setSelectedRowArr([]);
          setForceClearSelection(!forceClearSelection);
        }
      } catch (err) {
        console.log(err);
      }
    }
    store.dispatch(setGlobalState({ loading: false }));
  };

  let is_general_manager = localStorage.getItem('is_general_manager');
  let is_administrative = localStorage.getItem('is_administrative');
  let employee_ho = localStorage.getItem('employee_ho');
  let employeeCode = localStorage.getItem('employeeCode');
  console.log(employeeCode,"========")
  const handleEdit = (id: string) => {
    setIsViewMode(false);
    setIsCreating(false);
    setIdEmployee(id);
    showDrawer();
  };

  const handleClickShowInfoEmployee = (id: any) => {
    setIdHistoryEmployee(id);
    // Tìm nhân viên trong state employees dựa trên mã nhân viên
    setIsModalInfoEmployeeVisible(true);
  };
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const tableColums: MyPageTableOptions<IEmployeeeArgsResult> = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Id vân tay',
      dataIndex: 'time_keeping_code',
      key: 'time_keeping_code',
      width: 90,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'working_status',
      key: 'working_status',
      width: 120,
      align: 'center',
      fixed: 'left',

      render: (state: string) => {
        let textColor = '';
        let stateText = '';

        if (state === 'working') {
          textColor = 'green';
          stateText = 'Đang làm việc';
        } else if (state === 'resigned') {
          textColor = 'volcano';
          stateText = 'Đã nghỉ việc';
        }

        const spanStyle = textColor;

        return (
          <Tag color={spanStyle} style={{ fontSize: '13px' }}>
            {stateText}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày vào làm',
      dataIndex: 'workingday',
      key: 'workingday',
      width: 120,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      width: 170,
      align: 'center',
      fixed: 'left',
      onCell: record => {
        return {
          onClick: () => {
            if (record) {
              handleClickShowInfoEmployee(record.key);
            }
          },
          style: { cursor: 'pointer' },
        };
      },
    },
    is_administrative === 'true' || sub_admin_role !== 'none'
      ? {
          title: 'Công ty',
          dataIndex: 'mis_id',
          key: 'mis_id',
          width: 100,
          align: 'center',
        }
      : {},
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      width: 330,
      align: 'center',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'job',
      key: 'job',
      width: 240,
      align: 'center',
    },
    {
      title: 'Cấp nhân sự',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      align: 'center',
      render: item => {
        return <>{item < 10 || is_administrative === 'true'  ? <p>{item}</p> : <p>?</p>}</>;
      },
    },
    {
      title: 'Ca hiện tại',
      dataIndex: 'current_shift_name',
      key: 'current_shift_name',
      width: 100,
      align: 'center',
    },
    { 
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      width: 120,
      align: 'center',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 120,
      align: 'center',
    },
    {
      title: 'Số điện thoại cá nhân',
      dataIndex: 'mobile_phone',
      key: 'mobile_phone',
      width: 150,
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'work_email',
      key: 'work_email',
      width: 230,
      align: 'center',
    },
    {
      title: 'Ngày hết hạn hợp đồng hiện tại',
      dataIndex: 'official_contract_end_date',
      key: 'official_contract_end_date',
      width: 120,
      align: 'center',
    },
    {
      title: 'Giờ làm việc',
      dataIndex: 'resource_calendar',
      key: 'resource_calendar',
      width: 150,
      align: 'center',
    },
    {
      title: 'Nơi cấp CMND',
      dataIndex: 'issued_by_identification_text',
      key: 'issued_by_identification_text',
      width: 370,
      align: 'center',
    },
    {
      title: 'Số CMND',
      dataIndex: 'identification_id',
      key: 'identification_id',
      width: 120,
      align: 'center',
    },
    {
      title: 'Ngày cấp CMND',
      dataIndex: 'issued_by_identification_day',
      key: 'issued_by_identification_day',
      width: 120,
      align: 'center',
    },
    {
      title: 'Công ty kiêm nhiệm',
      dataIndex: 'part_time_company',
      key: 'part_time_company',
      width: 120,
      align: 'center',
    },
    {
      title: 'Ngày hết hạn hợp đồng thử việc',
      dataIndex: 'probationary_contract_termination_date',
      key: 'probationary_contract_termination_date',
      width: 120,
      align: 'center',
    },
    {
      title: 'Số lần chấm công',
      dataIndex: 'time_keeping_count',
      key: 'time_keeping_count',
      width: 130,
      align: 'center',
    },
    {
      title: 'Số điện thoại công việc',
      dataIndex: 'work_phone',
      key: 'work_phone',
      width: 150,
      align: 'center',
    },
    {
      title: 'Ngày thôi việc',
      dataIndex: 'severance_day',
      key: 'severance_day',
      width: 120,
      align: 'center',
    },
    {
      title: 'Người quản lý',
      dataIndex: 'parent_id',
      key: 'parent_id',
      width: 170,
      align: 'center',
    },
    {
      title: 'Phòng ban kiêm nhiệm',
      dataIndex: 'part_time_department',
      key: 'part_time_department',
      width: 150,
      align: 'center',
    },

    {
      title: 'Mã số thuế cá nhân',
      dataIndex: 'tax_id',
      key: 'tax_id',
      width: 120,
      align: 'center',
    },
    // {
    //   title: 'Quản lý chung',
    //   dataIndex: 'general_management_check',
    //   key: 'general_management_check',
    //   width: 120,
    //   align: 'center',
    //   render: item => (item === true ? <CheckOutlined /> : <CloseOutlined />),
    // },
    // {
    //   title: 'Trưởng bộ phận',
    //   dataIndex: 'head_of_department_check',
    //   key: 'head_of_department_check',
    //   width: 120,
    //   align: 'center',
    //   render: item => (item === true ? <CheckOutlined /> : <CloseOutlined />),
    // },
    // {
    //   title: 'Thư ký bộ phận',
    //   dataIndex: 'department_secretary_check',
    //   key: 'department_secretary_check',
    //   width: 120,
    //   align: 'center',
    //   render: item => (item === true ? <CheckOutlined /> : <CloseOutlined />),
    // },
    // {
    //   title: 'Kế toán trưởng',
    //   dataIndex: 'is_accountant',
    //   key: 'is_accountant',
    //   width: 120,
    //   align: 'center',
    //   render: item => (item === true ? <CheckOutlined /> : <CloseOutlined />),
    // },
    {
      title: 'Bắt buộc nộp báo cáo tuần',
      dataIndex: 'weekly_report_is_mandatory',
      key: 'weekly_report_is_mandatory',
      width: 120,
      align: 'center',
      render: item => (item === true ? <CheckOutlined /> : <CloseOutlined />),
    },
    {
      title: 'Nơi làm việc',
      dataIndex: 'work_location',
      key: 'work_location',
      width: 120,
      align: 'center',
    },
    {
      title: 'Nơi sinh',
      dataIndex: 'place_of_birth',
      key: 'place_of_birth',
      width: 120,
      align: 'center',
    },

    {
      title: 'Địa chỉ thường trú',
      dataIndex: 'permanent_address',
      key: 'permanent_address',
      width: 360,
      align: 'center',
    },
    {
      title: 'Quốc gia',
      dataIndex: 'country',
      key: 'country',
      width: 120,
      align: 'center',
    },
    {
      title: 'Tỉnh/Thành phố',
      dataIndex: 'state',
      key: 'state',
      width: 120,
      align: 'center',
    },
    {
      title: 'Quận/Huyện',
      dataIndex: 'district',
      key: 'district',
      width: 120,
      align: 'center',
    },
    {
      title: 'Xã/Phường',
      dataIndex: 'ward',
      key: 'ward',
      width: 120,
      align: 'center',
    },
    {
      title: 'Dân tộc',
      dataIndex: 'nation',
      key: 'nation',
      width: 120,
      align: 'center',
    },
    {
      title: 'Tôn giáo',
      dataIndex: 'religion',
      key: 'religion',
      width: 120,
      align: 'center',
    },

    {
      title: 'Nơi ở hiện tại',
      dataIndex: 'current_place_of_residence',
      key: 'current_place_of_residence',
      width: 360,
      align: 'center',
    },
    {
      title: 'Tình trạng hôn nhân',
      dataIndex: 'marital',
      key: 'marital',
      width: 120,
      align: 'center',
    },
    {
      title: 'STK ngân hàng',
      dataIndex: 'bank_account_number',
      key: 'bank_account_number',
      width: 120,
      align: 'center',
    },
    {
      title: 'Ngân hàng',
      dataIndex: 'bank_name',
      key: 'bank_name',
      width: 120,
      align: 'center',
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'bank_branch',
      key: 'bank_branch',
      width: 120,
      align: 'center',
    },
    {
      title: 'Số BHXH',
      dataIndex: 'social_insurance_number',
      key: 'social_insurance_number',
      width: 120,
      align: 'center',
    },
    {
      title: 'Bằng cấp cao nhất',
      dataIndex: 'certificate',
      key: 'certificate',
      width: 120,
      align: 'center',
    },
    {
      title: 'Trường đào tạo',
      dataIndex: 'study_school',
      key: 'study_school',
      width: 120,
      align: 'center',
    },
    {
      title: 'Chứng chỉ',
      dataIndex: 'highest_degree',
      key: 'highest_degree',
      width: 120,
      align: 'center',
    },
    {
      title: 'Chuyên ngành',
      dataIndex: 'study_field',
      key: 'study_field',
      width: 120,
      align: 'center',
    },
    {
      title: 'Loại xe',
      dataIndex: 'range_of_vehicle',
      key: 'range_of_vehicle',
      width: 120,
      align: 'center',
    },
    {
      title: 'Đăng ký gửi xe',
      dataIndex: 'car_registration',
      key: 'car_registration',
      width: 120,
      align: 'center',
    },
    {
      title: 'Biển số xe',
      dataIndex: 'license_plates',
      key: 'license_plates',
      width: 120,
      align: 'center',
    },
    {
      title: 'Màu xe',
      dataIndex: 'car_color',
      key: 'car_color',
      width: 120,
      align: 'center',
    },
    {
      title: t({ id: 'action' }),
      key: 'action',
      fixed: 'right',
      width: 120,
      align: 'center',
      render: (item, record) => (
        <>
          {item.code === employeeCode ||
            is_administrative === 'true' ||
            sub_admin_role == 'recruitment' ||
            sub_admin_role == 'administration' ||
            is_general_manager === 'true' ? (
              <Space size="middle">
                <EyeOutlined
                  style={{ fontSize: '14px', color: '#0960bd' }}
                  onClick={() => handleView(item.key)}
                />

                <EditOutlined
                  style={{ fontSize: '14px', color: '#0960bd' }}
                  onClick={() => handleEdit(item.key)}
                />
                {item.user_id && (
                  <LockOutlined
                    style={{ fontSize: '14px', color: '#0960bd' }}
                    onClick={() => handleChangePassword(item.key)}
                  />
                )}
                {/* <HistoryOutlined
                  style={{ fontSize: '14px', color: '#0960bd' }}
                  onClick={() => handleShowLog(item.key)}
                /> */}
              </Space>
            ): (
             <div></div>
            )}
        </>
      ),
    },
  ];
  const handleShowLog = (id: string) => {
    setShowLog(true);
    setIdEmployee(id);
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const changePasswordOnclose = () => {
    setChangePassword(false);
  };
  const onClose = () => {
    setOpen(false);
    setIsViewMode(!isViewMode);
    setIsCreating(false);
    setIdEmployee('');
    setShowLog(false);
    setShowAlClAdvanced(false);
    // setTimeout(() => setIdShift(null), 1000);
  };
  const handleCreate = async () => {
    await form.resetFields();
    showDrawer();
    setIsViewMode(false);
    setIsCreating(true);
  };
  const _getListEmployee = async (params: IFilterEmployeesArgs) => {
    const res = await getEmployeeByArgs(params);
    if (res) {
      console.log("res empl", res)
      setEmployees([...(res.results.data || [])]);
      return res;
    }
  };
  const handleCreateUser = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 nhân viên');
      return;
    }
    const hasUserWithAccount = selectedRowArr.some(item => item.user_id);
    if (hasUserWithAccount) {
      $message.error('Nhân viên bạn chọn đã có tài khoản');
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
      return;
    }

    const ids = selectedRowArr.map((item: any) => item.key);
    store.dispatch(setGlobalState({ loading: true }));

    try {
      for (const key of ids) {
        await createUserFromEmployee(key);
      }
      $message.success('Tạo tài khoản thành công');
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
    } catch (err) {
      console.log(err);
    } finally {
      store.dispatch(setGlobalState({ loading: false }));
    }
  };
  const handleChangePassword = async (id: any) => {
    setIdEmployee(id);
    showDrawerChangePassword();
  };

  return (
    <>
      <MyPage
        rowkey="id"
        pageApi={_getListEmployee}
        title={'Danh sách nhân viên'}
        searchRender={<SearchEmployeeeMis />}
        forceClearSelection={forceClearSelection}
        tableOptions={tableColums}
        setSelectedRowData={setSelectedRowArr}
        forceUpdate={foceUpdate}
        multipleSelection
        selectedRowArr={selectedRowArr}
        slot={
          <>
            {(is_general_manager === 'true' ||
              is_administrative == 'true' ||
              sub_admin_role == 'recruitment' || sub_admin_role == "administration") && (
              <>
                {/* <Button type="primary" onClick={updateshowAlClAdvanced}>
                  Quỹ
                </Button> */}
                <Button type="primary" onClick={handleCreate}>
                  Thêm mới
                </Button>
                <Button type="primary" onClick={handleCreateUser}>
                  Tạo tài khoản
                </Button>
                <Button type="primary" onClick={handleDelete}>
                  Xoá
                </Button>
              </>
            )}
          </>
        }
      />
      <FormEmployee
        form={form}
        setFoceUpdate={setFoceUpdate}
        foceUpdate={foceUpdate}
        idEmployee={idEmployee}
        open={open}
        isViewMode={isViewMode}
        showDrawer={showDrawer}
        onClose={onClose}
        isCreating={isCreating}
      />

      <ChangePasswordForm
        form={form}
        onClose={changePasswordOnclose}
        open={changePassword}
        showDrawer={showDrawerChangePassword}
        idEmployee={idEmployee}
      />

      <EmployeeLog
        showLog={showLog}
        onClose={onClose}
        idEmployee={idEmployee}
      />
      <UpdateAlClAdvancedForm
        onClose={onClose}
        open={showAlClAdvanced}
        showDrawer={updateshowAlClAdvanced}
        form={form}
      />
      <EmployeeWorkHistory
        isModalInfoEmployeeVisible={isModalInfoEmployeeVisible}
        setIsModalInfoEmployeeVisible={setIsModalInfoEmployeeVisible}
        isIdEmployee={idHistoryEmployee}
      />
    </>
  );
};

export default ListEmployee;
