#!/bin/bash

# Script de deploy para produção com PostgreSQL
# Uso: ./scripts/deploy-production.sh

set -e

echo "🚀 Iniciando deploy para produção..."

# Verificar se DATABASE_URL está configurada
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL não configurada!"
    echo "Configure a variável de ambiente DATABASE_URL com a URL do PostgreSQL"
    exit 1
fi

# Verificar se é uma URL PostgreSQL
if [[ ! "$DATABASE_URL" == postgresql* ]]; then
    echo "❌ DATABASE_URL deve ser uma URL PostgreSQL!"
    echo "Exemplo: postgresql://user:pass@host:port/database"
    exit 1
fi

echo "✅ DATABASE_URL configurada corretamente"

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --only=production

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

# Executar migrações
echo "🔄 Executando migrações do banco..."
npx prisma migrate deploy

# Build da aplicação
echo "🏗️ Fazendo build da aplicação..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
    echo "❌ Build falhou! Diretório dist não encontrado."
    exit 1
fi

echo "✅ Build concluído com sucesso!"

# Iniciar aplicação
echo "🚀 Iniciando aplicação..."
npm run start:prod
