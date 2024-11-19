import {
  deleteDocument,
  getDocumentDetail,
  getListDocument,
  getListExport,
  updateDocument,
} from '@/api/export/export.api';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  message as $message,
  Upload,
  Space,
} from 'antd';
import { EditOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState, useCallback } from 'react';
import ButtonDownload from './component/button';
import './style.css';
import { Typography, DatePicker, DatePickerProps } from 'antd';
import moment from 'moment';
import { AlertOutlined } from '@ant-design/icons';
import { Spin, message } from 'antd';
import { importReportShift } from '@/api/export/export.api';
import store from '@/stores';
import { useSelector } from 'react-redux';
import { setGlobalState } from '@/stores/global.store';
import { LocaleFormatter, useLocale } from '@/locales';
import * as XLSX from 'xlsx';
import { formatDateString } from '@/utils/formatDate';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import {
  IEmployeeeArgsResult,
  IsDocumentList,
} from '@/interface/employees/employee';
import MyForm from '@/components/core/form';
import FormDocument from './handle';

interface errorObject {
  row: number | string | any;
  code: string | any;
}
const columns: ColumnsType<errorObject> = [
  {
    width: 100,
    render: () => <AlertOutlined />,
  },
  {
    title: 'Số thứ tự',
    dataIndex: 'row',
    width: 450,
    align: 'center',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Mã nhân viên',
    dataIndex: 'code',
    width: 450,
    align: 'center',
  },
];

