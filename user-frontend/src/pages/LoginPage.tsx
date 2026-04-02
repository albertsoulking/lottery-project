import { type FormEvent, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export function LoginPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/login", {
        username: account,
        password,
      });
      const token = response.data?.accessToken;
      const user = response.data?.user;
      if (token && user) {
        localStorage.setItem("user_token", token);
        localStorage.setItem("user_id", String(user.id));
        localStorage.setItem("user_username", user.username);
        navigate("/");
      } else {
        setError(response.data?.message || "登录失败，请检查用户名和密码。");
      }
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.message;
      setError(errorMessage || "登录失败，请检查用户名和密码，或确认后端服务是否可用。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            用户登录
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            只供已登记的会员使用。
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, display: 'grid', gap: 2 }}>
            <TextField
              label="账号"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              autoComplete="username"
              placeholder="用户名/手机号码"
              fullWidth
              required
            />
            <TextField
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="您的账户密码"
              fullWidth
              required
            />

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Link component={RouterLink} to="/register" variant="body2">
                还没注册? &gt;
              </Link>
            </Box>

            {error ? (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            ) : null}

            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
        版权所有 不得转载 © 至尊联盟 858243.COM
      </Typography>
    </Container>
  );
}
