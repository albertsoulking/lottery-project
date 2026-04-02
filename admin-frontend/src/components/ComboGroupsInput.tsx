import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'

export interface ComboGroupsPayload {
  groups: number[][]
}

export interface ComboGroupsInputProps {
  groupSize: number
  value?: number[][]
  onChange?: (payload: ComboGroupsPayload) => void
  disabled?: boolean
}

function createEmptyGroup(size: number) {
  return Array.from({ length: size }, () => '')
}

export function ComboGroupsInput({ groupSize, value = [], onChange, disabled }: ComboGroupsInputProps) {
  const normalizedValue = useMemo(() => {
    if (!Array.isArray(value) || value.length === 0) {
      return [createEmptyGroup(groupSize)]
    }

    return value.map((group) =>
      Array.from({ length: groupSize }, (_, index) => {
        const numberValue = group[index]
        return numberValue !== undefined && numberValue !== null ? String(numberValue) : ''
      }),
    )
  }, [groupSize, value])

  const [groups, setGroups] = useState<string[][]>(normalizedValue)
  const lastEmittedPayloadRef = useRef('')

  useEffect(() => {
    setGroups(normalizedValue)
  }, [normalizedValue])

  useEffect(() => {
    if (!onChange) {
      return
    }
    const parsedGroups = groups
      .map((group) => {
        const normalizedGroup = group
          .map((item) => item.trim())
          .map((item) => (item === '' ? Number.NaN : Number(item)))

        if (normalizedGroup.some((num) => Number.isNaN(num))) {
          return null
        }

        return normalizedGroup
      })
      .filter((group): group is number[] => Array.isArray(group) && group.length === groupSize)

    const payload = { groups: parsedGroups }
    const serializedPayload = JSON.stringify(payload)

    if (serializedPayload !== lastEmittedPayloadRef.current) {
      lastEmittedPayloadRef.current = serializedPayload
      onChange(payload)
    }
  }, [groupSize, groups, onChange])

  const handleNumberChange = (groupIndex: number, itemIndex: number, value: string) => {
    setGroups((prev) => {
      const next = prev.map((group) => [...group])
      next[groupIndex][itemIndex] = value
      return next
    })
  }

  const addGroup = () => {
    setGroups((prev) => [...prev, createEmptyGroup(groupSize)])
  }

  const removeGroup = (index: number) => {
    setGroups((prev) => prev.filter((_, idx) => idx !== index))
  }

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {groups.map((group, groupIndex) => (
        <Box key={groupIndex} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, position: 'relative' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            组合 {groupIndex + 1}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 2 }}>
            {group.map((value, itemIndex) => (
              <TextField
                key={itemIndex}
                type="number"
                label={`数字 ${itemIndex + 1}`}
                value={value}
                onChange={(event) => handleNumberChange(groupIndex, itemIndex, event.target.value)}
                disabled={disabled}
                fullWidth
              />
            ))}
          </Box>
          <IconButton
            size="small"
            onClick={() => removeGroup(groupIndex)}
            disabled={disabled || groups.length <= 1}
            sx={{ position: 'absolute', top: 8, right: 8 }}
            aria-label="删除组合"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button variant="contained" size="small" onClick={addGroup} disabled={disabled} sx={{ alignSelf: 'start' }}>
        添加组合
      </Button>
    </Box>
  )
}
