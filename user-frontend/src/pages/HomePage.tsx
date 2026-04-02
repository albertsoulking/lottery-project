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
import assets from "../assets";
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";

const QQ_ID = "5944876";
const WECHAT_ID = "nn187384";
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
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: '1fr',
          alignItems: 'start',
        }}
      >
        <Box>
          <Card sx={{ mb: 3 }} elevation={0}>
            <Box component="img" src={assets.LOGO_GIF} alt="" sx={{ width: '100%', borderRadius: 2 }} onError={(e: SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }} />
          </Card>

          <Card sx={{ mb: 3 }}>
            <Box sx={{ position: 'relative', pb: '30%' }}>
              <Box
                component="iframe"
                title="开奖直播"
                src={LIVE_IFRAME_SRC}
                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, borderRadius: 2 }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              />
            </Box>
          </Card>

          <Card sx={{ p: 2, mb: 3 }}>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' },
              }}
            >
              {rechargeTiers.slice(0, 6).map((tier) => (
                <Paper key={tier.amount} sx={{ p: 2, textAlign: 'center' }} elevation={0}>
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

          <Card sx={{ p: 3, mb: 3, bgcolor: 'bisque', textAlign: 'center' }}>
            <Typography variant="h4" sx={{ display: 'inline', mb: 2 }} fontWeight={'bold'} color="primary">
              温馨提示：
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ display: "inline" }} fontWeight={'bold'}>
              如发消息给管理员长时间不回复，
            </Typography>
            <Typography variant="h4" color="text.primary" fontWeight={'bold'}>
              请添加最新 <span style={{ color: 'primary' }}>客服QQ：{QQ_ID}，客服微信：{WECHAT_ID}。</span>
            </Typography>
          </Card>

          <Card sx={{ p: 3, mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', bgcolor: 'grey.100' }}>
            <Typography variant="h4">点击此处复制客服微信号</Typography>
            <Box>
              <KeyboardDoubleArrowRightRounded fontSize="large" sx={{ verticalAlign: 'middle' }} />
              <KeyboardDoubleArrowRightRounded fontSize="large" sx={{ verticalAlign: 'middle' }} />
              <Button variant="contained" color="success" size="large" sx={{ textTransform: 'none', fontSize: 20 }} onClick={onCopyWechat}>
                微信号：{WECHAT_ID}
              </Button>
              <KeyboardDoubleArrowLeftRounded fontSize="large" sx={{ verticalAlign: 'middle' }} />
              <KeyboardDoubleArrowLeftRounded fontSize="large" sx={{ verticalAlign: 'middle' }} />
            </Box>

          </Card>

          <Card sx={{ p: 2, mb: 3, textAlign: 'center' }}>
            <Box component="img" src={assets.QR_WECHAT} alt="微信二维码" sx={{ width: '50%', borderRadius: 2 }} onError={(e: SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }} />
            <Typography variant="h6" display="block" sx={{ m: '0 auto', width: 'fit-content', p: 1, color: '#FFFF00', bgcolor: 'rgba(255, 0, 0, 0.85)', boxShadow: '0 6px 12px rgba(0,0,0,0.4)', textShadow: '2px 2px 6px rgba(0,0,0,0.9)', border: '2px solid #FFFFFF', borderRadius: 2 }}>
              试料，问料，扯皮的请勿加，谢谢
            </Typography>
          </Card>
        </Box>

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

          <Card sx={{ p: 3, mb: 1 }}>
            <Typography variant="h4" gutterBottom>
              本期推荐
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table size='medium'>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: 16 }}>类型</TableCell>
                    <TableCell sx={{ fontSize: 16 }}>帖子标题</TableCell>
                    <TableCell sx={{ fontSize: 16 }}>作者</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {HOME_FORUM_ROWS.map((row) => (
                    <TableRow key={`${row.kind}-${row.id}`} hover>
                      <TableCell>
                        <Chip label={row.kind} color={badgeColor(row.kind)} size="medium" sx={{ fontSize: 18 }} />
                      </TableCell>
                      <TableCell>
                        <Link component={RouterLink} to={`/post/${row.id}`} underline="hover" sx={{ fontSize: 20, fontWeight: 'bold' }}>
                          {row.title}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ fontSize: 18, fontWeight: 'bold', color: 'grey' }}>{row.author}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>

      <Box component="img" src={assets.FOOTER} alt="" sx={{ width: '100%', borderRadius: 2 }} onError={(e: SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }} />

      <Box sx={{ bgcolor: 'green', p: 1, mb: 1 }}>
        <Typography variant="h5" fontWeight="bold" align="center" sx={{ mt: 3, color: '#ffff99' }}>
          新澳彩论坛-【专注澳门特码研究】-提供澳门特码资料、澳门特码论坛、澳门特码开奖结果等服务，欢迎访问！
        </Typography>
      </Box>

      <Box component="img" src={assets.SIGN} alt="" sx={{ width: '100%', borderRadius: 2 }} onError={(e: SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }} />

      <Box textAlign={'center'}>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 3, mb: 2 }}>
          免责提示：未满十八岁人士、无民事行为能力人，请勿浏览本站内容，本站拒绝提供任何服务。
        </Typography>
        <Typography variant="h6">
          版权所有 不得转载 © 至尊联盟 858243.COM
        </Typography>
      </Box>
    </Container>
  );
}
