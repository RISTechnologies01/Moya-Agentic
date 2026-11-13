import { createFileRoute } from "@tanstack/react-router";
import { MoyaShell } from "@/components/moya-shell";

export const Route = createFileRoute("/_authenticated/recipients")({
  head: () => ({ meta: [ { title: "Recipients | MOYA SmartRoute" }, { name: "description", content: "Manage saved recipients for MOYA demo transfers." }, { property: "og:title", content: "Recipients | MOYA SmartRoute" }, { property: "og:description", content: "Manage your saved MOYA recipients." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" } ] }),
  component: () => <MoyaShell page="recipients" />,
});