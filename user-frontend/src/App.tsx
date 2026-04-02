import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RechargePage } from "./pages/RechargePage";
import { ServicePage } from "./pages/ServicePage";
import { RulesPage } from "./pages/RulesPage";
import { CategoryPage } from "./pages/CategoryPage";
import { PostDetailPage } from "./pages/PostDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="rule" element={<RulesPage />} />
          <Route path="recharge" element={<RechargePage />} />
          <Route path="service" element={<ServicePage />} />
          <Route path="category/:kind" element={<CategoryPage />} />
          <Route path="post/:id" element={<PostDetailPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
