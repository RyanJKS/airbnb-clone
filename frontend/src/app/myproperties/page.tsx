'use client';
import PropertyList from "../components/properties/PropertyList";
import { useAuth } from "@/app/contexts/AuthContext"

const MyProperties = () => {

    const { userId } = useAuth();

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl">My Properties</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {userId && <PropertyList host_id={userId} />}
            </div>
        </main>
    )
}

export default MyProperties;