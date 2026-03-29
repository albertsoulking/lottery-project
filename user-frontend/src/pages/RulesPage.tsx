import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const ruleBlocks = [
  {
    title: "保障一",
    text: "在本站购买资料杜绝二次收费行为，因为都是自由消费，不存在欺骗。",
  },
  {
    title: "保障二",
    text: "在本站购买资料百分百真实可靠，不会出现开奖后改资料误导彩友行为，每期资料都有版主监督，保证真实。",
  },
  {
    title: "保障三",
    text: "购买资料后，不会出现给钱不发资料行为，购买后会自动显示当期资料，如果高手还未公开，请稍后刷新帖子查看。",
  },
  {
    title: "保障四",
    text: "其他网站购买资料后，骗子要求帮忙下注、不下注就拉黑行为，在本站绝不会发生，都是自由消费，对骗子零容忍。",
  },
  {
    title: "保障五",
    text: "本站购买资料自愿单期购买，勿信包中承诺，资料真实由高手提供，金额由您自愿决定。",
  },
];

export function RulesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Card sx={{ mb: 3, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          充值与购买规则
        </Typography>
        <Typography color="text.secondary">
          尊享论坛服务，请仔细阅读以下规则与保障，确保交易公平、安全。
        </Typography>
      </Card>

      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            《至尊联盟论坛》承诺与保障
          </Typography>
          <Stack spacing={2}>
            {ruleBlocks.map((block) => (
              <Box key={block.title}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {block.title}
                </Typography>
                <Typography color="text.secondary">{block.text}</Typography>
              </Box>
            ))}
          </Stack>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            如何加入论坛发帖高手
          </Typography>
          <Typography color="text.secondary" paragraph>
            想成为高手请联系管理员认证账号并遵守平台规则。发布内容必须真实、完整，不得带联系方式或空贴。
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom>
              高手发布规则
            </Typography>
            <Stack component="ol" spacing={1} sx={{ pl: 2, '& li': { listStyleType: 'decimal' } }}>
              <Typography component="li">不能带有假纪录。</Typography>
              <Typography component="li">资料发表成功之后，禁止再次更新。</Typography>
              <Typography component="li">不能留有你的联系方式和网址。</Typography>
              <Typography component="li">发表资料一次更新，不能发空贴。</Typography>
              <Typography component="li">资料验证如出错就不能更改，必须如实展示，否则严罚。</Typography>
              <Typography component="li">发表资料必须遵守论坛规定格式。</Typography>
            </Stack>
          </Paper>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography color="text.secondary" paragraph>
            本论坛资料均为单期购买，购买后可查看当期资料，资料真实不保证包中。若购买后高手尚未公开请耐心等待并刷新页面。
          </Typography>
          <Typography color="text.secondary" paragraph>
            2024年起合作出售资料的高手需缴纳押金。押金用于防止违规处罚，退出后符合条件可退还。论坛每笔成交抽取30%作为维护费用。
          </Typography>
          <Typography color="text.secondary">
            温馨提示：兑换现金需填写银行卡账号与户名，填写错误可能导致无法到账；高手出售资料兑换现金比例为70%，论坛扣除30%维护费。
          </Typography>
        </Card>
      </Stack>
    </Container>
  );
}
