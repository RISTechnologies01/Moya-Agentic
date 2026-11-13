import { createFileRoute } from "@tanstack/react-router";
import { MoyaShell } from "@/components/moya-shell";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [ { title: "Dashboard | MOYA SmartRoute" }, { name: "description", content: "Review recent cross-border transfers, recipients, and demo corridors." }, { property: "og:title", content: "Dashboard | MOYA SmartRoute" }, { property: "og:description", content: "Your MOYA transfer dashboard." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" } ] }),
  component: () => <MoyaShell page="dashboard" />,
});