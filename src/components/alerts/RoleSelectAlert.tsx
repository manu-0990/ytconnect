import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectAlertProps {
  isOpen: boolean;
  userName: string;
  onRoleSelect: (role: 'CREATOR' | 'EDITOR') => void;
  isLoading: boolean;
}

export default function RoleSelectAlert({
  isOpen,
  userName,
  onRoleSelect,
  isLoading,
}: RoleSelectAlertProps) {
  const [loadingRole, setLoadingRole] = useState<'CREATOR' | 'EDITOR' | null>(null);

  useEffect(() => {
    if (!isOpen || !isLoading) {
      setLoadingRole(null);
    }
  }, [isOpen, isLoading]);

  const handleRoleSelect = (role: 'CREATOR' | 'EDITOR') => {
    setLoadingRole(role);
    onRoleSelect(role);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className={isLoading ? 'cursor-progress' : ''}>
        <AlertDialogHeader>
          <AlertDialogTitle>Hello, {userName}</AlertDialogTitle>
          <AlertDialogDescription>
            Select your role below to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center gap-4 pt-2">
          <Button
            onClick={() => handleRoleSelect('CREATOR')}
            size='lg'
            disabled={isLoading}
            aria-label="Select Creator Role"
            className={cn({
              'opacity-50': isLoading && loadingRole === 'EDITOR',
            })}
          >
            {isLoading && loadingRole === 'CREATOR' && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Creator
          </Button>
          <Button
            onClick={() => handleRoleSelect('EDITOR')}
            size='lg'
            disabled={isLoading}
            aria-label="Select Editor Role"
            className={cn({
              'opacity-50': isLoading && loadingRole === 'CREATOR',
            })}
          >
            {isLoading && loadingRole === 'EDITOR' && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Editor
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};