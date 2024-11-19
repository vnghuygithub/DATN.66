import MyForm from '@/components/core/form';
import { employeeOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IEmployee {
  value: number;
  label: string;
}

const SelectEmployeeEquipmentRequest = ({ ...props }) => {
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
      label={'Nhân viên'}
      {...props}
      name="employee"
      type="select"
      innerprops={{
        showSearch: true,
        placeholder: 'Vui lòng chọn Nhân viên',
        allowClear: true,
        loading: !employee.length,
      }}
    />
  );
};

export default SelectEmployeeEquipmentRequest;
