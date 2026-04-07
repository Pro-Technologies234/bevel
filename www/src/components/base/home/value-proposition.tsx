import { Wrapper } from "@/components/shared/wrapper";
import { Badge } from "@/components/ui/badge";

export function ValueProposition() {
  
  return (
    <Wrapper>
      <section className="space-y-2 flex flex-col items-center text-center ">
        <Badge
          variant={"secondary"}
          className="bg-muted/80 hover:bg-muted border! border-border/70! p-3.5 gap-2 text-xs uppercase select-none "
        >
          <span className="h-1.5 w-1.5 rounded-full dark:bg-green-400 bg-green-600" />
          Engineering-first UI Systems
        </Badge>
        <h1 className=" text-5xl font-sans font-medium  tracking-tight">
          Not another component library.
        </h1>
        <p className=" max-w-3xl text-center">
          Bevel gives you the systems every real product needs — fully wired, stateful, and production-ready.
        </p>
      </section>
    </Wrapper>
  );
}
