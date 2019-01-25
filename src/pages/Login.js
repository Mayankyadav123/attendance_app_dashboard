import React from 'react';

import { Layout, Row, Col, Form, Icon, Input, Button } from 'antd';

import client from '../client';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
    };
  }

  authenticate = (email, password) => {
    return client.authenticate({
      strategy: 'local',
      email,
      password,
    }).catch((error) => {
      this.setState({
        loading: false,
        error,
      });
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((error, values) => {
      const { username: email, password } = values;

      if (!error) {
        return this.setState({
          loading: true,
          error: false,
        }, () => this.authenticate(email, password));
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Layout style={{ height: '100vh' }}>
        <Row type='flex' justify='center' align='middle' style={{ height: '80vh' }}>
          <Col>
            <Row type='flex' justify='center' align='middle'>
              <Col>
                <img src='https://www.itcinfotech.com/wp-content/themes/ITC-Infotech/images/itc-logo.png' height='80' alt='Sting: Saudiology' />
              </Col>
            </Row>
            <br />
            <Row type='flex' justify='center' align='middle'>
              <Col>
                <Form onSubmit={this.onSubmit} className='login-form'>
                  <Form.Item>
                    {getFieldDecorator('username', {
                      rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                      <Input
                        prefix={<Icon type='user' />}
                        placeholder='Username'
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: 'Please input your password!' }],
                    })(
                      <Input
                        prefix={<Icon type='lock' />}
                        type='password'
                        placeholder='Password'
                      />
                    )}
                  </Form.Item>
                  <Button
                    loading={this.state.loading}
                    type='primary'
                    htmlType='submit'
                    style={{ width: '100%' }}
                  >
                    Login
                  </Button>
                  <div style={{ textAlign: 'center', color: 'red', paddingTop: '1em' }}>
                    &nbsp;{this.state.error.message || false}&nbsp;
                  </div>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </Layout>
    );
  }
}

export default Form.create()(Login);
