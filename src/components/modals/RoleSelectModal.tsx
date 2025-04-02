import Modal from 'react-modal';
import { Button } from '../ui/button';

Modal.setAppElement('#__main');

interface RoleSelectModalProps {
  isOpen: boolean;
  userName: string;
  onRoleSelect: (role: 'CREATOR' | 'EDITOR') => void;
  isLoading: boolean;
}

const RoleSelectModal: React.FC<RoleSelectModalProps> = ({ isOpen, userName, onRoleSelect, isLoading }) => {

  const overlayClasses = "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50";
  const contentClasses = `${isLoading ? 'cursor-progress' : 'cursor-default'} bg-gray-800 text-white p-8 rounded-lg shadow-xl flex flex-col items-center space-y-5 border border-gray-700 w-full max-w-sm relative outline-none`;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => { }}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      contentLabel="Role Selection Modal"
      className={contentClasses}
      overlayClassName={overlayClasses}
    >
      <h2 className="text-xl font-semibold">Hello, {userName}</h2>
      <p className="text-md text-gray-300">Select your role</p>
      <div className="flex space-x-4 w-full justify-center pt-2">
        <Button
          onClick={() => onRoleSelect('CREATOR')}
          size='lg'
          disabled={isLoading}
        >
          Creator
        </Button>
        <Button
          onClick={() => onRoleSelect('EDITOR')}
          size='lg'
          disabled={isLoading}
        >
          Editor
        </Button>
      </div>
    </Modal>
  );
};

export default RoleSelectModal;
