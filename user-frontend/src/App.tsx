import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RECHARGE_PAGE_TITLE, SERVICE_PAGE_TITLE } from "./data/rechargeServiceTitles";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RechargeServicePage } from "./pages/RechargeServicePage";
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
          <Route path="recharge" element={<RechargeServicePage title={RECHARGE_PAGE_TITLE} />} />
          <Route path="service" element={<RechargeServicePage title={SERVICE_PAGE_TITLE} />} />
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
