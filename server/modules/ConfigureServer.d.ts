import { app } from "../types/ExpressTypes";
declare class ConfigureServer {
    static configureSecretFiles(app: app): Promise<void>;
}
export default ConfigureServer;
