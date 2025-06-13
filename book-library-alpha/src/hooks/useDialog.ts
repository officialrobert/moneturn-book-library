import { useShallow } from 'zustand/shallow';
import { useAppStore } from '@/store';
import { Dialogs } from '@/types';

const useDialog = () => {
  const { showDialog, setShowDialog } = useAppStore(
    useShallow((state) => ({
      showDialog: state.showDialog,
      setShowDialog: state.setShowDialog,
    })),
  );

  const closeDialog = () => setShowDialog(Dialogs.none);

  return {
    showDialog,
    closeDialog,
    setShowDialog,
  };
};

export { useDialog };
