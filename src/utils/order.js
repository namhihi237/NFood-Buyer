class Order {
  orderStatus(status) {
    switch (status) {
      case 'Pending':
        return 'Đang chờ';
      case 'Processing':
        return 'Đang lấy hàng';
      case 'Shipping':
        return 'Đang giao hàng';
      case 'Delivered':
        return 'Đã nhận hàng';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }

  orderStatusColor(status) {
    switch (status) {
      case 'Pending':
        return 'orange.600';
      case 'Processing':
        return 'fuchsia.600';
      case 'Shipping':
        return 'info.600';
      case 'Delivered':
        return 'success.600';
      case 'Cancelled':
        return 'muted.600';
      default:
        return 'tertiary.600';
    }
  }

  orderStatusIcon(status) {
    switch (status) {
      case 'Pending':
        return {
          icon: 'clock',
          color: '#fb923c',
        };
      case 'Processing':
        return {
          icon: 'truck',
          color: '#f472b6',
        }
      case 'Shipping':
        return {
          icon: 'truck',
          color: '#fb7185',
        }
      case 'Delivered':
        return {
          icon: 'check-circle',
          color: '#4ade80',
        }
      case 'Cancelled':
        return {
          icon: 'times-circle',
          color: '#a3a3a3',
        }
      default:
        return 'help';
    }
  }

  paymentMethod(method) {
    switch (method) {
      case 'COD':
        return 'Thanh toán khi nhận hàng';
      case 'CRE':
        return 'Thanh toán bằng thẻ tín dụng';
    }
  }
}

export default new Order();