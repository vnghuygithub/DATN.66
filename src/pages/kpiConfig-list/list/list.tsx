import React, { useEffect, useState } from 'react';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { Button, Form, Space, Tag } from 'antd';
import { IEmpKpiConfigList} from '@/interface/employeeKpiConfig/type';
import { getListJob } from '@/api/employee/job.api';
import {getKpiEmpConfigList , deleteKpiEmpConfig} from '@/api/kpi/kpi_config.api'
import { formatDate, formatDateLeave } from '@/utils/formatDate';
import { message as $message } from 'antd';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { EditOutlined , CheckOutlined } from '@ant-design/icons';
import { useLocale } from '@/locales';
import { create } from 'lodash';
import KpiConfigForm from '../handle/index';
import { getListEmployeeV2 } from '@/api/employee/employee.api';
// import SearchKpiHr from '../components/search';
import moment from 'moment';

const index = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [foceUpdate, setFoceUpdate] = useState(false);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [leaveData, setLeaveData] = useState<any>(null);
  const [idJob, setIdJob] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState<any[]>([]);
  const [updateState , setUpdateState] = useState<boolean>(false)
  
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);

  };

  const handleCreate = () => {
    showDrawer();
    setIdJob(-1);
    setUpdateState(false)
  };

  const handleEdit = (id: any) => {
    showDrawer();
    setIdJob(id);
    setUpdateState(true)
  }

  const  handleDelete = async() => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn dòng để xoá');
      return;
    }
    
    
    const ids = selectedRowArr.map((item: any) => item.id);
    await Promise.all(ids.map((id) => deleteKpiEmpConfig(id))).then((res) => {
      if (res) {
        $message.success('Xoá thành công');
        setFoceUpdate(!foceUpdate);
        setSelectedRowArr([]);
        setForceClearSelection(!forceClearSelection);
        store.dispatch(setGlobalState({ loading: false }));
      }
    }).catch((err) => {
      console.log(err);
    })
  }
  //   deleteShiftById(ids).then((res) => {
  //     if (res.status === 1) {
  //       $message.success('Xoá thành công');
  //       setForceClearSelection(true);
  //       setFoceUpdate(!foceUpdate);
  //     } else {
  //       $message.error('Xoá thất bại');
  //     }
  //   });
  // }

  const sharedOnCell = ( data: any, index: any) => {
    if (data.company) {
      return { colSpan: 0 };
    }
  
    return {};
  };

  const tableColums: MyPageTableOptions<IEmpKpiConfigList> = [
    
    {
      title: 'Tên cấp',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      align: 'center',
      
    },
    
    {
      title: 'Cấp nhân viên',
      dataIndex: 'employee_level',
      key: 'employee_level',
      width: 100,
      align: 'center',
     
    },
    {
      title: 'Phạt đi muộn dưới 5 phút',
      dataIndex: 'late_compensation_under',
      key: 'late_compensation_under',
      width: 100,
      align: 'center',
    },
    

    {
        title: 'Phạt đi muộn trên 5 phút',
        dataIndex: 'late_compensation_over',
        key: 'late_compensation_over',
        width: 100,
        align: 'center',
      },
      {
        title: 'Phạt báo cáo tuần',
        dataIndex: 'base_weekly_report_compensation',
        key: 'base_weekly_report_compensation',
        width: 100,
        align: 'center',
      },
      {
        title: 'Phạt thiếu review sách',
        dataIndex: 'missing_review_book_compensation',
        key: 'missing_review_book_compensation',
        width: 100,
        align: 'center',
      },
      {
        title: 'tính phần trăm',
        dataIndex: 'use_percentage_weekly_report',
        key: 'use_percentage_weekly_report',
        width: 100,
        align: 'center',
        render: (item) => (
          <Space size="middle">
            {item ? (
              <CheckOutlined
                style={{ fontSize: '14px', color: '#0960bd' }}
              />
            ) : (
              <div></div>
            )}
          </Space>
        ),
      },
    {
      title: t({ id: 'action' }),
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      onCell: (item , rowindex) => (
         sharedOnCell(item, rowindex)
      ),
      render: (item) => (
        <Space size="middle"> {item.id? (<EditOutlined
          style={{ fontSize: '14px', color: '#0960bd' }}
          onClick={() => handleEdit(item.id)}
        />) : (<div></div>)}
          
          


        </Space>

      )
    }
  ];


  return (
    <>
      <MyPage
        
        pageApi={getKpiEmpConfigList}
        title={'Danh sách cấu hình Kpi'}
        tableOptions={tableColums}
        forceUpdate={foceUpdate}
        setSelectedRowData={setSelectedRowArr}
        selectedRowArr={selectedRowArr}

        multipleSelection
        rowkey={'key'}
        // searchRender={<SearchKpiHr />}
        forceClearSelection={forceClearSelection}
        slot={
          <>
            <Button type="primary" onClick={handleCreate}>
              {'Tạo mới'}
            </Button>
            <Button type='primary' onClick={handleDelete}>
              Xoá 
            </Button>
          </>
        }
        
        
        // forceClearSelection={forceClearSelection}
        // multipleSelection
      />
      <KpiConfigForm
      form={form}
      onClose={onClose}
      open={open}
      idKpi={idJob}
      forceUpdate={foceUpdate}
      showDrawer={showDrawer}
      setForceUpdate={setFoceUpdate}
      updateState = {updateState}
      
    />
      
    </>
  );
}

export default index;