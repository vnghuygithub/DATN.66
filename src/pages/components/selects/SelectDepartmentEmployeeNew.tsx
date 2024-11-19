import MyForm from '@/components/core/form';
import { departmentOptions, departmentOptionsNew, departmentOptionsNewForm } from '@/const/options';
import { useEffect, useState } from 'react';
import MyPage from '@/components/business/page';
interface IDepartment {
    value: number;
    label: string;
}
const { Item: SearchItem } = MyPage.MySearch;
const SelectDepartmentEmployeeNew = ({ selectedCurrentDepartmentId, ...props }: any) => {
    const [department, setDepartment] = useState<IDepartment[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        departmentOptionsNewForm(selectedCurrentDepartmentId).then((res) => {
            if (isMounted) {
                if (!selectedCurrentDepartmentId) {
                    setDepartment([]);
                    return () => {
                        setIsMounted(false);
                    }
                }
                setDepartment(res);
            }

        });
        return () => {
            setIsMounted(false);
        }
    }, [selectedCurrentDepartmentId]);
    return (
        <SearchItem
            options={department}
            label={'Phòng ban'}
            {...props}
            name="department_id"
            type="select"
            innerprops={{
                placeholder: 'Vui lòng chọn',
                allowClear: true,
            }}


        />
    )
}

export default SelectDepartmentEmployeeNew;