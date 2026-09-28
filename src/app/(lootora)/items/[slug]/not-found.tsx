import { NotFoundView } from "@/modules/status/components/not-found-view";

/** A slug the catalog doesn't know: the item variant of the 404, served with a real 404 status. */
export default function ItemNotFound() {
  return <NotFoundView variant="item" />;
}
