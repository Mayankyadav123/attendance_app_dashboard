import React from 'react';

import { Row, Col, Button } from 'antd';

const NotFound = (props) => {
  return (
    <Row type='flex' justify='center' align='middle' style={{ height: '50vh' }}>
      <Col style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '60px' }}>404</div>
        <div style={{ fontSize: '20px' }}>Page Not Found</div>
        <br />
        <a href='/'>
          <Button type='primary' icon='home'>Go to home</Button>
        </a>
      </Col>
    </Row>
  );
};

export default NotFound; 
