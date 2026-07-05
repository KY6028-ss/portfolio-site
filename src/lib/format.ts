// 日付表示は JST 固定（ビルドマシンのタイムゾーンに依存させない）
const TIME_ZONE = "Asia/Tokyo";

// en-CA ロケールは YYYY-MM-DD 形式を返す
const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

// Rails の format_date ヘルパーと同じ表記: "YYYY-MM-DD" / "YYYY-MM-DD HH:MM"
export function formatDate(date: Date, withTime = false): string {
  const formatted = dateFormatter.format(date);
  return withTime ? `${formatted} ${timeFormatter.format(date)}` : formatted;
}

// Rails の truncate ヘルパー相当（省略記号込みで length 文字に収める）
export function truncate(text: string, length: number): string {
  return text.length > length ? `${text.slice(0, length - 1)}…` : text;
}
