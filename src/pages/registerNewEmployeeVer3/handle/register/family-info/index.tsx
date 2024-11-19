import {
  deleteEmployeeRelativeById,
  getEmployeeRelativeByEmployeeCode,
  getEmployeeRelativeByEmployeeId,
} from '@/api/employee/employee.api';
import { useLocale } from '@/locales';
import { formatDate } from '@/utils/formatDate';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { message as $messase } from 'antd';
import RelativeForm from './RelativeForm';

const FamilyInfo = ({
  isViewMode,
  isCreatingEmployee,
  idRegisterNewEmployee,
  open2,
  open3,
  registerNewEmployee,
}: any) => {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [tableKey, setTableKey] = useState(1);
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [idRelative, setIdRelative] = useState<any>();
  const [form] = Form.useForm();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [employeeFamilyInfo, setEmployeeFamilyInfo] = useState<any>([]);

  const employeeId = localStorage.getItem('employee_id');
  const employeeCode = localStorage.getItem('employee_code_parent');
  const handleDelete = async (id: number) => {
    setLoading(true);

    const res = await deleteEmployeeRelativeById(id);

    if (res) {
      if (employeeCode) {
        const res = await getEmployeeRelativeByEmployeeCode(employeeCode);
        localStorage.setItem('length', res.result.length);
        setEmployeeFamilyInfo(res?.result);

        setForceUpdate(!forceUpdate);
        setLoading(false);
        $messase.success('Xoá thành công');
        return;
      } else {
        const res = await getEmployeeRelativeByEmployeeId(employeeId);
        console.log('8972397923');
        localStorage.setItem('length2', res.result.length);
        setEmployeeFamilyInfo(res?.result);

        setForceUpdate(!forceUpdate);
        setLoading(false);
        $messase.success('Xoá thành công');
        return;
      }
    }
  };
  useEffect(() => {
    if (open2 || open3) {
      if (employeeCode) {
        _getEmployeeRelativeByEmployeeCode(employeeCode);
      } else {
        _getEmployeeRelativeByEmployeeId(employeeId);
      }
    }
  }, [open2, open3, employeeCode]);

  const _getEmployeeRelativeByEmployeeCode = async (code: any) => {
    const res = await getEmployeeRelativeByEmployeeCode(code);
    setEmployeeFamilyInfo(res.result);
    localStorage.setItem('length', res.result.length);
    if (res) {
      setForceUpdate(!forceUpdate);
      setLoading(false);
      return res;
    } else {
      setLoading(false);
      return;
    }
  };
  const _getEmployeeRelativeByEmployeeId = async (id: any) => {
    const res = await getEmployeeRelativeByEmployeeId(id);
    setEmployeeFamilyInfo(res.result);
    localStorage.setItem('length2', res.result.length);

    if (res) {
      setForceUpdate(!forceUpdate);
      setLoading(false);
      return res;
    } else {
      setLoading(false);
      return;
    }
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setIsCreating(false);
    setIdRelative(null);
  };
 
  const handleAdd = async () => {
    showDrawer();
    setIsCreating(true);
    setIdRelative(null);
  };
  const handleEdit = async (id: number) => {
    showDrawer();
    setIdRelative(id);
    setIsCreating(false);
  };
  return (
    <>
      {/* <Table
        key={tableKey}
        loading={loading}
        columns={tableColumns}
        dataSource={employeeFamilyInfo}
        bordered
        rowClassName={() => 'editable-row'}
      /> */}
      <RelativeForm
        registerNewEmployee={registerNewEmployee}
        showDrawer={showDrawer}
        onClose={onClose}
        open={open}
        form={form}
        familyInfo={employeeFamilyInfo}
        idRelative={idRelative}
        isCreating={isCreating}
        isViewMode={isViewMode}
        idRegisterNewEmployee={idRegisterNewEmployee}
        forceUpdate={forceUpdate}
        setForceUpdate={setForceUpdate}
        _getEmployeeRelativeByEmployeeCode={_getEmployeeRelativeByEmployeeCode}
        _getEmployeeRelativeByEmployeeId={_getEmployeeRelativeByEmployeeId}
      />
      
    </>
  );
};
export default FamilyInfo;
