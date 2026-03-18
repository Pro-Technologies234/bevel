import chalk from "chalk";
import { Command } from "commander";

const program = new Command();

program
  .name("bevel")
  .description("Bevel UI — copy-to-own component systems for React")
  .version("0.0.1");

program
  .command("init")
  .description(chalk.hex("#50C878")("Initialize Bevel in your project"))
  .action(async () => {
    const { init } = await import("./commands/init");
    await init();
  });

program
  .command(`add <component>`)
  .description(chalk.hex("#50C878")("Add a component to your project"))
  .action(async (component) => {
    const { add } = await import("./commands/add");
    await add(component);
  });

program.parse();
