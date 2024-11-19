import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserItem } from '@/stores/user.store';
import { formatDateSearch } from '@/utils/common';

interface IMonthPicker {
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
}

const index = (props: IMonthPicker) => {
  const { setFromDate, setToDate } = props;
  const [selectedMonth, setSelectedMonth] = useState('');

  const dispatch = useDispatch();

  // Function to get the initial date string
  const getInitialDate = () => {
    const initialDate = localStorage.getItem('initialDate');
    if (initialDate) {
      return initialDate;
    } else {
      const currentDate = new Date();
      const tenDaysAgo = new Date(currentDate);
      // tenDaysAgo.setDate(currentDate.getDate() - 10);
      const currentYear = tenDaysAgo.getFullYear();
      const currentMonth = tenDaysAgo.getMonth() + 1;
      const currentMonthString = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
      localStorage.setItem('initialDate', currentMonthString);
      return currentMonthString;
    }
  };

  // Định dạng ngày tháng hiện tại thành chuỗi "YYYY-MM"
  const currentMonthString = getInitialDate();

  // Đặt giá trị mặc định cho datepicker là tháng hiện tại
  const logStartAndEndOfMonth = (value: string) => {
    const [year, month] = value.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 2);
    const endDate = new Date(parseInt(year), parseInt(month), 1);
    setFromDate(formatDateSearch(startDate.toISOString().slice(0, 10)).trim());
    setToDate(formatDateSearch(endDate.toISOString().slice(0, 10)).trim());
  };

  useEffect(() => {
    setSelectedMonth(currentMonthString);
    logStartAndEndOfMonth(currentMonthString);
  }, [currentMonthString]);

  const onChangeDatePicker = (value: string) => {
    setSelectedMonth(value);
    localStorage.setItem('initialDate', value);
    logStartAndEndOfMonth(value);
  };

  return (
    <input
      className="datepicker"
      onChange={e => {
        onChangeDatePicker(e.target.value);
      }}
      type="month"
      name="month"
      required
      defaultValue={currentMonthString}
    />
  );
};

export default index;                                 
