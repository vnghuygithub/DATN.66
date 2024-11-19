import MyForm from '@/components/core/form';
import { departmentAllocationOptions, departmentOptions, departmentOptionsNew } from '@/const/options';
import { useEffect, useState } from 'react';
import MyPage from '@/components/business/page';
interface IDepartment {
    value: number;
    label: string;
}
const { Item: SearchItem } = MyPage.MySearch;
const SelectDepartmentAllocationNew = ({ onChange,selectedCurrentDepartmentId, ...props }: any) => {
    const [department, setDepartment] = useState<IDepartment[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        departmentAllocationOptions(selectedCurrentDepartmentId).then((res) => {
            if (isMounted)
                setDepartment(res);

        });
        return () => {
            setIsMounted(false);
        }
    }, [selectedCurrentDepartmentId]);
    return (
        <SearchItem
            options={department}
            label={'Phòng ban chuyển đến'}
            {...props}
            name="department_allocation_new_id"
            type="select"
            innerprops={{
                allowClear: true,
                loading: !department.length,
                onChange: (value: any) => {
                    console.log(value)
                    onChange(value);
                }
            }}


        />
    )
}

export default SelectDepartmentAllocationNew;