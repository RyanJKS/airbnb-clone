'use client';
import { useRouter } from "next/navigation";
import { resetAuthCookies } from '../../lib/actions';
import MenuItem from "./MenuItem"; // Make sure this path is correct
import { useAuth } from "@/app/contexts/AuthContext";

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const { refreshUserId } = useAuth();

  const submitLogout = async () => {
    await resetAuthCookies();
    await refreshUserId();
    router.push('/');
  }

  return (
    <MenuItem
      label="Logout"
      onClick={submitLogout} />
  )
}

export default LogoutButton;
