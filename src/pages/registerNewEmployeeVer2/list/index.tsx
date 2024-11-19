import { useEffect, useState } from 'react';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { Button, Form, Space, Tag } from 'antd';

import { message as $message } from 'antd';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { useLocale } from '@/locales';
import { EditOutlined } from '@ant-design/icons';

import moment from 'moment';
import NewEmployeeRequestFormVer2 from '../handle';
import { IRegisterNewEmployee } from '@/interface/registerNewEmployeeVer2/register';
import {
  getRegisterNewEmployeeDetail,
  getRegisterNewEmployeeVer2,
  verifyRegisterNewEmployee,
} from '@/api/registerNewEmployee/register.api';
import RegisterForm from '../handle/register';
import {
  getEmployeeById,
  getEmployeeProfile,
  getEmployeeRelativeByEmployeeId,
} from '@/api/employee/employee.api';
import { updateEmployeeRelativeParent } from '@/api/employee/relative.api';
const RegisterNewEmployeeVer2 = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [foceUpdate, setFoceUpdate] = useState(false);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [idJob, setIdJob] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [updateState, setUpdateState] = useState<boolean>(false);
  const [registerNewEmployee, setRegisterNewEmployee] = useState<any>('');
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [url3, setUrl3] = useState('');
  const [url4, setUrl4] = useState('');
  const [url5, setUrl5] = useState('');
  const [url6, setUrl6] = useState('');
  const [children, setChildren] = useState('');
  const [openRegister, setOpenRegister] = useState(false);
  const [dataEmployee, setDataEmployee] = useState([]);
  const [dataContract, setDataContract] = useState([]);
  const [employeeFamilyInfo, setEmployeeFamilyInfo] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const [idEmployeeProfile, setIdEmployeeProfile] = useState([]);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    localStorage.removeItem('employee_code_parent');
  };
  const handleCancel = () => {
    setOpenRegister(false);
  };
  const idArray =
    employeeFamilyInfo && employeeFamilyInfo.map((item: any) => item.id);

  const handleCreate = async () => {
    setLoading(true);
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn dòng để duyệt');
      setLoading(false);

      return;
    }

    for (const id of selectedRowArr) {
      const res = await verifyRegisterNewEmployee(id);
      if (res) {
        if (res.result === 'success') {
          $message.success('Duyệt thành công');
        } else if (
          res.result ===
          'Số lượng con không khớp với số lượng người thân với quan hệ là con !'
        ) {
          $message.error(
            'Duyệt thất bại! Số lượng con không khớp với số lượng người thân với quan hệ là con '
          );
        } else if (res.result === 'already created') {
          $message.error('Đã được duyệt trước đó');
          setLoading(false);
          setFoceUpdate(!foceUpdate);
          setSelectedRowArr([]);
          setForceClearSelection(!forceClearSelection);
          store.dispatch(setGlobalState({ loading: false }));

          return;
        } else {
          $message.error('Duyệt thất bại thông tin nhân thân');
        }
      }
    }
    try {
      for (const id of idArray) {
        const res = await updateEmployeeRelativeParent(id, {
          state: 'đã duyệt',
        });
        if (res.result === true) {
          $message.success('Duyệt thành công');
        } else {
          $message.error('Duyệt thất bị thông tin nhân thân');
        }
      }
      setLoading(false);
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
      store.dispatch(setGlobalState({ loading: false }));
    } catch (err) {
      console.log(err);
    }
  };
  const handleView = async (id: any) => {
    const res = await getRegisterNewEmployeeDetail(id);

    if (res) {
      const respon = await getEmployeeProfile(res.employee_code);
      setDataContract(respon);
    } else {
      const respon = await getEmployeeProfile(codeEmployee);
      setDataContract(respon);
    }
    localStorage.setItem('employee_code_parent', res.employee_code);
    const employee_ids = res?.employee_ids?.map((i: any) => ({
      Label: i.company_id?.mis_id,
      value: i.id,
    }));

    setRegisterNewEmployee(res);
    if (res.status == 'verified') {
      $message.error('Không được sửa nhân sự đã duyệt ');
      return;
    }
    showDrawer();
    setIdJob(id);
    setUpdateState(false);
    const newEmployees = res?.register_employee_url_ids.find((i: any) =>
      i.url.includes('front_cccd')
    );
    setUrl1(newEmployees?.url);

    const newEmployees2 = res?.register_employee_url_ids.find((i: any) =>
      i.url.includes('back_cccd')
    );
    setUrl2(newEmployees2?.url);
    const newEmployees3 = res?.register_employee_url_ids.find((i: any) =>
      i.url.includes('avatar')
    );
    setUrl3(newEmployees3?.url);
    const convertData = {
      ...res,
      company_noright_id: {
        label: res.company_id.name,
        value: res.company_id.id,
      },
      department_id: {
        label: res.department_id.name,
        value: res.department_id.id,
      },
      job_id: {
        label: res.job_id.name,
        value: res.job_id.id,
      },
      start_work_date: res?.start_work_date
        ? moment(res?.start_work_date)
        : null,
      date_of_birth: res?.date_of_birth ? moment(res?.date_of_birth) : null,
      register_employee_url_ids: newEmployees?.url,
      parent_id: {
        label: res.parent_id.name,
        value: res.parent_id.id,
      },
      employee_ids: employee_ids,
    };

    if (res) {
      await form.setFieldsValue(convertData);
    }
  };

  const idEmployee = localStorage.getItem('employee_id');
  const codeEmployee = localStorage.getItem('employeeCode');

  const handleDataEmployee = async () => {
    setOpenRegister(true);
    const res = await getEmployeeProfile(codeEmployee);
    setDataContract(res);
    if (res) {
      const id = res && res.map((item: any) => item.id);
      setIdEmployeeProfile(id);
    }
    const respon = await getEmployeeById(idEmployee);
    const newEmployees = respon?.hr_employee_url_ids.find((i: any) =>
      i.url.includes('front_cccd')
    );

    setUrl4(newEmployees?.url);

    const newEmployees2 = respon?.hr_employee_url_ids.find((i: any) =>
      i.url.includes('back_cccd')
    );
    setUrl5(newEmployees2?.url);
    const newEmployees3 = respon?.hr_employee_url_ids.find((i: any) =>
      i.url.includes('avatar')
    );
    setUrl6(newEmployees3?.url);
    if (respon) {
      setDataEmployee(respon);
      const data = {
        ...respon,
        citizen_id: respon?.identification_id ? respon?.identification_id : '',
        verified_citizen_id_date1: respon?.issued_by_identification_day
          ? moment(respon.issued_by_identification_day, 'YYYY-MM-DD').isValid()
            ? moment(respon.issued_by_identification_day, 'YYYY-MM-DD')
            : null
          : null,
        verified_citizen_id_by: respon?.issued_by_identification_text
          ? respon?.issued_by_identification_text
          : '',
        tax_number: respon?.tax_id ? respon?.tax_id : '',
        original_address: respon?.permanent_address
          ? respon?.permanent_address
          : '',
        current_address: respon?.current_place_of_residence
          ? respon?.current_place_of_residence
          : '',
        license_plate: respon?.license_plates ? respon?.license_plates : '',
        vehicle_info: respon?.car_color ? respon?.car_color : '',
        bidv_info: respon?.bank_account_number
          ? respon?.bank_account_number
          : '',
        start_work_date: respon?.workingday
          ? moment(respon.workingday, 'YYYY-MM-DD').isValid()
            ? moment(respon.workingday, 'YYYY-MM-DD')
            : null
          : null,
        date_of_birth: respon?.birthday
          ? moment(respon.birthday, 'YYYY-MM-DD').isValid()
            ? moment(respon.birthday, 'YYYY-MM-DD')
            : null
          : null,
        social_insurance_number: respon?.social_insurance_number
          ? respon?.social_insurance_number
          : '',
      };

      await form.setFieldsValue(data);
    }
  };

  const sharedOnCell = (data: any, index: any) => {
    if (data.company) {
      return { colSpan: 0 };
    }

    return {};
  };
  const tableColums: MyPageTableOptions<IRegisterNewEmployee> = [
    {
      title: 'STT',
      width: 50,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: item => (
        <Space size="middle">
          {item == 'verified' ? (
            <Tag color="green">Đã Duyệt</Tag>
          ) : item == 'new' ? (
            <Tag color="blue">Chờ duyệt</Tag>
          ) : (
            <Tag color="red">Từ chối</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 170,
      align: 'center',
    },

    // {
    //   title: 'Công ty',
    //   dataIndex: 'company_id',
    //   key: 'company_id',
    //   width: 100,
    //   align: 'center',
    //   render: item => (
    //     <Space size="middle">
    //       {item ? <div>{item.mis_id}</div> : <div></div>}
    //     </Space>
    //   ),
    // },
    // {
    //   title: 'Phòng ban',
    //   dataIndex: 'department_id',
    //   key: 'department_id',
    //   width: 220,
    //   align: 'center',
    //   render: item => (
    //     <Space size="middle">
    //       {item ? <div>{item.name}</div> : <div></div>}
    //     </Space>
    //   ),
    // },

    // {
    //   title: 'Chức vụ',
    //   dataIndex: 'job_id',
    //   key: 'job_id',
    //   width: 220,
    //   align: 'center',
    //   render: item => (
    //     <Space size="middle">
    //       {item ? <div>{item.name}</div> : <div></div>}
    //     </Space>
    //   ),
    // },
    {
      title: 'Ngày bắt đầu làm',
      dataIndex: 'start_work_date',
      key: 'start_work_date',
      width: 130,
      align: 'center',
    },

    {
      title: 'Ngày sinh',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      width: 100,
      align: 'center',
    },

    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      align: 'center',
      render: item =>
        item === 'male' ? (
          <div>Nam</div>
        ) : item === 'female' ? (
          <div>Nữ</div>
        ) : (
          <div>Khác</div>
        ),
    },

    {
      title: 'CCCD/CMND',
      dataIndex: 'citizen_id',
      key: 'citizen_id',
      width: 120,
      align: 'center',
    },
    {
      title: 'Nơi cấp cccd/cmnd',
      dataIndex: 'verified_citizen_id_by',
      key: 'verified_citizen_id_by',
      width: 330,
      align: 'center',
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'tax_number',
      key: 'tax_number',
      width: 130,
      align: 'center',
    },
    {
      title: 'Mã số BHXH',
      dataIndex: 'social_insurance_number',
      key: 'social_insurance_number',
      width: 130,
      align: 'center',
    },
    {
      title: 'Hộ khẩu thường trú',
      dataIndex: 'original_address',
      key: 'original_address',
      width: 320,
      align: 'center',
    },
    {
      title: 'Địa chỉ hiện tại',
      dataIndex: 'current_address',
      key: 'current_address',
      width: 320,
      align: 'center',
    },
    {
      title: 'Biển số xe',
      dataIndex: 'license_plate',
      key: 'license_plate',
      width: 150,
      align: 'center',
    },
    {
      title: 'Loại xe, nhãn hiệu và màu sắc xe',
      dataIndex: 'social_insurance_number',
      key: 'social_insurance_number',
      width: 150,
      align: 'center',
    },
    {
      title: 'Tài khoản BIDV',
      dataIndex: 'bidv_info',
      key: 'bidv_info',
      width: 150,
      align: 'center',
    },
    {
      title: 'Ảnh CCCD mặt trước',
      dataIndex: 'register_employee_url_ids',
      key: 'register_employee_url_ids',
      width: 200,
      align: 'center',
      render: item => {
        const front_cccd = item.find((i: any) => i.url.includes('front_cccd'));
        return (
          <div>
            {front_cccd ? (
              <img
                src={front_cccd.url}
                style={{ width: 'auto', height: '100px', objectFit: 'cover' }}
              />
            ) : null}
          </div>
        );
      },
    },
    {
      title: 'Ảnh CCCD mặt sau',
      dataIndex: 'register_employee_url_ids',
      key: 'register_employee_url_ids',
      width: 200,
      align: 'center',
      render: item => {
        const back_cccd = item.find((i: any) => i.url.includes('back_cccd'));
        return (
          <div>
            {back_cccd ? (
              <img
                src={back_cccd.url}
                style={{ width: 'auto', height: '100px', objectFit: 'cover' }}
              />
            ) : null}
          </div>
        );
      },
    },
    {
      title: 'Ảnh chân dung',
      dataIndex: 'register_employee_url_ids',
      key: 'register_employee_url_ids',
      width: 130,
      align: 'center',
      render: item => {
        const avatar = item.find((i: any) => i.url.includes('avatar'));
        return (
          <div>
            {avatar ? (
              <img
                src={avatar.url}
                style={{ width: 'auto', height: '100px', objectFit: 'cover' }}
              />
            ) : null}
          </div>
        );
      },
    },
    {
      title: t({ id: 'action' }),
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      onCell: (item, rowindex) => sharedOnCell(item, rowindex),
      render: item => (
        <Space size="middle">
          {item.id ? (
            <EditOutlined
              style={{ fontSize: '14px', color: '#0960bd' }}
              onClick={() => handleView(item.id)}
            />
          ) : (
            <div></div>
          )}
        </Space>
      ),
    },
  ];
  const employeeId = localStorage.getItem('employee_id');

  useEffect(() => {
    const handleDataParent = async () => {
      const res = await getEmployeeRelativeByEmployeeId(employeeId);
      setEmployeeFamilyInfo(res.result);
    };
    handleDataParent();
  }, []);
  const is_administrative = localStorage.getItem('is_administrative');
  const is_administrativeCheck = is_administrative === 'true';
  return (
    <>
      <MyPage
        pageApi={getRegisterNewEmployeeVer2}
        title={'Danh sách đơn xin đổi thông tin'}
        tableOptions={tableColums}
        forceUpdate={foceUpdate}
        setSelectedRowData={setSelectedRowArr}
        selectedRowArr={selectedRowArr}
        multipleSelection
        rowkey={'id'}
        forceClearSelection={forceClearSelection}
        slot={
          <>
           <div style={{display:'flex', gap:'8px', marginLeft:'10px'}}>
            {is_administrativeCheck && (
              <Button type="primary" onClick={handleCreate} loading={loading}>
                {'Duyệt'}
              </Button>
            )}

            <Button type="primary" onClick={handleDataEmployee}>
              {'Tạo đơn'}
            </Button>
            </div>
          </>
        }

        // forceClearSelection={forceClearSelection}
        // multipleSelection
      />
      <NewEmployeeRequestFormVer2
        children={children}
        setChildren={setChildren}
        url1={url1}
        url2={url2}
        url3={url3}
        registerNewEmployee={registerNewEmployee}
        form={form}
        onClose={onClose}
        setOpen={setOpen}
        open={open}
        idRegisterNewEmployee={idJob}
        forceUpdate={foceUpdate}
        showDrawer={showDrawer}
        setForceUpdate={setFoceUpdate}
        updateState={updateState}
        dataContract={dataContract}
      />
      <RegisterForm
        forceUpdate={foceUpdate}
        setForceUpdate={setFoceUpdate}
        openRegister={openRegister}
        handleCancel={handleCancel}
        form={form}
        dataEmployee={dataEmployee}
        idEmployeeProfile={idEmployeeProfile}
        url4={url4}
        url5={url5}
        url6={url6}
      />
    </>
  );
};

export default RegisterNewEmployeeVer2;
