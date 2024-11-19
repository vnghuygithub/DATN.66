import { css } from '@emotion/react';
import { ColumnsType } from 'antd/lib/table/interface';
import { MyResponse } from '@/api/request';
import MyTable from '@/components/core/table';
import { PageData } from '@/interface';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useStates } from '@/utils/use-states';
import MyAside, { MyAsideProps } from '../aside';
import MyRadioCards, { MyRadioCardssOption } from '../radio-cards';
import MySearch from '../search';
import MyTabs, { MyTabsOption } from '../tabs';
import { mobileResponsive } from '@/utils/mobileResponsive';
import {
  Button,
  Card,
  Drawer,
  Modal,
  Spin,
  Transfer,
  message,
  Input,
  DatePicker,
} from 'antd';
import {
  ArrowRightOutlined,
  ExportOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import {
  convertToTimeFormat,
  extractAndFormatDate,
  extractTextInSingleQuotes,
  isDuplicate,
  removeDuplicates,
} from '@/utils/common';
import * as XLSX from 'xlsx';
import { getKpiWeeklyReportSummary } from '@/api/kpi/kpi_weekly_report_summary.api';
import { useDispatch, useSelector } from 'react-redux';
import { clearSearchData } from '@/stores/search.store';
interface SearchApi {
  (params?: any): MyResponse<PageData<any>>;
}

type ParseDataType<S> = S extends (
  params?: any
) => MyResponse<PageData<infer T>>
  ? T
  : S;

export type MyPageTableOptions<S> = ColumnsType<S>;
export interface PageProps<S> {
  searchRender?: React.ReactNode;
  pageApi?: any;
  rowkey?: string;
  pageParams?: object;
  tableOptions?: MyPageTableOptions<ParseDataType<S>>;
  multipleSelection?: boolean;
  logData?: any;
  tableRender?: (
    data: MyPageTableOptions<ParseDataType<S>>[]
  ) => React.ReactNode;
  asideData?: MyAsideProps['options'];
  asideKey?: string;
  asideValue?: string | number;
  radioCardsData?: MyRadioCardssOption[];
  radioCardsValue?: string | number;
  asideTreeItemRender?: MyAsideProps['titleRender'];
  tabsData?: MyTabsOption[];
  tabsValue?: string | number;
  slot?: React.ReactNode;
  title?: string;
  forceUpdate?: boolean;
  setDataExport?: React.Dispatch<React.SetStateAction<never[]>>;
  labelWidth?: number;
  setSelectedRowData?: React.Dispatch<React.SetStateAction<any[]>>;
  forceClearSelection?: boolean;
  expandedRowRender?: any;
  updateData?: any;
  disabledPagination?: any;
  selectedRowArr?: any;
}

export interface RefPageProps {
  setAsideCheckedKey: (key?: string) => void;
  load: (data?: object) => Promise<void>;
}
const BasePage = <S extends SearchApi>(
  props: PageProps<S>,
  ref: React.Ref<RefPageProps>
) => {
  const {
    pageApi,
    pageParams,
    searchRender,
    slot,
    title,
    tableOptions,
    multipleSelection,
    tableRender,
    asideKey,
    asideData,
    asideValue,
    asideTreeItemRender,
    radioCardsData,
    radioCardsValue,
    tabsData,
    tabsValue,
    logData,
    forceUpdate,
    setDataExport,
    labelWidth,
    setSelectedRowData,
    forceClearSelection,
    rowkey,
    expandedRowRender,
    updateData,
    disabledPagination,
    selectedRowArr,
  } = props;
  const [pageData, setPageData] = useStates<PageData<ParseDataType<S>>>({
    pageSize: 20,
    pageNum: 1,
    total: 0,
    data: [],
  });
  const [loading, setLoading] = useState(false);
  const { isMobile } = mobileResponsive();
  const [asideCheckedKey, setAsideCheckedKey] = useState(asideValue);
  const [showLog, setShowLog] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const { searchData, trigger } = useSelector(state => state.search);
  const dispatch = useDispatch();

  useEffect(() => {
    if (asideData) {
      setAsideCheckedKey(asideData[0].key);
    }
  }, [asideData]);
  const [paramsData, setparamsData] = useState<Record<string, any>>({});
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const handleChange = (nextTargetKeys: string[]) => {
    setSelectedKeys(nextTargetKeys);
  };
  const getPageData = useCallback(
    async (params: Record<string, any> = {}) => {
      if (asideKey && !asideCheckedKey) return;
      if (pageApi) {
        setLoading(true);
        params = { ...paramsData };
        const obj = {
          ...params,
          ...pageParams,
          page_size: pageData.pageSize,
          page: pageData.pageNum,
          [asideKey!]: asideCheckedKey,
        };
        const res = await pageApi(obj);
        if (res) {
          setPageData({ total: res?.results?.total, data: res?.results?.data });
          setDataExport && setDataExport(res.results.data);
          setLoading(false);
        }
      }
    },
    [
      // pageApi,
      pageParams,
      pageData.pageSize,
      pageData.pageNum,
      asideKey,
      asideCheckedKey,
      paramsData,
    ]
  );
  const [dateData, SetDateData] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [log, setLog] = useState<any>([]);
  const onChangePageData = (weekValue: any) => {
    const stringweekValue =
      weekValue._d.getFullYear() +
      '-' +
      (weekValue._d.getMonth() + 1) +
      '-' +
      '1';
    SetDateData(stringweekValue);
    console.log(stringweekValue);
  };
  const updatePageData = useEffect(() => {
    if (dateData != '') {
      getKpiWeeklyReportSummary(dateData).then((res: any) => {
        if (res) {
          setPageData({ total: res?.results?.total, data: res?.results?.data });
          setDataExport && setDataExport(res.results.data);
          // setLoading(false);
        }
      });
    }
    // pageApi(dateData).then((res: any) => {
    //   if (res) {
    //     setPageData({ total: res?.results?.total, data: res?.results?.data });
    //     setDataExport && setDataExport(res.results.data);
    //     setLoading(false);
    //   }
    // })
  }, [dateData]);
  const getLogData = async () => {
    setLoading(true);
    const res = await logData();
    if (res) {
      setLog(removeDuplicates(res?.results?.data));
      setLoading(false);
    }
  };
  useEffect(() => {
    setIsMounted(true);
    // getLogData();
    return () => {
      setIsMounted(false);
    };
  }, [forceUpdate]);

  useEffect(() => {
    setTimeout(() => {
      if (isMounted) {
        setSelectedRowKeys([]);
        setLoading(false);
      }
    }, 1000);
  }, [forceClearSelection, isMounted]);
  useEffect(() => {
    getPageData();
  }, [getPageData, forceUpdate]);
  const onSearch = (searchParams: Record<string, any>) => {
    setparamsData(searchParams);
    setPageData({ pageNum: 1 });
  };

  
  useEffect(() => {
    console.log(searchData)
    if (searchData.length > 0) {
      const handleData = async () => {
        await setparamsData(searchData);

        dispatch(clearSearchData());
      };
      handleData();
    }
  }, [searchData, trigger]);
  // console.log(searchData, 'searchData');

  const onSelectAsideTree: MyAsideProps['onSelect'] = ([key]) => {
    setAsideCheckedKey(key);
  };

  const onPageChange = (pageNum: number, pageSize?: number) => {
    setPageData({ pageNum });
    if (pageSize) {
      setPageData({ pageSize });
    }
  };

  useImperativeHandle(ref, () => ({
    setAsideCheckedKey,
    load: (data?: object) => getPageData(data),
  }));
  const handleClose = () => {
    setShowLog(false);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const onSelectChange = (
  //   newSelectedRowKeys: React.Key[],
  //   selectedRows: any
  // ) => {

  //   if (Array.isArray(selectedRows) && selectedRows.length > 0) {
  //     setSelectedRowData &&
  //       setSelectedRowData([
  //         ...selectedRowArr,
  //         selectedRows[selectedRows.length - 1],
  //       ]);
  //   } else {
  //     setSelectedRowData &&
  //       setSelectedRowData([...selectedRowArr, ...selectedRows]);
  //   }
  //   setSelectedRowKeys(newSelectedRowKeys);
  // };
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: any
  ) => {
    setSelectedRowData &&
      setSelectedRowData(value => {
        const uniqueRows = new Set([...value, ...selectedRows]);
        return Array.from(uniqueRows);
      });
    setSelectedRowKeys(newSelectedRowKeys);
  };
  useEffect(() => {
    if (selectedRowKeys.length === 0) {
      setSelectedRowData && setSelectedRowData([]);
    }
  }, [selectedRowKeys]);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
    renderCell: (
      checked: boolean,
      record: any,
      index: number,
      originNode: React.ReactNode
    ) => {
      if (record.id) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {originNode}
          </div>
        );
      } else {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}></div>
        );
      }
    },
  };
  const fetchAllData = async () => {
    const res = await pageApi({ ...paramsData, page_size: 10000 });
   console.log(res)
    if (res) {
      return res.results.data;
    }
  };
  const handleExportExcel = async (selectedKeys: string[]) => {
    if (selectedKeys.length === 0) {
      message.error('Xin vui lòng chọn ít nhất một trường.');
      return;
    }
      
//     const parseDate = (dateString: string) => {
//       const date = new Date(dateString);
//       return !isNaN(date.getTime()) ? date : null; // Trả về Date hoặc null nếu không hợp lệ
//     };
    
//     let dataToExport: any[] = [];
    
//     // Giả sử bạn có selectedRowArr và dateData
//     if (Array.isArray(selectedRowArr) && selectedRowArr.length > 0) {
//       dataToExport = selectedRowArr.map((item: any) => ({
//         ...item,
//         workingday: parseDate(item.workingday), // Giữ nguyên kiểu Date
//         severance_day: parseDate(item.severance_day), // Giữ nguyên kiểu Date
//       }));
//     } else if (dateData !== '') {
//       dataToExport = await getKpiWeeklyReportSummary(dateData).then(
//         (res: any) => {
//           if (res) {
//             return res.results.data.map((item: any) => ({
//               ...item,
//               workingday: parseDate(item.workingday),
//               severance_day: parseDate(item.severance_day),
//             }));
//           }
//           return []; // Trả về mảng rỗng nếu không có dữ liệu
//         }
//       );
//     } else {
//       dataToExport = await fetchAllData().then((data: any[]) =>
//         data.map((item: any) => ({
//           ...item,
//           workingday: parseDate(item.workingday),
//           severance_day: parseDate(item.severance_day),
//         }))
//       );
//     }
    
   
//     const titleMap = new Map();
//     tableOptions?.forEach(column => {
//       if (column.key && column.title) {
//         titleMap.set(column.key, column.title);
//       }
//     });

//     const titlesToExclude = ['ID', 'no'];
//     let keysToExclude = [...titleMap.entries()]
//       .filter(([key, title]) => titlesToExclude.includes(title))
//       .map(([key]) => key);

//     const filteredSelectedKeys = selectedKeys.filter(
//       key => !keysToExclude.includes(key)
//     );

//     dataToExport = dataToExport.map((item: any, index: number) => {
//       const newItem: any = { STT: index + 1 };
//       filteredSelectedKeys.forEach(key => {
//         if (item && item.hasOwnProperty(key)) {
//           newItem[titleMap.get(key)] =
//             item[key] === false ? 'X' : item[key] === true ? 'V' : item[key];
//         }
//       });
//       return newItem;
//     });

//     const ws = XLSX.utils.json_to_sheet(dataToExport);

//     ws['!cols'] = Object.keys(dataToExport[0]).map(key => ({
//       wch:
//         Math.max(
//           ...dataToExport.map((obj: any) => (`${obj[key]}` || '').length),
//           key.length
//         ) + 1,
//     }));
//     // Đặt định dạng ngày trong Excel để luôn là DD/MM/YYYY
// Object.keys(ws).forEach(cell => {
//   if (ws[cell].v instanceof Date) {
//     ws[cell].z = 'dd/mm/yyyy'; // Định dạng ngày rõ ràng
//   }
// });

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//     XLSX.writeFile(wb, `${title}.xlsx`);
//     onClose();
//     message.success('Xuất file thành công.');
let dataToExport: any[];
if (Array.isArray(selectedRowArr) && selectedRowArr.length > 0) {
  dataToExport = selectedRowArr;
} else if (dateData !== '') {
  dataToExport = await getKpiWeeklyReportSummary(dateData).then(
    (res: any) => {
      if (res) {
        return res.results.data;
      }
    }
  );
} else {
  dataToExport = await fetchAllData();
}

const titleMap = new Map();
tableOptions?.forEach(column => {
  if (column.key && column.title) {
    titleMap.set(column.key, column.title);
  }
});

const titlesToExclude = ['ID', 'no'];
let keysToExclude = [...titleMap.entries()]
  .filter(([key, title]) => titlesToExclude.includes(title))
  .map(([key]) => key);

const filteredSelectedKeys = selectedKeys.filter(
  key => !keysToExclude.includes(key)
);

dataToExport = dataToExport.map((item: any, index: number) => {
  const newItem: any = { STT: index + 1 }; // Create STT based on index
  filteredSelectedKeys.forEach(key => {
    if (item && item.hasOwnProperty(key)) {
      newItem[titleMap.get(key)] =
        item[key] === false ? 'X' : item[key] === true ? 'V' : item[key];
    }
  });
  return newItem;
});

const ws = XLSX.utils.json_to_sheet(dataToExport);

ws['!cols'] = Object.keys(dataToExport[0]).map(key => ({
  wch:
    Math.max(
      ...dataToExport.map((obj: any) => (`${obj[key]}` || '').length),
      key.length
    ) + 1,
}));

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
XLSX.writeFile(wb, `${title}.xlsx`);
onClose();
message.success('Xuất file thành công.');
  };

  const handleShowExportOptions = async () => {
    const dataToExport = await fetchAllData();
    if (dataToExport.length === 0 || !dataToExport) {
      message.error('Không có dữ liệu để xuất.');
      return;
    }
    setShowExportOptions(true);
  };
  const onClose = () => {
    setShowExportOptions(false);
  };
  return (
    <>
      <div css={styles}>
        {tabsData && (
          <MyTabs
            className="tabs"
            options={tabsData}
            defaultValue={tabsData[0].value || tabsValue}
          />
        )}
        <div className="tabs-main">
          {asideData && (
            <MyAside
              options={asideData}
              selectedKeys={asideCheckedKey ? [asideCheckedKey] : undefined}
              titleRender={asideTreeItemRender}
              onSelect={onSelectAsideTree}
            />
          )}
          <div className="aside-main">
            {searchRender && (
              <Card
                size="small"
                style={{ marginBottom: 16 }}
                className="search-all">
                <MySearch
                  loading={loading}
                  className="search"
                  onSearch={onSearch}
                  labelCol={{ style: { width: labelWidth } }}
                  labelAlign="right">
                  {searchRender}
                </MySearch>
              </Card>
            )}
            {updateData && (
              <Card size="small" style={{ marginBottom: 16 }}>
                <DatePicker
                  placeholder="Nhập từ khóa"
                  picker="month"
                  onChange={e => {
                    onChangePageData(e);
                  }}
                />
              </Card>
            )}
            {radioCardsData && (
              <MyRadioCards
                options={radioCardsData}
                defaultValue={radioCardsValue || radioCardsData[0].value}
              />
            )}
            {tableOptions && (
              <div className="table">
                <Card
                  size="small"
                  title={title}
                  extra={
                    <>
                      {logData && (
                        <Button type="primary" onClick={() => setShowLog(true)}>
                          <HistoryOutlined />
                        </Button>
                      )}
                      <Button type="primary" onClick={handleShowExportOptions}>
                        <ExportOutlined />
                      </Button>
                      {slot}
                    </>
                  }>
                  {multipleSelection ? (
                    <MyTable
                      loading={loading}
                      rowKey={rowkey}
                      size="middle"
                      height="100%"
                      dataSource={loading ? [] : pageData.data}
                      columns={tableOptions}
                      rowSelection={rowSelection}
                      pagination={
                        !disabledPagination && {
                          current: pageData.pageNum,
                          pageSize: pageData.pageSize,
                          total: pageData.total,
                          onChange: onPageChange,
                        }
                      }
                      expandedRowRender={expandedRowRender}>
                      {tableRender?.(pageData.data)}
                    </MyTable>
                  ) : (
                    <MyTable
                      loading={loading}
                      rowKey={rowkey}
                      size="middle"
                      height="100%"
                      dataSource={loading ? [] : pageData.data}
                      columns={tableOptions}
                      pagination={
                        !disabledPagination && {
                          current: pageData.pageNum,
                          pageSize: pageData.pageSize,
                          total: pageData.total,
                          onChange: onPageChange,
                        }
                      }
                      expandedRowRender={expandedRowRender}>
                      {tableRender?.(pageData.data)}
                    </MyTable>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      <Spin spinning={loading}>
        <Drawer
          title="Lịch sử thao tác"
          placement="right"
          open={showLog}
          onClose={handleClose}
          width={420}>
          {log &&
            log.map((item: any) => {
              return (
                <div style={{ marginBottom: '10px' }} key={item.key}>
                  <p
                    style={{
                      textAlign: 'center',
                      color: 'black',
                      fontWeight: '500',
                    }}>
                    {item.create_date._i
                      ? convertToTimeFormat(item.create_date._i)
                      : 'Không'}{' '}
                    Ngày{' '}
                    {item.create_date._i
                      ? extractAndFormatDate(item.create_date._i)
                      : 'Không'}
                  </p>
                  <p style={{ color: 'gray', fontWeight: 'bold' }}>
                    {localStorage.username}
                  </p>
                  <p>Hành động: {item.method}</p>
                  <p>ID: {item.res_id}</p>
                  <p>{item.name}</p>
                  <p>
                    {item.old_value_text
                      ? extractTextInSingleQuotes(item.old_value_text)
                      : 'Không'}{' '}
                    <ArrowRightOutlined />{' '}
                    {item.new_value_text
                      ? extractTextInSingleQuotes(item.new_value_text)
                      : 'Không'}{' '}
                    ({item.field_description})
                  </p>
                </div>
              );
            })}
        </Drawer>
      </Spin>
      <Modal
        width={isMobile ? '100%' : '80%'}
        title={'Cấu hình xuất file excel'}
        open={showExportOptions}
        onCancel={onClose}
        destroyOnClose
        bodyStyle={{
          padding: '0px',
          // paddingBottom: 80
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Button key={1} onClick={onClose}>
              Hủy
            </Button>
            <Button
              key={2}
              onClick={() => handleExportExcel(selectedKeys)}
              type="primary"
              loading={loading}>
              Xuất
            </Button>
          </div>
        }>
        <Transfer
          dataSource={
            tableOptions
              ? tableOptions
                  .filter(
                    option =>
                      option.key !== undefined &&
                      option.title !== 'ID' &&
                      option.key !== 'id' &&
                      option.key !== 'no'
                  )
                  .map(option => ({
                    key: String(option.key),
                    title: String(option.title),
                  }))
              : []
          }
          titles={['Các trường có thể xuất', 'Các trường đã chọn']}
          targetKeys={selectedKeys}
          onChange={handleChange}
          render={item => String(item.title)}
          listStyle={{
            width: 700,
            height: 550,
          }}
        />
      </Modal>
    </>
  );
};

const BasePageRef = forwardRef(BasePage) as <S extends SearchApi>(
  props: PageProps<S> & { ref?: React.Ref<RefPageProps> }
) => React.ReactElement;

type BasePageType = typeof BasePageRef;

interface MyPageType extends BasePageType {
  MySearch: typeof MySearch;
  MyTable: typeof MyTable;
  MyAside: typeof MyAside;
}

const MyPage = BasePageRef as MyPageType;

MyPage.MySearch = MySearch;
MyPage.MyTable = MyTable;
MyPage.MyAside = MyAside;

export default MyPage;

const styles = css`
  display: flex;
  flex-direction: column;
  .tabs-main {
    flex: 1;
    display: flex;
    /* overflow: hidden; */
  }
  .search {
    margin-bottom: 10px;
  }

  .aside-main {
    display: flex;
    flex: 1;
    overflow: hidden;
    flex-direction: column;
  }

  .table {
    flex: 1;
    overflow: hidden;
  }
`;
