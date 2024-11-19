import { useEffect, useState } from 'react';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { Button, Form, Space, Tag } from 'antd';

import { message as $message } from 'antd';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { useLocale } from '@/locales';
import { EditOutlined } from '@ant-design/icons';

import moment from 'moment';
import NewEmployeeRequestFormVer3 from '../handle';
import { IRegisterNewEmployee } from '@/interface/registerNewEmployeeVer3/register';
import {
  getRegisterNewEmployeeDetail,
  getRegisterNewEmployeeVer3,
  sendMailIT,
  verifyRegisterLetter,
  verifyRegisterLetter2,
} from '@/api/registerNewEmployee/registerLeave.api';
import RegisterForm from '../handle/register';
import {
  getEmployeeById,
  getEmployeeProfile,
  getEmployeeRelativeByEmployeeId,
} from '@/api/employee/employee.api';
import { updateEmployeeRelativeParent } from '@/api/employee/relative.api';
import { getResignationLetter } from '@/api/resignationletter';
const RegisterNewEmployeeVer3 = (props: any) => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [foceUpdate, setFoceUpdate] = useState(false);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [idJob, setIdJob] = useState<any>(null);
  const [idEmployees, setIdEmployees] = useState<any>(null);
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
  const [downLoad, setDownLoad] = useState([]);
  

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
    const data_id = selectedRowArr[0].id;
    const res = await verifyRegisterLetter(data_id);
    console.log(res)
    if (res) {
      if (res.result.code === 200) {
        $message.success('Duyệt thành công');
      } else if (res.result === 'Duyệt thất bại!') {
        $message.error('Duyệt thất bại!  ');
      } else if (res.result === 'already created') {
        $message.error('Đã được duyệt trước đó');
        setLoading(false);
        setFoceUpdate(!foceUpdate);
        setSelectedRowArr([]);
        setForceClearSelection(!forceClearSelection);
        store.dispatch(setGlobalState({ loading: false }));

        return;
      } else {
        $message.error('Duyệt thất bại đơn xin nghỉ việc');
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
          $message.error('Duyệt thất bại đơn xin nghỉ việc');
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

  const handleReject = async () => {
    setLoading(true);
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn dòng để duyệt');
      setLoading(false);
      return;
    }
    const data_id = selectedRowArr[0].id;
    const res = await verifyRegisterLetter2(data_id);
    console.log(res)
    if (res) {
      if (res.result.code === 200) {
        $message.error('Từ chối duyệt đơn thành công');
      } else if (res.result === 'Duyệt thất bại!') {
        $message.error('Duyệt thất bại!  ');
      } else if (res.result === 'already created') {
        $message.error('Đã được duyệt trước đó');
        setLoading(false);
        setFoceUpdate(!foceUpdate);
        setSelectedRowArr([]);
        setForceClearSelection(!forceClearSelection);
        store.dispatch(setGlobalState({ loading: false }));

        return;
      } else {
        $message.error('Duyệt thất bại đơn xin nghỉ việc');
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
          $message.error('Duyệt thất bại đơn xin nghỉ việc');
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

  const handleView = async (item: any) => {
    const res = await getRegisterNewEmployeeDetail(item.id);
    
   
    setRegisterNewEmployee(res);
    console.log(res)
    if (res.state == "approved"
    ) {
      $message.error('Không được sửa nhân sự đã duyệt ');
      return;
    }
    if (res.state == "rejected"
    ) {
      $message.error('Không được sửa nhân sự từ chối ');
      return;
    }
    
    showDrawer();
    setIdEmployees(item.employee_id[0])
    setIdJob(item.id)
    setUpdateState(false);
    setDownLoad(item.hand_over_docs_ids);

    const convertData = {
      ...res,
      severance_day: res?.severance_day ? moment(res?.severance_day) : null,
      reason:res?.reason,

    };
   console.log(res)
    if (res) {
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
      dataIndex: 'state',
      key: 'state',
      width: 100,
      align: 'center',
      render: item => (
        <Space size="middle">
          {item == 'approved' ? (
            <Tag color="green">Đã Duyệt</Tag>
          ) : item == 'draft' ? (
            <Tag color="blue">Chờ duyệt</Tag>
          ) : (
            <Tag color="red">Từ chối</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'employee_name',
      key: 'employee_name',
      width: 170,
      align: 'center',
    },

    {
      title: 'Ngày nghỉ việc',
      dataIndex: 'severance_day',
      key: 'severance_day',
      width: 130,
      align: 'center',
    },

    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
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
      title: 'Lý do nghỉ việc',
      dataIndex: 'reason',
      key: 'reason',
      width: 330,
      align: 'center',
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
              onClick={() => handleView(item)}
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
  const is_administrative = localStorage.getItem('is_administrative');
  const is_administrativeCheck = is_administrative === 'true';
  return (
    <>
      <MyPage
        pageApi={getRegisterNewEmployeeVer3}
        title={'Danh sách đơn xin nghỉ việc'}
        tableOptions={tableColums}
        forceUpdate={foceUpdate}
        setSelectedRowData={setSelectedRowArr}
        selectedRowArr={selectedRowArr}
        multipleSelection
        rowkey={'id'}
        forceClearSelection={forceClearSelection}
        slot={
          
          <div style={{display:'flex', gap:'8px', marginLeft:'10px'}}>
             {/* <Button
              type="primary"
              onClick={handleSendMailIT}
              loading={loading}>
              Gửi mail IT
            </Button> */}
            {is_administrativeCheck && (
              <div >
              <Button type="primary" onClick={handleCreate} loading={loading}>
                {'Duyệt'}
              </Button>
              <Button type="primary"  onClick={handleReject} loading={loading}>
                {'Từ chối'}
              </Button>
              </div>
              
            )
            }
            <Button type="primary" onClick={handleDataEmployee}>
              {'Tạo đơn'}
            </Button>
          </div>
        }
      />
      <NewEmployeeRequestFormVer3
      downLoad={downLoad}
      idEmployees={idEmployees}
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

export default RegisterNewEmployeeVer3;
