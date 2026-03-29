export type ForumSection = "开奖区" | "验证区" | "精品区";

export interface TopicRow {
  id: number;
  section: ForumSection;
  title: string;
  tag: string;
}

/** 参考原站帖子列表结构生成的示例数据 */
export const topics: TopicRow[] = [
  { id: 19401, section: "开奖区", title: "088期【战无不胜·12码中特】", tag: "战无不胜" },
  { id: 19402, section: "开奖区", title: "088期【南北双雄·11码中特】", tag: "南北双雄" },
  { id: 19403, section: "开奖区", title: "088期【西装革履·尾数中特】", tag: "西装革履" },
  { id: 19404, section: "开奖区", title: "088期【斩庄经典·四肖中特】", tag: "斩庄经典" },
  { id: 19405, section: "验证区", title: "088期【识途老马·前肖中特】", tag: "识途老马" },
  { id: 19406, section: "验证区", title: "088期【始终如一·四肖中特】", tag: "始终如一" },
  { id: 19407, section: "验证区", title: "088期【偷天换日·十码中特】", tag: "偷天换日" },
  { id: 19432, section: "验证区", title: "088期【一鸣惊人·一码中特】", tag: "一鸣惊人" },
  { id: 19433, section: "精品区", title: "088期【会员专享·四肖中特】", tag: "会员专享" },
  { id: 19434, section: "精品区", title: "088期【独家秘笈·两肖中特】", tag: "独家秘笈" },
  { id: 19435, section: "精品区", title: "088期【强强交手·绝杀三码】", tag: "强强交手" },
  { id: 19436, section: "精品区", title: "088期【专业研究·双波四肖】", tag: "专业研究" },
];

export const rechargeTiers = [
  { amount: 500, points: 588 },
  { amount: 1000, points: 1288 },
  { amount: 2000, points: 2588 },
  { amount: 3000, points: 4088 },
  { amount: 5000, points: 7188 },
  { amount: 10000, points: 16888 },
] as const;
