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
}

export default new Order();