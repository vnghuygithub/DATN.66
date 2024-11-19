import MyForm from '@/components/core/form';
import { employeeOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IEmployee {
  value: number;
  label: string;
}

const SelectDepartmentManager = ({ onChange, onSelect, ...props }: any) => {
  const [employee, setEmployee] = useState<IEmployee[]>([]);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    employeeOptions().then(res => {
      if (isMounted) {
        setEmployee(res);
      }
    });

    return () => {
      setIsMounted(false);
    };
  }, []);

  return (
    <MyForm.Item
      
      options={employee}
      label={'Người quản lý'}
      {...props}
      name="manager_id"
      type="select"
      innerprops={{
        showSearch: true,
        placeholder: 'Vui lòng chọn',
        allowClear: true,
        loading: !employee.length,
        onSelect: (value: string, id: any) => onSelect(value, id),
        onChange: (e: any, id: any) => onChange(e, id),
      }}
    />
  );
};

export default SelectDepartmentManager;
