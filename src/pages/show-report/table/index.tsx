import React, { useState } from 'react';
import Table from '@/containers/table-antd/index';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { setUserItem } from '@/stores/user.store';
import MonthPicker from '@/pages/monthly-report/component/monthpicker/index';
import Search from '@/containers/search-antd';
import Drawer from '@/pages/monthly-report/component/drawer/index';
import { Card } from 'antd';
const index = () => {
  // =================
  // State
  // =================
  const [dataAttendant, setDataAttendant] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  // =================================================================
  // Selector
  // =================================================================
  const { isShowInfoDrawer } = useSelector(state => state.user);
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
      <div className="month-content-container">
        <div className="col-left">
          <Card style={{ marginBottom: 16 }}>
            <Search
              setDataAttendant={setDataAttendant}
              dataAttendant={dataAttendant}
              forceUpdate={forceUpdate}
              fromDate={fromDate}
              toDate={toDate}>
              <MonthPicker setFromDate={setFromDate} setToDate={setToDate} />
            </Search>
          </Card>
          <Table
            onShowInfo={onShowInfoDrawer}
            forceUpdate={forceUpdate}
            fromDate={fromDate}
            toDate={toDate}
            dataAttendant={dataAttendant}
            setDataAttendant={setDataAttendant}
            disabledButton={true}
            setForceUpdate={setForceUpdate}
          />
        </div>
        <Drawer
          onClose={onCloseInfoDrawer}
          isShow={isShowInfoDrawer}
          setForceUpdate={setForceUpdate}
          forceUpdate={forceUpdate}
        />
      </div>
    </React.Fragment>
  );
};

export default index;
