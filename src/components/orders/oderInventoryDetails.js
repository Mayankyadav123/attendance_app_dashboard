import React from 'react';

import _ from 'lodash';

import { Table, Button } from 'antd';

import urljoin from 'url-join';

const mediaURL = process.env.REACT_APP_MEDIA_URL;

const orderURL = process.env.MAGENTO_ORDER_URL || 'https://www.saudiology.com/abadmin/sales/order/view/order_id';

const getMediaPath = (path) => urljoin(mediaURL, path);

class orderInventoryDetails extends React.Component {
  renderInventoryDetails = (product, record) => {
    const inventories = _.keyBy(record.inventories, '_id');

    const columns = [{
      title: 'ItemCode',
      dataIndex: 'inventoryId',
      key: 'itemcode',
      align: 'center',
      render: inventory => inventories[inventory].itemcode 
    }, {
      title: 'Barcode',
      dataIndex: 'inventoryId',
      key: 'barcode',
      align: 'center',
      render: inventory => inventories[inventory].barcode 
    }, {
      title: 'Selected Quantity',
      dataIndex: 'quantity',
      align: 'center',
    }];

    return (
      <Table
        rowKey='_id'
        title={() => 'Selected Inventory'}
        dataSource ={product.selectedInventory}
        columns={columns}
        bordered
        pagination={false}
      />
    );
  };

  render() {
    const { record } = this.props;
    const products = _.groupBy(record.products, '_id');

    const columns = [{
      title: 'Name',
      dataIndex: 'product',
      key: 'name',
      align: 'center',
      width: 250,
      render: product => products[product][0].system.name['en-SA']
    },{
      title: 'Image',
      align: 'center',
      dataIndex: 'product',
      key: 'image',
      render: product => {
        const record = products[product][0];
        if (record.images.length) {
          const primary = record.images.find((e) => e.primary);
          return <img src={getMediaPath(primary.thumb.thumb)} height='50' alt='' />;
        } else {
          return null;
        }
      }
    },{
      title: 'Url Key',
      dataIndex: 'product',
      key: 'urlKey',
      align: 'center',
      width: 300,
      render: product => products[product][0].system.urlKey['en-SA']
    },{
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },{
      title: 'Price',
      align: 'center',
      dataIndex: 'price'
    }];

    return (
      <div>
        <Table
          rowKey='_id'
          dataSource ={record.product}
          columns={columns}
          bordered
          pagination={false}
          expandRowByClick={true}
          defaultExpandAllRows={false}
          expandedRowRender={(product) => this.renderInventoryDetails(product, record)}
        />
        <br />
        <Button
          onClick={()=> 
            window.open(`${orderURL}/${record.entityId}`, "_blank")
          }
        >
          Go to Shipping
        </Button>
      </div>
    );
  }
}

export default orderInventoryDetails;