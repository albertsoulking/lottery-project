import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export function RulesPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, bgcolor: '#fff', boxShadow: 1 }}>
        <Box sx={{ borderBottom: '1px dashed #ccc', py: 1, textAlign: 'center' }}>
          <Typography variant="h4" component="h3" fontWeight="bold">
            充值与购买规则
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" align="center" fontWeight="bold" color="error.main" sx={{ mb: 2 }}>
            《至尊联盟论坛》承诺与保障
          </Typography>

          <Box component="dl" sx={{ '& dt': { fontWeight: 'bold', color: 'error.main', mb: 1 }, '& dd': { mb: 2 } }}>
            <Typography component="dt">保障一：</Typography>
            <Typography component="dd">
              在本站购买资料杜绝二次收费行为（因为都是自由消费，不存在欺骗）
            </Typography>

            <Typography component="dt">保障二：</Typography>
            <Typography component="dd">
              在本站购买资料百分百真实可靠，不会出现开奖后改资料误导彩友行为（每期资料都有版主监督，保证真实）
            </Typography>

            <Typography component="dt">保障三：</Typography>
            <Typography component="dd">
              在本站购买资料后，不会出现给钱不发资料行为，因为每期都会在原帖公开资料，购买后会自动显示当期资料，如果购买后高手还没公开，请稍后再刷新帖子即可查看（资料每期都有版主管理员监督，对错不改，违反规则封IP）
            </Typography>

            <Typography component="dt">保障四：</Typography>
            <Typography component="dd">
              其他网站购买资料后，骗子要求帮忙下注，不下注就拉黑行为。在本站绝不会发生这样的事情，都是自由消费，对骗子绝对零容忍！
            </Typography>

            <Typography component="dt">保障五：</Typography>
            <Typography component="dd">
              在本站购买资料都是自愿单期购买（不用担心骗子以各种借口向你索要什么服务费、保证金、红包、等等... 以及强迫你帮忙下注行为。你赚多少都是你自己的钱。）
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" color="error.main" sx={{ mb: 2 }}>
            如何加入论坛发帖高手
          </Typography>
        </Box>

        <Box sx={{ mt: 3, bgcolor: '#e0ffff', p: 3, borderRadius: 1 }}>
          <Typography variant="body2" paragraph>
            至尊联盟论坛介绍：所有出售的高手料均由高手提供，且至少在本网站发表连续准确6期及以上，所有高手料均由至尊联盟论坛管理审核通过才能发表，记录经版主严格审核及彩民跟踪监督获取，确保彩民在本网买到百分之百真实的高手料。
          </Typography>

          <Box sx={{ bgcolor: '#99ffff', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error.main" fontWeight="bold" paragraph>
              一、首先想成为高手必须和管理员联系购买高手发表功能和审核你的账号，发表资料必须是当下几种当中一种、生肖、特码、三中三、平特码、单双、大小、双波、头数、尾数、家野、平特一肖、杀肖、杀尾、杀头、等等... 都可以发表自己的心水。
            </Typography>

            <Typography variant="body2" color="error.main" fontWeight="bold" paragraph>
              二、达到要求的高手，请联系版主认证高手，审核通过后，需向本站缴纳50000元押金（押金说明：这50000元押金是为了防止高手违规罚款用），高手发表帖子不能违反平台规则(详细规则请看下方)，如发表带有假纪录和开奖后更改帖子的高手，第一次警告罚款5000元，第二次删除用户名，扣除押金，同时永远禁止该用户高手在本论坛发表任何资料。论坛要的是懂规矩的高手希望大家遵守，发表资料规矩请看下面6条要求:
            </Typography>

            <Box component="ol" sx={{ pl: 3, '& li': { mb: 1, color: 'error.main' } }}>
              <Typography component="li">不能带有假纪录。</Typography>
              <Typography component="li">资料发表成功之后，禁止再次更新。</Typography>
              <Typography component="li">不能留有你的联系方式和网址。</Typography>
              <Typography component="li">发表资料一次更新，不能发空贴。</Typography>
              <Typography component="li">资料验证如出错就不能更改，必须如实展示，否则严罚。</Typography>
              <Typography component="li">发表资料必须按照本论坛规定的规格发表。</Typography>
            </Box>

            <Typography variant="body2" color="error.main" fontWeight="bold" paragraph>
              三、首次出售的帖子只要达到10期中7、8期即可出售资料。2024年1月1号开始新规定:和本论坛合作出售资料条件要求和规矩说明高手出售资料要求，必须押50000元押金论坛管理平台，才能通过出售资料功能，交的50000元押金在你申请退出高手后，平台会把你所押的50000元保证金退回给你。声明：出售资料，每笔成交抽取30%金币做为论坛的维护。
            </Typography>
          </Box>

          <Typography variant="body2" color="info.main" paragraph>
            【温馨提示】兑换现金需要填写您的银行卡账号户名等。认真填写，填写有误可能导致无法到账。
          </Typography>
          <Typography variant="body2" color="info.main">
            【特别说明】高手出售资料所得的论坛金钱兑换现金是70%（论坛扣除30%做为论坛的维护）
          </Typography>

          <Typography variant="body2" color="error.main" fontWeight="bold" sx={{ mt: 2 }}>
            另外也告诫发帖高手，很多购买资料的彩友都是以前输惨了的彩民朋友，价钱方面尽量定低点，不要在人家伤口撒盐，雪上加霜的事情我们不做。日行一善，福报满满！
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
