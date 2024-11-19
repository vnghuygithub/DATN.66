import { getListExport } from '@/api/export/export.api';
import type { ColumnsType } from 'antd/es/table';
import {
  IUpdateExportBody,
  IUpdateExportParams,
} from '@/interface/export/export';
import { useEffect, useState, useCallback } from 'react';
// import ButtonDownload from './component/button';
import './style.css';
import { Typography, DatePicker, DatePickerProps, Button, Upload } from 'antd';
import moment from 'moment';
import {
  UploadOutlined,
  DownloadOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import { calculateAttendanceReport } from '@/api/weeklyreport/weeklyreport';
import { Card, Spin, message, Table, Row, Col } from 'antd';
import { importReportShift } from '@/api/export/export.api';
import store from '@/stores';
import { useDispatch, useSelector } from 'react-redux';
import { setGlobalState } from '@/stores/global.store';
import { LocaleFormatter } from '@/locales';
import * as XLSX from 'xlsx';
import { forEach, set } from 'lodash';
import { data } from '@/mock/applicationlist/list';
import { error } from 'console';
import { formatDateString } from '@/utils/formatDate';
import { mobileResponsive } from '@/utils/mobileResponsive';
import { updateUserSummary } from '@/api/employee_weekly_report/employeeWeeklyReport.api';
import {
  IGetAttendanceContentParams,
  IGetAttendanceParams,
} from '@/interface/weeklyreport/type';
import { Exception } from 'sass';

interface errorObject {
  row: number | string | any;
  code: string | any;
}

interface errorObjectShift {
  row: number | string | any;
  code: string | any;
}

const shiftcolumns: ColumnsType<errorObjectShift> = [
  {
    title: 'Mã Ca',
    dataIndex: 'shift_name',
    width: 245,
    align: 'center',
  },
];
const columns: ColumnsType<errorObject> = [
  // {
  //   width: 100,
  //   render: () => <AlertOutlined />,
  // },
  // {

  //   title: 'Số thứ tự',
  //   dataIndex: 'row',
  //   width: 450,
  //   align: 'center',
  //   render: (text: string) => <a>{text}</a>,
  // },
  {
    title: 'Mã nhân viên',
    dataIndex: 'code',
    width: 245,
    align: 'center',
  },
];

const index = () => {
  const { isMobile } = mobileResponsive();
  const [uploadedFile, setUploadedFile] = useState<any>();
  const { loading } = useSelector(state => state.global);
  const [fileList, setFileList] = useState<any[]>([]);
  const [shiftDataArray, setShiftDataArray] = useState<any[]>([]);
  const [stateSpin, setStateSpin] = useState<any>(false);
  const [errorArr, setErrorArr] = useState<any[]>([]);
  const [errorShiftArr, setErrorShiftArr] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
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
            new_row.push(row['__EMPTY_1'].trim());
            new_arr.push(new_row);
            for (const key in row) {
              if (isNaN(parseInt(key)) == false) {
                new_row.push(row[key]);
              }
            }
          }
        });

        setStartDate(convertNumberToStringDate(new_arr[0][1], 'yyyy-mm-dd'));
        setEndDate(
          convertNumberToStringDate(
            new_arr[0][new_arr[0].length - 1],
            'yyyy-mm-dd'
          )
        );
        setShiftDataArray(new_arr);
        message.success('Đọc file thành công.');
      } catch (error) {
        message.error('Error parsing the file.');
      }
    };
    reader.readAsBinaryString(file);
    // return false; // Prevent the default upload behavior
  };

  const ClearError = () => {
    setErrorArr([]);
    setErrorShiftArr([]);
  };

  const recursiveUpdateSummary = async (pageNumber: number) => {
    try {
      const args = [
        localStorage.getItem('company_name'),
        startDate,
        endDate,
        500,
        pageNumber,
        false,
      ];
      const params: IGetAttendanceContentParams = {
        args,
      };
      const body: IGetAttendanceParams = {
        params,
      };
      const updatePromise = await updateUserSummary(body);
      if (updatePromise) {
      }
      //  store.dispatch(setGlobalState({ loading: true }));
      if (updatePromise && updatePromise.result) {
        // console.log("read_complete" , updatePromise.result.total_records)
        //  (await updatePromise.then((res) => {

        if (updatePromise.result.total_records === 500) {
          if (pageNumber <= 9) {
            message.success(
              'Đồng bộ dữ liệu thành công ' + (pageNumber + 1) * 10 + '%'
            );
          } else {
            message.success(
              'Đồng bộ dữ liệu thành công ' + (9 * 10 + pageNumber + 1) + '%'
            );
          }

          recursiveUpdateSummary(pageNumber + 1);
          // setStateSpin(true);
          //  store.dispatch(setGlobalState({ loading: false }));
        } else if (updatePromise.result.total_records < 500) {
          message.success('Đồng bộ hóa dữ liệu thành công ' + '100%');
          setStateSpin(true);
          setStateSpin(false);
          // store.dispatch(setGlobalState({ loading: false }));
        }
      }
      //  )
      //  );
    } catch (err) {
      setStateSpin(false);
    }
  };

  const convertFormatDate = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const convertNumberToStringDate = (dateNum: any, format: any) => {
    const excelBaseDate = new Date('1899-12-30'); // Excel base date is 1900-01-01, but it erroneously considers 1900-02-29 as a valid date, so we use 1899-12-30

    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

    const date = new Date(
      excelBaseDate.getTime() + dateNum * millisecondsPerDay
    );

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed, so add 1
    const day = date.getDate().toString().padStart(2, '0');

    let formattedDateString = `${year}-${month}-${day}`;
    if (format === 'dd/mm/yyyy') {
      formattedDateString = `${day}/${month}/${year}`;
    } else if (format === 'yyyy-mm-dd') {
      formattedDateString = `${year}-${month}-${day}`;
    }
    return formattedDateString;
  };

  function formatDateToString(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return date
      .toLocaleDateString(undefined, options)
      .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1');
  }

  const recursiveCalculate = async (
    start: any,
    end: any,
    promiseArr: any[]
  ): Promise<any> => {
    const deltaInDays = 7;
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);
    const nextEndDate = new Date(
      Math.min(
        startDateTime.getTime() + deltaInDays * 24 * 60 * 60 * 1000,
        endDateTime.getTime()
      )
    );
    const nextEndDateString = formatDateToString(nextEndDate);
    console.log('start', start, ' - ', nextEndDateString, 'end');

    if (startDateTime.getTime() <= nextEndDate.getTime()) {
      let args: any[] = [
        convertFormatDate(start),
        convertFormatDate(nextEndDateString),
        '',
      ];
      const params: IGetAttendanceContentParams = {
        args,
      };
      const body: IGetAttendanceParams = {
        params,
      };
      const apiPromises = await calculateAttendanceReport(body);
      if (apiPromises) {
        message.success(
          'Tính toán dữ liệu thành công từ ' +
            start +
            ' đến ' +
            nextEndDateString
        );
        if (nextEndDate.getTime() < endDateTime.getTime()) {
          return recursiveCalculate(
            nextEndDateString,
            end,
            promiseArr.concat(apiPromises)
          );
        } else {
          return promiseArr.concat(apiPromises);
        }
      }
    } else {
      return promiseArr;
    }
  };

  useEffect(() => {}, [errorArr, errorShiftArr]);

  const handleRemove = (file: any) => {
    const index = fileList.indexOf(file);
    if (index !== -1) {
      const newFileList = [...fileList];
      newFileList.splice(index, 1); // Remove the file from the newFileList array
      setFileList(newFileList); // Update the state to trigger a re-render
    }
  };

  const handleSubmitImport = useCallback(async () => {
    const errorShiftTable = [] as any;
    const errorEmployeeTable = [] as any;
    const promises = [] as any;
    let promiseCalculate = [] as any;
    try {
      if (uploadedFile != null && uploadedFile != false) {
        setStateSpin(true);
        const rowDate = shiftDataArray[0];

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
              promises.push(
                importReportShift(data_object).then(res => {
                  if (res.status === 'successfully') {
                    message.success('import thành công dòng ' + index);
                  } else if (res.status == 'error_off_insufficient') {
                    message.error(
                      res.employee_name + ' quá số buổi OFF quy định'
                    );
                  } else if (res.status === 'employee_error') {
                    message.error('lỗi import dòng + ' + index);
                    const object = {
                      row: index,
                      code: data_object.code,
                      key: index,
                    };
                    errorEmployeeTable.push(object);

                    setErrorArr(prevErrorArr => [...prevErrorArr, object]);
                  } else if (res.status === 'shift_error') {
                    message.error('lỗi import dòng + ' + index);
                    const object = {
                      row: index,
                      shift_name: res.shift_name,
                      key: index,
                    };

                    // setErrorShiftArr(errorShiftArr)
                    setErrorShiftArr(prevErrorShiftArr => [
                      ...prevErrorShiftArr,
                      object,
                    ]);
                  } else if (res.status === 'error') {
                    message.error(res.message + ' tại dòng ' + index);
                  }
                  return res;
                })
              );
            } else if (index == shiftDataArray.length - 1) {
              try {
                promises.push(
                  importReportShift(data_object).then(res => {
                    if (res.status === 'successfully') {
                      message.success('import thành công dòng ' + index);
                      message.success('import hoàn thành');
                      setStateSpin(true);
                    } else if (res.status == 'error_off_insufficient') {
                      setStateSpin(true);
                      message.error(
                        res.employee_name + ' quá số buổi off quy định'
                      );
                    } else if (res.status === 'employee_error') {
                      setStateSpin(true);
                      message.error('lỗi import dòng + ' + index);
                      const object = {
                        row: index,
                        code: data_object.code,
                        key: index,
                      };

                      setErrorArr(prevErrorArr => [...prevErrorArr, object]);
                    } else if (res.status === 'shift_error') {
                      setStateSpin(true);
                      message.error('lỗi import dòng + ' + index);
                      const object = {
                        row: index,
                        shift_name: res.shift_name,
                        key: index,
                      };

                      setErrorShiftArr(prevErrorShiftArr => [
                        ...prevErrorShiftArr,
                        object,
                      ]);
                    } else {
                      setStateSpin(true);
                      message.error('lỗi import dòng + ' + index);
                    }
                    return res;
                  })
                );
              } catch (err) {}
            }
          }
        });
        Promise.all(promises).then(async () => {
          // setStateSpin(false)
          if (errorShiftTable.length > 0 || errorEmployeeTable.length > 0) {
            setStateSpin(false);
          } else {
            const PromiseCalculate = await recursiveCalculate(
              startDate,
              endDate,
              promiseCalculate
            );
            if (PromiseCalculate) {
              // PromiseCalculate.then(async (res) => {
              //   if (res){
              //     console.log("response calculate loaded")
              //     const apiPromises = await Promise.all(res);
              //     if (apiPromises){
              recursiveUpdateSummary(0);
              //       }
              //     }
              //   })
              // }
              // if (apiPromises){
              //   recursiveUpdateSummary(0)
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
      // setErrorArr(errorTable)
    } catch (err) {
      message.error('lỗi import file');
      setFileList([]);
      setUploadedFile(null);
      setShiftDataArray([]);
      return;
    }
  }, [shiftDataArray]);

  return (
    <>
      <div className="section">
        <Spin
          spinning={stateSpin}
          className="app-loading-wrapper"
          tip={<LocaleFormatter id="gloabal.tips.loading" />}></Spin>
        <h2
          style={isMobile ? { textAlign: 'center' } : { marginLeft: '22rem' }}>
          Phân ca nhân viên
        </h2>
        <div className="contentbox">
          <div className="interact">
            <div className="parent">
              <Card size={'small'} className="child">
                <div className="upload">
                  <div>
                    <Upload
                      fileList={fileList}
                      customRequest={customRequest}
                      maxCount={1}
                      beforeUpload={handleBeforeUpload}
                      accept=".xlsx">
                      <Button
                        style={{}}
                        size={'middle'}
                        icon={<UploadOutlined />}>
                        Chọn file import
                      </Button>
                    </Upload>
                  </div>
                  <div style={{ display: 'flex' }}>
                    {/* <Button className='checkfile'  style={{ marginTop: '1rem' , position:'relative'   }} type="primary" >Kiểm tra file</Button> */}
                    <Button
                      className="submitfile"
                      type="primary"
                      onClick={handleSubmitImport}>
                      Import Data
                    </Button>
                  </div>
                </div>
              </Card>

              <Card
                size={'small'}
                className="child"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: '3px',
                  justifyContent: 'center',
                }}>
                <Button
                  icon={<DownloadOutlined />}
                  type="primary"
                  href="https://dl.dropboxusercontent.com/scl/fi/e8arss7j7cwurouw5ahhn/Roster-MMN-08.2023-01-20.08.xlsx?rlkey=on1apps9x86itwgj1gg2vynb4&dl=0">
                  File import mẫu
                </Button>
              </Card>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                <Button
                  onClick={ClearError}
                  style={{
                    boxShadow: '0 3px 0 rgba(0, 0, 0, 0.02)',
                    float: 'right',
                    margin: '1rem 2.9rem 1rem 0rem',
                  }}>
                  Clear Lỗi
                </Button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ flex: '1' }}>
                  {errorShiftArr.length > 0 ? (
                    <div
                      style={{
                        margin: '0 1.5rem 0 1.5rem',
                        display: 'flex',
                        justifyContent: 'center',
                      }}>
                      <Card size={'small'} title="Ca không tồn tại">
                        <Table
                          columns={shiftcolumns}
                          dataSource={errorShiftArr}
                        />
                      </Card>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div style={{ flex: '1' }}>
                  {errorArr.length > 0 ? (
                    <div
                      style={{
                        margin: '0 1.5rem 0 1.5rem',
                        display: 'flex',
                        justifyContent: 'center',
                      }}>
                      <Card size={'small'} title="Mã nhân viên không tồn tại">
                        <Table columns={columns} dataSource={errorArr} />
                      </Card>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            {/* <table>
            <tr>
              <td>
                <div style={{ display: 'flex', position: 'relative' }} >
                  <div>
                    <Upload fileList={fileList} customRequest={customRequest} maxCount={1} beforeUpload={handleBeforeUpload} accept='.xlsx' >
                      <Button icon={<UploadOutlined />}>Chọn file import</Button>
                    </Upload>
                    <Button style={{ marginTop: '0.5rem' }} type="primary" onClick={handleSubmitImport}>Import Data</Button>
                  </div>
                  <div style={{ position: 'absolute', marginLeft: '9rem' }} >
                    <Button icon={<DownloadOutlined />} style={{ display: 'float', alignItems: 'top', position: 'absolute' }} type="primary" href="https://dl.dropboxusercontent.com/scl/fi/e8arss7j7cwurouw5ahhn/Roster-MMN-08.2023-01-20.08.xlsx?rlkey=on1apps9x86itwgj1gg2vynb4&dl=0">File import mẫu</Button>
                  </div>

                </div>
              </td>
            </tr>
            {errorArr.length > 0 ? <tr style={{ marginTop: '10rem' }}>
              <Card style={{ marginTop: '4rem' }} title='Lỗi Import Phân Ca'>
                <Table columns={columns} dataSource={errorArr} />
              </Card>
            </tr> : <></>}

          </table> */}
          </div>
          <div className="instruction">
            <div className="instructioncontent">
              <h2>Hướng dẫn import phân ca</h2>
              <h3>
                Bước 1: Tải file excel mẫu import phân ca tại nút File import
                mẫu
              </h3>
              <h3>
                Bước 2: Chỉnh sửa file excel muốn import giống với file excel
                mẫu
              </h3>
              <h3>
                Bước 3: Chọn file excel muốn import tại nút Chọn file import
                <br></br>Khi chọn file import xong, bấm nút Import data, hệ
                thống sẽ trả về kết quả nếu file bị lỗi tại 2 bảng ở dưới : Danh
                sách ca không tồn tại và Mã nhân viên không tồn tại. Nhân sự
                kiểm tra lại file excel.<br></br>
                Trong quá trình import ca, hệ thống sẽ hiển thị thông báo lên
                màn hình. Nếu import lỗi, hệ thống sẽ báo lỗi, và nhân sự có thể
                import lại file, các ca sẽ được ghi đè.
              </h3>
            </div>
            <div className="instructioncontent1">
              <h3>
                <i>Chú ý :</i>
              </h3>
              <h3>
                <i>
                  -Trong quá trình import vui lòng không tắt hoặc thoát hệ thống
                  cho đến khi import xong
                </i>
              </h3>
              <h3>
                <i>
                  -Hệ thống chỉ thực hiện import khi file giống với file mẫu,
                  nếu file import khác với file mẫu thì hệ thống sẽ không
                  import.
                </i>
              </h3>
              <h3>
                <i>
                  -Các ca trong file import phải là các ca đã có trên hệ thống.
                  Kiểm tra các ca đã có trên hệ thống hay chưa tại màn hình Danh
                  sách ca.
                </i>
              </h3>
            </div>
          </div>
        </div>
      </div>
      {/* <h2>lmaoxd</h2> */}
    </>
  );
};

export default index;
