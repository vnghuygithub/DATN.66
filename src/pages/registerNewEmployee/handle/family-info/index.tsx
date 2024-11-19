import {
  deleteEmployeeRelativeById,
  deleteEmployeeRelativeByIdParent,
  getEmployeeRelativeByEmployeeId,
  getEmployeeRelativeByEmployeeIds,
} from '@/api/employee/employee.api';
import { useLocale } from '@/locales';
import { formatDate } from '@/utils/formatDate';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { message as $messase } from 'antd';
import MyTable from '@/components/core/table';
import RelativeForm from './RelativeForm';
const FamilyInfo = ({
  isViewMode,
  isCreatingEmployee,
  idRegisterNewEmployee,
  setDataParent,
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
  const handleDelete = async (id: number) => {
    setLoading(true);
    const res = await deleteEmployeeRelativeByIdParent(id);
    if (res) {
      const res = await getEmployeeRelativeByEmployeeIds(idRegisterNewEmployee);
      setEmployeeFamilyInfo(res?.result);
      setDataParent(res.result);
      setForceUpdate(!forceUpdate);
      setLoading(false);
      $messase.success('Xoá thành công');
      return;
    }
  };
  useEffect(() => {
    _getEmployeeRelativeByEmployeeId(idRegisterNewEmployee);
  }, [idRegisterNewEmployee]);
  const _getEmployeeRelativeByEmployeeId = async (id: number) => {
    const res = await getEmployeeRelativeByEmployeeIds(id);
    setLoading(true);
    if (res) {
      setEmployeeFamilyInfo(res.result);
      setDataParent(res.result);
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
    {
      title: 'Nghề nghiệp',
      dataIndex: 'job',
      key: 'job',
      width: 120,
      align: 'center',
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 100,
      align: 'center',
    },
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
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 100,
      align: 'center',
    },
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
              <EditOutlined
                style={{ fontSize: '14px', color: '#0960bd' }}
                onClick={() => handleEdit(item.id)}
              />

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
        _getEmployeeRelativeByEmployeeId={_getEmployeeRelativeByEmployeeId}
      />
    </>
  );
};
export default FamilyInfo;
