import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { GET_DISHES } from '../../graphql/queries'

const DishesPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_DISHES, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const restaurantName = data.restaurant.data.attributes.name; 
  const dishes = data.restaurant.data.attributes.dishes.data;

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-bold my-4">{restaurantName} Dishes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {dishes.map(({ attributes }, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out bg-white"
            >
              {attributes.image && attributes.image.data && (
                <div className="w-full h-56 overflow-hidden rounded-t-lg">
                 {attributes.image.data.length > 0 && (
                <img
                  src={`http://localhost:3030${attributes.image.data[0].attributes.url}`}
                  alt={attributes.name}
                  className="w-full h-auto rounded mb-2"
                />
              )}
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1 text-gray-800">
                  {attributes.name}
                </h3>
                <p className="text-gray-600 mb-2">{attributes.description}</p>
                <p className="text-lg font-bold text-gray-900">{`${attributes.price.toFixed(
                  2
                )} RSD`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DishesPage