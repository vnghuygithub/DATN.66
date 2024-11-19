import { useState } from 'react';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { Button, Form, Space, Tag } from 'antd';
import { IRegisterNewEmployee } from '@/interface/registerNewEmployee/register';
import {
  getRegisterNewEmployee,
  verifyRegisterNewEmployee,
  getRegisterNewEmployeeDetail,
  sendMailIT,
  sendMailEmployee,
} from '@/api/registerNewEmployee/register.api';
import { message as $message } from 'antd';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { useLocale } from '@/locales';
import { EditOutlined } from '@ant-design/icons';
import NewEmployeeRequestForm from '../handle';
const index = () => {
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
  const [dataParent, setDataParent] = useState([]);
  const [children, setChildren] = useState('');
  const [loading, setLoading] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleCreate = () => {
    setLoading(true);
    const company_id =
      selectedRowArr &&
      selectedRowArr.some((item: any) => item.company_id === false);
    const department_id =
      selectedRowArr &&
      selectedRowArr.some((item: any) => item.department_id === false);
    const job_id =
      selectedRowArr &&
      selectedRowArr.some((item: any) => item.job_id === false);
    const parent_id =
      selectedRowArr &&
      selectedRowArr.some((item: any) => item.parent_id === false);
    const personal_email =
      selectedRowArr &&
      selectedRowArr.some((item: any) => item.personal_email === false);
    const time_keeping_code =
      selectedRowArr &&
      selectedRowArr.some((item: any) => item.time_keeping_code === false);
    const resource_calendar_id =
      selectedRowArr &&
      selectedRowArr.some((item: any) => item.resource_calendar_id === false);
    const status1 = selectedRowArr.some(
      (item: any) => item.status === 'it_received'
    );
    const status2 = selectedRowArr.some(
      (item: any) => item.status === 'employee_received'
    );
    if (status1) {
      $message.error('Không được duyệt bản ghi đã gửi mail it');
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setLoading(false);
      setForceClearSelection(!forceClearSelection);
      return;
    }
    if (status2) {
      $message.error('Không được duyệt bản ghi đã gửi mail nhân viên ');
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setLoading(false);
      setForceClearSelection(!forceClearSelection);
      return;
    }
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 bản ghi để duyệt');
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setLoading(false);
      setForceClearSelection(!forceClearSelection);
      return;
    }
    if (company_id) {
      $message.error('Thiếu trường công ty');
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setLoading(false);
      setForceClearSelection(!forceClearSelection);
      return;
    }

    if (department_id) {
      $message.error('Thiếu trường phòng ban');
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setLoading(false);
      setForceClearSelection(!forceClearSelection);
      return;
    }
    if (job_id) {
      $message.error('Thiếu trường chức vụ');
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setLoading(false);
      setForceClearSelection(!forceClearSelection);
      return;
    }
    if (parent_id) {
      $message.error('Thiếu trường người quản lý');
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setLoading(false);
      setForceClearSelection(!forceClearSelection);
      return;
    }
    if (personal_email) {
      $message.error('Thiếu email cá nhân');
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setLoading(false);
      setForceClearSelection(!forceClearSelection);
      return;
    }
    if (time_keeping_code) {
      $message.error('Thiếu id vân tay');
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setLoading(false);
      setForceClearSelection(!forceClearSelection);
      return;
    }
    if (resource_calendar_id) {
      $message.error('Thiếu giờ làm việc');
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setLoading(false);
      setForceClearSelection(!forceClearSelection);
      return;
    }
    const data_id =
      selectedRowArr && selectedRowArr.map((item: any) => item.id);
    for (const id of data_id) {
      verifyRegisterNewEmployee(id)
        .then(res => {
          if (res) {
            if (res.result == 'success') {
              $message.success('Duyệt thành công');
            } else if (res.result == 'Số lượng thân nhân không khớp!') {
              $message.error(
                'Duyệt thất bại! Số lượng con không khớp với số lượng người thân với quan hệ là con '
              );
              $message.error('Đã được duyệt trước đó');
              setFoceUpdate(!foceUpdate);
              setSelectedRowArr([]);
              setLoading(false);
              setForceClearSelection(!forceClearSelection);
              store.dispatch(setGlobalState({ loading: false }));
              return;
            } else if (res.result == 'already created') {
              $message.error('Đã được duyệt trước đó');
              setFoceUpdate(!foceUpdate);
              setSelectedRowArr([]);
              setLoading(false);
              setForceClearSelection(!forceClearSelection);
              store.dispatch(setGlobalState({ loading: false }));
              return;
            } else {
              $message.error('Duyệt thất bại');
            }
            setFoceUpdate(!foceUpdate);
            setSelectedRowArr([]);
            setLoading(false);
            setForceClearSelection(!forceClearSelection);
            store.dispatch(setGlobalState({ loading: false }));
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  const handleView = async (id: any) => {
    const res = await getRegisterNewEmployeeDetail(id);
    setRegisterNewEmployee(res);
    if (res.status == 'employee_received') {
      $message.error('Không được sửa đơn đã gửi mail nhân viên');
      return;
    }
    if (res.status == 'employee_created') {
      $message.error('Không được sửa đơn đã tạo nhân viên');
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

      start_work_date: res?.start_work_date,
      date_of_birth: res?.date_of_birth,
      register_employee_url_ids: newEmployees?.url,
      parent_id: {
        label: res.parent_id.name,
        value: res.parent_id.id,
      },
      resource_calendar_id: {
        label: res.resource_calendar_id.name,
        value: res.resource_calendar_id.id,
      },
      apec_group_mail_ids: res?.apec_group_mail_ids.map((item: any) => {
        return {
          label: item.name + ' - ' + item.email,
          value: item.id,
        };
      }),
      work_location: {
        label: res.work_location.name,
        value: res.work_location.id,
      },
      work_email: res?.work_email ? res?.work_email : '',
      personal_email: res?.personal_email ? res?.personal_email : '',
      time_keeping_code: res?.time_keeping_code ? res?.time_keeping_code : '',
      mobile_phone: res?.mobile_phone ? res?.mobile_phone : '',
      vehicle_info: res?.vehicle_info ? res?.vehicle_info : '',
    };

    if (res) {
      setChildren(res?.number_of_children);
      await form.setFieldsValue(convertData);
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
      width: 150,
      align: 'center',
      render: item => (
        <Space size="middle">
          {item == 'verified' ? (
            <Tag color="green">Đã Duyệt</Tag>
          ) : item == 'new' ? (
            <Tag color="blue">Chờ duyệt</Tag>
          ) : item == 'it_received' ? (
            <Tag color="green">Đã Mail IT</Tag>
          ) : item == 'employee_received' ? (
            <Tag color="green">Đã Mail nhân viên</Tag>
          ) : item == 'employee_created' ? (
            <Tag color="green"> Đã tạo nhân viên</Tag>
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
    {
      title: 'Công ty',
      dataIndex: 'mis_id',
      key: 'mis_id',
      width: 100,
      align: 'center',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department_id',
      key: 'department_id',
      width: 220,
      align: 'center',
      render: item => (
        <Space size="middle">
          {item && item[1] ? <div>{item[1]}</div> : <div></div>}
        </Space>
      ),
    },
    {
      title: 'Chức vụ',
      dataIndex: 'job_id',
      key: 'job_id',
      width: 220,
      align: 'center',
      render: item => (
        <Space size="middle">
          {item && item[1] ? <div>{item[1]}</div> : <div></div>}
        </Space>
      ),
    },
    {
      title: 'Nơi làm việc',
      dataIndex: 'work_location',
      key: 'work_location',
      width: 100,
      align: 'center',
      render: item => (
        <Space size="middle">
          {item && item[1] ? <div>{item[1]}</div> : <div></div>}
        </Space>
      ),
    },
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
      dataIndex: 'car_color',
      key: 'car_color',
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

  const handleSendMailIT = async () => {
    setLoading(true);

    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 bản ghi để gửi mail');
      setLoading(false);
      return;
    }
    selectedRowArr.forEach(item => {
      if (item.status !== 'verified') {
        setFoceUpdate(!foceUpdate);
        setSelectedRowArr([]);
        setForceClearSelection(!forceClearSelection);
        setLoading(false);
        return;
      }
    });
    const data = await sendMailIT(selectedRowArr.map((item: any) => item.id));
    if (data) {
      $message.success('Gửi mail thành công');
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleSendMailEmployee = async () => {
    setLoading(true);

    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn ít nhất 1 bản ghi để gửi mail');
      setLoading(false);
      return;
    }
    selectedRowArr.forEach(item => {
      if (item.status !== 'it_received') {
        setFoceUpdate(!foceUpdate);
        setSelectedRowArr([]);
        setForceClearSelection(!forceClearSelection);
        setLoading(false);
        return;
      }
    });
    const data = await sendMailEmployee(
      selectedRowArr.map((item: any) => item.id)
    );
    if (data) {
      $message.success('Gửi mail thành công');
      setLoading(false);
      setFoceUpdate(!foceUpdate);
      setSelectedRowArr([]);
      setForceClearSelection(!forceClearSelection);
    }
    setLoading(false);
  };
  return (
    <>
      <MyPage
        pageApi={getRegisterNewEmployee}
        title={'Danh sách Đăng ký nhân sự mới'}
        tableOptions={tableColums}
        forceUpdate={foceUpdate}
        setSelectedRowData={setSelectedRowArr}
        selectedRowArr={selectedRowArr}
        multipleSelection
        rowkey={'id'}
        forceClearSelection={forceClearSelection}
        slot={
          <>
            {/* <Button type="primary" onClick={handleSendMailIT} loading={loading}>
              Gửi mail IT
            </Button>
            <Button
              type="primary"
              onClick={handleSendMailEmployee}
              loading={loading}>
              Gửi mail nhân viên
            </Button> */}
            <Button type="primary" onClick={handleCreate} loading={loading}>
              {'Duyệt'}
            </Button>
          </>
        }
      />
      <NewEmployeeRequestForm
        setDataParent={setDataParent}
        dataParent={dataParent}
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
      />
    </>
  );
};

export default index;
