// @ts-nocheck
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema";

interface TenantConfig {
  subdomain: string;
  databaseUrl: string;
  storeName: string;
  isActive: boolean;
}

class TenantManager {
  private tenants: Map<string, TenantConfig> = new Map();
  private dbConnections: Map<string, any> = new Map();

  constructor() {
    this.loadTenants();
  }

  private loadTenants() {
    // Load tenant configurations from environment or main database
    const tenantsConfig = [
      {
        subdomain: "demo",
        databaseUrl: process.env.EXTERNAL_DB_URL || process.env.DATABASE_URL!,
        storeName: "Store 0 - Cửa hàng demo",
        isActive: true,
      },
      {
        subdomain: "mobile",
        databaseUrl: process.env.EXTERNAL_DB_URL || process.env.DATABASE_URL!,
        storeName: "Store 0 - Cửa hàng demo",
        isActive: true,
      },
      {
        subdomain: "0318225421",
        databaseUrl: process.env.EXTERNAL_DB_URL || process.env.DATABASE_URL!,
        storeName: "Store 1 - Cửa hàng 0318225421",
        isActive: true,
      },
      {
        subdomain: "0111156080",
        databaseUrl:
          process.env.DATABASE_0111156080 ||
          process.env.EXTERNAL_DB_0111156080 ||
          process.env.DATABASE_URL!,
        storeName: "Store 2 - Cửa hàng 0111156080",
        isActive: true,
      },
      {
        subdomain: "hazkitchen-mobie",
        databaseUrl:
          process.env.DATABASE_hazkitchen ||
          process.env.EXTERNAL_DB_hazkitchen!,
        storeName: "Store 3 - Cửa hàng hazkitchen",
        isActive: true,
      },
      {
        subdomain: "hazkitchen-mobile",
        databaseUrl:
          process.env.DATABASE_hazkitchen ||
          process.env.EXTERNAL_DB_hazkitchen!,
        storeName: "Store 3 - Cửa hàng hazkitchen",
        isActive: true,
      },
      {
        subdomain: "0108670987-001",
        databaseUrl:
          process.env.DATABASE_0108670987 ||
          process.env.EXTERNAL_DB_0108670987!,
        storeName: "Store 5 - Cửa hàng 0108670987",
        isActive: true,
      },
      {
        subdomain: "0318225421-mobile",
        databaseUrl:
          process.env.DATABASE_URL_MOBIE || process.env.EXTERNAL_DB_URL_MOBIE!,
        storeName: "Store 6 - Cửa hàng 0318225421-mobile",
        isActive: true,
      },
      {
        subdomain: "0108670987-001-mobile",
        databaseUrl:
          process.env.DATABASE_0108670987 ||
          process.env.EXTERNAL_DB_0108670987!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-002-mobile",
        databaseUrl:
          process.env.DATABASE_0108670987 ||
          process.env.EXTERNAL_DB_0108670987!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-003-mobile",
        databaseUrl:
          process.env.DATABASE_0108670987 ||
          process.env.EXTERNAL_DB_0108670987!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-004-mobile",
        databaseUrl:
          process.env.DATABASE_0108670987 ||
          process.env.EXTERNAL_DB_0108670987!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-005-mobile",
        databaseUrl:
          process.env.DATABASE_0108670987 ||
          process.env.EXTERNAL_DB_0108670987!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-006-mobile",
        databaseUrl:
          process.env.DATABASE_0108670987 ||
          process.env.EXTERNAL_DB_0108670987!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-007-mobile",
        databaseUrl:
          process.env.DATABASE_0108670987 ||
          process.env.EXTERNAL_DB_0108670987!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-008-mobile",
        databaseUrl:
          process.env.DATABASE_0108670987 ||
          process.env.EXTERNAL_DB_0108670987!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-009-mobile",
        databaseUrl:
          process.env.DATABASE_0108670987 ||
          process.env.EXTERNAL_DB_0108670987!,
        storeName: "Store 5 - Cửa hàng 0108670987-009",
        isActive: true,
      },
      {
        subdomain: "0108670987-001-mobile2",
        databaseUrl:
          process.env.DATABASE_0108670987_001 ||
          process.env.EXTERNAL_DB_0108670987_001!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-002-mobile2",
        databaseUrl:
          process.env.DATABASE_0108670987_002 ||
          process.env.EXTERNAL_DB_0108670987_002!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-003-mobile2",
        databaseUrl:
          process.env.DATABASE_0108670987_003 ||
          process.env.EXTERNAL_DB_0108670987_003!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-004-mobile2",
        databaseUrl:
          process.env.DATABASE_0108670987_004 ||
          process.env.EXTERNAL_DB_0108670987_004!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-005-mobile2",
        databaseUrl:
          process.env.DATABASE_0108670987_005 ||
          process.env.EXTERNAL_DB_0108670987_005!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-006-mobile2",
        databaseUrl:
          process.env.DATABASE_0108670987_006 ||
          process.env.EXTERNAL_DB_0108670987_006!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-007-mobile2",
        databaseUrl:
          process.env.DATABASE_0108670987_007 ||
          process.env.EXTERNAL_DB_0108670987_007!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "0108670987-008-mobile2",
        databaseUrl:
          process.env.DATABASE_0108670987_008 ||
          process.env.EXTERNAL_DB_0108670987_008!,
        storeName: "Store 5 - Cửa hàng 0108670987-008",
        isActive: true,
      },
      {
        subdomain: "227093000003-mobile",
        databaseUrl:
          process.env.EXTERNAL_227093000003 ||
          process.env.DATABASE_227093000003!,
        storeName: "Store 6 - Cửa hàng 227093000003",
        isActive: true,
      },
      {
        subdomain: "8045550047-mobile",
        databaseUrl:
          process.env.EXTERNAL_8045550047 || process.env.DATABASE_8045550047!,
        storeName: "Store 6 - Cửa hàng 8045550047",
        isActive: true,
      },
      {
        subdomain: "8355337985-mobile",
        databaseUrl:
          process.env.EXTERNAL_8355337985 || process.env.DATABASE_8355337985!,
        storeName: "Store 6 - Cửa hàng 8355337985",
        isActive: true,
      },
      {
        subdomain: "0108670987-mobile",
        databaseUrl:
          process.env.DATABASE_0108670987 ||
          process.env.EXTERNAL_DB_0108670987!,
        storeName: "Store 5 - Cửa hàng 0108670987-mobile",
        isActive: true,
      },
      {
        subdomain: "001097090862-mobile",
        databaseUrl:
          process.env.EXTERNAL_001097090862 ||
          process.env.DATABASE_001097090862!,
        storeName: "Store 7 - Cửa hàng 001097090862",
        isActive: true,
      },
      {
        subdomain: "0111063848-mobile",
        databaseUrl:
          process.env.EXTERNAL_0111063848 || process.env.DATABASE_0111063848!,
        storeName: "Store 8 - Cửa hàng 0111063848",
        isActive: true,
      },
      {
        subdomain: "0353133905-mobile",
        databaseUrl:
          process.env.EXTERNAL_0353133905 || process.env.DATABASE_0353133905!,
        storeName: "Store 9 - Cửa hàng 0353133905",
        isActive: true,
      },
      {
        subdomain: "001181043568-mobile",
        databaseUrl:
          process.env.EXTERNAL_001181043568 ||
          process.env.DATABASE_001181043568!,
        storeName: "Store 10 - Cửa hàng 001181043568",
        isActive: true,
      },
      {
        subdomain: "0109636107-mobile",
        databaseUrl:
          process.env.EXTERNAL_0109636107 || process.env.DATABASE_0109636107!,
        storeName: "Store 11 - Cửa hàng 0109636107",
        isActive: true,
      },
      {
        subdomain: "0354140787-mobile",
        databaseUrl:
          process.env.EXTERNAL_0354140787 || process.env.DATABASE_0354140787!,
        storeName: "Store 12 - Cửa hàng 0354140787",
        isActive: true,
      },
      {
        subdomain: "0366995540-mobile",
        databaseUrl:
          process.env.EXTERNAL_0366995540 || process.env.DATABASE_0366995540!,
        storeName: "Store 13 - Cửa hàng 0366995540",
        isActive: true,
      },
      {
        subdomain: "5500153691-mobile",
        databaseUrl:
          process.env.EXTERNAL_5500153691 || process.env.DATABASE_5500153691!,
        storeName: "Store 14 - Cửa hàng 5500153691",
        isActive: true,
      },
      {
        subdomain: "4601629329-mobile",
        databaseUrl:
          process.env.EXTERNAL_4601629329 || process.env.DATABASE_4601629329!,
        storeName: "Store 15 - Cửa hàng 4601629329",
        isActive: true,
      },
      {
        subdomain: "2803185369-mobile",
        databaseUrl:
          process.env.EXTERNAL_2803185369 || process.env.DATABASE_2803185369!,
        storeName: "Store 16 - Cửa hàng 2803185369",
        isActive: true,
      },
      {
        subdomain: "0317290403-mobile",
        databaseUrl:
          process.env.EXTERNAL_0317290403 || process.env.DATABASE_0317290403!,
        storeName: "Store 17 - Cửa hàng 0317290403",
        isActive: true,
      },
      {
        subdomain: "8534009211-001-mobile",
        databaseUrl:
          process.env.EXTERNAL_8534009211_001 ||
          process.env.DATABASE_8534009211_001!,
        storeName: "Store 18 - Cửa hàng 8534009211-001",
        isActive: true,
      },
      {
        subdomain: "082166003847-mobile",
        databaseUrl:
          process.env.EXTERNAL_082166003847 ||
          process.env.DATABASE_082166003847!,
        storeName: "Store 19 - Cửa hàng 082166003847",
        isActive: true,
      },
      {
        subdomain: "1201699647-mobile",
        databaseUrl:
          process.env.EXTERNAL_1201699647 || process.env.DATABASE_1201699647!,
        storeName: "Store 20 - Cửa hàng 1201699647",
        isActive: true,
      },
      {
        subdomain: "1201668085-mobile",
        databaseUrl:
          process.env.EXTERNAL_1201668085 || process.env.DATABASE_1201668085!,
        storeName: "Store 21 - Cửa hàng 1201668085",
        isActive: true,
      },
      {
        subdomain: "0107713807-mobile",
        databaseUrl:
          process.env.EXTERNAL_0107713807 || process.env.DATABASE_0107713807!,
        storeName: "Store 22 - Cửa hàng 0107713807",
        isActive: true,
      },
      {
        subdomain: "8143584654001-mobile",
        databaseUrl:
          process.env.EXTERNAL_8143584654001 ||
          process.env.DATABASE_8143584654001!,
        storeName: "Store 23 - Cửa hàng 8143584654001",
        isActive: true,
      },
      // Add more tenants as needed
    ];

    tenantsConfig.forEach((config) => {
      this.tenants.set(config.subdomain, config);
    });
  }

