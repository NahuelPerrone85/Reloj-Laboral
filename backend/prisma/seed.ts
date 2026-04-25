import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const company = await prisma.company.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Demo Empresa S.L.',
    },
  });
  console.log('✅ Company created:', company.name);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: hashedPassword,
      name: 'Admin Demo',
      role: 'ADMIN',
      companyId: company.id,
    },
  });
  console.log('✅ Admin created:', admin.email);

  const employee = await prisma.user.upsert({
    where: { email: 'empleado@demo.com' },
    update: {},
    create: {
      email: 'empleado@demo.com',
      password: hashedPassword,
      name: 'Juan Pérez',
      role: 'EMPLOYEE',
      companyId: company.id,
    },
  });
  console.log('✅ Employee created:', employee.email);

  await prisma.schedule.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      companyId: company.id,
      name: 'Horario General',
      type: 'FLEXIBLE',
      startTime: '09:00',
      endTime: '18:00',
      flexStart: '08:00',
      flexEnd: '10:00',
      workingDays: [1, 2, 3, 4, 5],
    },
  });
  console.log('✅ Schedule created: Horario General');

  const project = await prisma.project.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      companyId: company.id,
      name: 'Proyecto Demo',
      description: 'Proyecto de demostración',
      color: '#3B82F6',
      active: true,
    },
  });
  console.log('✅ Project created:', project.name);

  console.log('\n📧 Logincredentials:');
  console.log('   Admin: admin@demo.com / password123');
  console.log('   Employee: empleado@demo.com / password123');
  console.log('\n✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });