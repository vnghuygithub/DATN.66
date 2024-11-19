import React, { useEffect, useState } from 'react';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { Button, Form, Space, Tag } from 'antd';
import { IApiKpiWeeklyReportSummaryList } from '@/interface/kpiWeeklyReportSummary/type'; 
import { getKpiWeeklyReportSummary } from '@/api/kpi/kpi_weekly_report_summary.api';
import { message as $message } from 'antd';
import { useLocale } from '@/locales';
import Search from '@/containers/search';
import { Card , DatePicker , Table} from 'antd';
import SearchKpiHr from '@/pages/kpi-weekly-report-summary/components/search';
import { CheckOutlined } from '@ant-design/icons';

const index = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [foceUpdate, setFoceUpdate] = useState(false);
  const [updateState , setUpdateState] = useState<boolean>(false)
  const [dateData, setDateData] = useState<string>('');
  const [dataAttendant, setDataAttendant] = useState([]);

  const callApiSummary = async () => {
    const first_day_of_this_month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const string_first_day_of_this_month = first_day_of_this_month.getFullYear() + '-' + (first_day_of_this_month.getMonth() + 1) + '-' + first_day_of_this_month.getDate();
    try {
      const res = await getKpiWeeklyReportSummary(string_first_day_of_this_month);
      console.log(res);
      if (res) {
        setUpdateState(true)
        return res;
      }
    } catch (error) {
      $message.error('Load Data failed');
    }
  }

  useEffect(() => {
    callApiSummary().then((res :any) => {
      setDataAttendant(res.data.results.data);
      // console.log(res.data.results.data);
    })

  }, []);

   const onChangeDatePicker = (weekValue: any) => {
    const stringweekValue = weekValue._d.getFullYear() + '-' + (weekValue._d.getMonth() + 1) + '-' + "1";
    setDateData(stringweekValue);
   };

   useEffect(() => {
    getKpiWeeklyReportSummary(dateData).then((res :any) => {
      console.log(res.results.data);
      setDataAttendant(res.results.data);
    })  
  }, [dateData]);


  const sharedOnCell = ( data: any, index: any) => {
    if (data.company) {
      return { colSpan: 0 };
    }
  
    return {};
  };

  const expandedRowRender = (row :any ) => {
    const columns:MyPageTableOptions<IApiKpiWeeklyReportSummaryList>  = [
      {
        title: 'Trừ tuần 1',
        dataIndex: 'compensation_amount_week_1',
        key: 'compensation_amount_week_1',
        width: 100,
        align: 'left',
      },
      {
        title: 'Trừ tuần 2',
        dataIndex: 'compensation_amount_week_2',
        key: 'compensation_amount_week_2',
        width: 100,
        align: 'left',

      },
      {
        title: 'Trừ tuần 3',
        dataIndex: 'compensation_amount_week_3',
        key: 'compensation_amount_week_3',
        width: 100,
        align: 'left',

      },
      {
        title: 'Trừ tuần 4',
        dataIndex: 'compensation_amount_week_4',
        key: 'compensation_amount_week_4',
        width: 100,
        align: 'left',

      },
      {
        title: 'Trừ tuần 5',
        dataIndex: 'compensation_amount_week_5',
        key: 'compensation_amount_week_5',
        width: 100,
        align: 'left',

      },
      {
        title:'Trừ review sách',
        dataIndex: 'book_review_compensation',
        key: 'book_review_compensation',
        width: 100,
        align: 'left',
      },
      {
      title:'Tổng tiền',
      dataIndex: 'total_compensation',
      key: 'total_compensation',
      width: 100,
      align: 'left',

      }

    ];
    const data = [row];

    // dataNested = 

    return <Table rowKey="key" columns={columns} dataSource={data} pagination={false} />;
  }

  const tableColums: MyPageTableOptions<IApiKpiWeeklyReportSummaryList> = [
    {
      title: '#',
      dataIndex: 'stt',
      key: 'stt',
      width: 50 ,
      align: 'center',

    },
    
    {
      title: 'Tên nhân viên',
      dataIndex: 'employee_name',
      key: 'employee_name',
      width: 100,
      align: 'left',
      
    },

    {
      title: 'Mã nhân viên',
      dataIndex: 'employee_code',
      key: 'employee_code',
      width: 100,
      align: 'left',
    },
    
    {
      title: 'Cấp',
      dataIndex: 'employee_level',
      key: 'employee_level',
      width: 40,
      align: 'center',
    },
    {
        title: 'Phòng ban',
        dataIndex: 'department_name',
        key: 'department_name',
        width: 100,
        align: 'left',
      },
      {
        title: 'Tuần 1',
        dataIndex: 'compensation_status_week_1',
        key: 'compensation_status_week_1',
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
          } else if (state === 'chưa gửi'){
            textColor = 'volcano';
            stateText = 'Chưa gửi';
          } else{
            stateText = '';
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
        title: 'Tuần 2',
        dataIndex: 'compensation_status_week_2',
        key: 'compensation_status_week_2',
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
          } else if (state === 'chưa gửi'){
            textColor = 'volcano';
            stateText = 'Chưa gửi';
          } else{
            stateText = '';
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
        title: 'Tuần 3',
        dataIndex: 'compensation_status_week_3',
        key: 'compensation_status_week_3',
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
          } else if (state === 'chưa gửi'){
            textColor = 'volcano';
            stateText = 'Chưa gửi';
          } else{
            stateText = '';
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
        title: 'Tuần 4',
        dataIndex: 'compensation_status_week_4',
        key: 'compensation_status_week_4',
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
          } else if (state === 'chưa gửi'){
            textColor = 'volcano';
            stateText = 'Chưa gửi';
          } else{
            stateText = '';
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
        title: 'Tuần 5',
        dataIndex: 'compensation_status_week_5',
        key: 'compensation_status_week_5',
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
          } else if (state === 'chưa gửi'){
            textColor = 'volcano';
            stateText = 'Chưa gửi';
          } else{
            stateText = '';
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
        title: 'Trạng thái review sách',
        dataIndex: 'book_review_compensation_status',
        key: 'book_review_compensation_status',
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
          } else if (state === 'chưa gửi'){
            textColor = 'volcano';
            stateText = 'Chưa gửi';
          } else{
            stateText = '';
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
        title: 'Tổng số tiền',
        dataIndex: 'total_compensation',
        key: 'total_compensation',
        width: 100,
        align: 'left',
      },
      {
        title: 'Tổng số tiền',
        dataIndex: 'total_compensation',
        key: 'total_compensation',
        width: 100,
        align: 'left',
        
      },
      {
        title:'Tính phần trăm',
        dataIndex: 'use_percentage',
        key: 'use_percentage',
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
  ];


  return (
    <>
      <MyPage
        pageApi={callApiSummary}
        title={'Danh sách cấu hình Kpi'}
        tableOptions={tableColums}
        forceUpdate={foceUpdate}
        // setSelectedRowData={setSelectedRowArr}
        // multipleSelection
        rowkey={'key'}
        // searchRender={<SearchKpiHr />}
        // forceClea'rSelection={forceClearSelection}
        updateData={"any"}
        disabledPagination={true}
        expandedRowRender={expandedRowRender}
        // forceClearSelection={forceClearSelection}
        multipleSelection
      />

{/* <React.Fragment>
      <div className="weekly-content-container">
        <div className="col-left">
          <Card style={{ marginBottom: 16 }}>
           
          <DatePicker picker='month' onChange={(e) => {
            onChangeDatePicker(e);
          }}/>
            
          </Card>
          
          <Table
            columns={tableColums}
            dataSource={dataAttendant}
            rowKey="key"
            // expandable={}
            expandedRowRender={expandedRowRender}
            bordered
          />
        </div>
      </div>
    </React.Fragment> */}
      
      
    </>
  );
}

export default index;