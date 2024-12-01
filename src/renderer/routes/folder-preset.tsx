import { Error } from "./-Error";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/folder-preset")({
  component: Outlet,
  errorComponent: Error,
});
