export type LotteryTypeRuleType = 'number' | 'zodiac' | 'tail' | 'combo'

export interface LotteryTypeSeedItem {
  name: string
  code: string
  ruleType: LotteryTypeRuleType
  description?: string
  config: Record<string, unknown>
}

function createNumberType(count: number): LotteryTypeSeedItem {
  return {
    name: `${count}码中特`,
    code: `number_${count}_hits`,
    ruleType: 'number',
    description: `${count} numbers selection`,
    config: {
      input: 'number_list',
      count,
      win_rule: 'contains',
      fields: [
        {
          key: 'numbers',
          label: `选择${count}个号码`,
          input: 'number_list',
          count,
        },
      ],
      rules: [
        {
          type: 'contains',
          field: 'numbers',
        },
      ],
    },
  }
}

function createZodiacType(name: string, count: number): LotteryTypeSeedItem {
  return {
    name,
    code: `zodiac_${count}_multi`,
    ruleType: 'zodiac',
    description: `Select ${count} zodiac`,
    config: {
      input: 'zodiac_multi',
      count,
      win_rule: 'zodiac_match',
      fields: [
        {
          key: 'zodiacs',
          label: `选择${count}个生肖`,
          input: 'zodiac_multi',
          count,
        },
      ],
      rules: [
        {
          type: 'zodiac_match',
          field: 'zodiacs',
        },
      ],
    },
  }
}

function createTailType(name: string, count: number): LotteryTypeSeedItem {
  return {
    name,
    code: `tail_${count}`,
    ruleType: 'tail',
    description: `Select ${count} tail${count > 1 ? 's' : ''}`,
    config: {
      input: 'tail_multi',
      count,
      win_rule: 'tail_match',
      fields: [
        {
          key: 'tails',
          label: `选择${count}个尾数`,
          input: 'tail_multi',
          count,
        },
      ],
      rules: [
        {
          type: 'tail_match',
          field: 'tails',
        },
      ],
    },
  }
}

function createComboType(name: string, groupSize: number): LotteryTypeSeedItem {
  return {
    name,
    code: `combo_${groupSize}_of_${groupSize}`,
    ruleType: 'combo',
    description: `${groupSize}-number combination groups`,
    config: {
      input: 'combo',
      group_size: groupSize,
      win_rule: 'any_group_match',
      fields: [
        {
          key: 'groups',
          label: `${groupSize}位组合`,
          input: 'combo',
          count: groupSize,
        },
      ],
      rules: [
        {
          type: 'any_group_match',
          field: 'groups',
        },
      ],
    },
  }
}

export const DEFAULT_LOTTERY_TYPE_SEED: LotteryTypeSeedItem[] = [
  createNumberType(12),
  createNumberType(11),
  createNumberType(10),
  createNumberType(8),
  createZodiacType('五肖', 5),
  createZodiacType('六肖', 6),
  createTailType('二尾', 2),
  createTailType('一尾', 1),
  createComboType('组合（三中三）', 3),
  createComboType('二中二', 2),
]
