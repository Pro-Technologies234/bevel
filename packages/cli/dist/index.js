#!/usr/bin/env node
"use strict";var C=Object.create;var u=Object.defineProperty;var R=Object.getOwnPropertyDescriptor;var F=Object.getOwnPropertyNames;var I=Object.getPrototypeOf,z=Object.prototype.hasOwnProperty;var w=(e,o)=>()=>(e&&(o=e(e=0)),o);var b=(e,o)=>{for(var n in o)u(e,n,{get:o[n],enumerable:!0})},P=(e,o,n,s)=>{if(o&&typeof o=="object"||typeof o=="function")for(let r of F(o))!z.call(e,r)&&r!==n&&u(e,r,{get:()=>o[r],enumerable:!(s=R(o,r))||s.enumerable});return e};var d=(e,o,n)=>(n=e!=null?C(I(e)):{},P(o||!e||!e.__esModule?u(n,"default",{value:e,enumerable:!0}):n,e));var x={};b(x,{init:()=>T});async function T(){console.log(i.default.bold(`
  Bevel UI
`)),(0,l.existsSync)((0,a.join)(process.cwd(),"bevel.config.ts"))&&(console.log(i.default.yellow("  Bevel is already initialized in this project.")),process.exit(0));let e=(0,g.default)("Checking project...").start(),o=(0,l.existsSync)((0,a.join)(process.cwd(),"tsconfig.json"));e.succeed(`TypeScript: ${o?i.default.green("detected"):i.default.yellow("not found")}`),(0,l.existsSync)((0,a.join)(process.cwd(),"components/ui"))||(0,l.existsSync)((0,a.join)(process.cwd(),"src/components/ui"))||(console.log(i.default.yellow(`
  shadcn is required but was not found.`)),console.log(i.default.dim(`  Run: npx shadcn@latest init
`)),process.exit(1)),(0,g.default)().succeed("shadcn: "+i.default.green("detected"));let s=`import type { BevelConfig } from "@bevel/cli";

const config: BevelConfig = {
  outputPath: "src/components/bevel",
  typescript: ${o},
};

export default config;
`;(0,l.writeFileSync)((0,a.join)(process.cwd(),"bevel.config.ts"),s),(0,g.default)().succeed("Created "+i.default.green("bevel.config.ts")),console.log(i.default.bold(`
  Bevel initialized. Run npx bevel add <component> to get started.
`))}var i,g,l,a,$=w(()=>{"use strict";i=d(require("chalk")),g=d(require("ora")),l=require("fs"),a=require("path")});var j={};b(j,{add:()=>A});async function A(e){console.log(t.default.bold(`
  Adding ${e}...
`)),(0,c.existsSync)((0,h.join)(process.cwd(),"bevel.config.ts"))||(console.log(t.default.yellow(`  Bevel is not initialized. Run ${t.default.green("npx bevel init ")}first.`)),process.exit(1));let o=(0,S.default)(`Fetching ${e} from registry...`).start(),n=await fetch(`${U}/${e}`);n.ok||(o.fail(t.default.red(`Component "${e}" not found in registry.`)),process.exit(1));let s=await n.json();o.succeed(`Fetched ${t.default.green(e)}`);let r="components/bevel";for(let p of s.files){let f=(0,h.join)(process.cwd(),r,p.target),v=f.substring(0,f.lastIndexOf("/"));if((0,c.existsSync)(v)||(0,c.mkdirSync)(v,{recursive:!0}),(0,c.existsSync)(f)){console.log(t.default.yellow(`  File already exists: ${p.target} \u2014 skipping`));continue}(0,c.writeFileSync)(f,p.content),console.log(t.default.green(`  \u2713 ${p.target}`))}s.dependencies.shadcn.length>0&&(console.log(t.default.dim(`
  shadcn dependencies: ${s.dependencies.shadcn.join(", ")}`)),console.log(t.default.dim(`  Make sure these are installed via shadcn.
`))),console.log(t.default.bold(`
  ${e} added successfully.
`))}var t,S,c,h,U,k=w(()=>{"use strict";t=d(require("chalk")),S=d(require("ora")),c=require("fs"),h=require("path"),U="https://bevelui.vercel.app/api/registry"});var y=d(require("chalk")),B=require("commander"),m=new B.Command;m.name("bevel").description("Bevel UI \u2014 copy-to-own component systems for React").version("0.0.1");m.command("init").description(y.default.hex("#50C878")("Initialize Bevel in your project")).action(async()=>{let{init:e}=await Promise.resolve().then(()=>($(),x));await e()});m.command("add <component>").description(y.default.hex("#50C878")("Add a component to your project")).action(async e=>{let{add:o}=await Promise.resolve().then(()=>(k(),j));await o(e)});m.parse();
