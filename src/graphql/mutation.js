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
  }`,

  ADD_TO_CART: gql`mutation AddToCart($itemId: ID!, $quantity: Int!, $vendorId: ID!) {
    addToCart(itemId: $itemId, quantity: $quantity, vendorId: $vendorId) {
      _id
      item {
        name
        price
      }
      quantity
      createdAt
      vendorId
    }
  }
`,

  RESEND_CODE: gql`mutation GetCodePhoneNumber($phoneNumber: String!) {
    getCodePhoneNumber(phoneNumber: $phoneNumber)
  }`,

  ACTIVE_PHONE_NUMBER: gql`mutation ActivePhoneNumber($phoneNumber: String!, $code: String!) {
    activePhoneNumber(phoneNumber: $phoneNumber, code: $code) {
      token
      user {
      name  
      }
    }
  }`,

  DELETE_CART: gql`mutation RemoveFromCart($id: ID!) {
    removeFromCart(id: $id)
  }`,

  UPDATE_CART_ITEM: gql`mutation UpdateQuantityInCart($id: ID!, $quantity: Int!) {
    updateQuantityInCart(id: $id, quantity: $quantity) {
    _id
    quantity  
    }
  }`
}