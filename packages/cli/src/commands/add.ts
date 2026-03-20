import chalk from "chalk";
import ora from "ora";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { execa } from "execa";
import prompts from "prompts";

const REGISTRY_URL =
  process.env.BEVEL_REGISTRY_URL ?? "http://localhost:3000/api/registry";

function readConfig(cwd: string): { outputPath: string; typescript: boolean } {
  const configPath = join(cwd, "bevel.config.ts");
  const content = readFileSync(configPath, "utf-8");

  const outputPathMatch = content.match(/outputPath:\s*["'](.+?)["']/);
  const typescriptMatch = content.match(/typescript:\s*(true|false)/);

  return {
    outputPath: outputPathMatch?.[1] ?? "src/components/bevel",
    typescript: typescriptMatch?.[1] === "true",
  };
}

export async function add(component: string) {
  console.log(chalk.bold(`\n  Adding ${component}...\n`));

  const cwd = process.cwd();

  // Check bevel.config.ts exists
  if (!existsSync(join(cwd, "bevel.config.ts"))) {
    console.log(
      chalk.yellow(
        `  Bevel is not initialized. Run ${chalk.green("npx bevel init")} first.`,
      ),
    );
    process.exit(1);
  }

  // Read config
  const config = readConfig(cwd);

  // Fetch from registry
  const spinner = ora(`Fetching ${component} from registry...`).start();
  const res = await fetch(`${REGISTRY_URL}/${component}`);

  if (!res.ok) {
    spinner.fail(chalk.red(`Component "${component}" not found in registry.`));
    process.exit(1);
  }

  const data = await res.json();
  spinner.succeed(`Fetched ${chalk.green(component)}`);

  // Handle shadcn dependencies
  if (data.dependencies.shadcn.length > 0) {
    const { install } = await prompts({
      type: "confirm",
      name: "install",
      message: `Install shadcn dependencies? (${data.dependencies.shadcn.join(", ")})`,
      initial: true,
    });

    if (install) {
      const shadcnSpinner = ora("Installing shadcn dependencies...").start();
      try {
        await execa("npx", [
          "shadcn@latest",
          "add",
          ...data.dependencies.shadcn,
          "--yes",
        ]);
        shadcnSpinner.succeed("shadcn dependencies installed");
      } catch {
        shadcnSpinner.fail("Failed to install shadcn dependencies");
      }
    }
  }

  // Handle npm dependencies
  if (data.dependencies.npm.length > 0) {
    const npmSpinner = ora("Installing npm dependencies...").start();
    try {
      await execa("npm", ["install", ...data.dependencies.npm]);
      npmSpinner.succeed("npm dependencies installed");
    } catch {
      npmSpinner.fail("Failed to install npm dependencies");
    }
  }

  // Write files
  for (const file of data.files) {
    const fullPath = join(cwd, config.outputPath, file.target);
    const dir = fullPath.substring(
      0,
      Math.max(fullPath.lastIndexOf("/"), fullPath.lastIndexOf("\\")),
    );

    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    if (existsSync(fullPath)) {
      const { overwrite } = await prompts({
        type: "confirm",
        name: "overwrite",
        message: `File already exists: ${file.target}. Overwrite?`,
        initial: false,
      });

      if (!overwrite) {
        console.log(chalk.dim(`  Skipped ${file.target}`));
        continue;
      }
    }

    writeFileSync(fullPath, file.content);
    console.log(chalk.green(`  ✓ ${file.target}`));
  }

  console.log(chalk.bold(`\n  ${component} added successfully.\n`));
}