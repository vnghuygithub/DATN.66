import MyForm from '@/components/core/form';
import { departmentOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IDepartment {
  value: number;
  label: string;
}

const SelectDepartment = ({
  onChange,
  onSelect,
  department_id,
  ...props
}: any) => {
  const [department, setDepartment] = useState<IDepartment[]>([]);
  const [isMounted, setIsMounted] = useState(true);
  useEffect(() => {
    setIsMounted(true);
    departmentOptions(department_id).then(res => {
      if (isMounted) setDepartment(res);
    });
    return () => {
      setIsMounted(false);
    };
  }, [department_id]);
  return (
    <MyForm.Item
      options={department}
      label={'Phòng ban'}
      {...props}
      name="department_id"
      type="select"
      innerprops={{
        placeholder: 'Vui lòng chọn',
        allowClear: true,
        onSelect: (value: string, id: any) => onSelect(value, id),
        onChange: (e: any, id: any) => onChange(e, id),
      }}
    />
  );
};

export default SelectDepartment;
