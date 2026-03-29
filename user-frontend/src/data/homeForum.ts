import homeForumJson from "./homeForum.json";

export type PostKind = "出售帖" | "验证帖" | "精品帖";

type PostKindSlugMap = {
  出售帖: "sale";
  验证帖: "verify";
  精品帖: "premium";
};

export type PostKindSlug = PostKindSlugMap[PostKind];

export const POST_KIND_SLUGS: Record<PostKind, PostKindSlug> = {
  出售帖: "sale",
  验证帖: "verify",
  精品帖: "premium",
};

const SLUG_TO_POST_KIND: Record<PostKindSlug, PostKind> = {
  sale: "出售帖",
  verify: "验证帖",
  premium: "精品帖",
};

export function kindToSlug(kind: PostKind): PostKindSlug {
  return POST_KIND_SLUGS[kind];
}

export function slugToKind(slug: string | undefined): PostKind | undefined {
  if (!slug) return undefined;
  return SLUG_TO_POST_KIND[slug as PostKindSlug];
}

export interface HomeForumRow {
  id: number;
  kind: PostKind;
  title: string;
  author: string;
}

export const HOME_FORUM_ROWS = homeForumJson as HomeForumRow[];
