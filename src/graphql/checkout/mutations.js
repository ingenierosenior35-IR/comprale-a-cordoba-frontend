import { gql } from 'graphql-request';

export const CREATE_GUEST_CART = gql`
  mutation CreateGuestCart {
    createEmptyCart
  }
`;

export const ADD_PRODUCTS_TO_CART = gql`
  mutation AddProductsToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
    addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
      cart {
        id
        total_quantity
      }
      user_errors {
        code
        message
      }
    }
  }
`;

export const SET_GUEST_EMAIL = gql`
  mutation SetGuestEmailOnCart($cartId: String!, $email: String!) {
    setGuestEmailOnCart(input: { cart_id: $cartId, email: $email }) {
      cart {
        email
      }
    }
  }
`;

export const SET_SHIPPING_ADDRESS = gql`
  mutation SetShippingAddress($cartId: String!, $firstname: String!, $lastname: String!, $street: String!, $city: String!, $region: String!, $postcode: String!, $telephone: String!) {
    setShippingAddressesOnCart(
      input: {
        cart_id: $cartId
        shipping_addresses: [{
          address: {
            firstname: $firstname
            lastname: $lastname
            street: [$street]
            city: $city
            region: $region
            postcode: $postcode
            country_code: "CO"
            telephone: $telephone
            save_in_address_book: false
          }
        }]
      }
    ) {
      cart {
        shipping_addresses {
          firstname
          lastname
        }
      }
    }
  }
`;

export const PLACE_ORDER = gql`
  mutation PlaceOrder($cartId: String!) {
    placeOrder(input: { cart_id: $cartId }) {
      order {
        order_number
      }
    }
  }
`;
