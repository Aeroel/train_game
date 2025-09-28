export { makeFirstLetterLowercase, mustGetById };
  
     function makeFirstLetterLowercase(str: string) {
        return str[0].toLowerCase() + str.slice(1);
    }
    
    
     function mustGetById<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`No element found with id="${id}"`);
  }

  return el as T;
}