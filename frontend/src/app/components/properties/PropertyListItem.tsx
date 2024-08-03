import Image from "next/image";
import { PropertyType } from "./PropertyList";
import { useRouter } from "next/navigation";
import FavouriteButton from "../FavouriteButton";
import { useAuth } from "@/app/contexts/AuthContext";

interface PropertyProps {
    property: PropertyType;
    markFavourite: (id: string, is_favourite: boolean) => void;
}

const PropertyListItem: React.FC<PropertyProps> = ({ property, markFavourite }) => {
    const router = useRouter();
    const { userId } = useAuth();

    const handleFavouriteClick = (is_favourite: boolean) => {
        markFavourite(property.id, is_favourite);
    };

    return (
        <div className="cursor-pointer" onClick={() => router.push(`properties/${property.id}`)}>
            <div className="relative overflow-hidden aspect-square rounded-xl">
                <Image
                    fill
                    src={property.image_url}
                    sizes="(max-width: 768px) 768px, (max-width:1200px): 768px, 768px"
                    className="hover:scale-110 object-cover transition h-full w-full"
                    alt="Modern House"
                />
                {userId && (
                    <FavouriteButton
                        id={property.id}
                        is_favourite={property.is_favourite}
                        markFavourite={handleFavouriteClick}
                    />
                )}
            </div>

            <div className="mt-2">
                <p className="text-lg font-bold">{property.title}</p>
            </div>

            <div className="mt-2">
                <p className="text-sm"><strong>{property.price_per_night}</strong></p>
            </div>
        </div>
    );
};

export default PropertyListItem;
