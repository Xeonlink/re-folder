import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Error } from "./-Error";

export const Route = createFileRoute("/watchers")({
  component: Outlet,
  errorComponent: Error,
});
