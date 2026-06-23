export function splitIntoChars(element) {
  if (!element) return [];

  const existingChars = Array.from(element.querySelectorAll('.hero-char'));
  if (existingChars.length > 0) return existingChars;

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    if (walker.currentNode.nodeValue.trim()) {
      textNodes.push(walker.currentNode);
    }
  }

  const chars = [];

  for (const node of textNodes) {
    const fragment = document.createDocumentFragment();

    for (const char of node.nodeValue) {
      if (char === ' ') {
        fragment.appendChild(document.createTextNode(' '));
        continue;
      }

      const span = document.createElement('span');
      span.className = 'hero-char';
      span.textContent = char;
      fragment.appendChild(span);
      chars.push(span);
    }

    node.replaceWith(fragment);
  }

  return chars;
}
