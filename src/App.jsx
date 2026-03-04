import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PriceList from "./components/PriceList";
import "./App.css";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: true, // Refetch when user returns to the tab
      refetchOnMount: true, // Refetch when component mounts
      refetchOnReconnect: true, // Refetch when internet reconnects
    },
  },
});

export default function App() {
  // Simplified App - Only shows Price List
  // All other routes (billing, admin, search, etc.) are hidden for this branch

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Main Route - Price List on root path */}
          <Route path="/" element={<PriceList />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
