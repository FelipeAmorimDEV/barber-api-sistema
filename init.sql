-- Script de inicialização do PostgreSQL para o BarberApp
-- Este script é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS public;

-- Configurar timezone
SET timezone = 'America/Sao_Paulo';

-- Comentários para documentação
COMMENT ON DATABASE barberapp IS 'Banco de dados do BarberApp - Sistema de agendamento de barbearia';
