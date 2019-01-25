import React from 'react';

import {
  Row, Col, Table, Drawer, Form, Input, Button, Icon, Select, Divider, message
} from 'antd';

import ObjectId from 'bson-objectid';

import urljoin from 'url-join';

import client from '../client';

const Option = Select.Option;

const mediaURL = process.env.REACT_APP_MEDIA_URL;

const getMediaPath = (path) => urljoin(mediaURL, path);

class ProductCreate extends React.Component {
  render() {
    const { create, hideCreate, AttributeSet } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout='vertical' onSubmit={create} hideRequiredMark>
        <Row>
          <Col>
            <Form.Item label='Client Name'>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please enter the Client Name' }],
              })(
                <Input placeholder='Enter Client Name'/>
              )}
            </Form.Item>
            <Form.Item label='Client Id'>
              {getFieldDecorator('uid', {
                rules: [{ required: true, message: 'Please enter the Client id' }],
              })(
                <Input placeholder='Enter Client id'/>
              )}
            </Form.Item>
            <Form.Item label='Location'>
              {getFieldDecorator('address', {
                rules: [{ required: true, message: 'Please enter the Client Location' }],
              })(
                <Input placeholder='Enter Client Location'/>
              )}
            </Form.Item>
            <Form.Item label='Description'>
              {getFieldDecorator('description', {
                rules: [{ required: false }],
              })(
                <Input.TextArea rows={4} />
              )}
            </Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button onClick={hideCreate} style={{ marginRight: 8 }}>Cancel</Button>
              <Button type='primary' htmlType='submit'>Create</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

