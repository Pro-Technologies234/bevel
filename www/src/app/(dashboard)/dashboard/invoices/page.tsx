import {
  IconDownload,
  IconExternalLink,
  IconReceipt,
  IconWallet,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { getUserInvoices } from "@/actions/subscription";
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
import {
  DashboardEmptyState,
  DashboardHero,
  DashboardMetricCard,
  DashboardPage,
  DashboardPanel,
  DashboardSection,
} from "@/components/dashboard/dashboard-shell";

const statusClasses: Record<string, string> = {
  PAID: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  OPEN: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  VOID: "border-white/10 bg-white/5 text-muted-foreground",
};

export default async function InvoicesPage() {
  const invoices = await getUserInvoices();
  const totalPaid = invoices.reduce(
    (sum, invoice) => sum + (invoice.amountPaid ?? 0),
    0,
  );

  return (
    <DashboardPage>
      <DashboardHero
        eyebrow="Billing history"
        title="Invoices"
        description="Every completed payment in your customer workspace is collected here, with direct links for hosted invoices and PDF downloads."
      >
        <Badge variant="outline" className="border-white/10 bg-background/70">
          {invoices.length} invoices
        </Badge>
      </DashboardHero>

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardMetricCard
          label="Total invoices"
          value={`${invoices.length}`}
          detail="Your payment timeline updates automatically after successful checkout."
          icon={<IconReceipt size={18} />}
          tone="default"
        />
        <DashboardMetricCard
          label="Paid amount"
          value={formatPrice(totalPaid)}
          detail="This reflects only the amount successfully paid across all invoices."
          icon={<IconWallet size={18} />}
          tone="success"
        />
        <DashboardMetricCard
          label="Latest status"
          value={invoices[0]?.status ?? "No invoices"}
          detail="Open invoices and void records also surface here when applicable."
          icon={<IconExternalLink size={18} />}
          tone="warning"
        />
      </section>

      <DashboardSection
        title="Invoice ledger"
        description="Download a PDF copy or jump into the hosted invoice when a link is available."
      >
        {invoices.length === 0 ? (
          <DashboardEmptyState
            title="No invoices yet"
            description="Once you complete a purchase, the receipt and hosted invoice links will show up here automatically."
          />
        ) : (
          <DashboardPanel className="overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 bg-background/60 hover:bg-background/60">
                  <TableHead className="px-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Invoice
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Product
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="pr-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="border-white/10 hover:bg-background/40"
                  >
                    <TableCell className="px-5 py-4 font-mono text-xs">
                      {invoice.invoiceNumber ?? invoice.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="py-4 text-sm font-medium">
                      {invoice.purchase.product.name}
                    </TableCell>
                    <TableCell className="py-4 text-sm font-semibold">
                      {formatPrice(
                        invoice.amountPaid || invoice.amountDue,
                        invoice.currency,
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={statusClasses[invoice.status] ?? statusClasses.VOID}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-muted-foreground">
                      {invoice.paidAt ? format(invoice.paidAt, "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell className="py-4 pr-5">
                      <div className="flex items-center gap-2">
                        {invoice.invoicePdfUrl ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            asChild
                          >
                            <a
                              href={invoice.invoicePdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <IconDownload />
                              PDF
                            </a>
                          </Button>
                        ) : null}
                        {invoice.hostedInvoiceUrl ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl"
                            asChild
                          >
                            <a
                              href={invoice.hostedInvoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <IconExternalLink />
                              Open
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DashboardPanel>
        )}
      </DashboardSection>
    </DashboardPage>
  );
}
