import type { SyntheticEvent } from "react";
import { rechargeTiers } from "../data/topics";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export interface RechargeServicePageProps {
  title: string;
}

const WECHAT_ID = "nn187384";
const QR_IMAGE = "/fta1/83.jpg";

function handleQrError(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  img.style.display = "none";
  const wrap = img.closest(".rs-qr-wrap");
  if (!wrap) return;
  wrap.querySelector<HTMLElement>(".rs-qr-caption")?.style.setProperty("display", "none");
  wrap.querySelector(".rs-qr-fallback")?.classList.add("rs-qr-fallback--show");
}

export function RechargeServicePage({ title }: RechargeServicePageProps) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Card sx={{ mb: 3, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          充值金币联系微信：{WECHAT_ID}
        </Typography>
        <Typography variant="body1" fontWeight="bold" paragraph>
          最低充值500元起，充多送多。
        </Typography>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        }}
      >
        <Box>
          <Card sx={{ p: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                微信二维码
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  src={QR_IMAGE}
                  alt="微信二维码，点击图片可放大"
                  sx={{ width: '100%', maxWidth: 360, borderRadius: 2 }}
                  onError={handleQrError}
                />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  试料，问料，扯皮的请勿加，谢谢
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                  请将二维码图片放在 public/fta1/83.jpg
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              充值套餐
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              }}
            >
              {rechargeTiers.map((tier) => (
                <Box key={tier.amount}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      单次充值
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {tier.amount}元
                    </Typography>
                    <Typography>{tier.points}金币</Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Card>
          <Card sx={{ mt: 3, p: 3, bgcolor: 'grey.100' }}>
            <Typography variant="body2" color="text.secondary">
              货币汇率：1人民币 = 1金币。所有高手出售资料均需单期购买才能读取完整内容，金币充值后不允许退换，请谨慎考虑。
            </Typography>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
