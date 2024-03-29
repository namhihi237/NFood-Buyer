import { gql } from '@apollo/client';
export default {
  VENDORS: gql`query Vendors($distance: Float, $longitude: Float, $latitude: Float, $limit: Int, $offset: Int,$isPromotion: Boolean) {
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

     getAllVendors(offset: $offset, limit: $limit, distance: $distance, isPromotion: $isPromotion) {
      items {
        name
        _id
        rating
        image
        distance
        address
        numberOfReviews
        timeOpen {
          openTime
          day
          closeTime
          isOpen
        }
        menu {
          name
          _id
        }
      }
    }
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
      numberOfReviews
      timeOpen {
        openTime
        day
        closeTime
        isOpen
      }
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
      vouchers {
        _id
        promoCode
        discount
        status
        quantity
        startDate
        maxDiscount
        minTotal
        endDate
        discountType
        createdAt
      }
    }
  }`,

  GET_CARTS: gql`query Carts {
    carts {
      carts {
        _id
        vendorId
        item {
          _id
          name
          price
          image
        }
        quantity
      }
      vendor {
        _id
        name
        address
        image
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
      email
      gender
      birthday
      isBuyer
      coordinates
      money
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
        orderId
      }
      total
    }
  }`,

  GET_NUMBER_OF_NOTIFICATIONS: gql`query Query($userType: roleEnum!) {
    getNumberOfNotifications(userType: $userType)
  }`,

  GET_ORDER_BY_ID: gql`query getOrderByIdBuyer($id: ID!) {
    getOrderByIdBuyer(id: $id) {
      _id
      invoiceNumber
      subTotal
      shipping
      discount
      total
      orderItems {
        price
        buyerId
        quantity
        name
        buyerName
        image
        note
        _id
      }
      address
      phoneNumber
      name
      deliveredAt
      acceptedShippingAt
      estimatedDeliveryTime
      paymentStatus
      paymentMethod
      orderStatus
      createdAt
      isReviewedShipper
      isReviewVendor
      vendor {
        _id
        name
        phoneNumber
        image
        address
      }
      shipper {
        _id
        phoneNumber
        image
        name
        _id
      }
    }
  }`,

  CHECK_PROMO_CODE: gql`query CheckPromoCode($promoCode: String!, $vendorId: ID!, $subTotal: Float!) {
    checkPromoCode(promoCode: $promoCode, vendorId: $vendorId, subTotal: $subTotal) {
      promoCode
      _id
      discount
      status
      quantity
      startDate
      endDate
      discountType
      createdAt
    }
  }`,

  GET_VENDOR_FAVORITES: gql`query GetVendorFavorite {
    getVendorFavorite {
      _id
      name
      phoneNumber
      rating
      image
      distance
      address
      numberOfReviews
      menu {
        name
        _id
      }
      location {
        coordinates
      }
    }
  }`,

  GET_ALL_VENDORS: gql`query GetAllVendors($keyword: String, $offset: Int, $limit: Int, $distance: Float, $isPromotion: Boolean) {
    getAllVendors(keyword: $keyword, offset: $offset, limit: $limit, distance: $distance, isPromotion: $isPromotion) {
      items {
        name
        _id
        rating
        image
        distance
        address
        numberOfReviews
        timeOpen {
          openTime
          day
          closeTime
          isOpen
        }
        menu {
          name
          _id
        }
      }
    }
  }`,

  GET_REVIEWS_BY_VENDOR: gql`query GetReviewsByVendor($vendorId: ID!) {
    getReviewsByVendor(vendorId: $vendorId) {
      reviews {
        _id
        rating
        comment
        image
        buyer {
          name
        }
        createdAt
      }
    }
  }`,

  GET_SIGNATURE: gql`query getSignatureImage {
    getSignatureImage
  }`,

  GET_TRANSACTIONS: gql`query GetTransactions($type: String!) {
    getTransactions(type: $type) {
      _id
      userId
      amount
      type
      currency
      createdAt
    }
  }`,

};