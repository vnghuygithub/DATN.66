import React, { useEffect, useState } from 'react';

import MyPage, { MyPageTableOptions } from '@/components/business/page';

import { Button, Form, Space, Tag } from 'antd';
import { IViolationList } from '@/interface/violation/type'; 


import {  deleteViolationById , getViolationList } from '@/api/kpi/violation.api';
import { formatDate, formatDateLeave } from '@/utils/formatDate';
import { message as $message } from 'antd';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { EditOutlined } from '@ant-design/icons';
import { useLocale } from '@/locales';
import { create } from 'lodash';
import ViolationConfigForm from '../handle/index';
import { getListEmployeeV2 } from '@/api/employee/employee.api';
import SearchViolationConfig from '../components/search';



const index = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [foceUpdate, setFoceUpdate] = useState(false);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [leaveData, setLeaveData] = useState<any>(null);
  const [idViolation, setIdViolation] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState<any[]>([]);

  // useEffect(() => {
  //   getListEmployeeV2().then((res) => {
  //     if (res) {
  //       setEmployee(res);
  //     }
  //   });
  // }, []);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);

  };

  const handleCreate = () => {
    showDrawer();
    setIdViolation(-1);
  };

  const handleEdit = (id: any) => {
    showDrawer();
    setIdViolation(id);
  }

  const  handleDelete = async() => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn dòng để xoá');
      return;
    }
    // const ids = selectedRowArr.map((item) => item.id);
    
    const ids = selectedRowArr.map((item: any) => item.id);
    await Promise.all(ids.map((id) => deleteViolationById(id))).then((res) => {
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
    // deleteShiftById(ids).then((res) => {
    //   if (res.status === 1) {
    //     $message.success('Xoá thành công');
    //     setForceClearSelection(true);
    //     setFoceUpdate(!foceUpdate);
    //   } else {
    //     $message.error('Xoá thất bại');
    //   }
    // });
  }

  const tableColums: MyPageTableOptions<IViolationList> = [
    
    
    {
      title: 'Tên vi phạm',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      align: 'left',
    },

    {
      title: 'Hình thức xử lý',
      // dataIndex: 'default_violation_type',
      key: 'default_violation_type',
      width: 120,
      align: 'left',
      render: ( item ) => (
        <div>
          {item.default_violation_type == "1" ? (
            <div>Trừ tiền </div> 
          ) : item.default_violation_type == "2" ? (
            <div>Tỷ lệ</div>
          ) : item.default_violation_type == "3" ? (
            <div>Đền bù</div>
            ) : (<div>Sa thải</div>) }
        </div>
      )
    },
    
    {
      title: 'Mức độ vi phạm',
      dataIndex: 'default_violation_level',
      key: 'default_violation_level',
      width: 100,
      align: 'left',
    },
    
    {
      title: t({ id: 'action' }),
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (item) => (
        <Space size="middle">
          <EditOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleEdit(item.id)}
          />
        </Space>

      )
    }
  ];


  return (
    <>
      <MyPage
        rowkey="id"
        pageApi={getViolationList}
        title={'Danh sách KPI Hr'}
        tableOptions={tableColums}
        forceUpdate={foceUpdate}
        setSelectedRowData={setSelectedRowArr}
        selectedRowArr={selectedRowArr}

        multipleSelection
        forceClearSelection={forceClearSelection}
        searchRender={<SearchViolationConfig />}
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
      <ViolationConfigForm
      form={form}
      onClose={onClose}
      open={open}
      idKpi={idViolation}
      forceUpdate={foceUpdate}
      showDrawer={showDrawer}
      setForceUpdate={setFoceUpdate}
      
    />
      
    </>
  );
}

export default index;