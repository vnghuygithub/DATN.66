import React, { useEffect, useState } from 'react';

import MyPage, { MyPageTableOptions } from '@/components/business/page';

import { Button, Form, Space, Tag } from 'antd';
import { IKpiHrReportList } from '@/interface/kpihrreport/type';


import { getKpiHr , deleteKpiHrById } from '@/api/kpi/kpi_hr.api';
import { formatDate, formatDateLeave } from '@/utils/formatDate';
import { message as $message } from 'antd';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { EditOutlined } from '@ant-design/icons';
import { useLocale } from '@/locales';
import { create } from 'lodash';
import HrKpiForm from '../handle/index';
import { getListEmployeeV2 } from '@/api/employee/employee.api';
import SearchKpiHr from '../components/search';
import moment from 'moment';

const index = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [foceUpdate, setFoceUpdate] = useState(false);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [leaveData, setLeaveData] = useState<any>(null);
  const [idKpi, setIdKpi] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState<any[]>([]);
  const [updateState , setUpdateState] = useState<boolean>(false)
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
    setIdKpi(-1);
    setUpdateState(false)
  };

  const handleEdit = (id: any) => {
    showDrawer();
    setIdKpi(id);
    setUpdateState(true)
  }

  const  handleDelete = async() => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn dòng để xoá');
      return;
    }
    // const ids = selectedRowArr.map((item) => item.id);
    
    const ids = selectedRowArr.map((item: any) => item.id);
    await Promise.all(ids.map((id) => deleteKpiHrById(id))).then((res) => {
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

  const sharedOnCell = ( data: any, index: any) => {
    if (data.company) {
      return { colSpan: 0 };
    }
  
    return {};
  };

  const tableColums: MyPageTableOptions<IKpiHrReportList> = [
    {
      title: 'Công ty',
      dataIndex: "company",
      key: "company",
      align: 'left',
      width: 1,
      onCell: (item , rowindex) => ({
          colSpan: item.company ? 12 : 1
      }),
      render: (item:any) => {
        return (
          <div>
            {item}
          </div>
        )
      }
    },
    {
      title: 'Tên nhân viên',
      dataIndex: "employee_name",
      key: "employee_name",
      align: 'left',
      width: 100,
      onCell: (item , rowindex) => (
        sharedOnCell(item, rowindex)
     ),
    },
    {
      title: 'Mã nhân viên',
      dataIndex: "employee_code",
      key: "employee_code",
      align: 'left',
      width: 100,
      onCell: (item , rowindex) => (
        sharedOnCell(item, rowindex)
     ),
    },
    
    {
      title: 'Phòng ban',
      dataIndex: "department",
      key: "department",
      align: 'left',
      width: 100,
      onCell: (item , rowindex) => (
        sharedOnCell(item, rowindex)
     ),
    },
    
    {
      title: 'Số biên bản',
      dataIndex: 'report_serial',
      key: 'report_serial',
      width: 150,
      align: 'left',
      onCell: (item , rowindex) => (
        sharedOnCell(item, rowindex)
     ),
    },
    {
      title: 'Ngày biên bản',
      dataIndex: 'report_date',
      key: 'report_date',
      width: 120,
      align: 'left',
      onCell: (item , rowindex) => (
        sharedOnCell(item, rowindex)
     ),
    },
    {
      title: 'Loại vi phạm',
      dataIndex: 'violation',
      key: 'violation',
      width: 120,
      align: 'left',
      onCell: (item , rowindex) => (
        sharedOnCell(item, rowindex)
     ),
    },
    

    {
      title: 'Hình thức xử lý',
      // dataIndex: 'violation_type',
      key: 'violation_type',
      width: 120,
      align: 'left',
      onCell: (item , rowindex) => (
        sharedOnCell(item, rowindex)
     ),
      render: ( item ) => (
        <div>
          {item.violation_type == "1" ? (
            <div>Trừ tiền </div> 
          ) : item.violation_type == "2" ? (
            <div>Tỷ lệ</div>
          ) : item.violation_type == "3" ? (
            <div>Đền bù</div>
            ) : item.violation_type == "4" ? (
              <div>Sa thải</div>
              ) : (<div></div>
            
            )}
        </div>
      )
    },
    
    {
      title: 'Mức độ vi phạm',
      dataIndex: 'violation_level',
      key: 'violation_level',
      width: 100,
      align: 'left',
      onCell: (item , rowindex) => (
        sharedOnCell(item, rowindex)
     ),
    },
    {
      title: 'Tháng áp dụng',
      dataIndex: 'apply_date',
      key: 'apply_date',
      width: 100,
      align: 'left',
      onCell: (item , rowindex) => (
        sharedOnCell(item, rowindex)
     ),
      render: (item : any) => {
        if(item){ 
          return (
            <div>
              {moment(item, 'YYYY-MM-DD').format('MM/YYYY')}
            </div>
          )
        }
      }
    },

    {
      title: 'Tháng vi phạm',
      dataIndex: 'violation_date',
      key: 'violation_date',
      width: 100,
      align: 'left',
      onCell: (item , rowindex) => (
        sharedOnCell(item, rowindex)
     ),
      render: (item : any) => {
        if(item){
          return (
            <div>
              {moment(item, 'YYYY-MM-DD').format('MM/YYYY')}
            </div>
          )
        }
      }
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
        
        pageApi={getKpiHr}
        title={'Danh sách KPI Hr'}
        tableOptions={tableColums}
        forceUpdate={foceUpdate}
        setSelectedRowData={setSelectedRowArr}
        multipleSelection
        rowkey={'key'}
        searchRender={<SearchKpiHr />}
        forceClearSelection={forceClearSelection}
        selectedRowArr={selectedRowArr}

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
      <HrKpiForm
      form={form}
      onClose={onClose}
      open={open}
      idKpi={idKpi}
      forceUpdate={foceUpdate}
      showDrawer={showDrawer}
      setForceUpdate={setFoceUpdate}
      updateState = {updateState}
      
    />
      
    </>
  );
}

export default index;