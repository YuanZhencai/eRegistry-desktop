const ExportFileKey = 'export-files'

export function addExportFile(file) {
  const files = findExportFiles()
  files.push(file)
  saveExportFiles(files)
}

export function saveExportFiles(files) {
  const parse = JSON.parse(JSON.stringify(files))
  parse.forEach((file) => {
    delete file.stats
    delete file.visible
  })
  localStorage.setItem(ExportFileKey, JSON.stringify(parse))
}

export function findExportFiles() {
  const item = localStorage.getItem(ExportFileKey)
  return JSON.parse(item || '[]')
}

export function clearExportFiles() {
  localStorage.removeItem(ExportFileKey)
}
