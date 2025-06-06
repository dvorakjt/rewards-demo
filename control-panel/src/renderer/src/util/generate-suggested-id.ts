export function generateSuggestedId(name: string, existingNames: Set<string>) {
  let id = name.replace(/[^a-z0-9\-_]/g, (char) => {
    if (/[A-Z]/.test(char)) return char.toLowerCase();
    else if (/\s/.test(char)) return '-';
    return '';
  });

  let i = 1;
  while (existingNames.has(id)) {
    const temp = id;
    id += `-${i++}`;
    if (!existingNames.has(id)) {
      break;
    }
    id = temp;
  }

  return id;
}
