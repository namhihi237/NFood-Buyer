import { gql } from '@apollo/client';
export default {
  VENDORS: gql`query Vendors($distance: Float, $longitude: Float, $latitude: Float, $limit: Int, $offset: Int) {
    vendors(distance: $distance, longitude: $longitude, latitude: $latitude, limit: $limit, offset: $offset) {
      items {
        _id
        name
        rating
        image
        distance
        address
        numberOfReviews
      }  
      total
    }

    getQuantityOfCart
  }`,
  VENDOR: gql`query Vendor($vendorId: ID!) {
    vendor(id: $vendorId) {
      _id
      name
      phoneNumber
      rating
      image
      distance
      address
      menu {
        _id
        name
        items {
          _id
          name
          isActive
          price
          image
          description
        }
      }
    }
  }`,

  GET_CARTS: gql`query Carts {
    carts {
      carts {
        _id
        item {
          name
          price
        }
        quantity
      }
      vendor {
        _id
        name
        address
      }
    }
  }`,
  GET_USER: gql`query GetUser($role: roleEnum!) {
    getUser(role: $role) {
      _id
      phoneNumber
      role
      name
      address
      image
      isBuyer
      coordinates
    }
  }`,

  CALCULATE_SHIPPING: gql`query calculateShipping($vendorId: ID!) {
    calculateShipping(vendorId: $vendorId)
  }`,

  GET_ORDERS: gql`query GetOrderByBuyer {
    getOrderByBuyer {
      _id
      invoiceNumber
      subTotal
      shipping
      discount
      total
      orderItems {
        _id
        price
        quantity
        name
        image
        buyerName
        note
      }
      address
      phoneNumber
      name
      deliveredAt
      acceptedShippingAt
      estimatedDeliveryTime
      paymentStatus
      orderStatus
      createdAt
      vendor {
        name
        address
      }
    }
  }`,

  GET_NOTIFICATIONS: gql`query GetNotifications($userType: roleEnum!, $limit: Int, $skip: Int) {
    getNotifications(userType: $userType, limit: $limit, skip: $skip) {
      items {
        _id
        content
        image
        createdAt
      }
      total
    }
  }`,

  GET_NUMBER_OF_NOTIFICATIONS: gql`query Query($userType: roleEnum!) {
    getNumberOfNotifications(userType: $userType)
  }`

};