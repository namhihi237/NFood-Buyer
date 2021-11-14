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

    carts {
      _id
      vendorId
      quantity
      item {
        _id
        name
        price
        isActive
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
};