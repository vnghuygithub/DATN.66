import MyForm from '@/components/core/form';
import { departmentOptionsNoRight } from '@/const/options';
import { useEffect, useState } from 'react';

interface IDepartment {
  value: number;
  label: string;
}

const SelectDepartmentEmployeeForm = ({
  requiredOption,
  isCreating,
  selectedCompanyId,
  onChange,
  disabled,
  ...props
}: any) => {
  const [department, setDepartment] = useState<IDepartment[]>([]);
  const [isMounted, setIsMounted] = useState(true);
  const is_administrative = localStorage.getItem('is_administrative');
  useEffect(() => {
    setIsMounted(true);
    departmentOptionsNoRight(selectedCompanyId).then(res => {
      if (isMounted) setDepartment(res);
    });
    return () => {
      setIsMounted(false);
    };
  }, [selectedCompanyId]);
  return (
    <MyForm.Item
      options={department}
      label={'Phòng ban'}
      {...props}
      name="department_noright_id"
      type="select"
      required={requiredOption ? requiredOption : false}
      innerprops={{
        placeholder: 'Vui lòng chọn',
        allowClear: true,
        disabled: disabled,
        onChange: (value: any) => {
          onChange(value);
        },
      }}
    />
  );
};

export default SelectDepartmentEmployeeForm;
