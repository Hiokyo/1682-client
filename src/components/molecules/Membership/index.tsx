import { Card, Button, Col, Row } from 'antd'
import React from 'react'

import styles from './styles.module.scss'
const Memberships = () => {
  return (
    <div className={styles.membershipContainer}>
      <Row gutter={16}>
        <Col span={8} xs={24}>
          <Card title=" 1 month" style={{ width: '100%' }}>
            <p>Read all book in 1 month.</p>
            <p>Price: $10</p>
            <Button type="primary" size="large">Buy</Button>
          </Card>
        </Col>
        <Col span={8} xs={24}>
          <Card title=" 3 month" style={{ width: '100%' }}>
            <p>Read all book in 3 month.</p>
            <p>Price: $25</p>
            <Button type="primary" size="large">Buy</Button>
          </Card>
        </Col>
        <Col span={8} xs={24}>
          <Card title=" 6 month" style={{ width: '100%' }}>
            <p>Read all book in 6 month.</p>
            <p>Price: $40</p>
            <Button type="primary" size="large">Buy</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Memberships