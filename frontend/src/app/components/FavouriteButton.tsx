'use client';
import { CiHeart } from "react-icons/ci";
import apiService from "../api/apiService";

interface FavouriteButtonProps {
    id: string;
    is_favourite: boolean;
    markFavourite: (is_favourite: boolean) => void;
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({ id, is_favourite, markFavourite }) => {
    const toggleFavourite = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        try {
            const response = await apiService.post(`/api/properties/${id}/toggle-favourite/`, {});
            markFavourite(response.is_favourite);
        } catch (error) {
            console.error('Failed to toggle favourite:', error);
        }
    };

    return (
        <div
            onClick={toggleFavourite}
            className={`absolute top-2 right-2 ${is_favourite ? 'text-airbnb' : 'text-black'} hover:text-airbnb`}
        >
            <CiHeart className="text-3xl" />
        </div>
    );
};

export default FavouriteButton;