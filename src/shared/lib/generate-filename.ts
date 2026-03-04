export const generateFilename = (originalName: string) => {
  const ext = originalName.split('.').pop();
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  return fileName;
};
