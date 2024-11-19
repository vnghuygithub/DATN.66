import MyForm from '@/components/core/form';
import { employeeOptions } from '@/const/options';
import { useEffect, useState } from 'react';
import { Col } from 'antd';
import { on } from 'events';

interface IEmployee {
  value: number;
  label: string;
}

interface SelectEmployeeContractSearchProps {
  onChange: (value: any) => void; // Define the onChange prop
}

const SelectEmployeeContractSearch = ({
  onChange,
  onSelect,
  name,
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
  }, []);

  return (
    <MyForm.Item
      options={employee}
      label={'Nhân viên'}
      {...props}
      name={name ? name : "employee_id"}
      type="select"
      innerprops={{
        showSearch: true,
        placeholder: 'Vui lòng chọn',
        allowClear: true,
        loading: !employee.length,
        disabled: props.disabled,
        onChange: (value: string, id: any) => onSelect(value, id),
        onSelect: (value: string, id: any) => onSelect(value, id),
      }}
    />
  );
};

export default SelectEmployeeContractSearch;
