import MyForm from '@/components/core/form';
import { departmentAllocationOptions, departmentOptions, departmentOptionsNew } from '@/const/options';
import { useEffect, useState } from 'react';
import MyPage from '@/components/business/page';
interface IDepartment {
    value: number;
    label: string;
}
const { Item: SearchItem } = MyPage.MySearch;
const SelectCurrentDepartmentAllocation = ({ onChange,department_id, ...props }: any) => {
    const [department, setDepartment] = useState<IDepartment[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        departmentAllocationOptions(department_id).then((res) => {
            if (isMounted)
                setDepartment(res);

        });
        return () => {
            setIsMounted(false);
        }
    }, [department_id]);
    return (
        <SearchItem
            options={department}
            label={'Phòng ban hiện tại'}
            {...props}
            name="current_department_id"
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

export default SelectCurrentDepartmentAllocation;