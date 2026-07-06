import { hydrateRoot } from "react-dom/client";
import { SiteNav } from "../shared/SiteNav.js";
import "./styles.css";

const root = document.getElementById("root");

if (root) {
  const paths = JSON.parse(root.dataset.paths ?? "[]");
  const currentPath = root.dataset.currentPath ?? window.location.pathname;

  hydrateRoot(
    root,
    <SiteNav paths={paths} currentPath={currentPath} />,
  );
}
