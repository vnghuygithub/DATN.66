import { getEmployeeWeeklyReport, getEmployeeWeeklyReportById, getOneEmployeeWeeklyReport } from '@/api/employee_weekly_report/employeeWeeklyReport.api';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import SelectCC from '@/pages/components/selects/SelectCC';
import SelectReviewer from '@/pages/components/selects/SelectReviewer';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Drawer,
    FormInstance,
    Row,
    Space,
    Spin,
    Upload,
} from 'antd';
import moment from 'moment';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Tabs from '../handle/tabs/';
import { request } from '@/api/request';
import { message as $message } from 'antd';
import { getEmployeeById } from '../../../api/employee/employee.api';
import { mobileResponsive } from '@/utils/mobileResponsive';
import he from 'he';
import { IEmployeeWeeklyReportArgs } from '@/interface/employeeWeeklyReport/employeeWeeklyReport';
import { DOMIAN_HR_WEEKLY_REPORT } from '@/api/constApi';
interface Props {
    onClose?: () => void;
    showDrawer?: () => void;
    open?: boolean;
    idReport?: any;
    setForceUpdate?: Dispatch<SetStateAction<boolean>>;
    forceUpdate?: boolean;
    form?: FormInstance<any>;
    isCreating?: boolean;
    isView?: boolean;
}
const WeeklyReportForm = ({
    onClose,
    showDrawer,
    open,
    idReport,
    setForceUpdate,
    forceUpdate,
    form,
    isCreating,
    isView,
}: Props) => {
    const [loading, setLoading] = useState(false);
    const { isMobile } = mobileResponsive();
    const [fileAttachments, setFileAttachments] = useState<any>();
    const [fileAttachmentsList, setFileAttachmentsList] = useState<any[]>([]);
    const [responseAttachments, setResponseAttachments] = useState<any[]>([]);
    const [workContent, setWorkContent] = useState<any>('');
    const [reviewContent, setReviewContent] = useState<any>('');
    const [cc, setCc] = useState<any[]>([]);
    const [previousReport, setPreviosReport] = useState<any>(null);
    const { t } = useLocale();
    const getEmployeeByUserId = async () => {
        let url = `api/hr.employee/?query={id}&filter=[["user_id","=",${localStorage.user_id}]]&limit=1`;
        const res = await request('get', url);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res?.result[0]?.id;
    };
    const _getEmployeeOneWeeklyReport = async () => {
        const res = await getOneEmployeeWeeklyReport();
        if (res) {
            form && form.setFieldsValue({
                cc: res?.result[0]?.cc?.map((item: any) => {
                    return {
                        value: item?.id,
                        label: item?.name + ' - ' + item?.work_email,
                        email: item?.work_email,
                    };
                }),
            });
            return res;
        }
    }
    function removeTags(str: string) {
        if ((str === null) || (str === ''))
            return false;
        else
            str = str?.toString();
        str = str?.replace(/(<([^>]+)>)/ig, '');
        return he?.decode(str);
    }
    const onFinish = async () => {
        await form?.validateFields();
        const data = await form?.getFieldsValue();
        if (data) {
            const selectedWeek = moment(data.week).startOf('week');
            const currentWeek = moment().startOf('week');
            if (selectedWeek.isBefore(currentWeek)) {
                $message.error('Không thể tạo báo cáo cho các tuần trong quá khứ.');
                return;
            }
            const now = new Date();
            const dayOfWeek = now.getDay();
            const hour = now.getHours();
            const minute = now.getMinutes();
            const second = now.getSeconds();
            if (dayOfWeek === 0 && (hour > 12 || (hour === 12 && minute > 0) || (hour === 12 && minute === 0 && second > 0))) {
                $message.error('Đã quá hạn nộp báo cáo tuần !');
                return;
            }
            if (isCreating) {
                setLoading(true);
                const url = 'create_weekly_report';
                const employee_id = await getEmployeeByUserId();
                const reportContent = data?.report_content ? removeTags(data?.report_content) : null;
                const bookName = data?.book_name
                const bookContent = data?.review_content ? removeTags(data?.review_content) : null;
                const today = new Date();
                const lastDayOfMonth = new Date(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    0
                );

                let lastFridayOfMonth = new Date(lastDayOfMonth);

                while (lastFridayOfMonth.getDay() !== 5) {
                    lastFridayOfMonth.setDate(lastFridayOfMonth.getDate() - 1);
                }

                const thisWeekContainsLastFridayOfMonth = moment(data.week).endOf('isoWeek').isSameOrAfter(
                    lastFridayOfMonth,
                    'day'
                );
                if (!reportContent) {
                    $message.error('Vui lòng nhập nội dung báo cáo !');
                    setLoading(false);
                    return;
                }
                if (reportContent.length < 350) {
                    $message.error('Nội dung báo cáo phải ít nhất 350 ký tự !');
                    setLoading(false);
                    return;
                }
                if (bookName && bookName.length > 100) {
                    $message.error('Tiêu đề sách không được dài hơn 100 ký tự !');
                    setLoading(false);
                    return;
                }
                if (bookName && !data.review_content) {
                    $message.error('Vui lòng nhập nội dung review sách !');
                    setLoading(false);
                    return;
                }

                if (data.review_content && !bookName) {
                    $message.error('Vui lòng nhập tiêu đề sách !');
                    setLoading(false);
                    return;
                }

                if (thisWeekContainsLastFridayOfMonth) {
                    if (!data.book_name || !data.review_content) {
                        $message.error(
                            'Báo cáo tuần cuối tháng cần nhập tiêu đề sách và review sách !'
                        );
                        setLoading(false);
                        return;
                    }
                }

                if (bookContent && bookContent.length < 350) {
                    $message.error('Nội dung review sách phải dài hơn 350 ký tự !');
                    setLoading(false);
                    return;
                }
                if (cc.length > 0 && cc.some((item: any) => !item.email)) {
                    $message.error("Trong danh sách cc có người không có email !");
                    setLoading(false);
                    return;
                }
                if (data.cc_email_text) {
                    const input = data.cc_email_text.trim();
                    if ((input.match(/@/g) || []).length > 1) {
                        const amount_email = (input.match(/@/g) || []).length;
                        const emails = input.split(',').map((email: any) => email.trim());
                        const amount_emails_after_split = emails.reduce((acc: any, email: any) => {
                            if ((email.match(/@/g) || []).length === 1) {
                                return acc + 1;
                            }
                            return acc;
                        }, 0);
                        if (amount_email !== amount_emails_after_split) {
                            $message.error('Email không hợp lệ');
                            setLoading(false);
                            return;
                        }
                        else if (amount_email === amount_emails_after_split) {
                            for (let i = 0; i < emails.length; i++) {
                                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emails[i])) {
                                    $message.error('Email không hợp lệ');
                                    setLoading(false);
                                    return;
                                }
                            }
                        }
                    }
                    else {
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
                            $message.error('Email không hợp lệ');
                            setLoading(false);
                            return;
                        }
                    }
                }
                const formData = new FormData();
                formData.append('employee_id', employee_id);
                formData.append('book_name', data.book_name ?? '');
                formData.append('review_content', data.review_content ?? '');
                formData.append('report_content', data.report_content ?? '');
                if (data?.cc?.length > 0) {
                    if (typeof data?.cc[0] === "number") {

                        formData.append('cc', (data?.cc).join(','));
                    }
                    else {
                        formData.append('cc', data?.cc?.map((item: any) => item?.value).join(','));
                    }
                }
                formData.append(
                    'from_date',
                    moment(data.week).startOf('isoWeek').format('YYYY-MM-DD') ?? ''
                );
                formData.append(
                    'to_date',
                    moment(data.week)
                        .startOf('isoWeek')
                        .add(6, 'days')
                        .format('YYYY-MM-DD') ?? ''
                );
                formData.append('state', 'đúng giờ');
                fileAttachmentsList.forEach((file: any, index: any) => {
                    formData.append(`attachment_ids[${index}]`, file);
                });
                formData.append('cc_email_text', data?.cc_email_text?.trim() ?? '');
                const res = await request('post', url, formData);
                if (res?.error?.code && res.error.code == 400) {
                    $message.error(res.error.message);
                    setLoading(false);
                    setFileAttachmentsList([]);
                    setResponseAttachments([]);
                    setFileAttachments(undefined);
                    onClose && onClose();
                    return;
                } else {
                    const args = [
                        employee_id,
                        "",
                        "",
                        "",
                        "",
                        "",
                        10,
                        1,
                        "",
                        [["state", "in", ['đúng giờ', 'muộn giờ']], ["from_date", ">=", `${moment(data.week).startOf('isoWeek').format('YYYY-MM-DD')}`], ["to_date", "<=", `${moment(data.week).startOf('isoWeek').add(6, 'days').format('YYYY-MM-DD')}`]],
                    ]

                    const requestBody = {
                        params: {
                            args
                        }
                    }
                    const weeklyResult = await request("post", DOMIAN_HR_WEEKLY_REPORT.GET, requestBody);
                    if (weeklyResult?.result?.result) {
                        if (weeklyResult.result.result.length > 0) {
                            setLoading(false);
                            $message.success('Tạo báo cáo tuần thành công');
                            setForceUpdate && setForceUpdate(!forceUpdate);
                            setFileAttachmentsList([]);
                            setResponseAttachments([]);
                            setFileAttachments(undefined);
                            onClose && onClose();
                            return true;
                        }
                        else {
                            $message.error('Đã có lỗi trong việc tạo báo cáo tuần, xin vui lòng thử lại !');
                            setLoading(false);
                        }
                    }
                    else {
                        $message.error('Đã có lỗi trong việc tạo báo cáo tuần, xin vui lòng thử lại !');
                        setLoading(false);
                    }
                }
            }
        }
    };
    function set_data_type_date(property: string, res: any) {
        let string_props = null;
        if (res) {
            if (
                res[property] != false &&
                res[property] != null &&
                res[property] != undefined
            ) {
                string_props = res[property];
                form &&
                    form.setFieldsValue({
                        [property]: moment(string_props) ?? '',
                    });
            } else {
                string_props = '';
                form &&
                    form.setFieldsValue({
                        [property]: undefined,
                    });
            }
        }
    }

    const fetchWeeklyReportById = async (id: number) => {
        if (!id) {
            return;
        }
        try {
            setLoading(true);
            const res = await getEmployeeWeeklyReportById(id);
            if (res) {
                set_data_type_date('date', res);
                setFileAttachmentsList([]);
                setResponseAttachments([]);
                setFileAttachments(undefined);
                if (res.hr_weekly_report_url_ids && res.hr_weekly_report_url_ids.length > 0) {
                    let updatedResponseAttachments: any[] = [];
                    res?.hr_weekly_report_url_ids?.forEach((item: any) => {
                        const itemExists = updatedResponseAttachments.some(
                            existingItem => existingItem.name === item.name
                        );

                        if (!itemExists) {
                            updatedResponseAttachments.push(item);
                        }
                    });
                    setResponseAttachments(updatedResponseAttachments);
                }
                setWorkContent(res?.report_content);
                setReviewContent(res?.review_content);
                form &&
                    form.setFieldsValue({
                        key: res.id,
                        name: res.name,
                        employee_id: {
                            value: res.employee_id?.id ?? '',
                            label: res.employee_id?.name ?? '',
                        },
                        employee_code: res.employee_code,
                        department_id: {
                            value: res.department_id?.id ?? '',
                            label: res.department_id?.name ?? '',
                        },
                        reviewer: {
                            value:
                                res?.reviewer?.id ?? '' + ' - ' + res?.reviewer?.work_email,
                            label: res?.reviewer?.name ?? '',
                        },
                        job_title: res?.job_title,
                        company_id: {
                            value: res?.company_id?.id ?? '',
                            label: res?.company_id?.name ?? '',
                        },
                        state: res?.state,
                        send_to: res?.send_to,
                        book_name: res?.book_name,
                        review_content: res?.review_content,
                        report_content: res?.report_content,
                        cc_email: res?.cc_email,
                        cc: res?.cc?.map((item: any) => {
                            return {
                                value: item?.id,
                                label: item?.name + ' - ' + item?.work_email,
                                email: item?.work_email,
                            };
                        }),
                        cc_email_text: res?.cc_email_text,
                        week: moment(res?.from_date).week(res?.from_date),
                        dateRange: [moment(res?.from_date), moment(res?.to_date)],
                        dateString:
                            moment(res?.from_date)
                                .week(res?.from_date)
                                .format('WW/YYYY')
                                .toString() +
                            ' - ' +
                            moment(res?.from_date)
                                .startOf('isoWeek')
                                .format('DD/MM/YYYY')
                                .toString() +
                            ' -> ' +
                            moment(res?.from_date)
                                .startOf('isoWeek')
                                .add(6, 'days')
                                .format('DD/MM/YYYY')
                                .toString(),
                    });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const customRequest = async ({
        file,
        onSuccess,
        onError,
        onProgress,
        recordId,
    }: any) => {
        if (file) {
            const totalSize = fileAttachmentsList.reduce(
                (acc, currentFile) => acc + currentFile.size,
                0
            ) + file.size;
            if (totalSize > 10 * 1024 * 1024) {
                $message.error('Tổng dung lượng upload không được quá 10mb.');
                onError('error');
                return;
            }
            setFileAttachments(file);
            setFileAttachmentsList([...fileAttachmentsList, file]);
            onSuccess('ok');
        } else {
            onError('error');
        }
    };


    const handleDownload = () => {
        fetch(
            'https://dl.dropboxusercontent.com/scl/fi/uo26oxsuf5gnkb9e04soh/BM_BC_-KH-cong-viec.-mau-1.xls?rlkey=fg90d7odu1k6qco7hn7a03u64&dl=0'
        )
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'BM_BC_ KH cong viec. mau.xls';
                link.click();
            })
            .catch(console.error);
    };
    const handleDownloadFile = (url: string, name: string) => {
        console.log('download detail is', url, name);
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = name;
                link.click();
            })
            .catch(console.error);
    };
    const fetchEmployeeById = async (id: string) => {
        const res = await getEmployeeById(String(id));
        if (res) {
            const dateRange = [
                moment().startOf('isoWeek'),
                moment().startOf('isoWeek').add(6, 'days'),
            ];
            console.log('dateRange', dateRange);
            form &&
                form.setFieldsValue({
                    reviewer: res?.parent_id?.name + ' - ' + res?.parent_id?.work_email,
                    dateRange: dateRange,
                    dateString:
                        moment().week(moment().week()).format('WW/YYYY').toString() +
                        ' - ' +
                        moment().startOf('isoWeek').format('DD/MM/YYYY').toString() +
                        ' -> ' +
                        moment()
                            .startOf('isoWeek')
                            .add(6, 'days')
                            .format('DD/MM/YYYY')
                            .toString(),
                });

        }
    };
    useEffect(() => {
        if (idReport) {
            form?.resetFields();
            setResponseAttachments([]);
            setFileAttachmentsList([]);
            setFileAttachments(undefined);
            fetchWeeklyReportById(idReport);
        }
        if (isCreating) {
            const employee_id = localStorage.getItem('employee_id');
            _getEmployeeOneWeeklyReport();
            if (employee_id) {
                form?.resetFields();
                console.log()
                fetchEmployeeById(employee_id);
            }
        }
    }, [idReport, open]);
    useEffect(() => {
        setFileAttachmentsList([]);
        setFileAttachments(undefined);
        setResponseAttachments([]);
        setWorkContent('');
        setReviewContent('');
    }, [onClose]);
    const handleCCChange = (value: any) => {
        setCc(value)
    }
    return (
        <>
            <Drawer
                key={idReport}
                title={isCreating ? 'Tạo báo cáo tuần' : 'Chi tiết báo cáo tuần'}
                width={isMobile ? '100%' : '98%'}
                onClose={onClose}
                open={open}
                destroyOnClose
                footer={
                    !isView && (
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button key={1} onClick={onClose}>
                                Hủy
                            </Button>
                            <Button
                                key={2}
                                onClick={onFinish}
                                type="primary"
                                loading={loading}>
                                Lưu
                            </Button>
                        </div>
                    )
                }>
                <Spin spinning={loading}>
                    <MyForm<any> onFinish={onFinish} form={form} layout="vertical">
                        <Row gutter={9}>
                            <Col span={8}>
                                <MyForm.Item
                                    type="input"
                                    name="dateString"
                                    label="Thời gian"
                                    innerprops={{
                                        disabled: true,
                                    }}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={8}>
                                <SelectReviewer />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={8}>
                                <SelectCC onChange={handleCCChange} />
                            </Col>
                            {/* <Col xs={24} sm={24} md={12} lg={8}>
                                    <MyForm.Item
                                        type="input"
                                        name="cc_email_text"
                                        label="CC(tự nhập)"
                                        innerprops={{
                                            disabled: isView,
                                        }}
                                    />
                                </Col> */}
                            {!isCreating && (
                                <>
                                    <Col xs={24} sm={24} md={12} lg={8}>
                                        <MyForm.Item
                                            label="CC Email"
                                            type="input"
                                            name="cc_email"
                                            innerprops={{
                                                disabled: true,
                                            }}
                                        />
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={8}>
                                        <MyForm.Item
                                            label="Gửi tới"
                                            type="input"
                                            name="send_to"
                                            innerprops={{
                                                disabled: true,
                                            }}
                                        />
                                    </Col>
                                    {responseAttachments?.length > 0 && (
                                        <Col xs={24} sm={24} md={12} lg={8}>
                                            <span>File đính kèm</span>
                                            <Space
                                                direction="vertical"
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}>
                                                {responseAttachments?.map((item: any) => {
                                                    return (
                                                        <Button
                                                            style={{ marginTop: 8, width: '100%' }}
                                                            type="primary"
                                                            onClick={() => {
                                                                handleDownloadFile(item.url, item.name);
                                                            }}
                                                            icon={<DownloadOutlined />}>
                                                            {item.name}
                                                        </Button>
                                                    );
                                                })}
                                            </Space>
                                        </Col>
                                    )}
                                </>
                            )}

                            {isCreating && (
                                <>
                                    <Col xs={24} sm={24} md={12} lg={8}>
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <MyForm.Item
                                                label="File đính kèm"
                                                required
                                                name="attachment_ids">
                                                <Upload
                                                onRemove={(fileToDelete) => {
                                                    setFileAttachmentsList(fileAttachmentsList.filter(file => file !== fileToDelete));
                                                }}
                                                    className="upload"
                                                    customRequest={customRequest}>
                                                    <Button
                                                        style={{ width: '100%' }}
                                                        icon={<UploadOutlined />}>
                                                        Upload
                                                    </Button>
                                                </Upload>
                                            </MyForm.Item>
                                        </Space>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={8}>
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <span>File báo cáo mẫu</span>
                                            <Button
                                                style={{ width: '100%' }}
                                                type="primary"
                                                onClick={handleDownload}
                                                icon={<DownloadOutlined />}>
                                                Download
                                            </Button>
                                        </Space>
                                    </Col>
                                </>
                            )}
                        </Row>
                        <Row gutter={24} style={{ marginTop: 50 }}>
                            <Col span={24}>
                                <Tabs
                                    form={form}
                                    workContent={workContent}
                                    isView={isView}
                                    reviewContent={reviewContent}
                                />
                            </Col>
                        </Row>
                    </MyForm>
                </Spin>
            </Drawer>
        </>
    );
};
export default WeeklyReportForm;