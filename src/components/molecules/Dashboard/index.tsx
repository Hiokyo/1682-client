import React, { useMemo } from "react";
import { Column, Bar, Pie, DualAxes } from "@ant-design/plots";
import { Row, Col, Card, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
// import { useDashboard } from "~/hooks/useDashboard";

import Meta from "antd/es/card/Meta";
import Spin from "~/components/atoms/Spin";
import styles from "./styles.module.scss";

const Dashboards = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const lastYear = currentYear - 1;
  // const { data, isFetching, isLoading } = useDashboard(true);
  const dataDashBoard: any = [];

  // number user contributors by month
  const dataColumnChart = useMemo(() => {
    if (dataDashBoard) {
      return [
        {
          month: "Jan",
          value: dataDashBoard.ideaCountByDepartment?.Jan?.userCount,
        },
        {
          month: "Feb",
          value: dataDashBoard.ideaCountByDepartment?.Feb?.userCount,
        },
        {
          month: "Mar",
          value: dataDashBoard.ideaCountByDepartment?.Mar?.userCount,
        },
        {
          month: "Apr",
          value: dataDashBoard.ideaCountByDepartment?.Apr?.userCount,
        },
        {
          month: "May",
          value: dataDashBoard.ideaCountByDepartment?.May?.userCount,
        },
        {
          month: "Jun",
          value: dataDashBoard.ideaCountByDepartment?.Jun?.userCount,
        },
        {
          month: "Jul",
          value: dataDashBoard.ideaCountByDepartment?.Jul?.userCount,
        },
        {
          month: "Aug",
          value: dataDashBoard.ideaCountByDepartment?.Aug?.userCount,
        },
        {
          month: "Sep",
          value: dataDashBoard.ideaCountByDepartment?.Sep?.userCount,
        },
        {
          month: "Oct",
          value: dataDashBoard.ideaCountByDepartment?.Oct?.userCount,
        },
        {
          month: "Nov",
          value: dataDashBoard.ideaCountByDepartment?.Nov?.userCount,
        },
        {
          month: "Dec",
          value: dataDashBoard.ideaCountByDepartment?.Dec?.userCount,
        },
      ];
    }
  }, [dataDashBoard?.ideaCountByDepartment]);

  const config = {
    data: dataColumnChart ? dataColumnChart : [],
    xField: "month",
    yField: "value",
  };

  // total ideas for all system in each year
  const dataPieChart = useMemo(() => {
    if (dataDashBoard) {
      return dataDashBoard?.ideasByYear?.map((item: any) => ({
        type: item.year,
        value: item.ideasCount,
      }));
    }
  }, [dataDashBoard?.ideaCountByDepartment]);

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
  // total ideas for each departments
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
          ideaCount:
            dataDashBoard.ideaCountByDepartment?.Jan?.departments[0]?.ideaCount,
        },
        {
          month: "Feb",
          ideaCount:
            dataDashBoard.ideaCountByDepartment?.Feb?.departments[0]?.ideaCount,
        },
        {
          month: "Mar",
          ideaCount:
            dataDashBoard.ideaCountByDepartment?.Mar?.departments[0]?.ideaCount,
        },
        {
          month: "Apr",
          ideaCount:
            dataDashBoard.ideaCountByDepartment?.Apr?.departments[0]?.ideaCount,
        },
        {
          month: "May",
          ideaCount:
            dataDashBoard.ideaCountByDepartment?.May?.departments[0]?.ideaCount,
        },
        {
          month: "Jun",
          ideaCount:
            dataDashBoard.ideaCountByDepartment?.Jun?.departments[0]?.ideaCount,
        },
      ];
    }
  }, [dataDashBoard?.ideaCountByDepartment]);

  const configBarChart = {
    data: dataBarChart ? dataBarChart : [],
    xField: "ideaCount",
    yField: "month",
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
      {/* <Spin spinning={isLoading || isFetching}> */}
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
              <h3>Today's ideas</h3>
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
              <h3>Year's ideas</h3>
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
      {/* </Spin> */}
    </div>
  );
};

export default Dashboards;
