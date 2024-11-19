import MyForm from '@/components/core/form';
import { hinhThucNhanVienOptions } from '@/const/options';

const SelectTypeEmployee = ({ disabled,...props }:any) => {

  return (
    <>
      <MyForm.Item
        innerprops={{
          disabled: disabled,
          placeholder: 'Vui lòng chọn',
          allowClear: true,
        }}
        options={hinhThucNhanVienOptions}
        label="Hình thức nhân viên"
        {...props}
        name="employee_type"
        type="select"
        initialValue={"employee"}
        required
      />
    </>
  );
};

export default SelectTypeEmployee;