const index = (id: any) => {
  const [fileUrl, setFileUrl] = useState<any>([]);
  const initialDate = moment().subtract(10, 'days');
  const [month, setMonth] = useState(initialDate.month() + 1);
  const [year, setYear] = useState(moment().year());
  const { Text } = Typography;
  const [uploadedFile, setUploadedFile] = useState<any>();
  const { loading } = useSelector(state => state.global);
  const [fileList, setFileList] = useState<any[]>([]);
  const [shiftDataArray, setShiftDataArray] = useState<any[]>([]);
  const [stateSpin, setStateSpin] = useState<any>(false);
  const [errorArr, setErrorArr] = useState<any[]>([]);
  const [foceUpdate, setFoceUpdate] = useState(false);

  const customRequest = async ({
    file,
    onSuccess,
    onError,
    onProgress,
    onRemove,
  }: any) => {
    if (file) {
      setFileList([file]);
      setUploadedFile(file);

      onSuccess('ok');
    }
  };
  let is_administrative = localStorage.getItem('is_administrative');
  const handleBeforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const dataNoHeader = data?.slice(0);
        const workbook = XLSX.read(dataNoHeader, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const workSheet = workbook.Sheets[sheetName];
        // const merges = workSheet['!merges'] || [];
        const rows = XLSX.utils.sheet_to_json(workSheet, {
          raw: true,
          defval: '',
        });
        let new_arr = [] as any;
        // const daterow = rows[1]
        rows.forEach((row: any, index: number) => {
          if (index == 1) {
            let new_row = [''];
            for (const key in row) {
              if (row[key] != '') {
                new_row.push(row[key]);
              }
            }
            new_arr.push(new_row);
          }
          if (index >= 3) {
            let new_row = [] as any;
            new_row.push(row['__EMPTY_1']);
            new_arr.push(new_row);
            for (const key in row) {
              if (isNaN(parseInt(key)) == false) {
                new_row.push(row[key]);
              }
            }
          }
        });

        setShiftDataArray(new_arr);

        message.success('Đọc file thành công.');
      } catch (error) {
        message.error('Error parsing the file.');
      }
    };
    reader.readAsBinaryString(file);
    // return false; // Prevent the default upload behavior
  };

  const handleRemove = (file: any) => {
    const index = fileList.indexOf(file);
    if (index !== -1) {
      const newFileList = [...fileList];
      newFileList.splice(index, 1); // Remove the file from the newFileList array
      setFileList(newFileList); // Update the state to trigger a re-render
    }
  };

  const handleSubmitImport = useCallback(async () => {
    const errorTable = [] as any;
    try {
      if (uploadedFile != null && uploadedFile != false) {
        setStateSpin(true);
        const rowDate = shiftDataArray[0];
        const errorTable = [] as any;

        shiftDataArray.forEach(async (row: any, index: number) => {
          const data_object = {
            key: index,
            code: '',
            data: [] as any,
          };

          if (index > 0) {
            data_object.code = row[0];
            row.forEach((cell: any, altindex: number) => {
              if (altindex > 0) {
                data_object.data.push({
                  date: rowDate[altindex],
                  shift_name: cell,
                });
              }
            });

            if (index < shiftDataArray.length - 1) {
              importReportShift(data_object)
                .then(res => {
                  if (res.status === 'successfully') {
                    message.success('import thành công dòng ' + index);
                  } else {
                    message.error('lỗi import dòng + ' + index);
                    const object = {
                      row: index,
                      code: data_object.code,
                      key: index,
                    };
                    errorTable.push(object);
                    setErrorArr(prevErrorArr => [...prevErrorArr, object]);
                  }
                })
                .catch(err => { });
            } else if (index == shiftDataArray.length - 1) {
              try {
                const res = await importReportShift(data_object);
                if (res.status === 'successfully') {
                  message.success('import thành công dòng ' + index);
                  message.success('import hoàn thành');
                  setStateSpin(false);
                  setErrorArr(errorTable);
                } else {
                  setStateSpin(false);
                  message.error('lỗi import dòng + ' + index);
                  const object = {
                    row: index,
                    code: data_object.code,
                    key: index,
                  };
                  errorTable.push(object);
                  setErrorArr(prevErrorArr => [...prevErrorArr, object]);
                }
              } catch (err) { }
            }
          }
        });
      } else {
        message.error('lỗi import file');
        return;
      }
      store.dispatch(setGlobalState({ loading: false }));
      setFileList([]);
      setUploadedFile(null);
      setShiftDataArray([]);
      setErrorArr(errorTable);
    } catch (err) {
      message.error('lỗi import file');
      setFileList([]);
      setUploadedFile(null);
      setShiftDataArray([]);
      return;
    }
  }, [shiftDataArray]);

  const getListUrl = () => {
    getListExport({
      month: Number(monthLocal ? monthLocal : month),
      year: Number(yearLocal ? yearLocal : year),
    })
      .then(res => {
        var temp = [];
        if (res && res.data) {
          for (let i = 0; i < res.data.length; i++) {
            temp.push(res.data[i]);
          }
          setFileUrl(temp);
        } else {
          setFileUrl([]);
        }
      })
      .catch((error: any) => {
        console.log(error);
        setFileUrl([]);
      });
  };

  let write_date_url_1 = fileUrl.filter((item: any) => item.template === '1')[0]
    ?.write_date;
  let write_date_url_2 = fileUrl.filter((item: any) => item.template === '2')[0]
    ?.write_date;
  let write_date_url_3 = fileUrl.filter((item: any) => item.template === '3')[0]
    ?.write_date;
  let write_date_url_4 = fileUrl.filter((item: any) => item.template === '4')[0]
    ?.write_date;
  let write_date_url_5 = fileUrl.filter((item: any) => item.template === '5')[0]
    ?.write_date;
  let write_date_url_6 = fileUrl.filter((item: any) => item.template === '7')[0]
    ?.write_date;
  let write_date_url_7 = fileUrl.filter((item: any) => item.template === '8')[0]
    ?.write_date;
  let write_date_url_8 = fileUrl.filter((item: any) => item.template === '9')[0]
    ?.write_date;
  let write_date_url_12 = fileUrl.filter(
    (item: any) => item.template === '12'
  )[0];

  write_date_url_1 = write_date_url_1
    ? formatDateString(write_date_url_1)
    : null;
  write_date_url_2 = write_date_url_2
    ? formatDateString(write_date_url_2)
    : null;
  write_date_url_3 = write_date_url_3
    ? formatDateString(write_date_url_3)
    : null;
  write_date_url_4 = write_date_url_4
    ? formatDateString(write_date_url_4)
    : null;
  write_date_url_5 = write_date_url_5
    ? formatDateString(write_date_url_5)
    : null;
  write_date_url_6 = write_date_url_6
    ? formatDateString(write_date_url_6)
    : null;
  write_date_url_7 = write_date_url_7
    ? formatDateString(write_date_url_7)
    : null;
  write_date_url_8 = write_date_url_8
    ? formatDateString(write_date_url_8)
    : null;
  write_date_url_12 = write_date_url_12
    ? moment(write_date_url_12?.write_date).format('DD/MM/YYYY HH:mm:ss')
    : null;

  useEffect(() => {
    if (month && year) {
      getListUrl();
    }
  }, [month, year]);

  const onChangeMonth: DatePickerProps['onChange'] = (
    month: any,
    dateString: any
  ) => {
    setMonth(dateString);
    localStorage.setItem('month', dateString);
  };

  const onChangeYear: DatePickerProps['onChange'] = (
    year: any,
    dateString: any
  ) => {
    setYear(dateString);
    localStorage.setItem('year', dateString);
  };
  const monthLocal = localStorage.getItem('month');
  const yearLocal = localStorage.getItem('year');
  const [form] = Form.useForm();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [idRelative, setIdRelative] = useState<any>();
  const [open, setOpen] = useState(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [idDocument, setIdDocument] = useState<string>('');
  const [newDocument, setnewDocument] = useState<any>('');
  const [updateState, setUpdateState] = useState<boolean>(false);
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const { t } = useLocale();

  const showDrawer = () => {
    setOpen(true);
  };

  const handleCreate = async () => {
    await form.resetFields();
    showDrawer();
    setIsView(false);
    setIsCreating(true);
  };

  const onClose = () => {
    setOpen(false);
    setIsCreating(false);
    setIdRelative(null);
  };

  const handleView = async (item: any) => {
    console.log(item);

    const res = await getDocumentDetail(item?.id);

    setnewDocument(res);
    console.log(res);

    setIsView(true);
    showDrawer();
    setIdDocument(item?.id);
    setUpdateState(false);
    const convertData = {
      ...res,
    };
    console.log(res);
    if (res) {
      await form.setFieldsValue(convertData);
    }
  };

  const handleEdit = async (item: any) => {
    console.log('ITEMMM', item);
    const res = await getDocumentDetail(item?.id);

    setnewDocument(res);
    console.log(res);

    setIdDocument(item?.id);
    setUpdateState(false);
    setIsCreating(false);
    showDrawer();
    setIsView(false);
    const convertData = {
      ...res,
    };
    console.log(convertData, "RESS EDITTT");
    if (res) {
      await form.setFieldsValue(convertData);
    }
  };

  const handleDelete = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn phòng ban cần xóa');
      return;
    }
    const total_docs = selectedRowArr.some(item => item.total_employee > 0);
    if (total_docs) {
      $message.error('Không thể xóa tài liệu');
      setForceClearSelection(!forceClearSelection);
      setSelectedRowArr([]);
      return;
    }
    const ids = selectedRowArr.map(item => item.id);
    store.dispatch(setGlobalState({ loading: true }));
    await Promise.all(
      ids.map(async id => {
        deleteDocument(id)
          .then(res => {
            if (res) {
              $message.success('Xóa tài liệu thành công');
              setFoceUpdate(!foceUpdate);
              setForceClearSelection(!forceClearSelection);
              setSelectedRowArr([]);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            store.dispatch(setGlobalState({ loading: false }));
          });
      })
    );
  };

  const tableColums: MyPageTableOptions<IsDocumentList> = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      align: 'center',
      fixed: 'left',
    },

    {
      title: 'Từ ngày',
      dataIndex: 'from_date',
      key: 'from_date',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Đến ngày',
      dataIndex: 'to_date',
      key: 'to_date',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Link url',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      align: 'center',
      fixed: 'left',
    },

    {
      title: 'Download',
      key: 'download',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: (_, record) => (
        <ButtonDownload
          fileUrl={record.url}
          title="Báo cáo tổng hợp chấm công"
        />
      ),
    },
    {
      title: t({ id: 'action' }),
      key: 'action',
      fixed: 'right',
      width: 60,
      align: 'center',
      render: (item, record) => (
        <>
          <Space size="middle">
            <EyeOutlined
              style={{ fontSize: '14px', color: '#0960bd' }}
              onClick={() => handleView(item)}
            />

            <EditOutlined
              style={{ fontSize: '14px', color: '#0960bd' }}
              onClick={() => handleEdit(item)}
            />
          </Space>
        </>
      ),
    },
  ];
  const _getListDocument = async () => {
    const res = await getListDocument();
    if (res) {
      console.log('ressssssssssss', res);
      // setEmployees([...(res.results.data || [])]);
      return res;
    }
  };

  const customRequestFront = async ({ file, onSuccess, onError }: any) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // setFileFrontCCCD({
        //   data: reader.result,
        //   name: file.name,
        //   type: file.type,
        // });
        onSuccess(reader.result);
      };
      reader.onerror = onError;
      reader.readAsDataURL(file);
    } else {
      onError('No file selected');
    }
  };
  let sub_admin_role = localStorage.getItem('sub_admin_role');
  return (
    <>
      <div className="section">
        <Spin
          spinning={stateSpin}
          className="app-loading-wrapper"
          tip={<LocaleFormatter id="gloabal.tips.loading" />}></Spin>
        <div className="date-space">
          <Text>Tháng</Text>
          <DatePicker
            format={'MM'}
            placeholder=""
            onChange={onChangeMonth}
            picker="month"
            defaultValue={
              monthLocal
                ? moment(monthLocal, 'MM')
                : moment(Number(month), 'MM')
            }
          />
        </div>
        <div className="date-space">
          <Text>Năm</Text>
          <DatePicker
            placeholder=""
            onChange={onChangeYear}
            picker="year"
            defaultValue={moment()}
          />
        </div>
      </div>
      <div className="flex-list">
        <Row gutter={16}>
          <Col span={8}>
            <div className="section">
              <h2>Xuất file báo cáo</h2>
              <table>
                {
                  (sub_admin_role === 'none' || sub_admin_role === 'false') ? (
                    <>
                      <tr>
                        <td>
                          <ButtonDownload
                            fileUrl={
                              fileUrl.filter((item: any) => item.template === '1')[0]
                                ?.url
                            }
                            title="Báo cáo tổng hợp chấm công"
                          />
                        </td>
                        <td>
                          <p>Báo cáo tổng hợp chấm công</p>
                          {write_date_url_1 ? (
                            <p>Ngày cập nhật: {write_date_url_1}</p>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>


                      <tr>
                        <td>
                          <ButtonDownload
                            fileUrl={
                              fileUrl.filter(
                                (item: any) => item.template === '2'
                              )[0]?.url
                            }
                            title="Báo cáo chấm công đếm số lần"
                          />
                        </td>
                        <td>
                          <p>Báo cáo chấm công đếm số lần</p>
                          {write_date_url_2 ? (
                            <p>Ngày cập nhật: {write_date_url_2}</p>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <ButtonDownload
                            fileUrl={
                              fileUrl.filter(
                                (item: any) => item.template === '3'
                              )[0]?.url
                            }
                            title="Báo cáo đi muộn dưới 5p và trên 5p"
                          />
                        </td>
                        <td>
                          <p>Báo cáo đi muộn dưới 5p và trên 5p</p>
                          {write_date_url_3 ? (
                            <p>Ngày cập nhật: {write_date_url_3}</p>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <ButtonDownload
                            fileUrl={
                              fileUrl.filter(
                                (item: any) => item.template === '4'
                              )[0]?.url
                            }
                            title="Báo cáo ca đêm, ca gãy"
                          />
                        </td>
                        <td>
                          <p>Báo cáo ca đêm, ca gãy</p>{' '}
                          {write_date_url_4 ? (
                            <p>Ngày cập nhật: {write_date_url_4}</p>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <ButtonDownload
                            fileUrl={
                              fileUrl.filter(
                                (item: any) => item.template === '5'
                              )[0]?.url
                            }
                            title="Báo cáo phép bù"
                          />
                        </td>
                        <td>
                          <p>Báo cáo phép bù</p>{' '}
                          {write_date_url_5 ? (
                            <p>Ngày cập nhật: {write_date_url_5}</p>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <ButtonDownload
                            fileUrl={
                              fileUrl.filter(
                                (item: any) => item.template === '7'
                              )[0]?.url
                            }
                            title="Báo cáo ca ăn"
                          />
                        </td>
                        <td>
                          <p>Báo cáo ca ăn</p>{' '}
                          {write_date_url_6 ? (
                            <p>Ngày cập nhật: {write_date_url_6}</p>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <ButtonDownload
                            fileUrl={
                              fileUrl.filter(
                                (item: any) => item.template === '8'
                              )[0]?.url
                            }
                            title="Báo cáo tổng hợp chấm công HO V2"
                          />
                        </td>
                        <td>
                          <p>Báo cáo tổng hợp chấm công HO V2</p>{' '}
                          {write_date_url_7 ? (
                            <p>Ngày cập nhật: {write_date_url_7}</p>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <ButtonDownload
                            fileUrl={
                              fileUrl.filter(
                                (item: any) => item.template === '9'
                              )[0]?.url
                            }
                            title="Báo cáo phép/bù tồn nhân sự đã nghỉ việc"
                          />
                        </td>
                        <td>
                          <p>Báo cáo phép/bù tồn nhân sự đã nghỉ việc</p>{' '}
                          {write_date_url_8 ? (
                            <p>Ngày cập nhật: {write_date_url_8}</p>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <ButtonDownload
                            fileUrl={
                              fileUrl.filter(
                                (item: any) => item.template === '12'
                              )[0]?.url
                            }
                            title="Báo cáo kpi báo cáo tuần"
                          />
                        </td>
                        <td>
                          <p>Báo cáo kpi báo cáo tuần</p>{' '}
                          {write_date_url_12 ? (
                            <p>Ngày cập nhật: {write_date_url_12}</p>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td>
                        <ButtonDownload
                          fileUrl={
                            fileUrl.filter(
                              (item: any) => item.template === '2'
                            )[0]?.url
                          }
                          title="Báo cáo chấm công đếm số lần"
                        />
                      </td>
                      <td>
                        <p>Báo cáo chấm công đếm số lần</p>
                        {write_date_url_2 ? (
                          <p>Ngày cập nhật: {write_date_url_2}</p>
                        ) : (
                          <></>
                        )}
                      </td>
                    </tr>
                  )
                }
              </table>
            </div>
          </Col>
          <Col span={16} style={{ paddingRight: '50px' }}>
            <MyPage
              rowkey="id"
              pageApi={_getListDocument}
              title={'Danh sách tài liệu'}
              forceUpdate={foceUpdate}
              tableOptions={tableColums}
              setSelectedRowData={setSelectedRowArr}
              multipleSelection
              selectedRowArr={selectedRowArr}
              slot={
                <>
                  <div>
                    <Button
                      type="primary"
                      onClick={handleCreate}
                      style={{ marginLeft: 16 }}>
                      Thêm mới
                    </Button>
                    <Button type="primary" onClick={handleDelete}>
                      {'Xóa'}
                    </Button>
                  </div>
                </>
              }
            />
            <FormDocument
              form={form}
              setFoceUpdate={setFoceUpdate}
              foceUpdate={foceUpdate}
              idEmployee={idDocument}
              open={open}
              isView={isView}
              showDrawer={showDrawer}
              onClose={onClose}
              isCreating={isCreating}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};
export default index;
