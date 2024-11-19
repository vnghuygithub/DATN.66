import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { useState } from 'react';

import { FC } from 'react';
import {
  IAl,
  calculateEmployeeLeave,
  getEmployeeLeaveList,
  getLeaveLogs,
} from '@/api/employee/leave.api';
import {
  ILeaveAllocationArgs,
  ILeaveManagement,
  ILeaveManagementArgs,
} from '@/interface/leaveManagement';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import SearchLeaveManagement from '../components/search';
import SearchLeaveManagementMis from '../components/search-mis';
import { useEffect } from 'react';

import { formatDate } from '@/utils/formatDate';
import { Button, Form, Space, Spin, message } from 'antd';
import { LocaleFormatter, useLocale } from '@/locales';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import FormLeave from '../handle';
import { IEmployeeLog } from '@/interface/employees/employee';
import FileForm from '../handle/fileForm';

const leaveManagement: FC = () => {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [forceUpdate, setForceUpdate] = useState(false);

  const [importOpen, setImportOpen] = useState(false);
  const [idLeave, setIdLeave] = useState<any>(undefined);
  const _getLeaveLogs = async (args: IEmployeeLog) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getLeaveLogs(args);
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };
  const _getLeaveManagementByArgs = async (args: ILeaveManagementArgs) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getEmployeeLeaveList(args);
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };

  const handleEdit = (id: number) => {
    setIdLeave(id);
    showDrawer();
  };
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setImportOpen(false);
  };

  const showDrawerImport = () => {
    setImportOpen(true);
  };

  const handleImport = () => {
    showDrawerImport();
  };

  const tableColums: MyPageTableOptions<IAl> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Ngày tính phép',
      dataIndex: 'date_calculate_leave',
      key: 'date_calculate_leave',
      width: 120,
      align: 'center',
      fixed: 'left',

      render: (item: string) => {
        return <span>{item && formatDate(item)}</span>;
      },
    },
    {
      title: 'Thông Tin Nhân Viên',
      width: 150,
      align: 'center',
      children: [
        {
          title: 'Mã NS',
          dataIndex: 'employee_code',
          key: 'employee_code',
          width: 150,
          align: 'center',
          fixed: 'left',
        },
        {
          title: 'Họ và tên',
          dataIndex: 'employee_name',
          key: 'employee_name',
          width: 200,
          align: 'center',
          fixed: 'left',
        },
        // {
        //     title: "Công ty",
        //     dataIndex: "company_name",
        //     key: "company_name",
        //     width: 150,
        //     align: "center",
        // },
        {
          title: 'Phòng ban',
          dataIndex: 'department_name',
          key: 'department_name',
          width: 330,
          align: 'center',
        },
        {
          title: 'Chức Vụ',
          dataIndex: 'job_title',
          key: 'job_title',
          width: 330,
          align: 'center',
        },
        {
          title: 'Chuẩn ngày',
          dataIndex: 'standard_day',
          key: 'standard_day',
          width: 100,
          align: 'center',
        },
      ],
    },
    {
      title: 'Ngày tháng',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Ngày vào',
          dataIndex: 'workingday',
          key: 'workingday',
          width: 120,
          align: 'center',
          render: (item: string) => {
            return <span>{item && formatDate(item)}</span>;
          },
        },
        {
          title: 'Ngày ký HĐLĐ',
          dataIndex: 'date_sign',
          key: 'date_sign',
          width: 120,
          align: 'center',
          render: (item: string) => {
            return <span>{item && formatDate(item)}</span>;
          },
        },
        {
          title: 'Ngày hưởng phép năm',
          dataIndex: 'date_apply_leave',
          key: 'date_apply_leave',
          width: 170,
          align: 'center',
          render: (item: string) => {
            return <span>{item && formatDate(item)}</span>;
          },
        },
        {
          title: 'Ngày nghỉ việc',
          dataIndex: 'severance_day',
          key: 'severance_day',
          width: 120,
          align: 'center',
          render: (item: string) => {
            return <span>{item && formatDate(item)}</span>;
          },
        },
      ],
    },
    {
      title: 'Dữ liệu phép tăng theo từng tháng',
      width: 150,
      align: 'center',
      children: [
        {
          title: 'Thâm niên tính phép (Năm)',
          dataIndex: 'seniority_leave',
          key: 'seniority_leave',
          width: 120,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(1)}</span>;
          },
        },
        {
          title: 'Số ngày phép(ngày)',
          dataIndex: 'leave_day',
          key: 'leave_day',
          width: 150,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item > 0 ? Math.round(item) : 0}</span>;
          },
        },
        {
          title: 'Phép tăng theo thâm niên',
          dataIndex: 'leave_increase_by_seniority_leave',
          key: 'leave_increase_by_seniority_leave',
          width: 180,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item > 0 ? item : 0}</span>;
          },
        },
        {
          title: 'Phép hiếu hỉ',
          dataIndex: 'family_leave',
          key: 'family_leave',
          width: 160,
          align: 'center',
        },
        {
          title: 'Phép Năm(Phút)',
          dataIndex: 'leave_year',
          key: 'leave_year',
          width: 160,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item ? item.toFixed(0) : 0}</span>;
          },
        },
        {
          title: 'Phép tồn',
          dataIndex: 'remaining_leave',
          key: 'remaining_leave',
          width: 160,
          align: 'center',
        },
      ],
    },
    {
      title: 'Đã dùng theo dữ liệu chấm công hàng tháng',
      width: 150,
      align: 'center',
      children: [
        {
          title: 'Tháng 1',
          dataIndex: 'january',
          key: 'january',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(0)}</span>;
          },
        },
        {
          title: 'Tháng 2',
          dataIndex: 'february',
          key: 'february',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(0)}</span>;
          },
        },
        {
          title: 'Tháng 3',
          dataIndex: 'march',
          key: 'march',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(0)}</span>;
          },
        },
        {
          title: 'Tháng 4',
          dataIndex: 'april',
          key: 'april',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(0)}</span>;
          },
        },
        {
          title: 'Tháng 5',
          dataIndex: 'may',
          key: 'may',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(0)}</span>;
          },
        },
        {
          title: 'Tháng 6',
          dataIndex: 'june',
          key: 'june',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(0)}</span>;
          },
        },
        {
          title: 'Tháng 7',
          dataIndex: 'july',
          key: 'july',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(0)}</span>;
          },
        },
        {
          title: 'Tháng 8',
          dataIndex: 'august',
          key: 'august',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(0)}</span>;
          },
        },
        {
          title: 'Tháng 9',
          dataIndex: 'september',
          key: 'september',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(0)}</span>;
          },
        },
        {
          title: 'Tháng 10',
          dataIndex: 'october',
          key: 'october',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(0)}</span>;
          },
        },
        {
          title: 'Tháng 11',
          dataIndex: 'november',
          key: 'november',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(0)}</span>;
          },
        },
        {
          title: 'Tháng 12',
          dataIndex: 'december',
          key: 'december',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(0)}</span>;
          },
        },
      ],
    },
    {
      title: 'Tổng đã nghỉ(phút)',
      dataIndex: 'leave_used',
      key: 'leave_used',
      width: 180,
      align: 'center',
    },
    {
      title: 'Còn lại(phút)',
      dataIndex: 'remaining_leave_minute',
      key: 'remaining_leave_minute',
      width: 180,
      align: 'center',
      render: (item: number) => {
        return <span>{item && item.toFixed(0)}</span>;
      },
    },
    {
      title: 'Còn lại(Ngày)',
      dataIndex: 'remaining_leave_day',
      key: 'remaining_leave_day',
      width: 180,
      align: 'center',
      render: (item: number) => {
        return <span>{item && item.toFixed(2)}</span>;
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 100,
    },
    {
      title: t({ id: 'action' }),
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: item => (
        <Space size="middle">
          <EditOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleEdit(item.id)}
          />
        </Space>
      ),
    },
  ];
  let is_general_manager = localStorage.getItem('is_general_manager');
  const handleCalculate = async () => {
    const res = await calculateEmployeeLeave();
    if (res) {
      setForceUpdate(!forceUpdate);
      message.success(
        'Tính toán thành công và ngày tính toán là ' +
          (res.result.date_calculate_leave &&
            formatDate(res.result.date_calculate_leave))
      );
      return res;
    }
  };
  return (
    <>
      <MyPage
        // logData={_getLeaveLogs}
        pageApi={_getLeaveManagementByArgs}
        title={'Quản lý phép'}
        searchRender={<SearchLeaveManagementMis />}
        tableOptions={tableColums}
        forceUpdate={forceUpdate}
        
        slot={
          is_general_manager == 'true' && (
            <>
              <Button type="primary" onClick={handleImport}>
                Import
              </Button>
              {/* <Button type="primary" onClick={handleCalculate}>
                            Tính toán
                        </Button> */}
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
      <FormLeave
        form={form}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        open={open}
        onClose={onClose}
        idLeave={idLeave}
        showDrawer={showDrawer}
      />
    </>
  );
};

export default leaveManagement;
