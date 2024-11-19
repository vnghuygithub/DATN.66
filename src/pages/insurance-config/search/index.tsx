import MyPage from "@/components/business/page";
import SelectCompanyHO from "@/pages/components/selects/SelectCompanyHO";
import { Col } from "antd";

const { Item: SearchItem } = MyPage.MySearch;
const SearchInsuranceConfig = () => {
    const is_administrative = localStorage.getItem('is_administrative');
    const sub_admin_role = localStorage.getItem('sub_admin_role');
    return (
        <>
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
                    label="Mã đơn vị"
                    name="code"
                    type="input"
                    innerprops={{
                        placeholder: 'Mã đơn vị',
                        allowClear: true,
                    }}
                />
            </Col>
        </>
    )
}

export default SearchInsuranceConfig;