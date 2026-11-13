import { createFileRoute } from "@tanstack/react-router";
import { MoyaShell } from "@/components/moya-shell";

export const Route = createFileRoute("/_authenticated/proof")({
  head: () => ({ meta: [ { title: "Blockchain proof concept | MOYA SmartRoute" }, { name: "description", content: "Create a clearly labelled local simulation reference for an XRP Ledger testnet proof concept." }, { property: "og:title", content: "Blockchain proof concept | MOYA SmartRoute" }, { property: "og:description", content: "Explore MOYA's simulated blockchain proof experience." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" } ] }),
  component: () => <MoyaShell page="proof" />,
});