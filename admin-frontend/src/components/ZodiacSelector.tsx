import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

type Zodiac = '鼠' | '牛' | '虎' | '兔' | '龙' | '蛇' | '马' | '羊' | '猴' | '鸡' | '狗' | '猪'

export interface ZodiacSelectorPayload {
  zodiacs: Zodiac[]
}

export interface ZodiacSelectorProps {
  count: number
  value?: Zodiac[]
  onChange?: (payload: ZodiacSelectorPayload) => void
  disabled?: boolean
}

const ZODIAC_OPTIONS: Zodiac[] = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

export function ZodiacSelector({ count, value = [], onChange, disabled }: ZodiacSelectorProps) {
  const selected = useMemo(() => value.slice(0, count), [value, count])

  const handleSelectChange = (selectedItems: string[]) => {
    const next = selectedItems.slice(0, count) as Zodiac[]
    if (onChange) {
      onChange({ zodiacs: next })
    }
  }

  return (
    <FormControl fullWidth>
      <InputLabel>生肖选择</InputLabel>
      <Select
        multiple
        value={selected}
        label="生肖选择"
        onChange={(event) => handleSelectChange(event.target.value as string[])}
        disabled={disabled}
        renderValue={(selectedItems) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, py: 0.5 }}>
            {(selectedItems as string[]).map((item) => (
              <Chip key={item} size="small" label={item} />
            ))}
          </Box>
        )}
      >
        {ZODIAC_OPTIONS.map((zodiac) => (
          <MenuItem key={zodiac} value={zodiac} disabled={!selected.includes(zodiac) && selected.length >= count}>
            {zodiac}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
