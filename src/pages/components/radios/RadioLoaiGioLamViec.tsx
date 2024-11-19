import MyForm from '@/components/core/form';
import { caGayOptions, loaiGioLamViecOptions } from '@/const/options';
import React from 'react';

const RadioLoaiGioLamViec = ({ disabled,...props }:any) => {
  return (
    <MyForm.Item
      innerprops={{
        disabled: disabled,
      }}
        options={loaiGioLamViecOptions}
        label={'Loại giờ làm việc'}
        {...props}
        name="resource_calendar_type"
        type="radio"
        initialValue = {"1"}
      />
  );
};

export default RadioLoaiGioLamViec;
