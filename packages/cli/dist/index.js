"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/commands/init.ts
var init_exports = {};
__export(init_exports, {
  init: () => init
});
async function init() {
  console.log(import_chalk.default.bold("\n  Bevel UI\n"));
  if ((0, import_fs.existsSync)((0, import_path.join)(process.cwd(), "bevel.config.ts"))) {
    console.log(
      import_chalk.default.yellow("  Bevel is already initialized in this project.")
    );
    process.exit(0);
  }
  const spinner = (0, import_ora.default)("Checking project...").start();
  const hasTS = (0, import_fs.existsSync)((0, import_path.join)(process.cwd(), "tsconfig.json"));
  spinner.succeed(
    `TypeScript: ${hasTS ? import_chalk.default.green("detected") : import_chalk.default.yellow("not found")}`
  );
  const hasShadcn = (0, import_fs.existsSync)((0, import_path.join)(process.cwd(), "components/ui"));
  if (!hasShadcn) {
    console.log(import_chalk.default.yellow("\n  shadcn is required but was not found."));
    console.log(import_chalk.default.dim("  Run: npx shadcn@latest init\n"));
    process.exit(1);
  }
  (0, import_ora.default)().succeed("shadcn: " + import_chalk.default.green("detected"));
  const config = `import type { BevelConfig } from "@bevel/cli";

const config: BevelConfig = {
  outputPath: "components/bevel",
  typescript: ${hasTS},
};

export default config;
`;
  (0, import_fs.writeFileSync)((0, import_path.join)(process.cwd(), "bevel.config.ts"), config);
  (0, import_ora.default)().succeed("Created " + import_chalk.default.green("bevel.config.ts"));
  console.log(
    import_chalk.default.bold(
      "\n  Bevel initialized. Run npx bevel add <component> to get started.\n"
    )
  );
}
var import_chalk, import_ora, import_fs, import_path;
var init_init = __esm({
  "src/commands/init.ts"() {
    "use strict";
    import_chalk = __toESM(require("chalk"));
    import_ora = __toESM(require("ora"));
    import_fs = require("fs");
    import_path = require("path");
  }
});

// src/commands/add.ts
var add_exports = {};
__export(add_exports, {
  add: () => add
});
async function add(component) {
  console.log(import_chalk2.default.bold(`
  Adding ${component}...
`));
  if (!(0, import_fs2.existsSync)((0, import_path2.join)(process.cwd(), "bevel.config.ts"))) {
    console.log(
      import_chalk2.default.yellow(
        `  Bevel is not initialized. Run ${import_chalk2.default.green("npx bevel init ")}first.`
      )
    );
    process.exit(1);
  }
  const spinner = (0, import_ora2.default)(`Fetching ${component} from registry...`).start();
  const res = await fetch(`${REGISTRY_URL}/${component}`);
  if (!res.ok) {
    spinner.fail(import_chalk2.default.red(`Component "${component}" not found in registry.`));
    process.exit(1);
  }
  const data = await res.json();
  spinner.succeed(`Fetched ${import_chalk2.default.green(component)}`);
  const outputPath = "components/bevel";
  for (const file of data.files) {
    const fullPath = (0, import_path2.join)(process.cwd(), outputPath, file.target);
    const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
    if (!(0, import_fs2.existsSync)(dir)) (0, import_fs2.mkdirSync)(dir, { recursive: true });
    if ((0, import_fs2.existsSync)(fullPath)) {
      console.log(
        import_chalk2.default.yellow(`  File already exists: ${file.target} \u2014 skipping`)
      );
      continue;
    }
    (0, import_fs2.writeFileSync)(fullPath, file.content);
    console.log(import_chalk2.default.green(`  \u2713 ${file.target}`));
  }
  if (data.dependencies.shadcn.length > 0) {
    console.log(
      import_chalk2.default.dim(
        `
  shadcn dependencies: ${data.dependencies.shadcn.join(", ")}`
      )
    );
    console.log(import_chalk2.default.dim("  Make sure these are installed via shadcn.\n"));
  }
  console.log(import_chalk2.default.bold(`
  ${component} added successfully.
`));
}
var import_chalk2, import_ora2, import_fs2, import_path2, REGISTRY_URL;
var init_add = __esm({
  "src/commands/add.ts"() {
    "use strict";
    import_chalk2 = __toESM(require("chalk"));
    import_ora2 = __toESM(require("ora"));
    import_fs2 = require("fs");
    import_path2 = require("path");
    REGISTRY_URL = "https://bevelui.vercel.app/api/registry";
  }
});

// src/index.ts
var import_chalk3 = __toESM(require("chalk"));
var import_commander = require("commander");
var program = new import_commander.Command();
program.name("bevel").description("Bevel UI \u2014 copy-to-own component systems for React").version("0.0.1");
program.command("init").description(import_chalk3.default.hex("#50C878")("Initialize Bevel in your project")).action(async () => {
  const { init: init2 } = await Promise.resolve().then(() => (init_init(), init_exports));
  await init2();
});
program.command(`add <component>`).description(import_chalk3.default.hex("#50C878")("Add a component to your project")).action(async (component) => {
  const { add: add2 } = await Promise.resolve().then(() => (init_add(), add_exports));
  await add2(component);
});
program.parse();
