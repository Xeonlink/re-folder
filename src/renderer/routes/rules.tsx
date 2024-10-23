import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Error } from "./-Error";

export const Route = createFileRoute("/rules")({
  component: Outlet,
  errorComponent: Error
});
