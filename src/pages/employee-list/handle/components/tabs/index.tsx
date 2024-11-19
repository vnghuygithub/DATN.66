import { Form, Tabs, TabsProps } from 'antd';
import { useEffect, useState } from 'react';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import {
  IGetAttendanceDetails,
  IGetAttendanceDetailsParams,
} from '@/interface/weeklyreport/type';
import { getAttendanceDetailById } from '@/api/weeklyreport/weeklyreport';
import { useDispatch, useSelector } from 'react-redux';
import { setDetailAttendanceItem } from '@/stores/detail-attendance.store';
import PersonalInfo from './components/personal-info';
import WorkInfo from './components/work-info';
import FamilyInfo from './components/family-info';

const index = ({ employeeRelativeInfo, forceUpdate, setForceUpdate, isViewMode, isCreatingEmployee, idEmployee, form, countryId, districtId, wardId }: any) => {
  // ================================
  // State
  // ================================
  const [currentTabIndex, setCurrentTabIndex] = useState(1);
  const dispatch = useDispatch();

  // ================================
  // Selectors
  // ================================
  const { id } = useSelector(state => state.weekly);
  
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
          Thông tin công việc
        </span>
      ),
      children: <WorkInfo isCreatingEmployee={isCreatingEmployee} />,
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
          Thông tin cá nhân
        </span>
      ),
      children: (
        <PersonalInfo idEmployee={idEmployee} form={form} countryId={countryId} districtId={districtId} wardId={wardId} />
      ),
    },
  ];
  !isCreatingEmployee && items.push({
    key: '3',
    label: (
      <span
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 16,
        }}>
        Thông tin thân nhân
      </span>
    ),
    children: (
      <FamilyInfo idEmployee={idEmployee} isCreatingEmployee={isCreatingEmployee} isViewMode={isViewMode} familyInfo={employeeRelativeInfo} setForceUpdate={setForceUpdate} />
    ),
  });
  // ================================
  // Handler
  // ================================
  const onChange = (key: string) => {
    setCurrentTabIndex(Number(key));
  };
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
