// app/(admin)/admin/users/page.tsx
import { getAdminUsers, updateUserRole, deleteUser } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical, IconShield, IconTrash } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const page = Number(searchParams.page ?? 1);
  const { users, total, pages } = await getAdminUsers({
    page,
    search: searchParams.search,
  });

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total.toLocaleString()} total users
          </p>
        </div>
        <form className="flex items-center gap-2">
          <Input
            name="search"
            placeholder="Search by email or name..."
            defaultValue={searchParams.search}
            className="w-64 h-9 text-sm"
          />
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-xs">User</TableHead>
              <TableHead className="text-xs">Role</TableHead>
              <TableHead className="text-xs">Active Purchases</TableHead>
              <TableHead className="text-xs">Joined</TableHead>
              <TableHead className="text-xs w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/20">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-semibold text-primary shrink-0">
                      {user.name?.charAt(0).toUpperCase() ??
                        user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{
                      background:
                        user.role === "ADMIN"
                          ? "rgba(194,241,60,.15)"
                          : undefined,
                      color: user.role === "ADMIN" ? "#4d7a00" : undefined,
                    }}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.purchases.length === 0 ? (
                      <span className="text-xs text-muted-foreground">
                        Free
                      </span>
                    ) : (
                      user.purchases.map((p) => (
                        <Badge
                          key={p.id}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {p.product.name}
                        </Badge>
                      ))
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-7 h-7">
                        <IconDotsVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-sm">
                      <form
                        action={updateUserRole.bind(
                          null,
                          user.id,
                          user.role === "ADMIN" ? "CUSTOMER" : "ADMIN",
                        )}
                      >
                        <DropdownMenuItem asChild>
                          <button
                            type="submit"
                            className="w-full flex items-center gap-2 cursor-pointer"
                          >
                            <IconShield size={13} />
                            {user.role === "ADMIN"
                              ? "Remove admin"
                              : "Make admin"}
                          </button>
                        </DropdownMenuItem>
                      </form>
                      <form action={deleteUser.bind(null, user.id)}>
                        <DropdownMenuItem asChild>
                          <button
                            type="submit"
                            className="w-full flex items-center gap-2 cursor-pointer text-destructive"
                          >
                            <IconTrash size={13} />
                            Delete user
                          </button>
                        </DropdownMenuItem>
                      </form>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Page {page} of {pages}
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`?page=${page - 1}${searchParams.search ? `&search=${searchParams.search}` : ""}`}
              >
                Previous
              </a>
            </Button>
          )}
          {page < pages && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`?page=${page + 1}${searchParams.search ? `&search=${searchParams.search}` : ""}`}
              >
                Next
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
