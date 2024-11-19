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
  setEmployeeFamilyInfo,
  employeeFamilyInfo,
}: any) => {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [tableKey, setTableKey] = useState(1);
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [idRelative, setIdRelative] = useState<any>();
  const [form] = Form.useForm();
  const [forceUpdate, setForceUpdate] = useState(false);

 
  const handleDelete = async (name: string) => {
    setEmployeeFamilyInfo((prevState: any) =>
      prevState.filter((item: any) => item.name !== name)
    );
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
      title: 'Giảm trừ',
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
      title: '',
      key: 'action',
      fixed: 'right',
      width: 50,
      align: 'center',
      render: (item: any) => (
        <Space size="middle">
          {!isViewMode && (
            <Space size="middle" direction="horizontal">
              <DeleteOutlined
                style={{ fontSize: '14px', color: 'red' }}
                onClick={() => handleDelete(item.name)}
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
        setEmployeeFamilyInfo={setEmployeeFamilyInfo}
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
      />
    </>
  );
};
export default FamilyInfo;
