/**
 * Seller text is evidence. Strip identifiers and links before it is shown or
 * sent to a model. The remaining words stay as the seller wrote them.
 */
export function redactSellerText(text: string): string {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email]')
    .replace(/\b(?:\+?\d{1,3}[-.\s])?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]\d{4}\b/g, '[phone]')
    .replace(/\bDT-\d+\b/g, '[id]')
    .replace(/https?:\/\/\S+/gi, '[link]')
    .replace(/\s+/g, ' ')
    .trim()
}

export function numbersIn(text: string): string[] {
  return text.match(/\d+(?:\.\d+)?/g) ?? []
}
