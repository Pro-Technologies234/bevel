// app/(admin)/admin/products/page.tsx
import { getAdminProducts, toggleProductPublished } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { formatPrice } from "@/lib/stripe";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {products.length} total products
        </p>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Tier</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Prices</TableHead>
              <TableHead className="text-xs">Purchases</TableHead>
              <TableHead className="text-xs">Licenses</TableHead>
              <TableHead className="text-xs">Published</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/20">
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {product.slug}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="text-[10px]"
                    style={{
                      background:
                        product.tier === "FREE"
                          ? "rgba(34,197,94,.1)"
                          : product.tier === "PRO"
                            ? "rgba(194,241,60,.12)"
                            : "rgba(168,85,247,.1)",
                      color:
                        product.tier === "FREE"
                          ? "#16a34a"
                          : product.tier === "PRO"
                            ? "#4d7a00"
                            : "#7c3aed",
                    }}
                  >
                    {product.tier}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {product.type}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    {product.prices.map((price) => (
                      <span key={price.id} className="text-xs font-mono">
                        {formatPrice(price.amount)}{" "}
                        {price.label ? `(${price.label})` : ""}
                      </span>
                    ))}
                    {product.prices.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        Free
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm font-semibold">
                  {product._count.purchases}
                </TableCell>
                <TableCell className="text-sm font-semibold">
                  {product._count.licenses}
                </TableCell>
                <TableCell>
                  <form action={toggleProductPublished.bind(null, product.id)}>
                    <button type="submit">
                      <Switch
                        checked={product.published}
                        className="pointer-events-none"
                      />
                    </button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
