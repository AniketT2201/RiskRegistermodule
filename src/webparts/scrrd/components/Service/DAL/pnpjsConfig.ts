/**
 * Returns unique items from a collection based on a nested key
 * @param data - array of objects
 * @param selector - function to pick comparison value
 */
export const getUniqueBy = <T>(
    data: T[],
    selector: (item: T) => any
  ): T[] => {
    const unique: T[] = [];
  
    data.forEach(item => {
      const key = selector(item);
      if (key && !unique.some(u => selector(u) === key)) {
        unique.push(item);
      }
    });
  
    return unique;
  };
  