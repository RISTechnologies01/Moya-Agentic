import { createFileRoute } from "@tanstack/react-router";
import { MoyaShell } from "@/components/moya-shell";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [ { title: "Profile & settings | MOYA SmartRoute" }, { name: "description", content: "Review your MOYA account and edit your profile details." }, { property: "og:title", content: "Profile & settings | MOYA SmartRoute" }, { property: "og:description", content: "Manage your MOYA account profile." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" } ] }),
  component: () => <MoyaShell page="settings" />,
});