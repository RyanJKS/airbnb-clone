'use client';
import { useState, useEffect } from 'react';
import apiService from "@/app/api/apiService";
import HostContactButton from "@/app/components/HostContactButton";
import PropertyList from "@/app/components/properties/PropertyList";
import { useAuth } from "@/app/contexts/AuthContext";
import Image from "next/image";


interface Host {
    id: string;
    name: string;
    profile_img_url: string
}

const HostDetailPage = ({ params }: { params: { id: string } }) => {

    const [host, setHost] = useState<Host>({
        id: '',
        name: '',
        profile_img_url: '',
        // Initialize other properties as needed
    });
    const { userId } = useAuth();

    useEffect(() => {
        const fetchHost = async () => {
            try {
                const hostData = await apiService.get(`/api/auth/${params.id}`);
                setHost(hostData);
            } catch (error) {
                console.error('Failed to fetch host:', error);
            }
        };

        fetchHost();
    }, [params.id]);

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <aside className="col-span-1 mb-4">
                    <div className="flex flex-col items-center p-6 rounded-xl border border-gray-300 shadow-xl">
                        <Image
                            src={host.profile_img_url ? host.profile_img_url : "/template_host_image.jpeg"}
                            alt="Host Profile"
                            className="rounded-full"
                            width={200}
                            height={200}
                        />
                        <h1 className="mt-6 text-2xl"> {host.name}</h1>
                        {userId != params.id && <HostContactButton />}
                    </div>
                </aside>

                <div className="col-span-1 md:col-span-3 pl-0 md:pl-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PropertyList host_id={params.id} />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default HostDetailPage;