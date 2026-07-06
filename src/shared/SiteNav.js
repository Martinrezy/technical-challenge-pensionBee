import React from "react";

export function SiteNav({ paths, currentPath }) {
  const normalizedCurrent = currentPath.replace(/\/$/, "") || "/";

  return React.createElement(
    "header",
    { className: "site-header" },
    React.createElement(
      "div",
      { className: "site-header__inner" },
      React.createElement(
        "a",
        { className: "site-logo", href: "/about-page" },
        "Acme Co.",
      ),
      React.createElement(
        "nav",
        { "aria-label": "Main navigation" },
        React.createElement(
          "ul",
          { className: "site-nav" },
          paths.map((pagePath) => {
            const label = formatNavLabel(pagePath);
            const isActive = normalizedCurrent === pagePath;

            return React.createElement(
              "li",
              { key: pagePath },
              React.createElement("a", {
                href: pagePath,
                className: isActive ? "is-active" : undefined,
                "aria-current": isActive ? "page" : undefined,
              }, label),
            );
          }),
        ),
      ),
    ),
  );
}

function formatNavLabel(pagePath) {
  const slug = pagePath.split("/").filter(Boolean).pop() ?? "home";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
