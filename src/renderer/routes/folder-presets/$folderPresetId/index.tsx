import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/folder-presets/$folderPresetId/")({
  component: Page
});

function Page() {
  return <div></div>;
}
