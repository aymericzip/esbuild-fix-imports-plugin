declare module "load-tsconfig" {
  export interface TsConfig {
    compilerOptions?: {
      baseUrl?: string;
      [key: string]: any;
    };
    extends?: string | string[];
    [key: string]: any;
  }

  export interface Loaded {
    /** Path to the nearest config file */
    path: string;
    /** Merged config data */
    data: TsConfig;
    /** Discovered config files */
    files: string[];
  }

  export function loadTsConfig(dir: string, name?: string): Loaded | null;
}
