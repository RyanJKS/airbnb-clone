"use client";

interface MenuItemProps {
    label: string;
    onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, onClick }) => {
    return (
        <div
            className="px-5 py-4 hover:bg-gray-100 transition cursor-pointer"
            onClick={onClick}
        >
            {label}
        </div>
    );
}

export default MenuItem;
