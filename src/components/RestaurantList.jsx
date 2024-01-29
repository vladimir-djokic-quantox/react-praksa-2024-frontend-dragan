import Link from "next/link";

const RestaurantList = ({ restaurants }) => {
  if (!restaurants) return <p className="text-center text-gray-400 text-lg">No restaurants found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {restaurants.map(({ id, attributes }) => (
        <Link key={id} href={`/dishes/${id}`} className="block">
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out bg-white">
            {attributes.image.data && (
              <div className="w-full h-56 overflow-hidden rounded-t-lg">
                <img
                  src={`http://localhost:3030${attributes.image.data.attributes.url}`}
                  alt={attributes.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 hover:text-blue-500 transition-colors duration-300 ease-in-out">
                {attributes.name}
              </h2>
              <p className="text-gray-600">{attributes.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RestaurantList;
 