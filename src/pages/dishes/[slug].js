import { useQuery, useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { GET_DISHES_BY_SLUG, GET_USER_CART_QUERY, ADD_TO_CART } from "../../graphql/queries";

const DishesPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setAuthToken(token);
    }
  }, []);

  const { loading, error, data } = useQuery(GET_DISHES_BY_SLUG, {
    variables: { slug },
  });

  const { refetch } = useQuery(GET_USER_CART_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
    skip: !authToken,
  });

  const [addToCart, { loading: addingToCart }] = useMutation(ADD_TO_CART, {
    context: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
    onCompleted: () => refetch(), 
  });

  const handleAddToCart = async (dishId) => {
    await addToCart({ variables: { dishId } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const restaurantName = data.restaurantBySlug.data.attributes.name;
  const dishes = data.restaurantBySlug.data.attributes.dishes.data;

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-bold my-4">{restaurantName} Dishes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map(({ id, attributes }) => (
            <div
              key={id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out bg-white p-6"
            >
              {attributes.image && attributes.image.data.length > 0 && (
                <img
                  src={`http://localhost:3030${attributes.image.data[0].attributes.url}`}
                  alt={attributes.name}
                  className="w-full h-56 object-cover mb-4 rounded"
                />
              )}
              <h3 className="text-lg font-semibold mb-1 text-gray-800">
                {attributes.name}
              </h3>
              <p className="text-gray-600 mb-2">{attributes.description}</p>
              <p className="text-lg font-bold text-gray-900">{`${attributes.price.toFixed(
                2
              )} RSD`}</p>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleAddToCart(id)}
                disabled={addingToCart}
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DishesPage;
