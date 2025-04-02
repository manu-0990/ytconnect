"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import RoleSelectModal from "@/components/modals/RoleSelectModal";
import { useToast } from "@/hooks/use-toast";

export default function RoleSelectPage({ userName }: { userName: string }) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {       // <<< Keep modal open if no role selected
    if (selectedRole) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  }, [selectedRole]);

  const handleRoleSelection = async (role: 'CREATOR' | 'EDITOR') => {
    try {
      setIsLoading(true);
      await axios.post("/api/user/update-role", { role });
      toast({
        title: "Role Updated",
        description: `You have selected the ${role} role.`
      });
      setSelectedRole(role);
      router.refresh();
    } catch (error: any) {
      console.error("Error selecting role:", error);
      toast({
        title: "Error",
        description: error.message || "There was an issue selecting your role. Please try again.",
      });
      setIsLoading(false);
    } finally {
      setIsModalOpen(false);
      setIsLoading(false);
    }
  };

  return (
      <RoleSelectModal
        isOpen={isModalOpen}
        userName={userName}
        onRoleSelect={handleRoleSelection}
        isLoading={isLoading}
      />
  );
}
