// src/global.d.ts
declare module "*.svg?react" {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export { ReactComponent };
}