/**
 * Utility function to strip markdown formatting and return plain text
 * This is useful for previews where we don't want markdown formatting
 */
export function stripMarkdown(markdown: string): string {
    return (
        markdown
            // Remove headers
            .replace(/^#{1,6}\s+/gm, "")
            // Remove bold/italic
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .replace(/__(.*?)__/g, "$1")
            .replace(/_(.*?)_/g, "$1")
            // Remove inline code
            .replace(/`(.*?)`/g, "$1")
            // Remove links
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            // Remove blockquotes
            .replace(/^>\s+/gm, "")
            // Remove list markers
            .replace(/^[\s]*[-*+]\s+/gm, "")
            .replace(/^[\s]*\d+\.\s+/gm, "")
            // Remove extra whitespace
            .replace(/\n\s*\n/g, "\n")
            .replace(/^\s+|\s+$/g, "")
            .trim()
    );
}

/**
 * Utility function to truncate text to a specific length
 */
export function truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
}
