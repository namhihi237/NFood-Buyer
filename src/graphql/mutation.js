import { gql } from '@apollo/client';
export default {
  REGISTER: gql`mutation register($phoneNumber: String!,$password: String!, $role: roleEnum!) {
    register(phoneNumber: $phoneNumber,  password: $password, role: $role) {
      _id
      role
      phoneNumber  
    }
  }`,

  LOGIN: gql`mutation login($phoneNumber: String!, $password: String!) {
    login(phoneNumber: $phoneNumber, password: $password) {
      user {
        _id
        role
        isBuyer
      }
      token
    }
  }`,

  SET_NAME_BUYER: gql`mutation setNameBuyer($name: String!) {
    setNameBuyer(name: $name) {
    success
    message  
    }
  }`,

  SET_LOCATION_BUYER: gql`mutation updateGPSAddressBuyer($latitude: Float!, $longitude: Float!) {
    updateGPSAddressBuyer(latitude: $latitude, longitude: $longitude) 
  }`

}