import { LogOut, Settings } from "lucide-react";
import Button from "../ui/button";
import { redirect } from "next/navigation";

interface AccountProps {
    isOpen: boolean;
    onClose: () => void;
}

export default  function Account({isOpen, onClose}: AccountProps) {

    return (
        <div hidden={isOpen} className={`${isOpen ? "opacity-0" : "opacity-100"} transition-all ease-in-out bg-[#0d0c0c] fixed bottom-[10%] w-60 flex flex-col items-center gap-3 rounded-lg py-3 px-3 text-lg`}>
            <Button variant="large" className="w-full" onClick={() => redirect('settings')} ><Settings/>Settings</Button>
            <Button variant="large" className="w-full" onClick={() => (redirect('/api/auth/signout'))} ><LogOut/> Sign Out</Button>
        </div>
    )
}