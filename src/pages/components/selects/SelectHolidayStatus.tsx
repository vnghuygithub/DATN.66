import MyForm from '@/components/core/form';
import { departmentOptions, holidayStatusOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IHoliday {
  value: number;
  label: string;
}

const SelectHolidayStatus = ({ onChange, ...props }: any) => {

  const {checkUpdate} = props
  const [holiday, setHoliday] = useState<IHoliday[]>([]);
  const [isMounted, setIsMounted] = useState(true);
  useEffect(() => {
    setIsMounted(true);
    holidayStatusOptions().then(res => {
      if (isMounted) setHoliday(res);
    });
    return () => {
      setIsMounted(false);
    };
  }, []);
  return (
    <MyForm.Item
      options={holiday}
      label={'Loại đơn'}
      {...props}
      name="holiday_status_id"
      type="select"
      innerprops={{
        disabled: checkUpdate,
        placeholder: 'Vui lòng chọn',
        allowClear: true,
        onChange: (value: any, id: any) => {
          onChange(value, id);
        },
        onSelect: (value: any, id: any) => {
          onChange(value, id);
        },
      }}
    />
  );
};

export default SelectHolidayStatus;
