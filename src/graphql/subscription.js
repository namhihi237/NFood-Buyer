import { gql } from '@apollo/client';

export default {
  GET_NUMBER_OF_NOTIFICATIONS: gql`subscription Subscription($userType: roleEnum!) {
    numberOfNotifications(userType: $userType)
  }`
}