import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { FC } from 'react';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { useState, useEffect } from 'react';
import {
  ITRStateArgs,
  ITRStates,
} from '@/interface/timerecorderstate/time_recorder_state';
import { getTRStateByArgs } from '@/api/time_recorder_state/timerecorderstate';
import { ColumnType } from 'antd/lib/table';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import SearchTRState from '../components/search';
import SearchTRStateMis from '../components/search-mis';
const TimeRecorderState: FC = () => {
  const [forceUpdate, setForceUpdate] = useState(false);
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [month, setMonth] = useState<any>('');
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const _getTRStateByArgs = async (params: ITRStateArgs) => {
    store.dispatch(setGlobalState({ loading: true }));
    const res = await getTRStateByArgs(params);
    console.log(res);

    if (res) {
      store.dispatch(setGlobalState({ loading: false }));
      return res;
    }
  };

  const getDaysInMonth = (year: number, month: number): number => {
    const thirtyOneDaysMonths = [0, 2, 4, 6, 7, 9, 11];
    const thirtyDaysMonths = [3, 5, 8, 10];

    if (thirtyOneDaysMonths.includes(month - 1)) {
      return 31;
    } else if (thirtyDaysMonths.includes(month - 1)) {
      return 30;
    } else {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
    }
  };

  const getDayOfWeek = (year: number, month: number, day: number): number => {
    return new Date(year, month - 1, day).getDay();
  };

  type AlignType = 'left' | 'right' | 'center' | undefined;

  const generateColumns = () => {
    var dateParts = month.split('/');
    var months = dateParts[1];
    var year = dateParts[2];
    console.log('Tháng: ' + months);
    console.log('Năm: ' + year);
    const daysInMonth = getDaysInMonth(year, months);

    const columns: ColumnType<ITRStates>[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = getDayOfWeek(year, months, day);
      const dayOfWeekString = [
        'Chủ Nhật',
        'Thứ Hai',
        'Thứ Ba',
        'Thứ Tư',
        'Thứ Năm',
        'Thứ Sáu',
        'Thứ Bảy',
      ][dayOfWeek];
      const paddedDay = day.toString().padStart(2, '0');

      columns.push({
        title: `${dayOfWeekString} (${paddedDay}/${months})`,
        dataIndex: `day_${day}`,
        key: `day_${day}`,
        width: 80,
        align: 'center' as AlignType,
        render: (text, record) => {
          // console.log(record);
          const isActive = record.dates_and_states.some(
            (dateState: any) =>
              dateState.state === 'T' &&
              dateState.date ===
                `${year}-${months
                  .toString()
                  .padStart(2, '0')}-${paddedDay} 00:00:00`
          );

          const isNotActive = record.dates_and_states.some(
            (dateState: any) =>
              dateState.state === 'F' &&
              dateState.date ===
                `${year}-${months
                  .toString()
                  .padStart(2, '0')}-${paddedDay} 00:00:00`
          );

          if (!isActive && !isNotActive) {
            return null;
          }

          return (
            <span style={{ color: isActive ? 'green' : 'red', fontSize: 18 }}>
              {isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            </span>
          );
        },
      });
    }
    return columns;
  };

  const tableColumns: MyPageTableOptions<ITRStates> = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      fixed: 'left',
      align: 'center',
    },
    {
      title: 'Mã máy',
      dataIndex: 'time_recorder_id',
      key: 'time_recorder_id',
      width: 180,
      fixed: 'left',
      align: 'center',
    },
    {
      title: 'Tên máy',
      dataIndex: 'work_address',
      key: 'work_address',
      width: 100,
      fixed: 'left',
      align: 'center',
    },
    {
      title: 'Địa chỉ IP',
      dataIndex: 'address_ip',
      key: 'address_ip',
      width: 190,
      fixed: 'left',
      align: 'center',
    },
    {
      title: 'Kết nối',
      dataIndex: 'connection',
      key: 'connection',
      width: 180,
      fixed: 'left',
      align: 'center',
    },
    ...generateColumns(),
  ];

  return (
    <>
      <MyPage
        title="Danh sách trạng thái máy chấm công"
        pageApi={_getTRStateByArgs}
        tableOptions={tableColumns}
        forceUpdate={forceUpdate}
        searchRender={<SearchTRStateMis setMonth={setMonth} />}
        setSelectedRowData={setSelectedRowArr}
        selectedRowArr={selectedRowArr}

        forceClearSelection={forceClearSelection}
        multipleSelection
      />
    </>
  );
};
export default TimeRecorderState;
