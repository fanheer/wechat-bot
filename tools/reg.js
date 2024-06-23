// 获取关键词和操作（删除/增加）
export function extractSymbolAndWord(str) {
  const regex = /(^|\s)关键词(\+|-|\*)([^+\-]*)/;
  const match = str.match(regex);

  if (match) {
    return {
      symbol: match[2], // 捕获到的 "+" 或 "-"
      keyword: match[3].trim(), // 捕获到的任意词汇
    };
  } else {
    return {
      symbol: null,
      keyword: null,
    };
  }
}
