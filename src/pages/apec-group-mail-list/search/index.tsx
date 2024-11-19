import MyPage from '@/components/business/page';
import { useLocale } from '@/locales';
import SelectCompanyAll from '@/pages/components/selects/SelectCompanyAll';
import SelectCompanyAllSearch from '@/pages/components/selects/SelectCompanyAllSearch';
import SelectCompanyHO from '@/pages/components/selects/SelectCompanyHO';
import SelectDepartmentManager from '@/pages/components/selects/SelectDepartmentManager';
import SelectParentDepartment from '@/pages/components/selects/SelectParentDepartment';
import { Col, Row } from 'antd';

const { Item: SearchItem } = MyPage.MySearch;

const SearchApecGroupMail = () => {
    return (
        <Row gutter={24}>
            <Col span={12} >
                <SearchItem
                    label={'Tên'}
                    name="name"
                    type="input"
                    innerprops={{
                        allowClear: true,
                        placeholder: 'Vui lòng nhập tên',
                    }}
                />
            </Col>
            <Col span={12}>
                <SearchItem
                    label={'Email'}
                    name="email"
                    type="input"
                    innerprops={{
                        allowClear: true,
                        placeholder: 'Vui lòng nhập email',
                    }}
                />
            </Col>
        </Row>
    );
};

export default SearchApecGroupMail;
