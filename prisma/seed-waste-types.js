import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const wasteList = [
  "A.B.B",
  "A.G.B",
  "ALE-ALE",
  "ALUMINIUM",
  "BESI",
  "BONCOS",
  "DUPLEK",
  "EMBERAN",
  "KABIN",
  "KALENG",
  "KARDUS/BOX",
  "KERTAS",
  "PLASTIK",
  "RONGSOK",
  "TEMBERA",
  "KUNINGAN",
  "PC/PLAT",
  "KORAN",
  "PUTIHAN",
  "BODONG",
  "MN",
  "PARALON",
  "AQUA GELAS",
  "BOTOL",
  "GALON",
  "TUTUP BOTOL",
  "MAINAN",
  "SWL/KERTAS PUTIH",
  "POKARI",
  "KERTAS CINCANG",
  "GABRUK",
  "OLI",
];

async function main() {
  console.log(`Seeding waste types: ${wasteList.length} items`);

  for (const name of wasteList) {
    // Upsert by name to avoid duplicates
    await prisma.waste_types
      .upsert({
        where: { name },
        update: {},
        create: { name },
      })
      .catch((err) => {
        console.error("Failed to upsert waste type", name, err.message);
      });
  }

  console.log("Done seeding waste types");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
