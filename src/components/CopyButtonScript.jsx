"use client";
import { useEffect } from "react";

export default function CopyButtonScript() {
  useEffect(() => {
    const blocks = document.querySelectorAll("pre");

    blocks.forEach((block) => {
      if (block.querySelector(".copy-btn")) return;

      const button = document.createElement("button");
      button.innerText = "Copy";
      button.className = "copy-btn";

      button.addEventListener("click", () => {
        const code = block.querySelector("code");
        if (code) {
          navigator.clipboard.writeText(code.innerText);
          button.innerText = "Copied!";
          button.style.backgroundColor = "#2563eb";
          button.style.color = "white";

          setTimeout(() => {
            button.innerText = "Copy";
            button.style.backgroundColor = "";
            button.style.color = "";
          }, 2000);
        }
      });

      block.appendChild(button);
    });
  }, []);

  return null;
}