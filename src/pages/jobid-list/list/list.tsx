import React, { useEffect, useState } from 'react';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { Button, Form, Space, Tag } from 'antd';
import { IHrJobList } from '@/interface/jobid/type';
import { getListJob } from '@/api/employee/job.api';
import { deleteJob, getListJob2, getListJobs } from '@/api/job/job.api';
import { formatDate, formatDateLeave } from '@/utils/formatDate';
import { message as $message } from 'antd';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useLocale } from '@/locales';
import { create } from 'lodash';
import JobidForm from '../handle/index';
import { getListEmployeeV2 } from '@/api/employee/employee.api';
import SearchKpiHr from '../components/search';
import moment from 'moment';
import SearchJobs from '../components/search';
import SearchJobsMis from '../components/search-mis';
import { IJobV2 } from '@/api/job/transform';

const index = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [foceUpdate, setFoceUpdate] = useState(false);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [idJob, setIdJob] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [updateState, setUpdateState] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [employee, setEmployee] = useState<any[]>([]);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    showDrawer();
    setIdJob(-1);
    setUpdateState(false);
    setIsView(false);
  };

  const handleEdit = (id: any) => {
    showDrawer();
    setIdJob(id);
    setUpdateState(true);
    setIsView(false);
  };

  const fetchEmplohee = async () => {
    const res = await getListEmployeeV2();
    if (res) {
      setEmployee(res.result.result);
      return res;
    }
  };
  useEffect(() => {
    fetchEmplohee();
  }, [setFoceUpdate]);
  const handleDelete = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn chức vụ để xoá');
      return;
    }
    const ids = selectedRowArr.map((item: any) => item.id);
    if (employee && employee.length > 0) {
      const check = employee.filter((item: any) =>
        ids.includes(item?.job_id[0])
      );

      if (check && check.length > 0) {
        $message.error(
          'Không thể xoá chức vụ vì đang tồn tại nhân viên có chức vụ này !'
        );
        setFoceUpdate(!foceUpdate);
        setSelectedRowArr([]);
        setForceClearSelection(!forceClearSelection);
        store.dispatch(setGlobalState({ loading: false }));
        return;
      }
      await Promise.all(ids.map(id => deleteJob(id)))
        .then(res => {
          if (res) {
            $message.success('Xoá thành công');
            setFoceUpdate(!foceUpdate);
            setSelectedRowArr([]);
            setForceClearSelection(!forceClearSelection);
            store.dispatch(setGlobalState({ loading: false }));
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const sharedOnCell = (data: any, index: any) => {
    if (data.company) {
      return { colSpan: 0 };
    }

    return {};
  };

  const tableColums: MyPageTableOptions<IJobV2> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      align: 'center',
    },
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   width: 100,
    //   align: 'center',
    // },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 330,
      align: 'center',
    },

    {
      title: "Công ty",
      dataIndex: "mis_id",
      key: "mis_id",
      width: 70,
      align: "center",
      // render:(value, record, index)=>{
      //     console.log(record)
      //     return record?.mis_id
      // }

  },
    {
      title: 'Phòng ban',
      dataIndex: 'department_name',
      key: 'department_name',
      width: 200,
      align: 'center',
    },

    {
      title: 'Cấp bậc',
      dataIndex: 'level',
      key: 'level',
      width: 70,
      align: 'center',
    },
    {
      title: 'Loại chức vụ',
      dataIndex: 'job_type_name',
      key: 'job_type_name',
      width: 320,
      align: 'center',
    },
    // {
    //   title: 'Môi trường độc hại',
    //   dataIndex: 'is_hazardous_environment',
    //   key: 'is_hazardous_environment',
    //   width: 100,
    //   align: 'center',
    //   render: (item: any) =>
    //     item === true ? (
    //       <Tag color="green">
    //         <CheckOutlined />
    //       </Tag>
    //     ) : (
    //       <Tag color="red">
    //         <CloseOutlined />
    //       </Tag>
    //     ),
    // },
    {
      title: t({ id: 'action' }),
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      onCell: (item, rowindex) => sharedOnCell(item, rowindex),
      render: item => (
        <Space size="middle">
          {' '}
          {item.id ? (
            <EditOutlined
              style={{ fontSize: '14px', color: '#0960bd' }}
              onClick={() => handleEdit(item)}
            />
          ) : (
            <div></div>
          )}
          <EyeOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleView(item)}
          />
        </Space>
      ),
    },
  ];

  const handleView = (id: any) => {
    showDrawer();
    setIdJob(id);
    setIsView(true);
  };
  return (
    <>
      <MyPage
        pageApi={getListJobs}
        searchRender={<SearchJobsMis />}
        title={'Danh sách Chức vụ'}
        tableOptions={tableColums}
        forceUpdate={foceUpdate}
        setSelectedRowData={setSelectedRowArr}
        multipleSelection
        rowkey={'id'}
        forceClearSelection={forceClearSelection}
        selectedRowArr={selectedRowArr}

        slot={
          <>
            <Button type="primary" onClick={handleCreate}>
              {'Tạo mới'}
            </Button>
            <Button type="primary" onClick={handleDelete}>
              Xoá
            </Button>
          </>
        }
      />
      <JobidForm
        form={form}
        onClose={onClose}
        isView={isView}
        open={open}
        idKpi={idJob}
        forceUpdate={foceUpdate}
        showDrawer={showDrawer}
        setForceUpdate={setFoceUpdate}
        updateState={updateState}
      />
    </>
  );
};

export default index;
