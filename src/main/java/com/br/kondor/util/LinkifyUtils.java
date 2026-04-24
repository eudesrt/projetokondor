package com.br.kondor.util;

import org.springframework.web.util.HtmlUtils;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Utility class to detect and format URLs, emails, and phone numbers as links.
 */
public class LinkifyUtils {

    private static final Pattern URL_PATTERN = Pattern.compile(
            "(https?://[\\w\\.-]+(?:\\:[\\w\\.-]+)?(?:/[\\w\\.\\-\\?\\=\\&\\%\\#]*)?)", Pattern.CASE_INSENSITIVE);

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6})", Pattern.CASE_INSENSITIVE);

    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "(\\(\\d{2}\\)\\s?\\d{4,5}-\\d{4}|\\d{2}\\s?\\d{4,5}-\\d{4})", Pattern.CASE_INSENSITIVE);

    /**
     * Converts plain text into HTML with clickable links.
     * Escapes the input text first to prevent XSS.
     */
    public static String linkify(String text) {
        if (text == null) {
            return "";
        }

        // 1. Escape HTML to prevent XSS
        String escaped = HtmlUtils.htmlEscape(text);

        // 2. Linkify URLs
        Matcher urlMatcher = URL_PATTERN.matcher(escaped);
        StringBuffer sb = new StringBuffer();
        while (urlMatcher.find()) {
            urlMatcher.appendReplacement(sb, "<a href=\"$1\" target=\"_blank\" class=\"linkified-url\">$1</a>");
        }
        urlMatcher.appendTail(sb);
        String result = sb.toString();

        // 3. Linkify Emails
        Matcher emailMatcher = EMAIL_PATTERN.matcher(result);
        sb = new StringBuffer();
        while (emailMatcher.find()) {
            emailMatcher.appendReplacement(sb, "<a href=\"mailto:$1\" class=\"linkified-email\">$1</a>");
        }
        emailMatcher.appendTail(sb);
        result = sb.toString();

        // 4. Linkify Phones
        Matcher phoneMatcher = PHONE_PATTERN.matcher(result);
        sb = new StringBuffer();
        while (phoneMatcher.find()) {
            phoneMatcher.appendReplacement(sb, "<a href=\"tel:$1\" class=\"linkified-phone\">$1</a>");
        }
        phoneMatcher.appendTail(sb);

        return sb.toString();
    }
}
