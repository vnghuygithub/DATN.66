import React, { useEffect, useState } from 'react';
import Table from '../../containers/table-test';
import { useDispatch, useSelector } from 'react-redux';
import { setUserItem } from '@/stores/user.store';
import Search from '@/containers/search';
import { Card } from 'antd';
import DatePicker from './components/datepicker';
import './index.css';
import { Form } from 'antd';
import DrawerWeeklyReport from './components/drawer copy';
const WeeklyreportTest = () => {
  const [forceUpdate, setForceUpdate] = useState(false);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [dataEmployee, setDataEmployee] = useState<any>([]);

  // =================
  // State
  // =================
  const [dataAttendant, setDataAttendant] = useState([]);
  // =================
  // =================================================================
  // Selector
  // =================================================================
  const { isShowInfoDrawer, fromToWeeklyDate } = useSelector(
    state => state.user
  );
  // =================================================================
  // Dispatch
  // =================================================================

  const dispatch = useDispatch();
  const onShowInfoDrawer = () => {
    dispatch(
      setUserItem({
        isShowInfoDrawer: true,
        collapsed: true,
      })
    );
  };
  const onCloseInfoDrawer = () => {
    dispatch(
      setUserItem({
        isShowInfoDrawer: false,
        collapsed: true,
      })
    );
  };

  return (
    <React.Fragment>
      <div className="weekly-content-container">
        <div className="col-left">
          <Card style={{ marginBottom: 16 }}>
            <Search
              setDataEmployee={setDataEmployee}
              setDataAttendant={setDataAttendant}
              dataAttendant={dataAttendant}
              forceUpdate={forceUpdate}
              fromDate={fromDate}
              toDate={toDate}>
              <DatePicker setFromDate={setFromDate} setToDate={setToDate} />
            </Search>
          </Card>
          <Table
            dataEmployee={dataEmployee}
            onShowInfo={onShowInfoDrawer}
            forceUpdate={forceUpdate}
            fromDate={fromDate}
            toDate={toDate}
            dataAttendant={dataAttendant}
            setDataAttendant={setDataAttendant}
            disabledButton={false}
            setForceUpdate={setForceUpdate}
          />
        </div>
        <DrawerWeeklyReport
          onClose={onCloseInfoDrawer}
          isShow={isShowInfoDrawer}
          // isShow={true}
          setForceUpdate={setForceUpdate}
          forceUpdate={forceUpdate}
        />
      </div>
    </React.Fragment>
  );
};

export default WeeklyreportTest;
