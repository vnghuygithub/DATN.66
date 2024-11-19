import MyPage from '@/components/business/page';
import { useLocale } from '@/locales';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';
import SelectDepartmentEmployee from '@/pages/components/selects/SelectDepartmentEmployee';
import SelectEmployeeContractSearch from '@/pages/components/selects/SelectEmployeeContractSearch';
import { Col } from 'antd';


const { Item: SearchItem } = MyPage.MySearch;

const SearchShiftRequest = () => {
    const { t } = useLocale()
    const is_administrative = localStorage.getItem('is_administrative')
    const sub_admin_role = localStorage.getItem('sub_admin_role')
    return (
        <>
            <Col span={7}>
                <SelectEmployeeContractSearch />
            </Col>
            <Col span={7}>
                <SearchItem
                    label="Mã nhân viên"
                    name="employee_code"
                    type="input"
                    innerprops={{
                        allowClear: true,
                        placeholder: 'Vui lòng nhập mã nhân viên',
                    }}
                />
            </Col>
            <Col span={7}>
                <SelectDepartmentEmployee />
            </Col>
            <Col span={7}>
                <SearchItem
                    label="Ngày tạo"
                    name="create_date"
                    type="date-picker"
                    innerprops={{
                        allowClear: true,
                        placeholder: 'Vui lòng chọn ngày tạo',
                        format: 'DD/MM/YYYY',
                    }}
                />
            </Col>
            <Col span={7}>
                <SearchItem
                    label="Chức vụ"
                    name="job_title"
                    type="input"
                    innerprops={{
                        allowClear: true,
                        placeholder: 'Vui lòng nhập chức vụ',
                    }}
                />
            </Col>
            <Col span={7}>
                <SearchItem
                    label="Trạng thái"
                    name="state"
                    type="select"
                    innerprops={{
                        allowClear: true,
                        placeholder: 'Vui lòng chọn trạng thái',
                    }}
                    options={[
                        { label: 'Chờ duyệt', value: "chờ duyệt" },
                        { label: 'Đã duyệt', value: "đã duyệt" },
                        { label: 'Từ chối', value: "từ chối" },
                    ]}
                />
            </Col>
            {
                (is_administrative === "true" || sub_admin_role !== "none") && (
                    <Col span={7}>
                        <SelectCompanyHO />
                    </Col>
                )
            }
        </>
    )
}
export default SearchShiftRequest