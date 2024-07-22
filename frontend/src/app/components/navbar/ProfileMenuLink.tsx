"use client";

interface ProfileMenuLinkProps {
    label: string;
    onClick: () => void;
}

const ProfileMenuLink: React.FC<ProfileMenuLinkProps> = ({ label, onClick }) => {
    return (
        <div
            className="px-5 py-4 hover:bg-gray-100 transition cursor-pointer"
            onClick={onClick}
        >
            {label}
        </div>
    )
}

export default ProfileMenuLink