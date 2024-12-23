import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./layout/DashboardLayout";
import Invoice from "./pages/Invoice";

function App() {
  return (
    <Routes basename="/">
      {/* DashboardLayout route with nested routes */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="invoice" element={<Invoice />} />
      </Route>
      {/* Login and Register routes */}
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/register" element={<RegisterPage />}></Route>
    </Routes>
  );
}

export default App;
