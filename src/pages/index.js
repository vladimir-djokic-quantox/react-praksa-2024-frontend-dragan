import { useQuery, gql } from '@apollo/client';
import Layout from '../components/Layout';
import RestaurantList from '../components/RestaurantList';

const GET_RESTAURANTS = gql`
  query Restaurant {
    restaurants {
      data {
        id
        attributes {
          name
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

export default function Home() {
  const { loading, error, data } = useQuery(GET_RESTAURANTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-bold my-4">Restaurants</h1>
        <RestaurantList restaurants={data?.restaurants?.data} />
      </div>
    </Layout>
  );
}
