import { useMemo } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { HOME_FORUM_ROWS, slugToKind, type HomeForumRow } from "../data/homeForum";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

function badgeColor(kind: HomeForumRow["kind"]) {
  if (kind === "出售帖") return "error";
  if (kind === "验证帖") return "warning";
  return "success";
}

export function CategoryPage() {
  const params = useParams<{ kind?: string }>();
  const kind = slugToKind(params.kind);

  const rows = useMemo(() => HOME_FORUM_ROWS.filter((row) => row.kind === kind), [kind]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Card sx={{ p: 3, mb: 3 }}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={2}>
          <Typography variant="h5">{kind ?? '分类'}</Typography>
          <Link component={RouterLink} to="/" underline="hover">
            返回首页
          </Link>
        </Box>
      </Card>

      {!kind ? (
        <Card sx={{ p: 3 }}>
          <Typography>未找到对应分类。</Typography>
        </Card>
      ) : rows.length === 0 ? (
        <Card sx={{ p: 3 }}>
          <Typography>当前分类暂无内容。</Typography>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>类型</TableCell>
                <TableCell>帖子标题</TableCell>
                <TableCell>作者</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} hover>
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
      )}
    </Container>
  );
}
