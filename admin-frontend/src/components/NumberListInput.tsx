import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

export interface NumberListPayload {
  numbers: number[]
}

export interface NumberListInputProps {
  count: number
  value?: number[]
  onChange?: (payload: NumberListPayload) => void
  disabled?: boolean
}

export function NumberListInput({ count, value = [], onChange, disabled }: NumberListInputProps) {
  const normalizedValue = useMemo(() => {
    const values = Array.from({ length: count }, (_, index) => {
      const numberValue = value[index]
      return numberValue !== undefined && numberValue !== null ? String(numberValue) : ''
    })
    return values
  }, [count, value])

  const [inputs, setInputs] = useState<string[]>(normalizedValue)

  useEffect(() => {
    setInputs(normalizedValue)
  }, [normalizedValue])

  useEffect(() => {
    if (!onChange) {
      return
    }
    const numbers = inputs
      .map((item) => item.trim())
      .filter((item) => item !== '')
      .map((item) => Number(item))
      .filter((num) => !Number.isNaN(num))

    onChange({ numbers })
  }, [inputs, onChange])

  const handleInputChange = (index: number, value: string) => {
    setInputs((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2 }}>
        {Array.from({ length: count }, (_, index) => (
          <TextField
            key={index}
            type="number"
            label={`数字 ${index + 1}`}
            value={inputs[index] ?? ''}
            onChange={(event) => handleInputChange(index, event.target.value)}
            disabled={disabled}
            fullWidth
          />
        ))}
      </Box>
    </Box>
  )
}
