export interface LotteryTypeConfigDisplay {
  input?: string
  count?: number
  group_size?: number
}

export function getLotteryTypeDescription(config: LotteryTypeConfigDisplay, fallback?: string) {
  if (config.input === 'number_list' && typeof config.count === 'number') {
    return `${config.count} numbers selection`
  }

  if (config.input === 'zodiac_multi' && typeof config.count === 'number') {
    return `Select ${config.count} zodiac`
  }

  if (config.input === 'combo' && typeof config.group_size === 'number') {
    return `${config.group_size}-number combination groups`
  }

  if ((config.input === 'tail_list' || config.input === 'tail_multi') && typeof config.count === 'number') {
    return `Select ${config.count} tail${config.count > 1 ? 's' : ''}`
  }

  return fallback || 'Predefined lottery rule'
}
