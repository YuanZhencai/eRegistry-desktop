const ExportFileKey = 'export-files'

export function addExportFile(file) {
  const files = findExportFiles()
  files.push(file)
  localStorage.setItem(ExportFileKey, JSON.stringify(files))
}

export function findExportFiles() {
  const item = localStorage.getItem(ExportFileKey)
  return JSON.parse(item || '[]')
}

export function clearExportFiles() {
  localStorage.removeItem(ExportFileKey)
}
