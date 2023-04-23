import React, { useMemo } from "react";
import { Column, Bar, Pie, DualAxes } from "@ant-design/plots";
import { Row, Col, Card, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useDashboard } from "~/hooks/useDashboard";

import Meta from "antd/es/card/Meta";
import Spin from "~/components/atoms/Spin";
import styles from "./styles.module.scss";

const listMonth= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


const Dashboards = () => {
  const today = new Date();
  const currentMonth = today.getMonth();

  const { data, isFetching, isLoading } = useDashboard(true);
  const dataDashBoard = data?.data;
  
  // number user contributors by month
  const dataColumnChart = useMemo(() => {
    if (dataDashBoard) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map(month => {
        return {
          month: month,
          value: dataDashBoard.numberAuthorByMonth?.[month]?.authorCount
        };
      });
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

  const dataLineChart = dataDashBoard?.interactionCount;
  
  const transformedData = useMemo(() => {
    if (dataLineChart) {
      return dataLineChart?.map((item: any) => ({
        name: item.name,
        type: (item?.type?.charAt(0).toUpperCase() + item?.type?.slice(1))?.replace('Count', ''),
        value: item.value,
      }));
    }
  }, [dataLineChart])

  const configLineChart = {
    data: transformedData ? transformedData : [],
    xField: 'name',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [10, 10, 0, 0],
    },
  };

  const dataBarChart = useMemo(() => {
    if (dataDashBoard) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const topicFirst = months.map(month => {
        return {
          month: month,
          bookCount: dataDashBoard.numberAuthorByMonth?.[month]?.topics[0]?.bookCount || 0,
          type: dataDashBoard.numberAuthorByMonth?.[month]?.topics[0]?.name,
        };
      });
      const topicSecond = months.map(month => {
        return {
          month: month,
          bookCount: dataDashBoard.numberAuthorByMonth?.[month]?.topics[1]?.bookCount || 0,
          type: dataDashBoard.numberAuthorByMonth?.[month]?.topics[1]?.name,
        };
      });

      return [...topicFirst, ...topicSecond];
    }
  }, [dataDashBoard?.numberAuthorByMonth]);
  

  const configBarChart = {
    data: dataBarChart ? dataBarChart?.reverse() : [],
    isStack: true,
    xField: 'bookCount',
    yField: 'month',
    seriesField: 'type',
  };

  const info = useMemo(() => {
    if(dataDashBoard) {
      const { todayPostCount, yesterdayPostCount } = dataDashBoard;
  
      let percent = 0;
      let type = "equal";
  
      if (todayPostCount > yesterdayPostCount) {
        type = "greaterThan";
        percent =
          yesterdayPostCount === 0 ? 100 : todayPostCount / yesterdayPostCount;
      } else if (todayPostCount < yesterdayPostCount) {
        type = "lessThan";
        percent = todayPostCount === 0 ? 100 : yesterdayPostCount / todayPostCount;
      }
  
      return {
        type,
        percent,
      };
    }
  }, [dataDashBoard]);

  const infoByYear = useMemo(() => {
    if(dataDashBoard) {
      const { thisYearPostCount, lastYearPostCount } = dataDashBoard;
      let percent = 0;
      let type = "equal";
      if (thisYearPostCount > lastYearPostCount) {
        type = "greaterThan";
        percent = lastYearPostCount === 0 ? 100 : thisYearPostCount / lastYearPostCount;
      } else if (thisYearPostCount < lastYearPostCount) {
        type = "lessThan";
        percent = thisYearPostCount === 0 ? 100 : lastYearPostCount / thisYearPostCount;
      }
      return {
        type,
        percent,
      };
    }
  },[dataDashBoard])

  const authorContribution = useMemo(() => {
    if(dataDashBoard) {
      const currentMonthName = listMonth[currentMonth];
      const lastMonthName = listMonth[currentMonth - 1];
      const thisMonthAuthor = dataDashBoard.numberAuthorByMonth?.currentMonthName?.authorCount;
      const lastMonthAuthor = dataDashBoard.numberAuthorByMonth?.lastMonthName?.authorCount;
      let percent = 0;
      let type = "equal";
      if (thisMonthAuthor > lastMonthAuthor) {
        type = "greaterThan";
        percent = lastMonthAuthor === 0 ? 100 : thisMonthAuthor / lastMonthAuthor;
      } else if (thisMonthAuthor < lastMonthAuthor) {
        type = "lessThan";
        percent = thisMonthAuthor === 0 ? 100 : lastMonthAuthor / thisMonthAuthor;
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
                  {dataDashBoard?.todayPostCount}
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
                  {dataDashBoard?.thisYearPostCount}
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
                title="Author contribution"
                description={
                  <Statistic
                    title="than last month"
                    value={authorContribution?.percent}
                    style={{ display: "flex" }}
                    precision={2}
                    valueStyle={{
                      color:  authorContribution?.type === 'lessThan' ? 'red' : "#3f8600" ,
                      fontSize: 14,
                      marginLeft: 5,
                    }}
                    prefix={ authorContribution?.type === 'lessThan' ? <ArrowDownOutlined/> : <ArrowUpOutlined />}
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
              <Card>
                <Column {...configLineChart} height={300} />
              </Card>
              <Meta
                style={{ marginTop: 23 }}
                title="Interactions of book"
              />
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
              <Card>
                <Pie {...configPieChart} height={300} />
              </Card>
              <Meta
                style={{ marginTop: 23 }}
                title="Number of books published per year"
              />
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
              <Card>
                <Bar {...configBarChart} height={300} />
              </Card>
              <Meta
                style={{ marginTop: 23 }}
                title="Book topics"
                description={
                  "Aventure and Classic"
                }
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Dashboards;
