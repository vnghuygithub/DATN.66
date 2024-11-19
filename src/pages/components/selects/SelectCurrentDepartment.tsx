import MyForm from '@/components/core/form';
import { departmentOptions, departmentOptionsNew } from '@/const/options';
import { useEffect, useState } from 'react';
import MyPage from '@/components/business/page';
interface IDepartment {
    value: number;
    label: string;
}
const { Item: SearchItem } = MyPage.MySearch;
const SelectCurrentDepartmentEmployee = ({ onChange, ...props }: any) => {
    const [department, setDepartment] = useState<IDepartment[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        departmentOptions().then((res) => {
            if (isMounted)
                setDepartment(res);

        });
        return () => {
            setIsMounted(false);
        }
    }, []);
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

export default SelectCurrentDepartmentEmployee;