import { useState } from 'react';
import MyPage, { MyPageTableOptions } from '@/components/business/page';
import { Button, Form, Space, Tag } from 'antd';
import { IWorkLocation } from '@/interface/workLocation/type';
import {
  getWorkLocation,
  deleteWorkLocation,
} from '@/api/workLocation/worklocation';
import { message as $message } from 'antd';
import { setGlobalState } from '@/stores/global.store';
import store from '@/stores';
import { EditOutlined } from '@ant-design/icons';
import { useLocale } from '@/locales';
import WorkLocationForm from '../handle/index';
import SearchWorkLocation from '../components/search';

const index = () => {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [selectedRowArr, setSelectedRowArr] = useState<any[]>([]);
  const [foceUpdate, setFoceUpdate] = useState(false);
  const [forceClearSelection, setForceClearSelection] = useState(false);
  const [workLocation, setWorkLocation] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [updateState, setUpdateState] = useState<boolean>(false);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    showDrawer();
    setWorkLocation(-1);
    setUpdateState(false);
  };

  const handleEdit = (id: any) => {
    showDrawer();
    setWorkLocation(id);
    setUpdateState(true);
  };

  const handleDelete = async () => {
    if (selectedRowArr.length === 0) {
      $message.error('Vui lòng chọn dòng để xoá');
      return;
    }

    const ids = selectedRowArr.map((item: any) => item.id);
    await Promise.all(
      ids.map(id =>
        deleteWorkLocation({
          params: {
            args: [id],
          },
        })
      )
    )
      .then(res => {
        if (res) {
          $message.success('Xoá thành công');
          setFoceUpdate(!foceUpdate);
          setSelectedRowArr([]);
          setForceClearSelection(!forceClearSelection);
          store.dispatch(setGlobalState({ loading: false }));
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const sharedOnCell = (data: any, index: any) => {
    if (data.company) {
      return { colSpan: 0 };
    }
    return {};
  };

  const tableColums: MyPageTableOptions<IWorkLocation> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 50,
      align: 'center',
      onCell: (item, rowindex) => sharedOnCell(item, rowindex),
    },
    {
      title: 'Mã địa điểm',
      dataIndex: 'work_location_code',
      key: 'work_location_code',
      width: 70,
      align: 'center',
      onCell: (item, rowindex) => sharedOnCell(item, rowindex),
    },
    {
      title: 'Tên địa điểm',
      dataIndex: 'name',
      key: 'name',
      width: 170,
      align: 'center',
      onCell: (item, rowindex) => sharedOnCell(item, rowindex),
    },

    {
      title: 'Công ty',
      dataIndex: 'company_id',
      key: 'company_id',
      width: 650,
      align: 'center',
      onCell: (item, rowindex) => sharedOnCell(item, rowindex),
      render: (item: any) => {
        if (item) {
          return <div>{item.name}</div>;
        }
      },
    },
    {
      title: t({ id: 'action' }),
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      onCell: (item, rowindex) => sharedOnCell(item, rowindex),
      render: item => (
        <Space size="middle">
          <EditOutlined
            style={{ fontSize: '14px', color: '#0960bd' }}
            onClick={() => handleEdit(item)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <MyPage
        rowkey="id"
        pageApi={getWorkLocation}
        title={'Danh sách địa điểm làm việc'}
        tableOptions={tableColums}
        forceUpdate={foceUpdate}
        setSelectedRowData={setSelectedRowArr}
        selectedRowArr={selectedRowArr}
        searchRender={<SearchWorkLocation />}
        // multipleSelection
        // forceClearSelection={forceClearSelection}
        slot={
          <>
            <Button type="primary" onClick={handleCreate}>
              {'Tạo mới'}
            </Button>
            <Button type="primary" onClick={handleDelete}>
              Xoá
            </Button>
          </>
        }
        // forceClearSelection={forceClearSelection}
        multipleSelection
      />

      <WorkLocationForm
        form={form}
        onClose={onClose}
        open={open}
        idWorkLocation={workLocation}
        forceUpdate={foceUpdate}
        showDrawer={showDrawer}
        setForceUpdate={setFoceUpdate}
        updateState={updateState}
      />
    </>
  );
};

export default index;
