import MyForm from '@/components/core/form';
import { equipmentOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IEquipment {
    value: number;
    label: string;
}

const SelectDepartment = ({ ...props }) => {
    const [equipment, setEquipment] = useState<IEquipment[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        equipmentOptions().then((res: any) => {
            if (isMounted)
                setEquipment(res);

        });
        return () => {
            setIsMounted(false);
        }
    }, []);
    return (
        <MyForm.Item
            options={equipment}
            label={'Phòng ban'}
            {...props}
            name="equipment"
            type="select"
            innerprops={{
                placeholder: 'Vui lòng chọn Phòng ban',
                allowClear: true,
            }}
        />
    )
}

export default SelectDepartment;