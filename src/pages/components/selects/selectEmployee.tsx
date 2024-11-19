import MyForm from '@/components/core/form';
import { employeeOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IEmployee {
  value: number;
  label: string;
}

const SelectEmployee = ({
  requiredOption,
  disabled,
  selectedDepartmentId,
  onChange,
  ...props
}: any) => {
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
  }, [selectedDepartmentId]);

  return (
    <MyForm.Item
      options={employee}
      label={'Người quản lý'}
      {...props}
      name="parent_id"
      type="select"
      required={requiredOption ? requiredOption : false}
      innerprops={{
        disabled: disabled,
        showSearch: true,
        placeholder: 'Vui lòng chọn',
        allowClear: true,
        loading: !employee.length,
        onChange: (value: any) => {
          onChange && onChange(value);
      
        },
      }}
    />
  );
};

export default SelectEmployee;