class ProductMapping extends React.Component {
  render() {
    const { mapping, current, hideMapping } = this.props;
    const { getFieldDecorator } = this.props.form;
    const primary = current.images.find((e) => e.primary);

    return (
      <Form layout='vertical' onSubmit={mapping} hideRequiredMark>
        <Row>
          <Col>
            <div>
              {current ? (
                <Row>
                  <Col span={3} sytle={{ textAlign: 'center' }}>
                    {current.images.length ?
                      <img
                        src={
                          getMediaPath(primary.thumb ? primary.thumb.thumb : '')
                        }
                        height='60'
                        alt=''
                      /> : null
                    }
                  </Col>
                  <Col span={21}>
                    <div>{current.system.name['en-SA']}</div>
                    <div style={{ color: 'grey' }}>{current._id}</div>
                  </Col>
                </Row>
              ) : null}
            </div>
            <Divider />
            <Form.Item label='Item Code'>
              {getFieldDecorator('itemcode', {
                rules: [{ required: true, message: 'Please enter the Item Code' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label='Barcode'>
              {getFieldDecorator('barcode', {
                rules: [{ required: true, message: 'Please enter the Barcode' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label='Model Number'>
              {getFieldDecorator('modelnumber', {
                rules: [{ required: false }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label='Notes'>
              {getFieldDecorator('notes', {
                rules: [{ required: false }],
              })(
                <Input.TextArea rows={4} />
              )}
            </Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button onClick={hideMapping} style={{ marginRight: 8 }}>Cancel</Button>
              <Button type='primary' htmlType='submit'>Create</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

class Product extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      pagination: {},
      attributesets: [],
      showSelect: props.showSelect || false,
      showCreate: props.showCreate || true,
      loading: false,
      create: false,
      mapping: false,
      select: false,
      detail: false,
      current: null,
      columns: [{
        title: 'Client Name',
        key: 'name',
        render: (text, record, index) => {
          return (
            <div>
              <div style={{ color: 'grey' }}>{record.name}</div>
            </div>
          );
        },
      }, {
        title: 'Client Location',
        key: 'location',
        align: 'center',
        render: (text, record, index) => {
          return (
            <div>
              <div style={{ color: 'grey' }}>{record.address}</div>
            </div>
          );
        },
      }, {
        title: 'Client ID',
        key: 'uid',
        align: 'center',
        render: (text, record, index) => {
          return (
            <div>
              <div style={{ color: 'grey' }}>{record.uid}</div>
            </div>
          );
        },
      },
    ],
    };
  }

  componentDidMount() {
    if (this.state.showSelect) {
      const columns = this.state.columns;
      columns.push({
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Button
            icon='check-circle-o'
            onClick={() => this.props.onSelect(record._id, record.system.name['en-SA'])}
          >
            Select
          </Button>
        ),
      });

      this.setState({ columns });
    }

    this.fetch();
   // this.getFilters();
  }

  onChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };

    pager.current = pagination.current;

    this.setState({ pagination: pager });

    this.fetch({
      $skip: (pagination.current - 1) * 10,
    });
  };

  fetch = (params = {}) => {

    this.setState({ loading: true });

    client.service('clients').find({}).then((items) => {
      const pagination = { ...this.state.pagination };
      pagination.total = items.total;

      this.setState({
        loading: false,
        data: items.data,
        pagination,
      });
    });
  };

  showCreate = () => this.setState({ create: true });
  hideCreate = () => this.setState({ create: false });

  showMapping = () => this.setState({ mapping: true });
  hideMapping = () => this.setState({ mapping: false });

  showDetail = () => this.setState({ detail: true });
  hideDetail = () => this.setState({ detail: false });

  selectSearch = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  filterSearch = () => this.fetch();

  filterSearchInventory = () => {
    const {
      filterItemCode, filterBarcode
    } = this.state;

    const filters = {
      ...(filterItemCode && { 'itemcode': filterItemCode }),
      ...(filterBarcode && { 'barcode': filterBarcode }),
    };

    client.service('inventories').find({
      query: {
        ...filters,
      }
    }).then((items) => {
      const filterProducts = items.data.map((item) => item.product);
      if (filterProducts.length) {
        this.setState({filterProducts}, () => {
          this.fetch();
        });
      } else {
        message.error('No Such Product exists');
      }
    }).catch((error) => {
      message.error(error);
    })
  };

  filterSearchChange = (e) => this.setState({ filterSearch: e.target.value });

  filterIdChange = (e) => this.setState({ filterId: e.target.value });

  filterItemCode = (e) => this.setState({ filterItemCode: e.target.value });

  filterBarcode = (e) => this.setState({ filterBarcode: e.target.value });

  filterAttributeSet = (id) => this.setState({ filterAttributeSet: id }, () => this.fetch());

  filterStatus = (id) => this.setState({ filterStatus: id }, () => this.fetch());

  clearFilter = () => this.setState({
    filterSearch: null,
    filterId: null,
    filterAttributeSet: null,
    filterStatus: null,
  }, () => this.fetch());

  title = () => {
    const {
      attributesets, filterSearch, filterId, filterAttributeSet, filterStatus, filterItemCode, filterBarcode
    } = this.state;

    const createButton = this.state.showCreate
      ?  (<Button
        type='primary'
        icon='plus-circle-o'
        onClick={this.showCreate}
        style={{ float: 'right' }}
      >Create</Button>
      ) : null;

    return (
      <Row>
        <Col span={20}>
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          {createButton}
        </Col>
      </Row>
    );
  };

  create = (e) => {
    e.preventDefault();    

    const { form } = this.createForm.props;

    form.validateFields((error, values) => {
      if (!error) {
        const hide = message.loading('Creating Product');
        this.setState({ loading: true });
        client.service('clients').create({
          ...values
        }).then((result) => {
          form.resetFields();
          hide();
          message.success('Successfully created product!');
          this.setState({ loading: false, create: false });
          this.fetch();
        }).catch((error) => {
          message.error(error.message);
          this.setState({ loading: false });
        });
      }
    });
  };

  mapping = (e) => {
    e.preventDefault();

    const { current } = this.state;
    const { form } = this.mappingForm.props;

    form.validateFields((error, values) => {
      if (!error) {
        const hide = message.loading('Creating Inventory');
        this.setState({ loading: true });
        client.service('inventories').create({
          ...{ product: current._id },
          ...values,
        }).then((result) => {
          form.resetFields();
          hide();
          message.success('Successfully created inventory!');
          current.inventories.push(result);
          this.setState({ current, loading: false, mapping: false });
        }).catch((error) => {
          message.error(error.message);
          this.setState({ loading: false });
        });
      }
    });
  };

  getImages = (images) => {
    // sort so that primary image comes first and render <img> for each image
    return images.sort((a, b) => b.primary - a.primary).map((img, index) => {
      return (
        <Col span={6} key={index} style={{ textAlign: 'center' }}>
          <img
            src={getMediaPath(img.thumb ? img.thumb.thumb : '')}
            alt=''
          />
        </Col>
      );
    });
  };

  render() {
    const { columns, data, pagination, loading, create, mapping, detail, current } = this.state;

    const ProductCreateForm = Form.create()(ProductCreate);
    const ProductMappingForm = Form.create()(ProductMapping);
    const AttributeSet = this.state.attributesets.map((attr) =>
      <Option value={attr._id}>{attr.name}</Option>
    );

    return (
      <div>
        <Table
          rowKey='_id'
          title={this.title}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          loading={loading}
          onChange={this.onChange}
          onRow={(record) => {
            return {
              onClick: () => this.setState({ detail: true, current: record })
            };
          }}
        />
        <Drawer
          title='Product Details'
          placement='right'
          onClose={this.hideDetail}
          maskClosable={true}
          visible={detail}
          width={720}
        >
          {/* TODO: add stock and price */}
          {current ? (
            <div>
              <Row>
                <Col span={12}>
                  <div><strong>E-commerce ID</strong></div>
                  <div>{current._id}</div>
                </Col>
                <Col span={12}>
                  <div><strong>Category</strong></div>
                  <div>{current.attributesets.name}</div>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <div><strong>Name</strong></div>
                  <div>{current.system.name['en-SA']}</div>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={5}>
                  <div><strong>Approved</strong></div>
                  <div>{
                    current.approved
                      ?  <Icon type='check-circle' style={{ color: 'green' }} />
                      :  <Icon type='close-circle' style={{ color: 'red' }} />
                  }</div>
                </Col>
                <Col span={5}>
                  <div><strong>Enabled</strong></div>
                  <div>{
                    current.system.status
                      ?  <Icon type='check-circle' style={{ color: 'green' }} />
                      :  <Icon type='close-circle' style={{ color: 'red' }} />
                  }</div>
                </Col>
                <Col span={5}>
                  <div><strong>Stock</strong></div>
                  <div>{current.stock.quantity}</div>
                </Col>
                <Col span={4}>
                  <div><strong>Inventory</strong></div>
                  <div>{current.inventories ? current.inventories.length : 0}</div>
                </Col>
                <Col span={5}>
                  <div><strong>Price</strong></div>
                  <div>{current.price ? current.price.price.invoicePrice : '-'}</div>
                </Col>
              </Row>
              <Divider />
              <Row>
                <Col>
                  <Row>
                    <Col span={12}>
                      <div><strong>Inventory</strong> ({current.inventories ? current.inventories.length : 0})</div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'right' }}>
                        <Button
                          type='primary'
                          icon='plus-circle-o'
                          onClick={this.showMapping}
                          style={{ marginRight: 8 }}
                        >
                          New Mapping
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <br />
                  <Table
                    bordered
                    rowKey='_id'
                    pagination={false}
                    dataSource={current.inventories ? current.inventories : []}
                    columns={[
                      {
                        title: 'Itemcode',
                        key: 'itemcode',
                        dataIndex: 'itemcode',
                      },
                      {
                        title: 'Barcode',
                        key: 'barcode',
                        dataIndex: 'barcode',
                      },
                      {
                        title: 'Model Number',
                        key: 'modelnumber',
                        dataIndex: 'modelnumber',
                      },
                      {
                        title: 'Notes',
                        key: 'notes',
                        dataIndex: 'notes',
                      },
                    ]}
                  />
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <div><strong>Images</strong> ({current.images.length})</div>
                  <div>{this.getImages(current.images)}</div>
                </Col>
              </Row>
            </div>
          ) : false}
        </Drawer>

        <Drawer
          title='Create New Client'
          placement='right'
          onClose={this.hideCreate}
          maskClosable={true}
          visible={create}
          width={720}
        >
          <ProductCreateForm
            wrappedComponentRef={(ref) => this.createForm = ref}
            AttributeSet={AttributeSet}
            create={this.create}
            hideCreate={this.hideCreate}
          />
        </Drawer>

        <Drawer
          title='Create New Product Mapping'
          placement='right'
          onClose={this.hideMapping}
          maskClosable={true}
          visible={mapping}
          width={720}
        >
          <ProductMappingForm
            wrappedComponentRef={(ref) => this.mappingForm = ref}
            current={current}
            mapping={this.mapping}
            hideMapping={this.hideMapping}
          />
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Product);
