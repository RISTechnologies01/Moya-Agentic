import { createFileRoute } from "@tanstack/react-router";
import { MoyaShell } from "@/components/moya-shell";

export const Route = createFileRoute("/_authenticated/tracking")({
  validateSearch: (search: Record<string, unknown>) => ({ id: typeof search.id === "string" ? search.id : "" }),
  head: () => ({ meta: [ { title: "Track transfer | MOYA SmartRoute" }, { name: "description", content: "Follow the simulated status timeline for a MOYA demo transfer." }, { property: "og:title", content: "Track transfer | MOYA SmartRoute" }, { property: "og:description", content: "Follow a MOYA demo transfer from route selection to payout." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" } ] }),
  component: () => <TrackingRoute />,
});

function TrackingRoute() {
  const search = Route.useSearch();
  return <MoyaShell page="tracking" trackingId={search.id} />;
}