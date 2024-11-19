import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { formatDateSearch, getDateFromWeek } from '@/utils/common';

interface IMonthPicker {
  setDate: (value: string) => void;
}
const index = (props: IMonthPicker) => {
  const { setDate } = props;
  const [selectedMonth, setSelectedMonth] = useState('');
  // // =================================================================
  // // Dispatch
  // // =================================================================
  const dispatch = useDispatch();
  // Lấy ngày tháng hiện tại
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Lưu ý: getMonth() trả về giá trị từ 0-11

  const currentMonthString = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
  // Đặt giá trị mặc định cho datepicker là tháng hiện tại
  const logStartAndEndOfMonth = (value: string) => {
    const [year, month] = value.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 2);
    const endDate = new Date(parseInt(year), parseInt(month), 1);
    setDate(formatDateSearch(startDate.toISOString().slice(0, 10)).trim());
    // setToDate(formatDateSearch(endDate.toISOString().slice(0, 10)).trim());
  };
  useEffect(() => {
    setSelectedMonth(currentMonthString);
    logStartAndEndOfMonth(currentMonthString);
  }, [currentMonthString]);

  const onChangeDatePicker = (value: string) => {
    setSelectedMonth(value);
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
