import React, { useMemo } from "react";
import { Column, Bar, Pie, DualAxes } from "@ant-design/plots";
import { Row, Col, Card, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useDashboard } from "~/hooks/useDashboard";

import Meta from "antd/es/card/Meta";
import Spin from "~/components/atoms/Spin";
import styles from "./styles.module.scss";

const Dashboards = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const lastYear = currentYear - 1;
  const { data, isFetching, isLoading } = useDashboard(true);
  const dataDashBoard = data?.data;

  // number user contributors by month
  const dataColumnChart = useMemo(() => {
    if (dataDashBoard) {
      return [
        {
          month: "Jan",
          value: dataDashBoard.numberAuthorByMonth?.Jan?.authorCount,
        },
        {
          month: "Feb",
          value: dataDashBoard.numberAuthorByMonth?.Feb?.authorCount,
        },
        {
          month: "Mar",
          value: dataDashBoard.numberAuthorByMonth?.Mar?.authorCount,
        },
        {
          month: "Apr",
          value: dataDashBoard.numberAuthorByMonth?.Apr?.authorCount,
        },
        {
          month: "May",
          value: dataDashBoard.numberAuthorByMonth?.May?.authorCount,
        },
        {
          month: "Jun",
          value: dataDashBoard.numberAuthorByMonth?.Jun?.authorCount,
        },
        {
          month: "Jul",
          value: dataDashBoard.numberAuthorByMonth?.Jul?.authorCount,
        },
        {
          month: "Aug",
          value: dataDashBoard.numberAuthorByMonth?.Aug?.authorCount,
        },
        {
          month: "Sep",
          value: dataDashBoard.numberAuthorByMonth?.Sep?.authorCount,
        },
        {
          month: "Oct",
          value: dataDashBoard.numberAuthorByMonth?.Oct?.authorCount,
        },
        {
          month: "Nov",
          value: dataDashBoard.numberAuthorByMonth?.Nov?.authorCount,
        },
        {
          month: "Dec",
          value: dataDashBoard.numberAuthorByMonth?.Dec?.authorCount,
        },
      ];
    }
  }, [dataDashBoard?.numberAuthorByMonth]);

  const config = {
    data: dataColumnChart ? dataColumnChart : [],
    xField: "month",
    yField: "value",
  };

  // total ideas for all system in each year
  const dataPieChart = useMemo(() => {
    if (dataDashBoard) {
      return dataDashBoard?.totalBookEachYear?.map((item: any) => ({
        type: item.year,
        value: item.bookCount,
      }));
    }
  }, [dataDashBoard?.totalBookEachYear]);

  const configPieChart = {
    data: dataPieChart ? dataPieChart : [],
    appendPadding: 10,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }: any) => `${(percent * 100)?.toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  const dataLineChart = useMemo(() => {
    if (dataDashBoard) {
      const dataInteraction = dataDashBoard.departmentInteractionCount;
      if (dataInteraction) {
        const dataChart = dataInteraction.map((item: any) => ({
          department: item.name,
          like: item.likeCount,
          view: item.viewCount,
        }));
        return dataChart;
      }
    }
  }, [dataDashBoard?.departmentInteractionCount]);

  const configLineChart = {
    data: dataLineChart ? [dataLineChart, dataLineChart] : [{}, {}],
    xField: "department",
    yField: ["like", "view"],
    geometryOptions: [
      {
        geometry: "line",
        color: "#5B8FF9",
      },
      {
        geometry: "line",
        color: "#5AD8A6",
      },
    ],
  };

  const dataBarChart = useMemo(() => {
    if (dataDashBoard) {
      return [
        {
          month: "Jan",
          bookCount:
            dataDashBoard.numberAuthorByMonth?.Jan?.topics[0]?.bookCount,
          type: dataDashBoard.numberAuthorByMonth?.Jan?.topics[0]?.name,
        },
        {
          month: "Feb",
          bookCount:
            dataDashBoard.numberAuthorByMonth?.Feb?.topics[0]?.bookCount,
          type: dataDashBoard.numberAuthorByMonth?.Feb?.topics[0]?.name,
        },
        {
          month: "Mar",
          bookCount:
            dataDashBoard.numberAuthorByMonth?.Mar?.topics[0]?.bookCount,
          type: dataDashBoard.numberAuthorByMonth?.Mar?.topics[0]?.name,
        },
        {
          month: "Apr",
          bookCount:
            dataDashBoard.numberAuthorByMonth?.Apr?.topics[0]?.bookCount,
          type: dataDashBoard.numberAuthorByMonth?.Apr?.topics[0]?.name,
        },
        {
          month: "May",
          bookCount:
            dataDashBoard.numberAuthorByMonth?.May?.topics[0]?.bookCount,
          type: dataDashBoard.numberAuthorByMonth?.May?.topics[0]?.name,
        },
        {
          month: "Jun",
          bookCount:
            dataDashBoard.numberAuthorByMonth?.Jun?.topics[0]?.bookCount,
          type: dataDashBoard.numberAuthorByMonth?.Jun?.topics[0]?.name,
        },
        
        /// Note
        {
          month: "Jan",
          bookCount:
            dataDashBoard.numberAuthorByMonth?.Jan?.topics[1]?.bookCount,
          type: dataDashBoard.numberAuthorByMonth?.Jan?.topics[1]?.name,
        },
        {
          month: "Feb",
          bookCount:
            dataDashBoard.numberAuthorByMonth?.Feb?.topics[1]?.bookCount,
          type: dataDashBoard.numberAuthorByMonth?.Feb?.topics[1]?.name,
        },
        {
          month: "Mar",
          bookCount:
            dataDashBoard.numberAuthorByMonth?.Mar?.topics[1]?.bookCount,
          type: dataDashBoard.numberAuthorByMonth?.Mar?.topics[1]?.name,
        },
        {
          month: "Apr",
          bookCount:
            dataDashBoard.numberAuthorByMonth?.Apr?.topics[1]?.bookCount,
          type: dataDashBoard.numberAuthorByMonth?.Apr?.topics[1]?.name,
        },
        {
          month: "May",
          bookCount:
            dataDashBoard.numberAuthorByMonth?.May?.topics[1]?.bookCount,
          type: dataDashBoard.numberAuthorByMonth?.May?.topics[1]?.name,
        },
        {
          month: "Jun",
          bookCount:
            dataDashBoard.numberAuthorByMonth?.Jun?.topics[1]?.bookCount,
          type: dataDashBoard.numberAuthorByMonth?.Jun?.topics[1]?.name,
        },
      ];
    }
  }, [dataDashBoard]);

  const configBarChart = {
    data: dataBarChart ? dataBarChart?.reverse() : [],
    isStack: true,
    xField: 'bookCount',
    yField: 'month',
    seriesField: 'type',
  };

  const info = useMemo(() => {
    if(dataDashBoard) {
      const { todayIdeaCount, yesterdayIdeaCount } = dataDashBoard;
  
      let percent = 0;
      let type = "equal";
  
      if (todayIdeaCount > yesterdayIdeaCount) {
        type = "greaterThan";
        percent =
          yesterdayIdeaCount === 0 ? 100 : todayIdeaCount / yesterdayIdeaCount;
      } else if (todayIdeaCount < yesterdayIdeaCount) {
        type = "lessThan";
        percent = todayIdeaCount === 0 ? 100 : yesterdayIdeaCount / todayIdeaCount;
      }
  
      return {
        type,
        percent,
      };
    }
  }, [dataDashBoard]);

  const infoByYear = useMemo(() => {
    if(dataDashBoard) {
      let percent = 0;
      let type = "equal";
      const dataNow = (dataDashBoard?.ideasByYear)?.find((item: any) => (item.year === currentYear))?.ideasCount;
      const dataPast = (dataDashBoard?.ideasByYear)?.find((item: any) => (item.year === lastYear))?.ideasCount;
      if (dataNow > dataPast) {
        type = "greaterThan";
        percent = dataPast === 0 ? 100 : dataNow / dataPast;
      } else if (dataNow < dataPast) {
        type = "lessThan";
        percent = dataNow === 0 ? 100 : dataPast / dataNow;
      }
      return {
        type,
        percent,
      };
    }
  },[dataDashBoard])
  return (
    <div className={styles.dashboardContainer}>
      <Spin spinning={isLoading || isFetching}>
        <Row gutter={25}>
          <Col 
            xxl={{ span: 12}}
            xl={{ span: 12}}
            lg={{ span: 12}}
            md={{ span: 24}}
            sm={{ span: 24}}
            xs={{ span: 24}}
          >
            <Card>
              <h3>Today's posts</h3>
              <div className={styles.statistic}>
                <h1 className={styles.cardInfoValue}>
                  {dataDashBoard?.todayIdeaCount}
                </h1>
                <Statistic
                  className="mt-2 ml-2"
                  value={
                    info?.percent
                  }
                  precision={2}
                  valueStyle={{ color:  info?.type === 'lessThan' ? 'red' : "#3f8600" , fontSize: 14 }}
                  prefix={ info?.type === 'lessThan' ? <ArrowDownOutlined/> : <ArrowUpOutlined />}
                  suffix="%"
                />
              </div>
            </Card>
          </Col>
          <Col 
            xxl={{ span: 12}}
            xl={{ span: 12}}
            lg={{ span: 12}}
            md={{ span: 24}}
            sm={{ span: 24}}
            xs={{ span: 24}}
          >
            <Card>
              <h3>Year's posts</h3>
              <div className={styles.statistic}>
                <h1 className={styles.cardInfoValue}>
                  {(dataDashBoard?.ideasByYear)?.find((item: any) => (item.year === currentYear))?.ideasCount}
                </h1>
                <Statistic
                  className="mt-2 ml-2"
                  value={infoByYear?.percent}
                  precision={2}
                  valueStyle={{ color:  infoByYear?.type === 'lessThan' ? 'red' : "#3f8600" , fontSize: 14 }}
                  prefix={ infoByYear?.type === 'lessThan' ? <ArrowDownOutlined/> : <ArrowUpOutlined />}
                  suffix="%"
                />
              </div>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4" gutter={16}>
          <Col 
            xxl={{ span: 10}}
            xl={{ span: 10}}
            lg={{ span: 10}}
            md={{ span: 24}}
            sm={{ span: 24}}
            xs={{ span: 24}}
          >
            <Card>
              <Card className={styles.cardColumnChart}>
                <Column {...config} height={300} color="#dfe7f7" />
              </Card>
              <Meta
                style={{ marginTop: 23 }}
                title="user contribution"
                description={
                  <Statistic
                    title="than last month"
                    value={5.63}
                    style={{ display: "flex" }}
                    precision={2}
                    valueStyle={{
                      color: "#3f8600",
                      fontSize: 14,
                      marginLeft: 5,
                    }}
                    prefix={<ArrowUpOutlined />}
                    suffix="%"
                  />
                }
              />
            </Card>
          </Col>
          <Col 
            xxl={{ span: 14}}
            xl={{ span: 14}}
            lg={{ span: 14}}
            md={{ span: 24}}
            sm={{ span: 24}}
            xs={{ span: 24}}
          >
            <Card
              className={styles.dualLineChart}
            >
              <DualAxes {...configLineChart} height={300} />
            </Card>
          </Col>
        </Row>
        <Row className="mt-4" gutter={[16, 16]}>
          <Col 
            xxl={{ span: 12}}
            xl={{ span: 12}}
            lg={{ span: 12}}
            md={{ span: 24}}
            sm={{ span: 24}}
            xs={{ span: 24}}
          >
            <Card>
              <Pie {...configPieChart} height={300} />
            </Card>
          </Col>
          <Col 
            xxl={{ span: 12}}
            xl={{ span: 12}}
            lg={{ span: 12}}
            md={{ span: 24}}
            sm={{ span: 24}}
            xs={{ span: 24}}
          >
            <Card>
              <Bar {...configBarChart} height={300} />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Dashboards;
