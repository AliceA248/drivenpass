export function exclude<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  // Use a sintaxe do operador spread para criar um novo objeto
  const newObj = { ...obj };

  // Exclua as propriedades especificadas
  keys.forEach((key) => {
    delete newObj[key];
  });

  return newObj;
}
