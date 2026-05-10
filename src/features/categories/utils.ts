/* ------------------------------ classnames ------------------------------ */
export const cx = (...a: Array<string | false | null | undefined>) =>
  a.filter(Boolean).join(" ");

/* --------------------------------- error -------------------------------- */
export const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

/* ------------------------------ slugify (vi) ----------------------------- */
export function slugifyVi(input: string): string {
  const from =
    "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ";
  const to =
    "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIoooooooooooooooooUUUUUUUUUUYYYYYĐ";
  const map: Record<string, string> = {};
  for (let i = 0; i < from.length; i++) map[from[i]] = to[i];

  const s = input
    .split("")
    .map((c) => map[c] || c)
    .join("")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
