import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import assets from "../assets";

const WECHAT_ID = "nn187384";

export function RechargePage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Paper sx={{ position: 'relative', p: { xs: 2, md: 3 }, bgcolor: '#fff', boxShadow: 1 }}>
        <Box sx={{ borderBottom: '1px dashed #ccc', py: 1, textAlign: 'center' }}>
          <Typography variant="h5" component="h3" fontWeight="bold">
            【金币充值流程及注册说明】
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Box sx={{ textAlign: 'center', bgcolor: '#e7e7e7', py: 2, borderRadius: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="error.main">
              充值金币联系微信：{WECHAT_ID}
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

          <Box sx={{ mt: 3, textAlign: 'left' }}>
            <Typography variant="body1" sx={{ fontSize: 18 }}>
              <Typography component="span" sx={{ color: '#ff0000', bgcolor: '#ffffff', fontWeight: 'bold' }}>
                声明：
              </Typography>
              <Typography component="span" sx={{ color: '#666666', bgcolor: '#ffffff' }}>
                上方微信二维码是论坛管理员。管理员不发表资料也不提供任何资料，论坛所有资料都是高手发表与版主无关。问码的请不要加！版主只提供充值服务，和监督高手!
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Table sx={{ borderCollapse: 'collapse', width: '100%', '& td': { border: 'none', p: 2 } }}>
              <TableBody>
                <TableRow sx={{ bgcolor: '#F8F5EF' }}>
                  <TableCell align="center" sx={{ width: '33%', fontWeight: 'bold', color: '#ff0000' }}>
                    单次充值<br />500元=<br />588金币
                  </TableCell>
                  <TableCell align="center" sx={{ width: '33%', fontWeight: 'bold', color: '#ff0000' }}>
                    单次充值<br />1000元=<br />1288金币
                  </TableCell>
                  <TableCell align="center" sx={{ width: '34%', fontWeight: 'bold', color: '#ff0000' }}>
                    单次充值<br />2000元=<br />2588金币
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: '#F8F5EF' }}>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#ff0000' }}>
                    单次充值<br />3000元=<br />4088金币
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#ff0000' }}>
                    单次充值<br />5000元=<br />7188金币
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#ff0000' }}>
                    单次充值<br />10000元=<br />16888金币
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

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
