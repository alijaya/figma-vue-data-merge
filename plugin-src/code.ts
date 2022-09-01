import api from "./api";

api.init();

figma.showUI(__html__);

figma.on("selectionchange", () => {
  api.uiApi.selectionChangeHandler(
    figma.currentPage.selection.map((node) => ({
      id: node.id,
      type: node.type,
      name: node.name,
    }))
  );
});

// restore previous size
figma.clientStorage
  .getAsync("windowSize")
  .then((size) => {
    if (size) figma.ui.resize(size.width, size.height);
  })
  .catch((err) => {});
