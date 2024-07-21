import Image from "next/image"

const PropertyListItem = () => {
    return (
        <div className="cursor-pointer">
            <div className="relative overflow-hidden aspect-square rounded-xl">
                <Image
                    fill
                    src='/template_house.jpg'
                    sizes="(max-width: 768px) 768px, (max-width:1200px): 768px, 768px"
                    className="hover:scale-110 object-cover transition h-full w-full"
                    alt="Modern House"
                />
            </div>

            <div className="mt-2">
                <p className="text-lg font-bold">Property Name</p>
            </div>

            <div className="mt-2">
                <p className="text-sm"><strong>Price</strong></p>
            </div>
        </div>
    )
}

export default PropertyListItem