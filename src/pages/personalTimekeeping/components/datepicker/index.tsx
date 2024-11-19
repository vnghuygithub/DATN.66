import { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { setUserItem } from '@/stores/user.store';
import './style.css';
import { formatDateSearch, getDateFromWeek } from '@/utils/common';

interface IDatePicker {
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
}

const index = (props: IDatePicker) => {
  const { setFromDate, setToDate } = props;

  // Function to get the initial week string
  const getInitialWeek = () => {
    const initialWeek = localStorage.getItem('initialWeek');
    if (initialWeek) {
      return initialWeek;
    } else {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 10); // Trừ đi 10 ngày
      const currentWeek = moment(currentDate).format('YYYY-[W]WW');
      localStorage.setItem('initialWeek', currentWeek);
      return currentWeek;
    }
  };

  // Lấy tuần hiện tại hoặc từ localStorage
  const currentWeek = getInitialWeek();
  const [defaultYear, defaultWeek] = currentWeek.split('-W');

  const defaultStartDate = getDateFromWeek(parseInt(defaultYear), parseInt(defaultWeek), 1);
  const defaultEndDate = new Date(defaultStartDate.getTime() + 6 * 24 * 60 * 60 * 1000); // Thêm 6 ngày
  const defaultFormatValue = `${formatDateSearch(defaultStartDate.toISOString().slice(0, 10))} ~ ${formatDateSearch(defaultEndDate.toISOString().slice(0, 10))}`;
  
  const [formatValue, setFormatValue] = useState(defaultFormatValue);

  const dispatch = useDispatch();

  const onChangeDatePicker = (weekValue: string) => {
    const [year, week] = weekValue.split('-W');
    const startDate = getDateFromWeek(parseInt(year), parseInt(week), 1);
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000); // Thêm 6 ngày
    
    const newFormatValue = `${formatDateSearch(startDate.toISOString().slice(0, 10))} ~ ${formatDateSearch(endDate.toISOString().slice(0, 10))}`;
    setFormatValue(newFormatValue);
    localStorage.setItem('initialWeek', weekValue);
  };

  useEffect(() => {
    setFromDate(formatValue.split('~')[0]?.trim());
    setToDate(formatValue.split('~')[1]?.trim());
  }, [formatValue]);

  return (
    <input
      className="datepicker"
      onChange={e => {
        onChangeDatePicker(e.target.value);
      }}
      type="week"
      name="week"
      id="camp-week"
      required
      defaultValue={currentWeek}
    />
  );
};

export default index;
