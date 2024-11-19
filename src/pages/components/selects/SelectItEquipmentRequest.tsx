import React from 'react';
import MyForm from '@/components/core/form';
import { testOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IEquipment {
    value: number;
    label: string;
  } 

const SelectItEquipmentRequest = () => {    
    const [equipment, setEquipment] = useState<IEquipment[]>([]);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        testOptions().then(res => {
          if (isMounted) {
            setEquipment(res);
          }
        });
    
        return () => {
          setIsMounted(false);
        };
      }, []);
      
      return (
        <MyForm.Item
          options={equipment}
          label={'Văn phòng phẩm'}
         //{...props}
          name="equipment"
          type="select"
          innerprops={{
            showSearch: true,
            placeholder: 'Vui lòng chọn Văn phòng phẩm',
            allowClear: true,
            loading: !equipment.length,
          }}
        />
      );
};

export default SelectItEquipmentRequest;