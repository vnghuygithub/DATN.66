import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { useState } from 'react';
import { setGlobalState } from '@/stores/global.store';
import { FC } from 'react';
import store from '@/stores';
import {
  IEmployeeByLeaveArgs,
  calculateEmployeeByLeave,
  getEmployeeByLeave,
  getEmployeeByLeaveLogs,
} from '@/api/employee/employeeByLeave.api';
import { IEmployeeByLeave } from '@/interface/leaveManagement';
import { formatDate } from '@/utils/formatDate';
import SearchEmployeeByLeave from '../components/search';
import { IEmployeeLog } from '@/interface/employees/employee';
import { title } from 'process';
import { Form, Space, Button, message, message as $message } from 'antd';
import { useLocale } from '@/locales';
import { EditOutlined } from '@ant-design/icons';
import FileForm from '../handle/fileForm';
import FormCl from '../handle/index';
import SearchEmployeeByLeaveMis from '../components/search-mis';

const EmployeeByLeave: FC = () => {
  const [forceUpdate, setForceUpdate] = useState(false);
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [importOpen, setImportOpen] = useState(false);
  const [idCl, setIdCl] = useState<any>(undefined);
  const _getEmployeeByLeaveByArgs = async (params: IEmployeeByLeaveArgs) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getEmployeeByLeave(params);
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };
  const _getEmployeeByLeaveLogs = async (params: IEmployeeLog) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getEmployeeByLeaveLogs(params);
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };

  const showDrawerImport = () => {
    setImportOpen(true);
  };

  const handleImport = () => {
    showDrawerImport();
  };

  const tableColumns: MyPageTableOptions<IEmployeeByLeave> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'id',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Ngày tính bù',
      dataIndex: 'date_calculate',
      key: 'date_calculate',
      width: 120,
      align: 'center',
      fixed: 'left',

    },
    {
      title: 'Mã nhân sự',
      dataIndex: 'employee_code',
      key: 'employee_code',
      width: 120,
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
    {
      title: 'Ngày vào làm',
      dataIndex: 'workingday',
      key: 'workingday',
      width: 150,
      align: 'center',
      // render: (item: string) => {
      //     return (
      //         <span>{item && formatDate(item)}</span>
      //     )
      // }
    },
    {
      title: 'Cấp bậc',
      dataIndex: 'tier',
      key: 'tier',
      width: 150,
      align: 'center',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department_name',
      key: 'department_name',
      width: 330,
      align: 'center',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'job_title',
      key: 'job_title',
      width: 330,
      align: 'center',
    },
    {
      title: 'Ngày nghỉ việc',
      dataIndex: 'severance_day',
      key: 'severance_day',
      width: 120,
      align: 'center',
      // render: (item: string) => {
      //     return (
      //         <span>{item && formatDate(item)}</span>
      //     )
      // }
    },
    {
      title: 'Ngày ký HĐLĐ',
      dataIndex: 'date_sign',
      key: 'date_sign',
      width: 120,
      align: 'center',
      // render: (item: string) => {
      //     return (
      //         <span>{item && formatDate(item)}</span>
      //     )
      // }
    },
    {
      title: 'Loại hợp đồng',
      dataIndex: 'contract_type_name',
      key: 'contract_type_name',
      width: 170,
      align: 'center',
    },
    {
      title: 'Tháng 1',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Phát sinh tăng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'increase_probationary_1',
              key: 'increase_probationary_1',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'increase_official_1',
              key: 'increase_official_1',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Sử dụng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'used_probationary_1',
              key: 'used_probationary_1',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'used_official_1',
              key: 'used_official_1',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Tăng ca',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'overtime_probationary_1',
              key: 'overtime_probationary_1',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'overtime_official_1',
              key: 'overtime_official_1',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Tháng 2',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Phát sinh tăng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'increase_probationary_2',
              key: 'increase_probationary_2',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'increase_official_2',
              key: 'increase_official_2',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Sử dụng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'used_probationary_2',
              key: 'used_probationary_2',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'used_official_2',
              key: 'used_official_2',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Tăng ca',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'overtime_probationary_2',
              key: 'overtime_probationary_2',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'overtime_official_2',
              key: 'overtime_official_2',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Tháng 3',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Phát sinh tăng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'increase_probationary_3',
              key: 'increase_probationary_3',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'increase_official_3',
              key: 'increase_official_3',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Sử dụng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'used_probationary_3',
              key: 'used_probationary_3',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'used_official_3',
              key: 'used_official_3',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Tăng ca',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'overtime_probationary_3',
              key: 'overtime_probationary_3',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'overtime_official_3',
              key: 'overtime_official_3',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Tháng 4',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Phát sinh tăng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'increase_probationary_4',
              key: 'increase_probationary_4',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'increase_official_4',
              key: 'increase_official_4',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Sử dụng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'used_probationary_4',
              key: 'used_probationary_4',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'used_official_4',
              key: 'used_official_4',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Tăng ca',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'overtime_probationary_4',
              key: 'overtime_probationary_4',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'overtime_official_4',
              key: 'overtime_official_4',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Tháng 5',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Phát sinh tăng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'increase_probationary_5',
              key: 'increase_probationary_5',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'increase_official_5',
              key: 'increase_official_5',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Sử dụng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'used_probationary_5',
              key: 'used_probationary_5',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'used_official_5',
              key: 'used_official_5',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Tăng ca',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'overtime_probationary_5',
              key: 'overtime_probationary_5',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'overtime_official_5',
              key: 'overtime_official_5',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Tháng 6',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Phát sinh tăng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'increase_probationary_6',
              key: 'increase_probationary_6',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'increase_official_6',
              key: 'increase_official_6',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Sử dụng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'used_probationary_6',
              key: 'used_probationary_6',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'used_official_6',
              key: 'used_official_6',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Tăng ca',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'overtime_probationary_6',
              key: 'overtime_probationary_6',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'overtime_official_6',
              key: 'overtime_official_6',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Tháng 7',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Phát sinh tăng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'increase_probationary_7',
              key: 'increase_probationary_7',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'increase_official_7',
              key: 'increase_official_7',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Sử dụng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'used_probationary_7',
              key: 'used_probationary_7',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'used_official_7',
              key: 'used_official_7',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Tăng ca',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'overtime_probationary_7',
              key: 'overtime_probationary_7',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'overtime_official_7',
              key: 'overtime_official_7',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Tháng 8',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Phát sinh tăng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'increase_probationary_8',
              key: 'increase_probationary_8',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'increase_official_8',
              key: 'increase_official_8',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Sử dụng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'used_probationary_8',
              key: 'used_probationary_8',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'used_official_8',
              key: 'used_official_8',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Tăng ca',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'overtime_probationary_8',
              key: 'overtime_probationary_8',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'overtime_official_8',
              key: 'overtime_official_8',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Tháng 9',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Phát sinh tăng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'increase_probationary_9',
              key: 'increase_probationary_9',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'increase_official_9',
              key: 'increase_official_9',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Sử dụng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'used_probationary_9',
              key: 'used_probationary_9',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'used_official_9',
              key: 'used_official_9',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Tăng ca',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'overtime_probationary_9',
              key: 'overtime_probationary_9',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'overtime_official_9',
              key: 'overtime_official_9',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Tháng 10',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Phát sinh tăng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'increase_probationary_10',
              key: 'increase_probationary_10',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'increase_official_10',
              key: 'increase_official_10',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Sử dụng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'used_probationary_10',
              key: 'used_probationary_10',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'used_official_10',
              key: 'used_official_10',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Tăng ca',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'overtime_probationary_10',
              key: 'overtime_probationary_10',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'overtime_official_10',
              key: 'overtime_official_10',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Tháng 11',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Phát sinh tăng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'increase_probationary_11',
              key: 'increase_probationary_11',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'increase_official_11',
              key: 'increase_official_11',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Sử dụng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'used_probationary_11',
              key: 'used_probationary_11',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'used_official_11',
              key: 'used_official_11',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Tăng ca',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'overtime_probationary_11',
              key: 'overtime_probationary_11',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'overtime_official_11',
              key: 'overtime_official_11',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Tháng 12',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Phát sinh tăng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'increase_probationary_12',
              key: 'increase_probationary_12',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'increase_official_12',
              key: 'increase_official_12',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Sử dụng',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'used_probationary_12',
              key: 'used_probationary_12',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'used_official_12',
              key: 'used_official_12',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
        {
          title: 'Tăng ca',
          width: 100,
          align: 'center',
          children: [
            {
              title: 'Thử việc',
              dataIndex: 'overtime_probationary_12',
              key: 'overtime_probationary_12',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
            {
              title: 'Chính thức',
              dataIndex: 'overtime_official_12',
              key: 'overtime_official_12',
              width: 100,
              align: 'center',
              render: (item: number) => {
                return <span>{item && item.toFixed(1)}</span>;
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Tổng tăng(Phút)',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Thử việc',
          dataIndex: 'total_increase_probationary',
          key: 'total_increase_probationary',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(1)}</span>;
          },
        },
        {
          title: 'Chính thức',
          dataIndex: 'total_increase_official',
          key: 'total_increase_official',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(1)}</span>;
          },
        },
        {
          title: 'TV-OVT',
          dataIndex: 'total_increase_tv_ovt',
          key: 'total_increase_tv_ovt',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(1)}</span>;
          },
        },
        {
          title: 'CT-OVT',
          dataIndex: 'total_increase_ct_ovt',
          key: 'total_increase_ct_ovt',
          width: 100,
          align: 'center',
          render: (item: number) => {
            return <span>{item && item.toFixed(1)}</span>;
          },
        },
      ],
    },
    {
      title: 'Tổng dùng(Phút)',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Thử việc',
          width: 100,
          align: 'center',
          dataIndex: 'total_used_probationary',
          key: 'total_used_probationary',
          render: (item: number) => {
            return <span>{item && item.toFixed(1)}</span>;
          },
        },
        {
          title: 'Chính thức',
          width: 100,
          align: 'center',
          dataIndex: 'total_used_official',
          key: 'total_used_official',
          render: (item: number) => {
            return <span>{item && item.toFixed(1)}</span>;
          },
        },
      ],
    },
    {
      title: 'Còn lại(Phút)',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Thử việc',
          width: 100,
          align: 'center',
          dataIndex: 'remaining_probationary_minute',
          key: 'remaining_probationary_minute',
          render: (item: number) => {
            return <span>{item && item.toFixed(1)}</span>;
          },
        },
        {
          title: 'Chính thức',
          width: 100,
          align: 'center',
          dataIndex: 'remaining_official_minute',
          key: 'remaining_official_minute',
          render: (item: number) => {
            return <span>{item && item.toFixed(1)}</span>;
          },
        },
        {
          title: 'Còn lại',
          width: 100,
          align: 'center',
          dataIndex: 'remaining_total_minute',
          key: 'remaining_total_minute',
          render: (item: number) => {
            return <span>{item && item.toFixed(1)}</span>;
          },
        },
      ],
    },
    {
      title: 'CL còn lại(Ngày)',
      width: 100,
      align: 'center',
      children: [
        {
          title: 'Thử việc',
          width: 100,
          align: 'center',
          dataIndex: 'remaining_probationary_day',
          key: 'remaining_probationary_day',
          render: (item: number) => {
            return <span>{item && item.toFixed(1)}</span>;
          },
        },
        {
          title: 'Chính thức',
          width: 100,
          align: 'center',
          dataIndex: 'remaining_official_day',
          key: 'remaining_official_day',
          render: (item: number) => {
            return <span>{item && item.toFixed(1)}</span>;
          },
        },
        {
          title: 'Còn lại',
          width: 100,
          align: 'center',
          dataIndex: 'remaining_total_day',
          key: 'remaining_total_day',
          render: (item: number) => {
            return <span>{item && item.toFixed(1)}</span>;
          },
        },
      ],
    },
    {
      title: 'Ghi chú',
      width: 100,
      align: 'center',
      dataIndex: 'note',
      key: 'note',
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
  const handleEdit = (id: number) => {
    setIdCl(id);
    showDrawer();
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setImportOpen(false);
  };
  let is_general_manager = localStorage.getItem('is_general_manager');
  const handleCalculate = async () => {
    const res = await calculateEmployeeByLeave();
    if (res) {
      setForceUpdate(!forceUpdate);
      $message.success(
        'Tính toán thành công và ngày tính toán là ' +
          res.result.date_calculate && formatDate(res.result.date_calculate)
      );
      return res;
    }
  };
  return (
    <>
      <MyPage
        rowkey="id"
        pageApi={_getEmployeeByLeaveByArgs}
        // logData={_getEmployeeByLeaveLogs}
        title={'Quản lý bù'}
        searchRender={<SearchEmployeeByLeaveMis />}
        tableOptions={tableColumns}
        forceUpdate={forceUpdate}
        slot={
          is_general_manager === 'true' && (
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
      <FormCl
        form={form}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        open={open}
        idCl={idCl}
        showDrawer={showDrawer}
        onClose={onClose}
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

export default EmployeeByLeave;
