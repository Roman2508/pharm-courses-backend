export const generateSertificateNumber = (id: number) => {
  const idStr = String(id)

  const totalLength = 6
  const prefix = "1"

  const zerosCount = totalLength - prefix.length - idStr.length
  const zeros = "0".repeat(zerosCount)

  return `${prefix}${zeros}${idStr}`
}
