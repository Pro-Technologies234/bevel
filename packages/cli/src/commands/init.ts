import chalk from "chalk";
import ora from "ora";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";

export async function init() {
  console.log(chalk.bold("\n  Bevel UI\n"));

  // Check if already initialized
  if (existsSync(join(process.cwd(), "bevel.config.ts"))) {
    console.log(
      chalk.yellow("  Bevel is already initialized in this project."),
    );
    process.exit(0);
  }

  const spinner = ora("Checking project...").start();

  // Check TypeScript
  const hasTS = existsSync(join(process.cwd(), "tsconfig.json"));
  spinner.succeed(
    `TypeScript: ${hasTS ? chalk.green("detected") : chalk.yellow("not found")}`,
  );

  // Check shadcn
  const hasShadcn =
    existsSync(join(process.cwd(), "components/ui")) ||
    existsSync(join(process.cwd(), "src/components/ui"));

  if (!hasShadcn) {
    console.log(chalk.yellow("\n  shadcn is required but was not found."));
    console.log(chalk.dim("  Run: npx shadcn@latest init\n"));
    process.exit(1);
  }

  ora().succeed("shadcn: " + chalk.green("detected"));

  // Create bevel.config.ts
  const config = `import type { BevelConfig } from "@bevel/cli";

const config: BevelConfig = {
  outputPath: "src/components/bevel",
  typescript: ${hasTS},
};

export default config;
`;

  writeFileSync(join(process.cwd(), "bevel.config.ts"), config);
  ora().succeed("Created " + chalk.green("bevel.config.ts"));

  console.log(
    chalk.bold(
      "\n  Bevel initialized. Run npx bevel add <component> to get started.\n",
    ),
  );
}
