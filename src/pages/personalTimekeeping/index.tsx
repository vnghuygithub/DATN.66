import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserItem } from '@/stores/user.store';
// import Search from '@/containers/search';
// import { Card } from 'antd';
// import DatePicker from './components/datepicker';
import './index.css';
import Drawer from './components/component/drawer';
import TableTest from '@/containers/table-personal-timekeeping';

const PersonalTimekeeping = () => {
  const [forceUpdate, setForceUpdate] = useState(false);
 

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

  function closePopup(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <React.Fragment>
      <div className="weekly-content-container">
        <div className="col-left">
          <TableTest
            onShowInfo={onShowInfoDrawer}
            forceUpdate={forceUpdate}
            dataAttendant={dataAttendant}
            setDataAttendant={setDataAttendant}
            disabledButton={false}
            setForceUpdate={setForceUpdate}
            //pageApi={_getShiftRequests}
          />
        </div>
        <Drawer
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

export default PersonalTimekeeping;
