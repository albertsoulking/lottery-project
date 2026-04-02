export type LotteryFieldType = 'text' | 'number' | 'select' | 'textarea'

export interface LotteryFormField {
  key: string
  label: string
  type: LotteryFieldType
  required?: boolean
  options?: string[]
  helperText?: string
}

export type LotteryRuleType = 'required' | 'regex' | 'min' | 'max' | 'oneOf'

export interface LotteryRule {
  field: string
  type: LotteryRuleType
  value?: string | number | string[]
  message: string
}

export interface LotteryTypeConfig {
  lotteryType: string
  label: string
  fields: LotteryFormField[]
  rules: LotteryRule[]
}

export const lotteryConfigs: LotteryTypeConfig[] = [
  {
    lotteryType: '11选5',
    label: '11选5',
    fields: [
      { key: 'numbers', label: '号码列表', type: 'text', required: true, helperText: '请用逗号分隔 5 个号码，例如 01,03,07,09,11' },
      { key: 'expectedSum', label: '预测和值', type: 'number', required: true, helperText: '最多 100' },
      { key: 'hotNumber', label: '看好号码', type: 'select', options: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'], helperText: '请选择一个看好号码' },
    ],
    rules: [
      { field: 'numbers', type: 'required', message: '号码列表为必填项' },
      { field: 'numbers', type: 'regex', value: '^(\\d{1,2},){4}\\d{1,2}$', message: '号码格式应为 5 个数字，用逗号分隔' },
      { field: 'expectedSum', type: 'required', message: '预测和值为必填项' },
      { field: 'expectedSum', type: 'min', value: 0, message: '预测和值不能小于 0' },
      { field: 'expectedSum', type: 'max', value: 100, message: '预测和值不能超过 100' },
      { field: 'hotNumber', type: 'required', message: '看好号码必须选择' },
    ],
  },
  {
    lotteryType: '大乐透',
    label: '大乐透',
    fields: [
      { key: 'redBalls', label: '红球', type: 'text', required: true, helperText: '请用逗号分隔 5 个红球号码，例如 01,03,05,07,09' },
      { key: 'blueBall', label: '蓝球', type: 'text', required: true, helperText: '请填写 1 个蓝球号码，例如 12' },
      { key: 'strategy', label: '选号策略', type: 'select', required: true, options: ['和值优先', '跨度优先', '连号优先'], helperText: '选择推荐策略' },
    ],
    rules: [
      { field: 'redBalls', type: 'required', message: '红球列表为必填项' },
      { field: 'redBalls', type: 'regex', value: '^(\\d{1,2},){4}\\d{1,2}$', message: '红球格式应为 5 个数字，用逗号分隔' },
      { field: 'blueBall', type: 'required', message: '蓝球为必填项' },
      { field: 'blueBall', type: 'regex', value: '^\\d{1,2}$', message: '蓝球必须为 1 个数字' },
      { field: 'strategy', type: 'required', message: '选号策略为必选项' },
    ],
  },
  {
    lotteryType: '双色球',
    label: '双色球',
    fields: [
      { key: 'reds', label: '红球', type: 'text', required: true, helperText: '请用逗号分隔 6 个红球数字' },
      { key: 'blue', label: '篮球', type: 'text', required: true, helperText: '请输入 1 个篮球数字' },
      { key: 'analysis', label: '杀号/走势分析', type: 'textarea', helperText: '请输入简要分析内容' },
    ],
    rules: [
      { field: 'reds', type: 'required', message: '红球为必填项' },
      { field: 'reds', type: 'regex', value: '^(\\d{1,2},){5}\\d{1,2}$', message: '红球格式应为 6 个数字，用逗号分隔' },
      { field: 'blue', type: 'required', message: '篮球为必填项' },
      { field: 'blue', type: 'regex', value: '^\\d{1,2}$', message: '篮球必须为 1 个数字' },
    ],
  },
]

export function getLotteryConfig(lotteryType: string) {
  return lotteryConfigs.find((config) => config.lotteryType === lotteryType)
}
