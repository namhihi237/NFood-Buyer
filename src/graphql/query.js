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
      }  
      total
    }
  }`
};