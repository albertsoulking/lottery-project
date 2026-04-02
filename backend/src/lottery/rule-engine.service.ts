import { BadRequestException, Injectable } from '@nestjs/common'
import { lotteryConfigs, LotteryRule } from './lottery-config'

export type LotteryResultPayload = {
  number: number
  zodiac?: string
}

export type PredictionData = Record<string, unknown>

export type LotteryEvaluationRule = {
  type: 'contains' | 'zodiac_match' | 'tail_match' | 'any_group_match' | string
  field?: string
  value?: unknown
  values?: unknown[]
  groups?: unknown[][]
  message?: string
}

export type LotteryEvaluationConfig = {
  rules: LotteryEvaluationRule[]
}

export type RuleEvaluator = (
  rule: LotteryEvaluationRule,
  prediction: PredictionData,
  result: LotteryResultPayload,
) => boolean

@Injectable()
export class RuleEngineService {
  private readonly evaluators: Record<string, RuleEvaluator> = {
    contains: (rule, prediction, result) => {
      const field = rule.field
      if (!field) {
        throw new BadRequestException('contains 规则缺少 field')
      }
      const value = prediction[field]
      if (value === undefined || value === null) {
        return false
      }

      const target = String(result.number)
      if (Array.isArray(value)) {
        return value.some((item) => String(item) === target)
      }

      if (typeof value === 'string') {
        const items = value.split(',').map((v) => v.trim())
        return items.includes(target)
      }

      return false
    },
    zodiac_match: (rule, prediction, result) => {
      if (!rule.field) {
        throw new BadRequestException('zodiac_match 规则缺少 field')
      }
      const actual = prediction[rule.field]
      const expected = result.zodiac ?? rule.value
      if (typeof expected !== 'string') {
        return false
      }
      if (Array.isArray(actual)) {
        return actual.some((item) => String(item).toLowerCase() === expected.toLowerCase())
      }
      return String(actual).toLowerCase() === expected.toLowerCase()
    },
    tail_match: (rule, prediction, result) => {
      const field = rule.field
      if (!field) {
        throw new BadRequestException('tail_match 规则缺少 field')
      }
      const actual = prediction[field]
      const tail = result.number % 10
      if (typeof actual === 'number') {
        return actual === tail
      }
      if (typeof actual === 'string') {
        return Number(actual) === tail
      }
      if (Array.isArray(actual)) {
        return actual.some((item) => Number(item) === tail)
      }
      return false
    },
    any_group_match: (rule, prediction, result) => {
      const field = rule.field
      if (!field) {
        throw new BadRequestException('any_group_match 规则缺少 field')
      }
      const actual = prediction[field]
      const groups = rule.groups ?? []

      const normalize = (value: unknown): string[][] => {
        if (Array.isArray(value)) {
          return value.map((group) => {
            if (Array.isArray(group)) {
              return group.map((item) => String(item).trim())
            }
            return String(group).split(',').map((item) => item.trim())
          })
        }
        if (typeof value === 'string') {
          return value
            .split(';')
            .map((group) => group.split(',').map((item) => item.trim()))
            .filter((group) => group.length > 0)
        }
        return []
      }

      const predictionGroups = normalize(actual)
      const ruleGroups = Array.isArray(groups) && groups.length > 0 ? normalize(groups) : [[String(result.number)]]
      return ruleGroups.some((ruleGroup) =>
        ruleGroup.every((item) => predictionGroups.some((predictionGroup) => predictionGroup.includes(item))),
      )
    },
  }

  evaluatePrediction(
    ruleType: string,
    config: LotteryEvaluationConfig,
    prediction: PredictionData,
    result: LotteryResultPayload,
  ): boolean {
    if (!config || !Array.isArray(config.rules)) {
      throw new BadRequestException('规则配置需要包含 rules 数组')
    }

    if (!result || typeof result.number !== 'number') {
      throw new BadRequestException('开奖号码必须包含 number')
    }

    const normalizedRuleType = String(ruleType || '').trim()
    if (!normalizedRuleType) {
      throw new BadRequestException('rule_type 必须提供')
    }

    return config.rules.every((rule) => {
      const evaluator = this.evaluators[rule.type]
      if (!evaluator) {
        throw new BadRequestException(`不支持的规则类型: ${rule.type}`)
      }
      return evaluator(rule, prediction, result)
    })
  }

  validate(lotteryType: string, data: Record<string, unknown>) {
    const config = lotteryConfigs.find((item) => item.lotteryType === lotteryType)
    if (!config) {
      throw new BadRequestException('未知彩种配置')
    }

    const errors: string[] = []
    config.rules.forEach((rule: LotteryRule) => {
      const value = data[rule.field]
      switch (rule.type) {
        case 'required': {
          if (value === undefined || value === null || value === '') {
            errors.push(rule.message)
          }
          break
        }
        case 'regex': {
          if (typeof value !== 'string') {
            errors.push(rule.message)
            break
          }
          const regex = new RegExp(rule.value as string)
          if (!regex.test(value)) {
            errors.push(rule.message)
          }
          break
        }
        case 'min': {
          if (typeof value !== 'number' || value < Number(rule.value)) {
            errors.push(rule.message)
          }
          break
        }
        case 'max': {
          if (typeof value !== 'number' || value > Number(rule.value)) {
            errors.push(rule.message)
          }
          break
        }
        case 'oneOf': {
          if (!Array.isArray(rule.value) || !rule.value.includes(value as string)) {
            errors.push(rule.message)
          }
          break
        }
        default:
          break
      }
    })

    if (errors.length) {
      throw new BadRequestException(errors.join('；'))
    }

    return true
  }

  registerEvaluator(type: string, evaluator: RuleEvaluator) {
    this.evaluators[type] = evaluator
  }
}
