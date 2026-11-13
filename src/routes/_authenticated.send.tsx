import { createFileRoute } from "@tanstack/react-router";
import { MoyaShell } from "@/components/moya-shell";

export const Route = createFileRoute("/_authenticated/send")({
  head: () => ({ meta: [ { title: "Send money | MOYA SmartRoute" }, { name: "description", content: "Compare simulated cross-border transfer options and see fees before selecting a route." }, { property: "og:title", content: "Send money | MOYA SmartRoute" }, { property: "og:description", content: "Compare transparent demo routes for sending money across Africa." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" } ] }),
  component: () => <MoyaShell page="send" />,
});