import Link from 'next/link';

const RestaurantList = ({ restaurants }) => {
  if (!restaurants) return <p>No restaurants found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {restaurants.map(({ id, attributes }) => (
        <div key={id} className="border rounded shadow-lg p-4">
          <h2 className="text-2xl font-bold mb-2">
            <Link href={`/dishes/${id}`}>
              {attributes.name}
            </Link>
          </h2>
          {attributes.image.data && (
            <img
              src={`http://localhost:3030${attributes.image.data.attributes.url}`}
              alt={attributes.name}
              className="w-full h-auto rounded mb-2"
            />
          )}
          <p>{attributes.description}</p>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
