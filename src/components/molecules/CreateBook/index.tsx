import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  content: string;
}


interface EditableRowProps {
  index: number;
}
interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  fieldType: string;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const CreateBooks = () => {

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  fieldType,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  // useEffect(() => {
  //   if (editing) {
  //     inputRef.current!.focus();
  //   }
  // }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  const renderFormItem = () => {
    switch (fieldType) {
      case 'Input':
        return (
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        );
      case 'TextEditor':
        return (
          <ReactQuill theme="snow"/>
        )
      default:
        break;
    }
  }

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: '',
          },
        ]}
      >
      {
        renderFormItem()
      }
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  content: string
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;
const [dataSource, setDataSource] = useState<DataType[]>([
  {
    key: '0',
    name: 'Edward King 0',
    content: 'asdasdasdasdsadasd'
  },
  {
    key: '1',
    name: 'Edward King 1',
    content: 'London, Park Lane no. 1',
  },
]);

const [count, setCount] = useState(2);

const handleDelete = (key: React.Key) => {
  const newData = dataSource.filter((item) => item.key !== key);
  setDataSource(newData);
};

const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: '20%',
    editable: true,
  },
  {
    title: 'Content',
    dataIndex: 'content',
    editable: true,
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    width: '5%',
    render: (_, record: any) =>
      dataSource.length >= 1 ? (
        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
          <a>Delete</a>
        </Popconfirm>
      ) : null,
  },
];

const handleAdd = () => {
  const newData: DataType = {
    key: count,
    name: `Edward King ${count}`,
    content: `London, Park Lane no. ${count}`,
  };
  setDataSource([...dataSource, newData]);
  setCount(count + 1);
};

const handleSave = (row: DataType) => {
  const newData = [...dataSource];
  const index = newData.findIndex((item) => row.key === item.key);
  const item = newData[index];
  newData.splice(index, 1, {
    ...item,
    ...row,
  });
  setDataSource(newData);
};

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

const columns = defaultColumns.map((col) => {
  if (!col.editable) {
    return col;
  }
  return {
    ...col,
    onCell: (record: DataType) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
    }),
  };
});

return (
  <div>
    <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
      Add a row
    </Button>
    <Table
      components={components}
      rowClassName={() => 'editable-row'}
      bordered
      pagination={false}
      dataSource={dataSource}
      columns={columns as ColumnTypes}
    />
  </div>
  )
}

export default CreateBooks