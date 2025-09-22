import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      duration: 5000,
    });
  },
  
  loading: (message: string) => {
    return toast.loading(message, {
      duration: 3000,
    });
  },
  
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
  
  promise: <T>(
    promise: Promise<T>,
    {
      loading = 'Loading...',
      success = 'Success!',
      error = 'An error occurred',
    }: {
      loading?: string;
      success?: string;
      error?: string;
    } = {}
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};
