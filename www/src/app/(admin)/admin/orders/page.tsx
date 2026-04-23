// app/(admin)/admin/orders/page.tsx
import { getAdminOrders, refundOrder } from "@/actions/admin";
import { formatPrice } from "@/lib/stripe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { IconReceipt, IconRefresh } from "@tabler/icons-react";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: "rgba(34,197,94,.15)", color: "#16a34a" },
  PENDING: { bg: "rgba(234,179,8,.15)", color: "#a16207" },
  CANCELLED: { bg: "rgba(239,68,68,.1)", color: "#dc2626" },
  EXPIRED: { bg: "rgba(107,114,128,.15)", color: "#6b7280" },
  REFUNDED: { bg: "rgba(168,85,247,.1)", color: "#7c3aed" },
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const page = Number(searchParams.page ?? 1);
  const { orders, total, pages } = await getAdminOrders({ page });

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {total.toLocaleString()} total orders
        </p>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-xs">Customer</TableHead>
              <TableHead className="text-xs">Product</TableHead>
              <TableHead className="text-xs">Amount</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const style = STATUS_STYLES[order.status] ?? {};
              return (
                <TableRow key={order.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">
                        {order.user.name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{order.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.price.label}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-sm">
                    {formatPrice(order.amountPaid ?? 0)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="text-[10px]"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {order.stripePaymentIntentId &&
                        order.status === "ACTIVE" && (
                          <form action={refundOrder.bind(null, order.id)}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                            >
                              <IconRefresh size={12} className="mr-1" />
                              Refund
                            </Button>
                          </form>
                        )}
                      {order.license && (
                        <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                          {order.license.key.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Page {page} of {pages}
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <Button variant="outline" size="sm" asChild>
              <a href={`?page=${page - 1}`}>Previous</a>
            </Button>
          )}
          {page < pages && (
            <Button variant="outline" size="sm" asChild>
              <a href={`?page=${page + 1}`}>Next</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
