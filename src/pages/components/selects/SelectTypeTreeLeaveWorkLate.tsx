import { Form, TreeSelect } from 'antd';
import { useEffect, useState } from 'react';

const { TreeNode } = TreeSelect;
interface ISelectTypeLeaveProps {
  treeData: any[];
  setTypeLeaveValue: (value: string) => void;
  typeLeaveValue: string;
}
const SelectTypeLeave = (props: ISelectTypeLeaveProps) => {
  const { treeData, setTypeLeaveValue, typeLeaveValue } = props;
  const [form] = Form.useForm();
  const defaultTypeLeaveValue = 'DXDM~55';

  useEffect(() => {
    form.setFieldsValue({
      typeLeave: 'DXDM~55',
    });

    setTypeLeaveValue('DXDM~55');
  }, []);
  // const onChangeSelectTypeLeave = (value: string) => {
  //   setTypeLeaveValue(value);
  // };
  const renderTreeNodes = (data: any) => {
    console.log(data);

    return data.map((node: any) => {
      if (
        node.value === 'CTL' &&
        !node.title.includes('(chỉ dùng cho hiếu, hỉ)')
      ) {
        node.title += ' (chỉ dùng cho hiếu, hỉ)';
      }
      if (
        node.children &&
        node.children.length > 1 &&
        !node.value.includes('TN')
      ) {
        return (
          <TreeNode
            value={node.value}
            title={node.title}
            key={node.value}
            disabled={true}>
            {renderTreeNodes(node.children)}
          </TreeNode>
        );
      } else if (
        node.children &&
        node.children.length === 1 &&
        !node.value.includes('TN')
      ) {
        return (
          <TreeNode
            value={node.children[0].value}
            title={node.title}
            key={node.children[0].value}></TreeNode>
        );
      } else if (!node.value.includes('TN')) {
        return (
          <TreeNode value={node.value} title={node.title} key={node.value} />
        );
      }
    });
  };

  return (
    <>
      <Form form={form} style={{ marginBottom: '50px' }}>
        <Form.Item
          label={'Loại đơn'}
          name="typeLeave"
          rules={[{ required: true, message: 'Chọn loại đơn' }]}>
          <TreeSelect
            style={{ width: '100%' }}
            // value={'DXDM~55'}
            disabled={true}
            showSearch
            allowClear
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Chọn loại đơn"
            treeDefaultExpandAll
            // onChange={onChangeSelectTypeLeave}
          >
            {renderTreeNodes(treeData)}
          </TreeSelect>
        </Form.Item>
      </Form>
    </>
  );
};

export default SelectTypeLeave;
