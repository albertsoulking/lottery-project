import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { ComboGroupsInput } from './ComboGroupsInput'
import type { ComboGroupsPayload } from './ComboGroupsInput'

export type DynamicFormInputType = 'number_list' | 'zodiac_multi' | 'tail_multi' | 'combo'

export interface DynamicFieldConfig {
  key: string
  label: string
  input: DynamicFormInputType
  options?: string[]
  count?: number
  groups?: number
  placeholder?: string
}

export interface DynamicPredictionFormConfig {
  fields: DynamicFieldConfig[]
}

const DEFAULT_ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
const DEFAULT_TAILS = Array.from({ length: 10 }, (_, index) => String(index))

function parseNumberList(value: string) {
  return value
    .split(/[ ,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number(item))
    .filter((num) => !Number.isNaN(num))
}

function toComboPayload(value: unknown): ComboGroupsPayload {
  if (value && typeof value === 'object' && Array.isArray((value as ComboGroupsPayload).groups)) {
    return value as ComboGroupsPayload
  }

  if (Array.isArray(value)) {
    return {
      groups: value.map((group) => {
        if (!Array.isArray(group)) {
          return []
        }
        return group
          .map((item) => Number(item))
          .filter((num) => !Number.isNaN(num))
      }),
    }
  }

  return { groups: [] }
}

function buildFormState(config: DynamicPredictionFormConfig, value?: Record<string, unknown>) {
  const state: Record<string, unknown> = {}

  config.fields.forEach((field) => {
    const incomingValue = value?.[field.key]

    if (incomingValue !== undefined) {
      switch (field.input) {
        case 'number_list':
          state[field.key] = Array.isArray(incomingValue) ? incomingValue.join(',') : String(incomingValue ?? '')
          break
        case 'zodiac_multi':
        case 'tail_multi':
          state[field.key] = Array.isArray(incomingValue) ? incomingValue : []
          break
        case 'combo':
          state[field.key] = toComboPayload(incomingValue)
          break
        default:
          state[field.key] = incomingValue
      }
      return
    }

    switch (field.input) {
      case 'number_list':
        state[field.key] = ''
        break
      case 'zodiac_multi':
      case 'tail_multi':
        state[field.key] = []
        break
      case 'combo':
        state[field.key] = { groups: Array.from({ length: field.groups ?? 1 }, () => []) }
        break
      default:
        state[field.key] = ''
    }
  })

  return state
}

function buildPrediction(config: DynamicPredictionFormConfig, formState: Record<string, unknown>) {
  const prediction: Record<string, unknown> = {}

  config.fields.forEach((field) => {
    const current = formState[field.key]
    switch (field.input) {
      case 'number_list':
        prediction[field.key] = typeof current === 'string' ? parseNumberList(current) : []
        break
      case 'zodiac_multi':
      case 'tail_multi':
        prediction[field.key] = Array.isArray(current) ? current : []
        break
      case 'combo':
        prediction[field.key] = toComboPayload(current)
        break
      default:
        prediction[field.key] = current
    }
  })

  return prediction
}

interface DynamicPredictionFormProps {
  config: DynamicPredictionFormConfig
  value?: Record<string, unknown>
  onChange?: (prediction: Record<string, unknown>) => void
  disabled?: boolean
}

export function DynamicPredictionForm({ config, value, onChange, disabled }: DynamicPredictionFormProps) {
  const initialState = useMemo(() => buildFormState(config, value), [config, value])
  const [formState, setFormState] = useState<Record<string, unknown>>(initialState)
  const lastSyncedStateRef = useRef(JSON.stringify(initialState))
  const lastEmittedPredictionRef = useRef('')

  useEffect(() => {
    const serializedState = JSON.stringify(initialState)
    if (serializedState !== lastSyncedStateRef.current) {
      lastSyncedStateRef.current = serializedState
      setFormState(initialState)
    }
  }, [initialState])

  useEffect(() => {
    if (!onChange) {
      return
    }

    const prediction = buildPrediction(config, formState)
    const serializedPrediction = JSON.stringify(prediction)

    if (serializedPrediction !== lastEmittedPredictionRef.current) {
      lastEmittedPredictionRef.current = serializedPrediction
      onChange(prediction)
    }
  }, [config, formState, onChange])

  const handleChange = (key: string, value: unknown) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      {config.fields.map((field) => {
        const label = field.label || field.key
        const fieldValue = formState[field.key]

        switch (field.input) {
          case 'number_list':
            return (
              <TextField
                key={field.key}
                label={label}
                value={typeof fieldValue === 'string' ? fieldValue : ''}
                onChange={(event) => handleChange(field.key, event.target.value)}
                placeholder={field.placeholder ?? '输入逗号分隔的数字，例如 1,2,3'}
                fullWidth
                disabled={disabled}
              />
            )

          case 'zodiac_multi':
            return (
              <FormControl key={field.key} fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select
                  multiple
                  value={Array.isArray(fieldValue) ? fieldValue : []}
                  label={label}
                  onChange={(event) => handleChange(field.key, event.target.value as string[])}
                  disabled={disabled}
                >
                  {(field.options ?? DEFAULT_ZODIAC).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )

          case 'tail_multi':
            return (
              <FormControl key={field.key} fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select
                  multiple
                  value={Array.isArray(fieldValue) ? fieldValue : []}
                  label={label}
                  onChange={(event) => handleChange(field.key, event.target.value as string[])}
                  disabled={disabled}
                >
                  {field.options ?? DEFAULT_TAILS.map((value) => String(value)).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )

          case 'combo': {
            const comboPayload = toComboPayload(fieldValue)
            return (
              <Box key={field.key} sx={{ display: 'grid', gap: 2 }}>
                <Typography variant="subtitle2">{label}</Typography>
                <ComboGroupsInput
                  groupSize={field.count ?? 2}
                  value={comboPayload.groups}
                  onChange={(payload) => handleChange(field.key, payload)}
                  disabled={disabled}
                />
              </Box>
            )
          }

          default:
            return (
              <TextField
                key={field.key}
                label={label}
                value={typeof fieldValue === 'string' ? fieldValue : ''}
                onChange={(event) => handleChange(field.key, event.target.value)}
                fullWidth
                disabled={disabled}
              />
            )
        }
      })}
    </Box>
  )
}
