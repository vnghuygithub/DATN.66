import MyForm from '@/components/core/form';
import { departmentOptions } from '@/const/options';
import { on } from 'events';
import { useEffect, useState } from 'react';

interface IDepartment {
  value: number;
  label: string;
}

const SelectParentDepartment = ({ onChange, onSelect, ...props }: any) => {
  const [department, setDepartment] = useState<IDepartment[]>([]);
  const [isMounted, setIsMounted] = useState(true);
  useEffect(() => {
    setIsMounted(true);
    departmentOptions().then(res => {
      if (isMounted) setDepartment(res);
    });
    return () => {
      setIsMounted(false);
    };
  }, []);
  return (
    <MyForm.Item
    
      options={department}
      label={'Phòng ban cấp trên'}
      {...props}
      name="parent_id"
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

export default SelectParentDepartment;
