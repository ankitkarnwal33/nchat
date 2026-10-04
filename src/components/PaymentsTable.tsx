import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

export function PaymentsTable({ children }: { children: React.ReactNode }) {
  return (
    <Table className="w-full rounded-lg ">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  );
}
