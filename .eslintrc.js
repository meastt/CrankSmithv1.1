module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Disable the unescaped entities rule for now since it's cosmetic
    "react/no-unescaped-entities": "off",
    // Make some other rules warnings instead of errors
    "@next/next/no-img-element": "warn",
    "@next/next/no-html-link-for-pages": "warn",
    "prefer-const": "warn",
    "react-hooks/exhaustive-deps": "warn",
  }
};