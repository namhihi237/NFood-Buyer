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
        _id
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
  }`,

  CHECKOUT: gql`mutation Checkout($method: methodEnum!, $promoCode: String) {
  checkout(method: $method, promoCode: $promoCode) {
      _id
      total
      subTotal
      shipping
      discount
      name
      phoneNumber
      address
      deliveredAt
    }
  }`,

  RESET_NUMBER_OF_NOTIFICATIONS: gql`mutation ResetNumberOfNotifications($userType: roleEnum!) {
    resetNumberOfNotifications(userType: $userType)
  }`,

  CANCEL_ORDER: gql`mutation CancelOrder($id: ID!) {
    cancelOrder(id: $id)
  }`,

  ADD_REVIEW: gql`mutation AddReview($rating: Int!, $comment: String!, $reviewedId: ID!, $type: reviewEnum!,$orderId: ID!) {
    addReview(rating: $rating, comment: $comment, reviewedId: $reviewedId, type: $type, orderId: $orderId)
  }`,

  ADD_FAVORITE: gql`mutation AddVendorFavorite($vendorId: ID!, $isAdd: Boolean!) {
    addVendorFavorite(vendorId: $vendorId, isAdd: $isAdd)
  }`,

  FORGOT_PASSWORD: gql`mutation ForgotPassword($phoneNumber: String!) {
    forgotPassword(phoneNumber: $phoneNumber)
  }`,

  VERIFY_CODE: gql`mutation VerifyCode($code: String!, $phoneNumber: String!) {
    verifyCode(code: $code, phoneNumber: $phoneNumber)
  }`,

  UPDATE_PASSWORD: gql`mutation UpdatePassword($password: String!, $code: String!) {
    updatePassword(password: $password, code: $code)
  }`,

  CHANGE_PASSWORD: gql`mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }`,

  UPDATE_PROFILE: gql`mutation UpdateBuyerProfile($name: String, $image: String, $email: String, $birthDay: String, $gender: String) {
    updateBuyerProfile(name: $name, image: $image, email: $email, birthDay: $birthDay, gender: $gender) {
      _id
      name
      phoneNumber
      image
      email
    }
  }`
}