  getTenantBySubdomain(subdomain: string): TenantConfig | null {
    return this.tenants.get(subdomain) || null;
  }

  async getDatabaseConnection(subdomain: string) {
    if (this.dbConnections.has(subdomain)) {
      return this.dbConnections.get(subdomain);
    }

    let tenant = this.getTenantBySubdomain(subdomain);
    if (!tenant) {
      tenant = this.getTenantBySubdomain("demo");
    }

    const pool = new Pool({
      connectionString: tenant.databaseUrl,
      max: 10,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 10000,
      acquireTimeoutMillis: 10000,
      ssl: tenant.databaseUrl?.includes("1.55.212.135")
        ? false // Disable SSL for external server
        : tenant.databaseUrl?.includes("neon")
          ? { rejectUnauthorized: false }
          : undefined,
    });

    const db = drizzle({ client: pool, schema });
    this.dbConnections.set(subdomain, db);

    return db;
  }

  getAllTenants(): TenantConfig[] {
    return Array.from(this.tenants.values());
  }

  addTenant(config: TenantConfig) {
    this.tenants.set(config.subdomain, config);
  }

  removeTenant(subdomain: string) {
    this.tenants.delete(subdomain);
    this.dbConnections.delete(subdomain);
  }

  extractStoreCode(host: string): string | null {
    // Remove port if present
    if (!host) return null;

    // Map specific domains to store codes
    const storeCodeMap: {
      key: string;
      value: string;
    }[] = [
      { key: "https://0108670987-001-mobile.edpos.vn", value: "CH-001" },
      { key: "https://0108670987-002-mobile.edpos.vn", value: "CH-002" },
      { key: "https://0108670987-003-mobile.edpos.vn", value: "CH-003" },
      { key: "https://0108670987-004-mobile.edpos.vn", value: "CH-004" },
      { key: "https://0108670987-005-mobile.edpos.vn", value: "CH-005" },
      { key: "https://0108670987-006-mobile.edpos.vn", value: "CH-006" },
      { key: "https://0108670987-007-mobile.edpos.vn", value: "CH-007" },
      { key: "https://0108670987-008-mobile.edpos.vn", value: "CH-008" },
      { key: "https://0108670987-009-mobile.edpos.vn", value: "CH-009" },
      { key: "https://0108670987-mobile.edpos.vn", value: "CH-010" },
    ];

    // Check for Replit dev environment
    if (host?.includes(".replit.dev")) {
      return ""; // Default store code for Replit dev
    }

    // Check exact domain match
    const findStoreCode = storeCodeMap.find((item) => item.key === host);
    if (findStoreCode) {
      return findStoreCode.value;
    }

    // No store code filtering for other domains
    return null; // Default store code for other domains";
  }
}

export const tenantManager = new TenantManager();
