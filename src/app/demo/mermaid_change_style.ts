Array.from(document.getElementsByClassName("basic label-container")).map(
  (node) => {
    if (node.attributes.rx.value === "0") {
      node.style = "fill: #ebf8ff";
    }
  }
);

Array.from(document.getElementsByClassName("nodeLabel")).map((node) => {
  const initialText = node.innerHTML;
  const splitted = initialText.split("<br>");

  const doesNotHaveText = splitted.length === 0;
  if (doesNotHaveText) return;

  const title = splitted[0];
  const titleNode = document.createElement("span");
  titleNode.style = "font-weight: bold";
  titleNode.innerHTML = title;

  const breakNode = document.createElement("br");

  const text = splitted.slice(1).join("<br>");
  const textNode = document.createElement("span");
  textNode.classList.add("nodeLabel");
  textNode.innerHTML = text;

  node.innerHTML = "";
  node.appendChild(titleNode);
  node.appendChild(breakNode);
  node.appendChild(textNode);
});
