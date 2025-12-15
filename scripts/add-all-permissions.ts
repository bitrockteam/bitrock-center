import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { Permissions } from "../db";
import { PrismaClient } from "../generated/prisma";

const USER_EMAIL = "davide.ghiotto@bitrock.it";

// Crea un client Prisma diretto per lo script (senza server-only)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const addAllPermissions = async () => {
  try {
    console.log(`🔍 Cercando utente con email: ${USER_EMAIL}...`);

    // Trova l'utente per email
    const user = await db.user.findUnique({
      where: {
        email: USER_EMAIL,
      },
    });

    if (!user) {
      throw new Error(`❌ Utente con email ${USER_EMAIL} non trovato!`);
    }

    console.log(`✅ Utente trovato: ${user.name} (ID: ${user.id})`);

    // Ottieni tutti i permessi disponibili dall'enum
    const allPermissions = Object.values(Permissions) as Permissions[];

    console.log(`📋 Aggiungendo ${allPermissions.length} permessi all'utente...`);

    // Aggiungi tutti i permessi usando upsert (evita duplicati)
    const results = await Promise.all(
      allPermissions.map((permission_id) =>
        db.user_permission.upsert({
          where: {
            user_id_permission_id: {
              user_id: user.id,
              permission_id: permission_id,
            },
          },
          create: {
            user_id: user.id,
            permission_id: permission_id,
          },
          update: {},
          select: { user_id: true, permission_id: true },
        })
      )
    );

    console.log(`✅ ${results.length} permessi aggiunti con successo!`);
    console.log("\n📝 Permessi aggiunti:");
    allPermissions.forEach((permission, index) => {
      console.log(`   ${index + 1}. ${permission}`);
    });

    // Verifica i permessi aggiunti
    const userPermissions = await db.user_permission.findMany({
      where: {
        user_id: user.id,
      },
      select: {
        permission_id: true,
      },
    });

    console.log(`\n✅ Totale permessi per l'utente: ${userPermissions.length}`);
  } catch (error) {
    console.error("❌ Errore durante l'aggiunta dei permessi:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
};

// Esegui lo script
addAllPermissions();
