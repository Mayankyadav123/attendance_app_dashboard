import React from 'react';

import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom';

import client from '../client';

import { Layout, Menu, Icon, Button } from 'antd';

const { Content, Header, Sider, Footer } = Layout;

class BaseLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  componentDidMount() {
    this.setState({ username: client.get('username') });
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  logout = () => {
    return client.logout();
  };

  render() {
    const { pathname } = this.props.location;
    return (
      <Layout style={{ height: '100vh' }}>
        <Sider
          theme='light'
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <Link to='/'>
            <img
              src={this.state.collapsed ? '/favicon.png' : 'https://www.itcinfotech.com/wp-content/themes/ITC-Infotech/images/itc-logo.png'}
              alt='Sting'
              style={{
                height: '62px',
                padding: '4px 0',
                display: 'block',
                margin: 'auto',
                verticalAlign: 'middle',
              }}
            />
          </Link>
          <Menu
            theme='light'
            mode='inline'
            selectedKeys={[pathname]}
            defaultSelectedKeys={['/']}
          >
            <Menu.Item key='/clients'>
              <Link to='/clients'>
                <Icon type='barcode' />
                <span>Clients</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='/employees'>
              <Link to='/employees'>
                <Icon type='shopping-cart' />
                <span>Employees</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              background: '#fff',
              height: '62px',
              padding: '0 5px',
              textAlign: 'right'
            }}
          >
            <div>
              <Button type='dashed' icon='poweroff' onClick={this.logout}>Logout</Button>
            </div>
          </Header>
          <Content style={{ padding: 24, background: '#fff', margin: '5px' }}>
            {this.props.children}
          </Content>
          <Footer style={{ textAlign: 'center', background: '#fff' }}>
            <div>&copy; {new Date().getFullYear()} &middot; Itcinfotech</div>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(BaseLayout);
