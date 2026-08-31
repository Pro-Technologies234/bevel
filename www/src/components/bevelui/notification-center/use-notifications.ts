import { useNotificationCtx } from "./notification-context";
import type { NotificationInput } from "./types";

/**
 * Call from anywhere under <NotificationRoot> to push a notification.
 * Returns the same context API — notify(), dismissToast(), undo(), etc. —
 * so consumers rarely need anything beyond this one hook.
 */
export function useNotifications() {
  const ctx = useNotificationCtx();

  function notify(input: NotificationInput): string {
    return ctx.notify(input);
  }

  return { ...ctx, notify };
}
