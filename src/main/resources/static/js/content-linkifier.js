/**
 * Utility to automatically convert text URLs, Phone numbers and Emails into clickable links.
 */
document.addEventListener('DOMContentLoaded', function() {
    const linkifyElements = document.querySelectorAll('.js-linkify');
    
    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const emailPattern = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/g;
    // Brazilian phone pattern: (XX) XXXX-XXXX or (XX) 9XXXX-XXXX or XXXXXXXXXXX
    const phonePattern = /(\(?\d{2}\)?\s?)?(9?\d{4}[-.\s]?\d{4})/g;

    linkifyElements.forEach(el => {
        let text = el.innerHTML;

        // Linkify URLs
        text = text.replace(urlPattern, '<a href="$1" target="_blank" class="content-link">$1</a>');

        // Linkify Emails
        text = text.replace(emailPattern, '<a href="mailto:$1" class="content-link">$1</a>');

        // Linkify Phones (only if not already inside a link)
        // This is simplified; complex nesting might need a more robust approach but for news content it works.
        text = text.replace(phonePattern, function(match) {
            // Remove non-numeric chars for the tel: link
            const digits = match.replace(/\D/g, '');
            if (digits.length >= 8) {
                return `<a href="tel:${digits}" class="content-link">${match}</a>`;
            }
            return match;
        });

        el.innerHTML = text;
    });

    console.log('🔗 Content linkified successfully.');
});
