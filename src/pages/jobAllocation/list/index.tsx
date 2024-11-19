import { approveAllocation, deleteAllocation, denyAllocation, getEmployeeAllocationById, getListJobEmployeeAllocation } from "@/api/employee-allocation/employeeAllocation.api";
import MyPage, { MyPageTableOptions } from "@/components/business/page";
import { IEmployeeAllocation, IEmployeeAllocationArgs } from "@/interface/employeeAllocation/employeeAllocation";
import { useLocale } from "@/locales";
import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Space, Tag } from "antd";
import { FC, useState } from "react";
import { formatDate } from '@/utils/formatDate';
import { message as $message } from 'antd';
import SearchEmployeeAllocationMis from "../search-mis";
import FormAllocation from "../handle";
const JobAllocation: FC = () => {
    const { t } = useLocale();
    const [form] = Form.useForm();
    const [forceUpdate, setForceUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
    const [forceClearSelection, setForceClearSelection] = useState(false);
    const [idAllocation, setIdAllocation] = useState<any>(undefined);
    const [isCreating, setIsCreating] = useState(false);
    const [isView, setIsView] = useState(false);
    let is_general_manager = localStorage.getItem('is_general_manager');
    let is_administrative = localStorage.getItem('is_administrative');
    const _getEmployeeAllocationListByArgs = async (
        params: IEmployeeAllocationArgs
    ) => {
        store.dispatch(setGlobalState({ loading: true }));
        const res = await getListJobEmployeeAllocation(params);
        if (res) {
            store.dispatch(setGlobalState({ loading: false }));
            return res;
        }
    };
    const onClose = () => {
        setOpen(false);
        setIsCreating(false);
    };
    const showDrawer = () => {
        setOpen(true);
    };
    const handleView = (id: number) => {
        setIdAllocation(id);
        setIsCreating(false);
        setIsView(true);
        showDrawer();
    };
    const _getAllocationById = async (id: number) => {
        const res = await getEmployeeAllocationById(id);
        if (res.state === 'chờ duyệt') {
            return true;
        }
        return false;
    };
    const handleEdit = async (id: number) => {
        const canEdit = await _getAllocationById(id);
        if (!canEdit) {
            $message.error(
                'Không thể chỉnh sửa phiếu bổ nhiệm đã được duyệt'
            );
            return;
        }
        setIdAllocation(id);
        setIsCreating(false);
        setIsView(false);
        showDrawer();
    };
    const handleApprove = async () => {
        store.dispatch(setGlobalState({ loading: true }));
        if (selectedRowArr.length === 0) {
            $message.error('Vui lòng chọn ít nhất 1 phiếu bổ nhiệm');
            setForceClearSelection(!forceClearSelection);
            setSelectedRowArr([]);
            store.dispatch(setGlobalState({ loading: false }));
            return;
        }
        const ids = selectedRowArr.map((item: any) => item.id);
        if (selectedRowArr.some((item: any) => item.state !== 'chờ duyệt')) {
            $message.error(
                'Vui lòng chọn phiếu bổ nhiệm đang ở trạng thái chờ duyệt'
            );
            setSelectedRowArr([]);
            setForceClearSelection(!forceClearSelection);
            store.dispatch(setGlobalState({ loading: false }));
            return;
        }
        try {
            await Promise.all(
                ids.map((id: number) =>
                    approveAllocation(id)
                        .then(res => {
                            if (!res.result.error) {
                                setForceUpdate(!forceUpdate);
                                setSelectedRowArr([]);
                                setForceClearSelection(!forceClearSelection);
                                store.dispatch(setGlobalState({ loading: false }));
                            } else {
                                $message.error(res.result.error);
                                setForceUpdate(!forceUpdate);
                                setSelectedRowArr([]);
                                setForceClearSelection(!forceClearSelection);
                                store.dispatch(setGlobalState({ loading: false }));
                            }
                        })
                        .catch(err => {
                            console.log('err', err);
                        })
                )
            );
        } catch (error) {
            console.log('error', error);
        }
    };

    const handleDeny = async () => {
        store.dispatch(setGlobalState({ loading: true }));
        if (selectedRowArr.length === 0) {
            $message.error('Vui lòng chọn ít nhất 1 phiếu bổ nhiệm');
            setForceClearSelection(!forceClearSelection);
            setSelectedRowArr([]);
            store.dispatch(setGlobalState({ loading: false }));
            return;
        }
        const ids = selectedRowArr.map((item: any) => item.id);
        if (selectedRowArr.some((item: any) => item.state !== 'chờ duyệt')) {
            $message.error(
                'Vui lòng chọn phiếu bổ nhiệm đang ở trạng thái chờ duyệt'
            );
            setForceClearSelection(!forceClearSelection);
            setSelectedRowArr([]);
            store.dispatch(setGlobalState({ loading: false }));
            return;
        }
        try {
            await Promise.all(
                ids.map((id: number) =>
                    denyAllocation(id)
                        .then(res => {
                            if (res) {
                                setForceUpdate(!forceUpdate);
                                setForceClearSelection(!forceClearSelection);
                                setSelectedRowArr([]);
                                store.dispatch(setGlobalState({ loading: false }));
                            }
                        })
                        .catch(err => {
                            console.log('err', err);
                        })
                )
            );
        } catch (error) {
            console.log('error', error);
        }
    };
    const handleDelete = async () => {
        store.dispatch(setGlobalState({ loading: true }));
        if (selectedRowArr.length === 0) {
            $message.error('Vui lòng chọn ít nhất 1 phiếu bổ nhiệm');
            setSelectedRowArr([]);
            setForceClearSelection(!forceClearSelection);
            store.dispatch(setGlobalState({ loading: false }));
            return;
        }
        const ids = selectedRowArr.map((item: any) => item.id);
        if (selectedRowArr.some((item: any) => item.state !== 'chờ duyệt')) {
            $message.error(
                'Vui lòng chọn phiếu bổ nhiệm đang ở trạng thái chờ duyệt'
            );
            setSelectedRowArr([]);
            setForceClearSelection(!forceClearSelection);
            store.dispatch(setGlobalState({ loading: false }));
            return;
        }
        try {
            await Promise.all(
                ids.map((id: number) =>
                    deleteAllocation(id)
                        .then(res => {
                            if (res) {
                                setForceUpdate(!forceUpdate);
                                setSelectedRowArr([]);
                                setForceClearSelection(!forceClearSelection);
                                store.dispatch(setGlobalState({ loading: false }));
                            }
                        })
                        .catch(err => {
                            console.log('err', err);
                        })
                )
            );
        } catch (error) {
            console.log('error', error);
        }
    };
    const handleCreate = () => {
        setIsCreating(true);
        setIsView(false);
        setIdAllocation(undefined);
        showDrawer();
    };
    const tableColumns: MyPageTableOptions<IEmployeeAllocation> = [
        {
            title: 'STT',
            dataIndex: 'no',
            key: 'no',
            width: 50,
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'state',
            width: 100,
            key: 'state',
            align: 'center',
            render: item => {
                let textColor = '';
                let stateText = '';
                if (item === 'chờ duyệt') {
                    textColor = 'blue';
                    stateText = 'Chờ duyệt';
                } else if (item === 'đã duyệt') {
                    textColor = 'green';
                    stateText = 'Đã duyệt';
                } else if (item === 'hủy') {
                    textColor = 'red';
                    stateText = 'Hủy';
                }
                const spanStyle = textColor;
                return (
                    <Tag color={spanStyle} style={{ fontSize: '13px' }}>
                        {stateText}
                    </Tag>
                );
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'create_date',
            width: 100,
            key: 'create_date',
            align: 'center',
            render: item => {
                return item ? formatDate(item) : '';
            },
        },
        {
            title: 'Tên phiếu',
            dataIndex: 'name',
            width: 350,
            key: 'name',
            align: 'center',
        },
        {
            title: 'Công ty',
            dataIndex: 'current_company_name',
            width: 550,
            key: 'current_company_name',
            align: 'center',
        },
        {
            title: 'Nhân viên',
            dataIndex: 'employee_names',
            width: 200,
            key: 'employee_names',
            align: 'center',
        },
        {
            title: 'Phòng ban',
            dataIndex: 'current_department_name',
            width: 220,
            key: 'current_department_name',
            align: 'center',
        },
        {
            title: 'Chức vụ hiện tại',
            dataIndex: 'current_job_name',
            width: 150,
            key: 'current_job_name',
            align: 'center',
        },
        {
            title: "Chức vụ bổ nhiệm",
            dataIndex: 'job_name',
            width: 150,
            key: 'job_name',
            align: 'center',
        },
        {
            title: 'Ngày bổ nhiệm',
            dataIndex: 'new_job_id_date',
            width: 150,
            key: 'new_job_id_date',
            align: 'center',
            render: item => {
                return item ? formatDate(item) : '';
            },
        },
        {
            title: 'Ngày duyệt',
            dataIndex: 'approved_date',
            width: 100,
            key: 'approved_date',
            align: 'center',
            render: item => {
                return item ? formatDate(item) : '';
            },
        },
        {
            title: 'Người duyệt',
            dataIndex: 'approved_by_name',
            width: 150,
            key: 'approved_by_name',
            align: 'center',
        },

        {
            title: t({ id: 'action' }),
            key: 'id',
            dataIndex: 'id',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: item => (
                <Space size="middle">
                    {(is_general_manager === 'true' || is_administrative === "true") && (
                        <EditOutlined
                            style={{ fontSize: '14px', color: '#0960bd' }}
                            onClick={() => handleEdit(item)}
                        />
                    )}
                    <EyeOutlined
                        style={{ fontSize: '14px', color: '#0960bd' }}
                        onClick={() => handleView(item)}
                    />
                </Space>
            ),
        },
    ];
    return (
        <>
            <MyPage
                rowkey="id"
                pageApi={_getEmployeeAllocationListByArgs}
                title="Kiểm kê phiếu bổ nhiệm nhân viên"
                forceUpdate={forceUpdate}
                tableOptions={tableColumns}
                setSelectedRowData={setSelectedRowArr}
                forceClearSelection={forceClearSelection}
                searchRender={<SearchEmployeeAllocationMis />}
                multipleSelection
                selectedRowArr={selectedRowArr}

                slot={
                    (is_general_manager === "true" || is_administrative === 'true') && (
                        <>
                            <Button type="primary" onClick={handleCreate}>
                                Tạo
                            </Button>
                            <Button type="primary" onClick={handleApprove}>
                                Duyệt
                            </Button>
                            <Button type="primary" onClick={handleDeny}>
                                Hủy
                            </Button>
                            <Button type="primary" onClick={handleDelete}>
                                Xóa
                            </Button>
                        </>
                    )
                }
            />
            <FormAllocation
                isCreating={isCreating}
                form={form}
                onClose={onClose}
                open={open}
                forceUpdate={forceUpdate}
                setForceUpdate={setForceUpdate}
                idAllocation={idAllocation}
                showDrawer={showDrawer}
                isView={isView}
            />
        </>
    )
}

export default JobAllocation;