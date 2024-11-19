import { IInsuranceConfigArgs, deleteInsuranceConfig, getInsuranceConfig } from "@/api/insurance/insurance.api";
import { IIsuranceConfig } from "@/api/insurance/transform";
import MyPage, { MyPageTableOptions } from "@/components/business/page";
import { useLocale } from "@/locales";
import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, message, Space } from "antd";
import { FC, useState } from "react";
import SearchInsuranceConfig from "../search";
import InsuranceConfigForm from "../handle";

const InsuranceConfigList: FC = () => {
    const { t } = useLocale();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [idInsuranceConfig, setIdInsuranceConfig] = useState<any>(null);
    const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [forceClearSelection, setForceClearSelection] = useState(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const _getInsuranceConfigList = async (params: IInsuranceConfigArgs) => {
        store.dispatch(setGlobalState({ loading: true }));
        const res = await getInsuranceConfig(params);
        if (res) {
            store.dispatch(setGlobalState({ loading: false }));
            return res;
        }
    };
    const handleCreate = () => {
        setIsCreating(true);
        showDrawer();
        setIsView(false);
        setIdInsuranceConfig(null)
    }
    const handleDelete = async() => { 
        if (selectedRowArr.length === 0) {
            message.error("Vui lòng chọn dữ liệu để xóa");
            return;
        }
        store.dispatch(setGlobalState({ loading: true }));
        const itemsToDelete = selectedRowArr.map((item) => item.id);
        await Promise.all(itemsToDelete.map(async (id) => {
            const res = await deleteInsuranceConfig(id);
            if (res) {
                store.dispatch(setGlobalState({ loading: false }));
                setForceUpdate && setForceUpdate(!forceUpdate);
                setForceClearSelection && setForceClearSelection(!forceClearSelection);
                setSelectedRowArr([]);
            }
        })).then(() => {
            message.success('Xóa thành công');
            setSelectedRowArr([]);
        }).catch(() => {
            message.error('Xóa thất bại');
        }
        );
    }
        
    
    const tableColumns: MyPageTableOptions<IIsuranceConfig> = [
        {
            title: "#",
            dataIndex: "no",
            key: "no",
            width: 50,
            align: "center",
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 50,
            align: "center",
        },
        {
            title: "Công ty",
            dataIndex: "mis_id",
            key: "mis_id",
            width: 150,
            align: "center",
        },
        {
            title: "Mã đơn vị",
            dataIndex: "code",
            key: "code",
            width: 100,
            align: "center",
        },
        {
            title: "Lương tối thiểu vùng",
            dataIndex: "minimum_wage",
            key: "minimum_wage",
            width: 150,
            align: "center",
        },
        {
            title: "BHXH",
            dataIndex: "bhxh_company",
            key: "bhxh_company",
            width: 100,
            align: "center",
        },
        {
            title: "BHYT",
            dataIndex: "bhyt_company",
            key: "bhyt_company",
            width: 100,
            align: "center",
        },
        {
            title: "BHTN",
            dataIndex: "bhtn_company",
            key: "bhtn_company",
            width: 100,
            align: "center",
        },
        {
            title: "BHTNLĐ",
            dataIndex: "bhtnld_company",
            key: "bhtnld_company",
            width: 100,
            align: "center",
        },
        {
            title: "Tổng BHBB do DN đóng",
            dataIndex: "total_insurance_company",
            key: "total_insurance_company",
            width: 150,
            align: "center",
        },
        {
            title: "BHXH",
            dataIndex: "bhxh_employee",
            key: "bhxh_employee",
            width: 100,
            align: "center",
        },
        {
            title: "BHYT",
            dataIndex: "bhyt_employee",
            key: "bhyt_employee",
            width: 100,
            align: "center",
        },
        {
            title: "BHTN",
            dataIndex: "bhtn_employee",
            key: "bhtn_employee",
            width: 100,
            align: "center",
        },
        {
            title: "Tổng BHBB do người lao động đóng",
            dataIndex: "total_insurance_employee",
            key: "total_insurance_employee",
            width: 150,
            align: "center",
        },
        {
            title: "Tổng tiền BHXH",
            dataIndex: "total_social_insurance",
            key: "total_social_insurance",
            width: 150,
            align: "center",
        },
        {
            title: "Tổng tiền BHYT",
            dataIndex: "total_health_insurance",
            key: "total_health_insurance",
            width: 150,
            align: "center",
        },
        {
            title: "Tổng tiền BHTN",
            dataIndex: "total_unemployed_insurance",
            key: "total_unemployed_insurance",
            width: 150,
            align: "center",
        },
        {
            title: "Tổng tiền BHTNLĐ",
            dataIndex: "total_unemployed_working",
            key: "total_unemployed_working",
            width: 150,
            align: "center",
        },
        {
            title: "Tổng tiền phải nộp",
            dataIndex: "total_insurance",
            key: "total_insurance",
            width: 150,
            align: "center",
        },
        {
            title: "Hành động",
            dataIndex: "id",
            key: "id",
            width: 100,
            align: "center",
            render: (item) => (
                <Space size="middle"> 
                        <EditOutlined
                            style={{ fontSize: '14px', color: '#0960bd' }}
                            onClick={() => handleEdit(item)}
                        />
                    <EyeOutlined
                        style={{ fontSize: '14px', color: '#0960bd' }}
                        onClick={() => handleView(item)}
                    />
                </Space>
            ),
        },
    ]
    const handleEdit = (item: any) => {
        setIsCreating(false);
        setIsView(false);
        showDrawer();
        setIdInsuranceConfig(item);
    }
    const handleView = (item: any) => {
        setIsView(true);
        showDrawer();
        setIdInsuranceConfig(item);
    }
    return (
        <>
            <MyPage
                title="Danh sách cấu hình bảo hiểm"
                multipleSelection
                rowkey="id"
                pageApi={_getInsuranceConfigList}
                tableOptions={tableColumns}
                forceUpdate={forceUpdate}
                forceClearSelection={forceClearSelection}
                setSelectedRowData={setSelectedRowArr}
        selectedRowArr={selectedRowArr}

                searchRender={<SearchInsuranceConfig />}
                slot={
                    <>
                        <Button type="primary" onClick={handleCreate}>
                            Tạo mới
                        </Button>
                        <Button type="primary" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </>
                }
            />
            <InsuranceConfigForm
                isCreating={isCreating}
                form={form}
                onClose={onClose}
                open={open}
                forceUpdate={forceUpdate}
                setForceUpdate={setForceUpdate}
                idInsuranceConfig={idInsuranceConfig}
                showDrawer={showDrawer}
                isView={isView}
            />
        </>
    )
}

export default InsuranceConfigList;