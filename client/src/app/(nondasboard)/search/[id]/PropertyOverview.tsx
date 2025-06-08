import { useGetPropertyQuery } from "@/src/state/api";
import { MapPin, Star } from "lucide-react";
import React from "react";

const PropertyOverview = ({ propertyId }: PropertyOverviewProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) {
    return <>Property not Found</>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">
          {property.location?.country} / {property.location?.state} /{" "}
          <span className="font-semibold text-gray-600">
            {property.location?.city}
          </span>
        </div>
        <h1 className="text-3xl font-bold my-5">{property.name}</h1>
        <div className="flex justify-between items-center">
          <span className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1 text-gray-700" />
            {property.location?.city}, {property.location?.state},{" "}
            {property.location?.country}
          </span>
          <div className="flex justify-between items-center gap-3">
            <span className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {property.averageRating.toFixed(1)} ({property.numberOfReviews}{" "}
              Reviews)
            </span>
            <span className="text-green-600">Verified Listing</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="border border-primary-200 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center gap-4 px-5">
          <div>
            <div className="text-sm text-gray-500">Monthly Rent</div>
            <div className="font-semibold">
              ₹{property.pricePerMonth.toLocaleString()}
            </div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Bedrooms</div>
            <div className="font-semibold">{property.beds} bed</div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Bathrooms</div>
            <div className="font-semibold">{property.baths} bath</div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Square Feet</div>
            <div className="font-semibold">
              {property.squareFeet.toLocaleString()} sq ft
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="my-16">
        <h2 className="text-xl font-semibold mb-5">About {property.name}</h2>
        <p className="text-gray-500 leading-7">
          {property.description}
          Experience resort-style luxury living at Seacrest Homes, where the
          vibrancy of city life meets serene green spaces. Our newly built
          community offers sophisticated two and three-bedroom residences, each
          thoughtfully designed with high-end finishes, elegant quartz
          countertops, premium modular kitchen appliances, a dedicated office
          nook, and a full-size in-unit washer and dryer. Discover your personal
          sanctuary at home with stunning swimming pools and spas, complete with
          poolside cabanas. Relax in your own oasis, surrounded by beautifully
          landscaped gardens and indoor/outdoor entertainment lounges. Spend
          your days unwinding in the exclusive BBQ area and enjoy breathtaking,
          unobstructed views of the Delhi skyline, or watch the city lights
          sparkle by night. Begin or end your day with a workout in our
          state-of-the-art fitness club and yoga studio. For professionals, our
          business center features a modern conference room, adjacent to a
          high-speed internet and coffee lounge—perfect for meetings or remote
          work. Conveniently located near Delhi’s most beautiful parks and
          gardens, Seacrest Homes offers easy access to the city’s major roads
          and expressways, including the Delhi-Gurgaon Expressway and the Outer
          Ring Road. Enjoy proximity to world-class shopping at Select Citywalk
          and DLF Promenade, as well as top healthcare facilities such as AIIMS,
          Fortis, and Max Super Specialty Hospital. Contact us today to schedule
          a tour and embrace the Seacrest luxury lifestyle as your own. Seacrest
          Homes Apartments is a premier community located in South Delhi, within
          the 110017 PIN code area, served by the Delhi Public School and other
          leading educational institutions. Let me know if you want to customize
          it further for a specific Delhi neighborhood or add more local flavor!
          Related Experience resort-style luxury living at Seacrest Homes, now
          in Delhi, where urban vibrancy and natural beauty blend seamlessly
        </p>
      </div>
    </div>
  );
};

export default PropertyOverview;
