import { getEmployeeWeeklyReport, getOneEmployeeWeeklyReport } from '@/api/employee_weekly_report/employeeWeeklyReport.api';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import {
  IEmployeeWeeklyReport,
  IEmployeeWeeklyReportArgs,
} from '@/interface/employeeWeeklyReport/employeeWeeklyReport';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import { Button, Form, Space, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';
import { getEmployeeWeeklyReportLog } from '../../../api/employee_weekly_report/employeeWeeklyReport.api';
import EmployeeWeeklyReportSearch from '../components/search';
import WeeklyReportForm from '../handle';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useLocale } from '@/locales';
import EmployeeWeeklyReportSearchMis from '../components/search-mis';

const EmployeeWeeklyReportList: FC = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [idReport, setIdReport] = useState<any>(null);
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const _getEmployeeWeeklyReportList = async (
    params: IEmployeeWeeklyReportArgs
  ) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getEmployeeWeeklyReport(params);
    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };

  const tableColums: MyPageTableOptions<IEmployeeWeeklyReport> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      align: 'center',
      fixed: 'left',
    },
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   width: 50,
    //   align: 'center',
    // },
    {
      title: 'Mã nhân viên',
      dataIndex: 'employee_code',
      key: 'employee_code',
      width: 130,
      align: 'center',
      fixed: 'left',

    },
    {
      title: 'Nhân viên',
      dataIndex: 'employee_name',
      key: 'employee_name',
      width: 150,
      align: 'center',
      fixed: 'left',

    },
    {
      title: 'Phòng ban',
      dataIndex: 'department_name',
      key: 'department_name',
      width: 530,
      align: 'center',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'job_title',
      key: 'job_title',
      width: 350,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      key: 'state',
      width: 100,
      align: 'center',
      render: (state: string) => {
        let textColor = '';
        let stateText = '';

        if (state === 'đúng giờ') {
          textColor = 'green';
          stateText = 'Đúng giờ';
        } else if (state === 'muộn giờ') {
          textColor = 'orange';
          stateText = 'Muộn giờ';
        } else {
          textColor = 'volcano';
          stateText = 'Chưa gửi';
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
      title: 'Ngày gửi báo cáo',
      dataIndex: 'create_date',
      key: 'create_date',
      width: 180,
      align: 'center',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'name',
      key: 'name',
      width: 530,
      align: 'center',
    },
    {
      title: 'Tên sách review',
      dataIndex: 'book_name',
      key: 'book_name',
      width: 120,
      align: 'center',
    },
    // {
    //     title: "File đính kèm",
    //     dataIndex: "attachment_urls",
    //     key: "attachment_urls",
    //     width: 100,
    //     align: "center",
    // },
    {
      title: t({ id: 'action' }),
      key: 'id',
      dataIndex: 'id',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: item => (
        <Space size="middle">
          <EyeOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleView(item)}
          />
        </Space>
      ),
    },
  ];
  const handleView = (id: number) => {
    setIsCreating(false);
    showDrawer();
    setIdReport(id);
    setIsView(true);
  };
  const handleCreate = () => {
    setIsCreating(true);
    showDrawer();
    setIdReport(null);
    setIsView(false);
  };
  let is_head_of_department = localStorage.getItem('is_head_of_department');
  let is_department_secretary = localStorage.getItem('is_department_secretary');
  return (
    <>
      <MyPage
        rowkey="id"
        pageApi={_getEmployeeWeeklyReportList}
        // logData={_getEmployeeWeeklyReportLog}
        searchRender={<EmployeeWeeklyReportSearchMis />}
        title="Báo cáo tuần"
        tableOptions={tableColums}
        setSelectedRowData={setSelectedRowArr}
        forceClearSelection={forceClearSelection}
        forceUpdate={forceUpdate}
        selectedRowArr={selectedRowArr}

        slot={
          <>
            <Button type="primary" onClick={handleCreate}>
              Tạo mới
            </Button>
          </>
        }
      />
      <WeeklyReportForm
        form={form}
        onClose={onClose}
        open={open}
        idReport={idReport}
        forceUpdate={forceUpdate}
        setForceUpdate={setForceUpdate}
        showDrawer={showDrawer}
        isView={isView}
        isCreating={isCreating}
      />
    </>
  );
};

export default EmployeeWeeklyReportList;
