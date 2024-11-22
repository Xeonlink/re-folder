import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Error } from "./-Error";

export const Route = createFileRoute("/folder-preset")({
  component: Outlet,
  errorComponent: Error
});
