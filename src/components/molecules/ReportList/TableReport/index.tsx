import React, { useEffect, useState } from "react";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import styles from "./styles.module.scss";
import Spin from "~/components/atoms/Spin";
import Table from "~/components/atoms/Table";
import { DATE, SUCCESS } from "~/utils/constant";
import { Button, Row, Tag, message } from "antd";
import { inactiveCategory } from "~/api/categories";
import { SorterResult } from "antd/es/table/interface";
import { CheckSquareFilled, CloseSquareFilled } from "@ant-design/icons";
import { updateReportStatus } from "~/api/report";

interface Props {
  reports?: any;
  refetch: () => void;
  isLoading?: boolean;
  isFetching?: boolean;
  total?: number;
  setParams?: (value: any) => void;
}
interface DataType {
  name: string;
  createdAt: Date;
  status: string;
}

const ReportTable = (props: Props) => {
  const { reports, refetch, isLoading, isFetching, setParams, total } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idInactive, setIdInactive] = useState();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: total && total,
  });

  useEffect(() => {
    setPagination({ ...pagination, total: total });
  }, [total]);

  const modalConfirmDelete = (record: any) => {
    //Code here
  };

  const handleInactive = async () => {
    if (idInactive) {
      const res = await inactiveCategory(idInactive);
      if (res.message === SUCCESS) {
        message.success("Inactive Category success");
        // refetch();
      } else {
        message.error(res.message);
      }
    }
  };

  const handleUpdateRecordStatus = async (
    _id: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    const res = await updateReportStatus(_id, status);

    if (res && !res.errorCode && !res.errors.length) {
      message.success("Success");

      refetch();
    } else {
      message.error("Error");
    }
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    sorter: SorterResult<any>
  ) => {
    setPagination(newPagination);

    const paramsfilters = {
      sort: "TITLE_ASC",
      oder: sorter.order,
      page: newPagination.current,
      limit: newPagination.pageSize,
    };
    if (setParams) {
      setParams(paramsfilters);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Title",
      dataIndex: "title",
      width: "20%",
    },
    {
      title: "Reported by",
      dataIndex: "createdBy",
      width: "15%",
      render: (item: any) => (
        <div>
          {item.firstName} {item.lastName}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "schema",
      width: "15%",
      render: (_: string, record: any) => (
        <div>
          {record.type} - {record.schema}
        </div>
      ),
    },
    {
      title: "Schema name",
      dataIndex: "schemaId",
      width: "15%",
      render: (item: any) => <div>{item.title}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "15%",
      render: (status: string, record: any) => (
        <Tag
          color={
            status === "PENDING"
              ? "orange"
              : status === "REJECTED"
              ? "red"
              : status === "APPROVED"
              ? "green"
              : "blue"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Content",
      dataIndex: "content",
      width: "20%",
    },
    {
      title: "",
      dataIndex: "_id",
      width: "15%",
      render: (value: any, record: any, index) => (
        <Row
          style={{ display: "flex", flexDirection: "row", flexFlow: "initial" }}
        >
          <Button
            style={{
              color: "green",
              border: "none",
              padding: 0,
              height: "fit-content",
            }}
            onClick={() => handleUpdateRecordStatus(value, "APPROVED")}
          >
            <CheckSquareFilled />
          </Button>

          <Button
            style={{
              color: "red",
              border: "none",
              padding: 0,
              height: "fit-content",
              marginLeft: 5,
            }}
            onClick={() => handleUpdateRecordStatus(value, "REJECTED")}
          >
            <CloseSquareFilled />
          </Button>
        </Row>
      ),
    },
  ];

  return (
    <>
      <div className={styles.container}>
        <Spin spinning={isLoading || isFetching}>
          <Table
            className={styles.tableContainer}
            pagination={pagination}
            columns={columns}
            onChange={handleTableChange}
            rowKey={(record: any) => record._id}
            dataSource={reports}
          />
        </Spin>
      </div>
    </>
  );
};

export default ReportTable;
