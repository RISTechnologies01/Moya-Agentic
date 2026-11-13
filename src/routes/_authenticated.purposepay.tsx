import { createFileRoute } from "@tanstack/react-router";
import { MoyaShell } from "@/components/moya-shell";

export const Route = createFileRoute("/_authenticated/purposepay")({
  head: () => ({ meta: [ { title: "PurposePay | MOYA SmartRoute" }, { name: "description", content: "Create and share a suggested purpose allocation for a MOYA demo transfer." }, { property: "og:title", content: "PurposePay | MOYA SmartRoute" }, { property: "og:description", content: "Share a suggested spending plan with your recipient." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" } ] }),
  component: () => <MoyaShell page="purposepay" />,
});