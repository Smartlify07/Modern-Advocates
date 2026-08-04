function escapeCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return ""
  const str = String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Generates and triggers a client-side CSV file download.
 * @param filename Name of the downloaded file, e.g. "users.csv".
 * @param headers Column headers for the first row.
 * @param rows Data rows; each entry must align with `headers`.
 */
export function downloadCsv(
  filename: string,
  headers: string[],
  rows: Array<Array<string | number | boolean | null | undefined>>,
) {
  const lines = [headers, ...rows].map((row) => row.map(escapeCell).join(","))
  // Prepend BOM so Excel recognises UTF-8 (handles currency symbols).
  const csv = "\uFEFF" + lines.join("\r\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}