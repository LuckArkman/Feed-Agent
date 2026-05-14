import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { router } from '@/routes';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './App.css';

// Central TanStack Query Configuration Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents aggressive background refetches on window blur
      retry: 1, // Only 1 retry before reporting network failure
      staleTime: 1000 * 60 * 5, // Cache entries considered fresh for 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        
        {/* Dynamic Glassmorphic Toasts Engine */}
        <Toaster 
          position="top-right" 
          toastOptions={{ 
            className: 'glass-toast',
            duration: 3500,
          }} 
        />
        
        {/* Network & Cache State Debugger (Devtools) */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
