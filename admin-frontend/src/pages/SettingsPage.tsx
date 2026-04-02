import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

export function SettingsPage() {
  const [lotteryEnabled, setLotteryEnabled] = useState(true)

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box>
        <Typography variant="h5" fontWeight="bold">
          系统设置
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          配置抽奖开关和系统运行状态。
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              抽奖开关
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              开启后用户可以继续参与抽奖活动。
            </Typography>
          </Box>
          <FormControlLabel
            control={<Switch checked={lotteryEnabled} onChange={(event) => setLotteryEnabled(event.target.checked)} />}
            label={lotteryEnabled ? '已开启' : '已关闭'}
          />
        </CardContent>
      </Card>
    </Box>
  )
}
