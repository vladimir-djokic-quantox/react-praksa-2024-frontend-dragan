import { gql } from "@apollo/client";

export const ADD_TO_CART = gql`
mutation AddToCart($dishId: ID!) {
  addToCart(dish: $dishId) {
    data {
      id
      attributes {
        dishes {
          data {
            id
            attributes {
              name
              price
            }
          }
        }
      }
    }
  }
}
`;

export const REMOVE_FROM_CART_MUTATION = gql`
mutation RemoveFromCart($dishId: ID!) {
  removeFromCart(dish: $dishId) {
    data {
      id
      attributes {
        dishes {
          data {
            id
            attributes {
              name
              price
            }
          }
        }
      }
    }
  }
}
`;

export const GET_USER_CART_QUERY = gql`
query GetUserCart {
  me {
    username
    cart {
      data{
        attributes{
          dishes{
            data {
              id
              attributes{
                name
                price
                image {
                  data{
                    attributes{
                      url
                    }
                    
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

`;

export const CLEAR_CART_MUTATION = gql`
  mutation ClearCart {
    clearCart {
      data {
        attributes {
          dishes {
            data {
              attributes {
                name
                price
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_DISHES_BY_SLUG = gql`
query GetDishesBySlug($slug: String!) {
  restaurantBySlug(slug: $slug) {
    data {
      attributes {
        name
        dishes {
          data {
            id
            attributes {
              name
              description
              price
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    register(
      input: { username: $username, email: $email, password: $password }
    ) {
      jwt
      user {
        id
        username
      }
    }
  }
`;

export const GET_RESTAURANTS = gql`
  query Restaurant {
    restaurants {
      data {
        id
        attributes {
          name
          slug
          description
          image {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { identifier: $email, password: $password }) {
      jwt
      user {
        id
        username
        email
      }
    }
  }
`;
