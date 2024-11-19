import { Tabs, TabsProps, message, message as $message } from 'antd';
import Info from '../info';
import Shift from '../shifts';
import Leave from '../leave';
import Explaintation from '../explaintation';
import { SetStateAction, useEffect, useState } from 'react';
import './style.css';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import { setSelectedShifts } from '@/stores/shifts.store'; //clearSelectedShifts,
import { formatDate } from '@/utils/formatDate';
import {
  IGetAttendanceDetails,
  IGetAttendanceDetailsParams,
} from '@/interface/weeklyreport/type';
import { getAttendanceDetailById } from '@/api/weeklyreport/weeklyreport';
import { useDispatch, useSelector } from 'react-redux';
import { setDetailAttendanceItem } from '@/stores/detail-attendance.store';
import moment from 'moment';
interface tabsProps {
  setForceUpdate: any;
  forceUpdate: boolean;
}
const index = (props: tabsProps) => {
  const { setForceUpdate, forceUpdate } = props;
  // ================================
  // State
  // ================================
  const [currentTabIndex, setCurrentTabIndex] = useState(1);
  const [foreUpdateLeave, setForceUpdateLeave] = useState(false);
  const [foreUpdateShift, setForceUpdateShift] = useState(false);
  const { selectedShift, message } = useSelector(state => state.shifts);
  let is_general_manager = localStorage.getItem('is_general_manager');
  let is_head_of_department = localStorage.getItem('is_head_of_department');
  let is_department_secretary = localStorage.getItem('is_department_secretary');
  const shouldShowShiftTab =
    is_general_manager === 'true' ||
    is_department_secretary === 'true' ||
    is_head_of_department === 'true';

  const dispatch = useDispatch();
  
  const is_administrative = localStorage.getItem('is_administrative');
  const employee_ho = localStorage.getItem('employee_ho');
  const sub_admin_role = localStorage.getItem('sub_admin_role');
  const shouldShowExplainTab =
  (is_administrative === "true" || sub_admin_role !== "none") || employee_ho === 'true';
  // ================================
  // Selectors
  // ================================
  const {
    id,
   
  } = useSelector(state => state.weekly);


  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 16,
          }}>
          Thông tin
        </span>
      ),
      children: (
        <Info
          currentTabIndex={currentTabIndex}
          forceUpdate={forceUpdate}
          foreUpdateLeave={foreUpdateLeave }
          setForceUpdateLeave={setForceUpdateLeave}
        />
      ),
    },
    {
      key: '2',
      label: (
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 16,
          }}>
          Sửa ca
        </span>
      ),
      children: shouldShowShiftTab ? (
        <Shift
          currentTabIndex={currentTabIndex}
          setForceUpdate={setForceUpdate}
          forceUpdate={forceUpdate}
          forceUpdateShift={foreUpdateShift}
          setForceUpdateShift={setForceUpdateShift}
        />
      ) : null,
    },
    {
      key: '3',
      label: (
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 16,
          }}>
          Đơn
        </span>
      ),
      children: (
        <Leave
          foreUpdateLeave={foreUpdateLeave}
          setForceUpdateLeave={setForceUpdateLeave}
        />
      ),
    },
  ];
  // ================================
  // Handler
  // ================================
  if (shouldShowExplainTab) {
    items.push({
      key: '4',
      label: (
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 16,
          }}>
          Giải trình
        </span>
      ),
      children: (
        <Explaintation
          foreUpdateLeave={foreUpdateLeave}
          setForceUpdateLeave={setForceUpdateLeave}
        />
      ),
    });
  }
  const onChange = (key: string) => {
    console.log('selectedShift', selectedShift);
    setCurrentTabIndex(Number(key));
    setForceUpdateLeave(!foreUpdateLeave);
    setForceUpdateShift(!foreUpdateShift);
  };
  // const getAttendanceByIdAsync = async () => {
  //   // store.dispatch(
  //   //   setGlobalState({
  //   //     loading: true,
  //   //   })
  //   // );
  //   const args: number[] = [id!];
  //   const params: IGetAttendanceDetailsParams = {
  //     args,
  //   };
  //   const body: IGetAttendanceDetails = {
  //     params,
  //   };
  //   const res = (await getAttendanceDetailById(body)) as any;
  //   if (res) {
  //     if (res?.result) {
  //       // store.dispatch(
  //       //   setGlobalState({
  //       //     loading: false,
  //       //   })
  //       // );
  //       dispatch(setDetailAttendanceItem(res?.result));
  //       localStorage.setItem('detailAttendance', JSON.stringify(res?.result));
  //       return true;
  //     }
  //   }
  //   return false;
  // };
  // // =============
  // // Hooks
  // // =============

  // useEffect(() => {
  //   console.log('currentTabIndex', currentTabIndex);
  //   if (currentTabIndex === 3 || currentTabIndex === 4) {
  //     console.log('refresh leave');
  //     getAttendanceByIdAsync();
  //   }
  // }, [id, foreUpdateLeave]);
  return (
    <Tabs
      defaultActiveKey="1"
      items={items}
      type="card"
      size="small"
      onChange={onChange}
      style={{ height: '100%' }}
      className="tabs-wrapper"
    />
  );
};

export default index;
