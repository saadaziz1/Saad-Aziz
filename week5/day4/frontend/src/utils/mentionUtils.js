/**
 * Extract user IDs from HTML content that contains mentions
 * @param {string} html - HTML content with mention spans
 * @returns {string[]} Array of user IDs
 */
export const extractMentionIdsFromHTML = (html) => {
  if (!html) return [];
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const mentionElements = doc.querySelectorAll('[data-type="mention"]');
    
    return Array.from(mentionElements)
      .map(el => el.getAttribute('data-id'))
      .filter(id => id && id.trim() !== '');
  } catch (error) {
    console.error('Error extracting mentions:', error);
    return [];
  }
};

/**
 * Extract plain text from HTML content
 * @param {string} html - HTML content
 * @returns {string} Plain text
 */
export const extractPlainTextFromHTML = (html) => {
  if (!html) return '';
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  } catch (error) {
    console.error('Error extracting plain text:', error);
    return html;
  }
};

