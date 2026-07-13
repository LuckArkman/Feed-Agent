const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const contacts = await prisma.contact.findMany();
  console.log("Contacts count:", contacts.length);
  console.log("Active contacts:", contacts.filter(c => c.active).length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
