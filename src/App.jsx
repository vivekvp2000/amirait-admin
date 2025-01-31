import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import { HomePage } from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import PageLoader from "./components/PageLoader";

// Lazy Loading Components
const Invoice = lazy(() => import("./pages/Invoice"));
const Proposal = lazy(() => import("./pages/Proposal"));

function App() {
  return (
    <Routes basename="/">
      {/* DashboardLayout route with nested routes */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="invoice" element={<Suspense fallback={<div><PageLoader /></div>}><Invoice /></Suspense>} />
        <Route path="proposal" element={<Suspense fallback={<div><PageLoader /></div>}><Proposal /></Suspense>} />

      </Route>
      {/* Login and Register routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Error Route  */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
