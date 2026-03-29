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

export function RegisterPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await apiClient.post("/auth/register", {
        username: account,
        password,
        phone,
      });
      setSuccess("注册成功，请登录。即将跳转到登录页...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.message;
      setError(errorMessage || "注册失败，请检查输入或确认后端服务是否可用。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            用户注册
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            请填写真实资料，客服将联系核实。
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, display: 'grid', gap: 2 }}>
            <TextField
              label="账号"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              autoComplete="username"
              placeholder="请输入姓名(必填)"
              fullWidth
              required
            />
            <TextField
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="请输入密码(必填)"
              fullWidth
              required
            />
            <TextField
              label="手机"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              placeholder="您的手机号码(必填)"
              fullWidth
              required
            />

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Link component={RouterLink} to="/login" variant="body2">
                已注册，去登录 &gt;
              </Link>
            </Box>

            {error ? (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            ) : null}
            {success ? (
              <Typography color="success.main" variant="body2">
                {success}
              </Typography>
            ) : null}

            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? "提交中..." : "注册提交"}
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
