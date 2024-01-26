import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import Layout from '../../components/Layout';

const GET_RESTAURANT_WITH_DISHES = gql`
  query RestaurantWithDishes($restaurantId: ID!, $dishIds: [ID!]) {
    restaurant(id: $restaurantId) {
      data {
        attributes {
          name
        }
      }
    }
    dishes(filters: { id: { in: $dishIds } }) {
      data {
        id
        attributes {
          name
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

const Dishes = () => {
  const router = useRouter();
  const { id } = router.query;

  const dishesByRestaurant = {
    '1': ['1', '2', '3'], //  Pizza Zebra
    '2': ['4'],           //  Milky Čačak
  };

  const dishIds = dishesByRestaurant[id] || [];

  const { loading, error, data } = useQuery(GET_RESTAURANT_WITH_DISHES, {
    variables: { restaurantId: id, dishIds: dishIds },
    skip: !id,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-bold my-4">
          Dishes at {data?.restaurant?.data?.attributes?.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.dishes?.data.map(({ id, attributes }) => (
            <div key={id} className="border rounded shadow-lg p-4">
              <h2 className="text-lg font-bold mb-2">{attributes.name}</h2>
              {attributes.image.data.length > 0 && (
                <img
                  src={`http://localhost:3030${attributes.image.data[0].attributes.url}`}
                  alt={attributes.name}
                  className="w-full h-auto rounded mb-2"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dishes;
