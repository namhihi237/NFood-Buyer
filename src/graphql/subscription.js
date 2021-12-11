import { gql } from '@apollo/client';

export default {
  GET_NUMBER_OF_NOTIFICATIONS: gql`subscription Subscription($userType: roleEnum!) {
    numberOfNotifications(userType: $userType)
  }`,

  GET_LOCATION_SHIPPER: gql`subscription Subscription($orderId: ID!) {
    locationShipper(orderId: $orderId)
  }`
}