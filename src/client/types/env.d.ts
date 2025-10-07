declare module "bun" {
  interface Env {
    CLIENT_TOKEN: string;
    APPLICATION_ID: string;
    API_PORT: number;
    DAILY_FACT_CHANNEL_ID: string;
  }
}
