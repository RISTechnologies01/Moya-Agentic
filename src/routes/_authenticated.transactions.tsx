import { createFileRoute } from "@tanstack/react-router";
import { MoyaShell } from "@/components/moya-shell";

export const Route = createFileRoute("/_authenticated/transactions")({
  head: () => ({ meta: [ { title: "Transactions | MOYA SmartRoute" }, { name: "description", content: "Search and filter your saved MOYA transfer history." }, { property: "og:title", content: "Transactions | MOYA SmartRoute" }, { property: "og:description", content: "Search and follow your MOYA transfer history." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" } ] }),
  component: () => <MoyaShell page="transactions" />,
});