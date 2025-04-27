import path from 'path';
import fs from 'fs/promises';

export async function getFiles(
  __dirname: string,
  directory: string,
  suffix: string,
): Promise<string[]> {
  const directoryPath = path.resolve(__dirname, directory);
  const files = await fs.readdir(directoryPath, { withFileTypes: true });

  return files
    .filter(file => file.isFile() && file.name.endsWith(suffix))
    .map(file => path.join(directoryPath, file.name));
}
