import { useAppStore } from '../store';
import { useShallow } from 'zustand/shallow';
import { Dialogs } from '../types';

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
  };
};

export { useDialog };
