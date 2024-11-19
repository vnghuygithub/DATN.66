import MyPage from "@/components/business/page";
import SelectCompany from "@/pages/components/selects/SelectCompany";
import SelectCompanyHO from "@/pages/components/selects/SelectCompanyHO";
import SelectDepartmentEmployee from "@/pages/components/selects/SelectDepartmentEmployee";
import SelectEmployeeContractSearch from "@/pages/components/selects/SelectEmployeeContractSearch";
import SelectJob from "@/pages/components/selects/SelectJob";
import SelectDepartment from "@/pages/components/selects/selectDepartment";
import { Col } from "antd";

const { Item: SearchItem } = MyPage.MySearch;
const SearchInsurance = () => {
    const is_administrative = localStorage.getItem('is_administrative');
    const sub_admin_role = localStorage.getItem('sub_admin_role');
    return (
        <>
            <Col xs={24} sm={24} md={12} lg={7}>
                <SelectEmployeeContractSearch />
            </Col>
            <Col xs={24} sm={24} md={12} lg={7}>
                <SelectDepartmentEmployee />
            </Col>
            {
                (is_administrative === "true" || sub_admin_role !== "none") && (
                    <Col xs={24} sm={24} md={12} lg={7}>
                        <SelectCompanyHO />
                    </Col>
                )
            }
            <Col xs={24} sm={24} md={12} lg={7}>
                <SearchItem
                    label="Tháng"
                    name="date"
                    type="date-picker"
                    innerprops={{
                        allowClear: true,
                        placeholder: 'Tháng',
                        format: 'MM/YYYY',
                        picker: 'month',
                    }}
                />
            </Col>
            <Col xs={24} sm={24} md={12} lg={7}>
                <SearchItem
                    label="Tham gia BHXH"
                    name="have_insurance"
                    type="select"
                    options={[
                        { label: 'Có', value: true },
                        { label: 'Không', value: false },
                    ]}
                />
            </Col>
            <Col xs={24} sm={24} md={12} lg={7}>
                <SearchItem
                    label="Mã NV"
                    name="employee_code"
                    type="input"
                    innerprops={{
                        placeholder: 'Mã nv',
                        allowClear: true,
                    }}
                />
            </Col>
            <Col xs={24} sm={24} md={12} lg={7}>
                <SelectJob />
            </Col>
        </>
    )
}
export default SearchInsurance;