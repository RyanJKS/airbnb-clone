'use client';
import PropertyList from "../components/properties/PropertyList";
import { useAuth } from "../contexts/AuthContext";

const MyFavouritesPage = () => {
    const { userId } = useAuth();

    if (!userId) {
        return (
            <main className="max-w-[1500px] max-auto px-6 py-12">
                <p>You need to be authenticated...</p>
            </main>
        )
    }

    return (
        <main className="max-w-[1500px] max-auto px-6 pb-12">
            <h1 className="my-6 text-2xl">My favorites</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PropertyList
                    favourites={true}
                />
            </div>
        </main>
    )
}

export default MyFavouritesPage;