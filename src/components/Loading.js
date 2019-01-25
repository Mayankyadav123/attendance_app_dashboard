import React from 'react';

import { Layout, Row, Col, Spin } from 'antd';

const Loading = (props) => {
  return (
    <Layout>
      <Row type='flex' justify='center' align='middle' style={{ height: '100vh' }} >
        <Col>
          <Spin size='large' />
        </Col>
      </Row>
    </Layout>
  );
};

export default Loading;
