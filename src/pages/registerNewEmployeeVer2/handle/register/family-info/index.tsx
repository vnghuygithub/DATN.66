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
  const tableColumns: any = [
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      key: 'state',
      width: 70,
      align: 'center',
      render: (state: string) => {
        let textColor = '';
        let stateText = '';

        if (state === 'chưa duyệt') {
          textColor = 'cyan';
          stateText = 'Chưa duyệt';
        } else if (state === 'đã duyệt') {
          textColor = 'green';
          stateText = 'Đã duyệt';
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
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      width: 140,
      align: 'center',
    },
    {
      title: 'Quan hệ',
      dataIndex: 'relationship',
      key: 'relationship',
      width: 100,
      align: 'center',
      render: (item: any) => {
        let result = item;
        if (item === 'dad') {
          result = 'Bố';
        } else if (item === 'mother') {
          result = 'Mẹ';
        } else if (item === 'child') {
          result = 'Con';
        } else if (item === 'older brother') {
          result = 'Anh trai';
        } else if (item === 'younger brother') {
          result = 'Em trai';
        } else if (item === 'older sister') {
          result = 'Chị gái';
        } else if (item === 'younger sister') {
          result = 'Em gái';
        } else {
          result = 'Khác';
        }
        return result;
      },
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      width: 100,
      align: 'center',
      render: (item: any) => {
        return item && formatDate(item);
      },
    },
    // {
    //   title: 'Nghề nghiệp',
    //   dataIndex: 'job',
    //   key: 'job',
    //   width: 120,
    //   align: 'center',
    // },
    // {
    //   title: 'Điện thoại',
    //   dataIndex: 'phone',
    //   key: 'phone',
    //   width: 100,
    //   align: 'center',
    // },
    {
      title: 'Giảm trừ gia cảnh',
      dataIndex: 'family_allowances',
      key: 'family_allowances',
      width: 150,
      align: 'center',
      render: (item: any) => {
        return item === 'no' ? 'Không' : 'Có';
      },
    },
    // {
    //   title: 'Ghi chú',
    //   dataIndex: 'note',
    //   key: 'note',
    //   width: 100,
    //   align: 'center',
    // },
    {
      title: t({ id: 'action' }),
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (item: any) => (
        <Space size="middle">
          {!isViewMode && (
            <Space size="middle" direction="horizontal">
              <DeleteOutlined
                style={{ fontSize: '14px', color: 'red' }}
                onClick={() => handleDelete(item.id)}
              />
            </Space>
          )}
        </Space>
      ),
    },
  ];
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
      {!isViewMode && !isCreatingEmployee && (
        <div>
          <Button
            onClick={handleAdd}
            type="primary"
            style={{ marginBottom: 16 }}>
            Thêm mới thân nhân
          </Button>
        </div>
      )}
      <Table
        key={tableKey}
        loading={loading}
        columns={tableColumns}
        dataSource={employeeFamilyInfo}
        bordered
        rowClassName={() => 'editable-row'}
      />
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
