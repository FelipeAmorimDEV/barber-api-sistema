#!/usr/bin/env node

/**
 * Script para migrar do SQLite para PostgreSQL
 * 
 * Uso:
 * 1. Configure a variável DATABASE_URL no .env para PostgreSQL
 * 2. Execute: node scripts/migrate-to-postgres.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Configurações
const SQLITE_DB_PATH = path.join(__dirname, '../prisma/dev.db');
const POSTGRES_URL = process.env.DATABASE_URL;

if (!POSTGRES_URL) {
  console.error('❌ DATABASE_URL não configurada para PostgreSQL');
  process.exit(1);
}

if (!fs.existsSync(SQLITE_DB_PATH)) {
  console.error('❌ Banco SQLite não encontrado:', SQLITE_DB_PATH);
  process.exit(1);
}

async function migrateToPostgres() {
  console.log('🚀 Iniciando migração do SQLite para PostgreSQL...');
  
  // Cliente SQLite (temporário)
  const sqliteClient = new PrismaClient({
    datasources: {
      db: {
        url: `file:${SQLITE_DB_PATH}`
      }
    }
  });

  // Cliente PostgreSQL
  const postgresClient = new PrismaClient({
    datasources: {
      db: {
        url: POSTGRES_URL
      }
    }
  });

  try {
    // 1. Conectar aos bancos
    console.log('📡 Conectando aos bancos de dados...');
    await sqliteClient.$connect();
    await postgresClient.$connect();
    console.log('✅ Conexões estabelecidas');

    // 2. Executar migrações no PostgreSQL
    console.log('🔄 Executando migrações no PostgreSQL...');
    // As migrações serão executadas pelo Prisma

    // 3. Migrar dados
    console.log('📦 Migrando dados...');
    
    // Migrar usuários
    const users = await sqliteClient.user.findMany();
    if (users.length > 0) {
      console.log(`👥 Migrando ${users.length} usuários...`);
      for (const user of users) {
        await postgresClient.user.upsert({
          where: { id: user.id },
          update: user,
          create: user
        });
      }
    }

    // Migrar barbeiros
    const barbers = await sqliteClient.barber.findMany();
    if (barbers.length > 0) {
      console.log(`💇 Migrando ${barbers.length} barbeiros...`);
      for (const barber of barbers) {
        await postgresClient.barber.upsert({
          where: { id: barber.id },
          update: barber,
          create: barber
        });
      }
    }

    // Migrar serviços
    const services = await sqliteClient.service.findMany();
    if (services.length > 0) {
      console.log(`✂️ Migrando ${services.length} serviços...`);
      for (const service of services) {
        await postgresClient.service.upsert({
          where: { id: service.id },
          update: service,
          create: service
        });
      }
    }

    // Migrar agendamentos
    const bookings = await sqliteClient.booking.findMany();
    if (bookings.length > 0) {
      console.log(`📅 Migrando ${bookings.length} agendamentos...`);
      for (const booking of bookings) {
        await postgresClient.booking.upsert({
          where: { id: booking.id },
          update: booking,
          create: booking
        });
      }
    }

    // Migrar avaliações
    const reviews = await sqliteClient.review.findMany();
    if (reviews.length > 0) {
      console.log(`⭐ Migrando ${reviews.length} avaliações...`);
      for (const review of reviews) {
        await postgresClient.review.upsert({
          where: { id: review.id },
          update: review,
          create: review
        });
      }
    }

    console.log('✅ Migração concluída com sucesso!');
    console.log('🎉 Seu banco PostgreSQL está pronto para produção!');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await sqliteClient.$disconnect();
    await postgresClient.$disconnect();
  }
}

// Executar migração
migrateToPostgres();
