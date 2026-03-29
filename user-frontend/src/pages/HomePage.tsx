import { type SyntheticEvent, useCallback, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { HOME_FORUM_ROWS, type HomeForumRow, type PostKindSlug } from "../data/homeForum";
import { rechargeTiers } from "../data/topics";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const WECHAT_ID = "nn187384";
const QR_SRC = "/fta1/83.jpg";
const LOGO_GIF = "/fta1/logo.gif";
const LIVE_IFRAME_SRC = "https://zhibo.2020kj.com:777/2020kj.html";

function copyWechatId(wechatId: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(wechatId).then(
      () => {
        window.alert("复制微信号成功，请去微信粘贴添加即可。");
      },
      () => {
        window.alert("复制失败，请手动复制");
      }
    );
    return;
  }
  const textArea = document.createElement("textarea");
  textArea.value = wechatId;
  textArea.style.position = "absolute";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const ok = document.execCommand("copy");
    window.alert(ok ? "复制微信号成功，请去微信粘贴添加即可。" : "复制失败，请手动复制");
  } catch {
    window.alert("复制失败，请手动复制");
  } finally {
    document.body.removeChild(textArea);
  }
}

const CATEGORY_LINKS: Record<PostKindSlug, string> = {
  sale: "出售帖",
  verify: "验证帖",
  premium: "精品帖",
};

function badgeColor(kind: HomeForumRow["kind"]) {
  if (kind === "出售帖") return "error";
  if (kind === "验证帖") return "warning";
  return "success";
}

export function HomePage() {
  const [bannerFallback, setBannerFallback] = useState(false);
  const username = localStorage.getItem("user_username");

  const onCopyWechat = useCallback(() => {
    copyWechatId(WECHAT_ID);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Paper sx={{ mb: 4, overflow: 'hidden' }}>
        {bannerFallback ? (
          <Box sx={{ height: 220, bgcolor: 'grey.300' }} aria-label="站点横幅" />
        ) : (
          <Box component="picture">
            <source type="image/webp" media="(min-width: 466px)" srcSet="/images/kb.webp" />
            <source type="image/webp" media="(max-width: 465px)" srcSet="/images/m-kb.webp" />
            <Box
              component="img"
              src="/images/kb.webp"
              alt=""
              width="100%"
              sx={{ display: 'block' }}
              onError={() => setBannerFallback(true)}
            />
          </Box>
        )}
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          alignItems: 'start',
        }}
      >
        <Box>
          <Card sx={{ p: 3, mb: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h5">欢迎来到 至尊联盟</Typography>
              <Typography variant="body2" color="text.secondary">
                {username ? `欢迎, ${username}` : '您现在是游客'}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap">
                {Object.entries(CATEGORY_LINKS).map(([slug, label]) => (
                  <Button
                    key={slug}
                    component={RouterLink}
                    to={`/category/${slug}`}
                    variant="outlined"
                    size="small"
                  >
                    {label}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Card>

          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              充值优惠
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' },
              }}
            >
              {rechargeTiers.slice(0, 6).map((tier) => (
                <Paper key={tier.amount} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    单次充值
                  </Typography>
                  <Typography variant="h6" component="div">
                    {tier.amount}元
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {tier.points}金币
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Card>

          <Card sx={{ p: 3, mb: 3, bgcolor: 'warning.lighter' }}>
            <Typography variant="subtitle1" gutterBottom>
              温馨提示
            </Typography>
            <Typography variant="body2" color="text.secondary">
              如发消息给管理员长时间不回复，请添加最新客服QQ：5944876，客服微信：nn187384。
            </Typography>
          </Card>

          <Card sx={{ p: 3, mb: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">微信客服</Typography>
              <Box>
                <Button variant="contained" startIcon={<ShoppingCartIcon />} onClick={onCopyWechat}>
                  复制微信号：{WECHAT_ID}
                </Button>
              </Box>
            </Stack>
          </Card>

          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              本期推荐
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>类型</TableCell>
                    <TableCell>帖子标题</TableCell>
                    <TableCell>作者</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {HOME_FORUM_ROWS.map((row) => (
                    <TableRow key={`${row.kind}-${row.id}`} hover>
                      <TableCell>
                        <Chip label={row.kind} color={badgeColor(row.kind)} size="small" />
                      </TableCell>
                      <TableCell>
                        <Link component={RouterLink} to={`/post/${row.id}`} underline="hover">
                          {row.title}
                        </Link>
                      </TableCell>
                      <TableCell>{row.author}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>

        <Box>
          <Card sx={{ p: 2, mb: 3 }}>
            <Box component="img" src={LOGO_GIF} alt="" sx={{ width: '100%', borderRadius: 2 }} onError={(e: SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }} />
          </Card>

          <Card sx={{ p: 2, mb: 3 }}>
            <Box sx={{ position: 'relative', pb: '100%' }}>
              <Box
                component="iframe"
                title="开奖直播"
                src={LIVE_IFRAME_SRC}
                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, borderRadius: 2 }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              />
            </Box>
          </Card>

          <Card sx={{ p: 2, mb: 3, textAlign: 'center' }}>
            <Box component="img" src={QR_SRC} alt="微信二维码" sx={{ width: '100%', borderRadius: 2 }} onError={(e: SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }} />
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              试料，问料，扯皮的请勿加，谢谢
            </Typography>
          </Card>

          <Card sx={{ p: 2, bgcolor: 'grey.100' }}>
            <Typography variant="body2">请将二维码图片放在 public/fta1/83.jpg</Typography>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
