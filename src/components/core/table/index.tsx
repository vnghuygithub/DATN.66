import TableColumn from '../table-column';
import { Table, TableProps } from 'antd';
import { css } from '@emotion/react';

interface MyTableProps<T extends object> extends TableProps<T> {
  height?: string;
}

const MyTable = <T extends object = object>(props: MyTableProps<T>) => {
  const { height, pagination, ...rest } = props;

  const defaultPagination = {
    size: 'default',
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100', '200'],
    defaultPageSize: 10,
    showTotal: (total: number) => `Tổng ${total} bản ghi`,
  };

  const combinedPagination =
    typeof pagination === 'object'
      ? { ...defaultPagination, ...pagination }
      : {};

  return (
    <div>
      <div style={{ height }} css={styles}>
        <Table<T>
          {...rest}
          bordered
          // scroll={{ x: '100%', y: '50vh' }}
          scroll={{ x: '100%', y: '80vh' }}
          pagination={combinedPagination}
          expandable={{
            defaultExpandAllRows: false,
          }}
        />
      </div>
    </div>
  );
};

MyTable.defaultProps = {
  size: 'small',
  height: 'auto',
} as MyTableProps<any>;

MyTable.Column = TableColumn;
MyTable.ColumnGroup = Table.ColumnGroup;

export default MyTable;

const styles = css`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  // .ant-table-expanded-row-fixed {
  //   height: 50vh;
  // }

  .ant-table-wrapper,
  .ant-spin-nested-loading,
  .ant-spin-container,
  .ant-table-container {
    // height: 100%;
    // height: 80vh;
    max-height: 100vh;
  }
  .ant-spin-container {
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .ant-table {
      flex: 1;
      overflow: hidden;
      border-bottom: 1px solid #eee;

      .ant-table-container {
        display: flex;
        flex-direction: column;
        .ant-table-body {
          flex: 1;
          table {
            height: 100%;
          }
        }
      }
    }

    .ant-pagination {
      padding: 0 10px;
    }
  }
`;
