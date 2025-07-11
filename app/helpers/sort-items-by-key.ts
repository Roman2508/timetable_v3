export const sortItemsByKey = (items: any[], key: string, order: "asc" | "desc" = "asc") => {
  const itemsDeepCopy = JSON.parse(JSON.stringify(items));

  const getValue = (obj: any) => obj[key];

  const compareValues = (valA: any, valB: any) => {
    if (typeof valA === "string" && typeof valB === "string") {
      return valA.toLowerCase().localeCompare(valB.toLowerCase());
    } else if (typeof valA === "number" && typeof valB === "number") {
      return valA - valB;
    } else {
      return valA.toString().toLowerCase().localeCompare(valB.toString().toLowerCase());
    }
  };

  const compare = (a: any, b: any) => (order === "asc" ? compareValues(a, b) : -compareValues(a, b));

  if (Array.isArray(itemsDeepCopy[0])) {
    return itemsDeepCopy.sort((a: any, b: any) => compare(getValue(a[0]), getValue(b[0])));
  }

  return itemsDeepCopy.sort((a: any, b: any) => compare(getValue(a), getValue(b)));
};
