import { LogOut, Settings } from "lucide-react";
import Button from "../ui/button";
import { redirect } from "next/navigation";
import SignoutButton from "../auth/SignoutButton";

interface AccountProps {
    isOpen: boolean;
    onClose: () => void;
}

export default  function Account({isOpen, onClose}: AccountProps) {

    return (
        <div className={`${!isOpen ? "opacity-0" : "opacity-100"} transition-all ease-in-out bg-[#0d0c0c] fixed bottom-[10%] w-60 flex flex-col items-center gap-3 rounded-lg py-3 px-3 text-lg`}>
            <Button variant="large" className="w-full" onClick={() => redirect('settings')} ><Settings/>Settings</Button>
            <SignoutButton />
        </div>
    )
}