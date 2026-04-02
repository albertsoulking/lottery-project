import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import assets from "../assets";

const WECHAT_ID = "nn187384";

export function ServicePage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, bgcolor: '#fff', boxShadow: 1 }}>
        <Box sx={{ borderBottom: '1px dashed #ccc', py: 1, textAlign: 'center' }}>
          <Typography variant="h5" component="h3" fontWeight="bold">
            客服联系📞
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Box sx={{ textAlign: 'center', bgcolor: '#e7e7e7', py: 2, borderRadius: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="error.main">
              充值金币联系：{WECHAT_ID}
            </Typography>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Box
                component="img"
                src={assets.QR_WECHAT}
                alt="微信二维码"
                sx={{ width: 362, height: 498, display: 'block' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#FFFF00',
                  bgcolor: 'rgba(255,0,0,0.85)',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  border: '2px solid #FFFFFF',
                  textShadow: '2px 2px 6px rgba(0,0,0,0.9)',
                  width: '86%',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                试料，问料，扯皮的请勿加，谢谢
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body1" fontWeight="bold" color="error.main" sx={{ fontSize: 18 }}>
              最低充值500元起，充多送多。
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Box sx={{ overflowX: 'auto' }}>
              <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                <Box component="tbody">
                  <Box component="tr" sx={{ bgcolor: '#F8F5EF' }}>
                    <Box component="td" sx={{ width: '33%', textAlign: 'center', fontWeight: 'bold', color: '#ff0000', p: 2 }}>
                      单次充值<br />500元=<br /><strong>588金币</strong>
                    </Box>
                    <Box component="td" sx={{ width: '33%', textAlign: 'center', fontWeight: 'bold', color: '#ff0000', p: 2 }}>
                      单次充值<br />1000元=<br /><strong>1288金币</strong>
                    </Box>
                    <Box component="td" sx={{ width: '34%', textAlign: 'center', fontWeight: 'bold', color: '#ff0000', p: 2 }}>
                      单次充值<br />2000元=<br /><strong>2588金币</strong>
                    </Box>
                  </Box>
                  <Box component="tr" sx={{ bgcolor: '#F8F5EF' }}>
                    <Box component="td" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#ff0000', p: 2 }}>
                      单次充值<br />3000元=<br /><strong>4088金币</strong>
                    </Box>
                    <Box component="td" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#ff0000', p: 2 }}>
                      单次充值<br />5000元=<br /><strong>7188金币</strong>
                    </Box>
                    <Box component="td" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#ff0000', p: 2 }}>
                      单次充值<br />10000元=<br /><strong>16888金币</strong>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#ff0000', bgcolor: '#ffff00', px: 1 }}>
                （货币汇率：1人民币=1金币）
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body1" fontWeight="bold" color="error.main" sx={{ fontSize: 18 }}>
              （注意1：所有高手出售的资料都是单期购买才能查看）
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="error.main" sx={{ fontSize: 18, mt: 2 }}>
              （注意2：金币充值后不允许退换,请谨慎考虑后再充值）
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
