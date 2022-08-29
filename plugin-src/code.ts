import pluginApi, { init as initPluginApi } from "./pluginApi";

initPluginApi();

figma.showUI(__html__, { themeColors: true, height: 300 });

figma.on("selectionchange", () => {
  figma.ui.postMessage({
    type: "selectionchange",
    selection: figma.currentPage.selection.map((node) => ({
      id: node.id,
      type: node.type,
      name: node.name,
    })),
  });
});

// restore previous size
figma.clientStorage
  .getAsync("size")
  .then((size) => {
    if (size) figma.ui.resize(size.w, size.h);
  })
  .catch((err) => {});

// figma.ui.onmessage = (msg) => {
//   if (msg.type === "create-rectangles") {
//     const nodes = [];

//     for (let i = 0; i < msg.count; i++) {
//       const rect = figma.createRectangle();
//       rect.x = i * 150;
//       rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
//       figma.currentPage.appendChild(rect);
//       nodes.push(rect);
//     }

//     figma.currentPage.selection = nodes;
//     figma.viewport.scrollAndZoomIntoView(nodes);
//   }

//   if (msg.type === "resize") {
//     figma.ui.resize(msg.size.w, msg.size.h);
//     figma.clientStorage.setAsync("size", msg.size).catch((err) => {});
//   }
// };
