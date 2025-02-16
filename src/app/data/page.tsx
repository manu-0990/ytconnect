import { signOut } from "next-auth/react";

const handleSignOut = () => {
  signOut({ callbackUrl: '/' }); // Redirect to home after sign out
};

export default function LogoutButton() {
  return <button onClick={handleSignOut}>Sign Out</button>;
}
