import { Error } from "./-Error";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: Outlet,
  errorComponent: Error,
});
