import chalk from "chalk";
import ora from "ora";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";

const REGISTRY_URL = "https://bevelui.vercel.app/api/registry";

export async function add(component: string) {
  console.log(chalk.bold(`\n  Adding ${component}...\n`));

  // Check bevel.config.ts exists
  if (!existsSync(join(process.cwd(), "bevel.config.ts"))) {
    console.log(
      chalk.yellow(
        `  Bevel is not initialized. Run ${chalk.green("npx bevel init ")}first.`,
      ),
    );
    process.exit(1);
  }

  const spinner = ora(`Fetching ${component} from registry...`).start();

  const res = await fetch(`${REGISTRY_URL}/${component}`);

  if (!res.ok) {
    spinner.fail(chalk.red(`Component "${component}" not found in registry.`));
    process.exit(1);
  }

  const data = await res.json();
  spinner.succeed(`Fetched ${chalk.green(component)}`);

  // Read output path from bevel.config.ts
  const outputPath = "components/bevel";

  // Write files
  for (const file of data.files) {
    const fullPath = join(process.cwd(), outputPath, file.target);
    const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));

    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    if (existsSync(fullPath)) {
      console.log(
        chalk.yellow(`  File already exists: ${file.target} — skipping`),
      );
      continue;
    }

    writeFileSync(fullPath, file.content);
    console.log(chalk.green(`  ✓ ${file.target}`));
  }

  // Log shadcn dependencies
  if (data.dependencies.shadcn.length > 0) {
    console.log(
      chalk.dim(
        `\n  shadcn dependencies: ${data.dependencies.shadcn.join(", ")}`,
      ),
    );
    console.log(chalk.dim("  Make sure these are installed via shadcn.\n"));
  }

  console.log(chalk.bold(`\n  ${component} added successfully.\n`));
}
