# Sistema de Gestão de Barbearia

Sistema MVC completo para gestão de barbearia construído com NestJS, Prisma e SQLite.

## 🚀 Funcionalidades

### 👥 Gestão de Usuários
- **Cadastro** com diferentes roles (CLIENT, BARBER, ADMIN)
- **Autenticação** com hash de senha seguro
- **Validação** de email único

### 🧑‍💼 Gestão de Clientes
- **Perfil completo** com telefone e data de nascimento
- **Histórico de agendamentos**
- **Sistema de avaliações**

### 💇‍♂️ Gestão de Barbeiros
- **Cadastro** com especialidades
- **Controle de status** (ativo/inativo)
- **Gerenciamento de serviços**

### 🛠️ Gestão de Serviços
- **Criação** com preço e duração
- **Associação** com barbeiros específicos
- **Controle de disponibilidade**

### 📅 Sistema de Agendamentos
- **Reserva de horários** com validação de disponibilidade
- **Verificação de conflitos** automática
- **Validação de horários** de funcionamento (8h às 18h)
- **Horários disponíveis** baseados na duração do serviço
- **Status**: PENDING, CONFIRMED, CANCELLED, COMPLETED

### ⭐ Sistema de Avaliações
- **Avaliação** de 1 a 5 estrelas
- **Comentários** opcionais
- **Cálculo de média** por barbeiro

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **Prisma** - ORM para SQLite
- **Zod** - Validação de dados
- **bcryptjs** - Hash de senhas
- **TypeScript** - Tipagem estática

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🚀 Instalação e Execução

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev
```

### 3. Executar o projeto
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

O servidor estará disponível em `http://localhost:3000`

## 📚 Como Usar

### Testando a API

Use o arquivo `client.http` para testar todos os endpoints. Exemplos:

#### 1. Criar um usuário barbeiro
```http
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@barber.com",
  "password": "123456",
  "role": "BARBER"
}
```

#### 2. Criar perfil de barbeiro
```http
POST http://localhost:3000/barbers
Content-Type: application/json

{
  "userId": "user-id-aqui",
  "phone": "11999999999",
  "specialties": "Corte, Barba, Sobrancelha",
  "isActive": true
}
```

#### 3. Criar um serviço
```http
POST http://localhost:3000/services
Content-Type: application/json

{
  "name": "Corte Masculino",
  "description": "Corte tradicional masculino",
  "duration": 30,
  "price": 25.00,
  "barberId": "barber-id-aqui",
  "isActive": true
}
```

#### 4. Verificar horários disponíveis do barbeiro
```http
POST http://localhost:3000/bookings/available-slots
Content-Type: application/json

{
  "barberId": "barber-id-aqui",
  "serviceId": "service-id-aqui",
  "date": "2024-12-15T00:00:00Z"
}
```

#### 5. Fazer um agendamento
```http
POST http://localhost:3000/bookings
Content-Type: application/json

{
  "clientId": "client-id-aqui",
  "barberId": "barber-id-aqui",
  "serviceId": "service-id-aqui",
  "date": "2024-12-15T10:00:00Z",
  "startTime": "10:00",
  "endTime": "10:30",
  "notes": "Primeira vez"
}
```

## 📖 Endpoints da API

### Usuários (`/users`)
- `POST /users` - Criar usuário
- `GET /users/:id` - Buscar por ID
- `GET /users/email/:email` - Buscar por email
- `PUT /users/:id` - Atualizar
- `DELETE /users/:id` - Deletar

### Clientes (`/clients`)
- `POST /clients` - Criar cliente
- `GET /clients/:id` - Buscar por ID
- `GET /clients/user/:userId` - Buscar por usuário
- `PUT /clients/:id` - Atualizar
- `DELETE /clients/:id` - Deletar

### Barbeiros (`/barbers`)
- `POST /barbers` - Criar barbeiro
- `GET /barbers` - Listar (com filtros)
- `GET /barbers/:id` - Buscar por ID
- `GET /barbers/user/:userId` - Buscar por usuário
- `PUT /barbers/:id` - Atualizar
- `POST /barbers/:id/specialties` - Adicionar especialidade
- `DELETE /barbers/:id/specialties` - Remover especialidade
- `DELETE /barbers/:id` - Deletar

### Serviços (`/services`)
- `POST /services` - Criar serviço
- `GET /services` - Listar (com filtros)
- `GET /services/:id` - Buscar por ID
- `PUT /services/:id` - Atualizar
- `DELETE /services/:id` - Deletar

### Agendamentos (`/bookings`)
- `POST /bookings` - Criar agendamento
- `GET /bookings` - Listar (com filtros)
- `GET /bookings/:id` - Buscar por ID
- `PUT /bookings/:id` - Atualizar
- `POST /bookings/:id/confirm` - Confirmar
- `POST /bookings/:id/cancel` - Cancelar
- `POST /bookings/:id/complete` - Marcar como concluído
- `POST /bookings/check-availability` - Verificar disponibilidade
- `POST /bookings/available-slots` - **NOVO**: Obter horários disponíveis do barbeiro
- `DELETE /bookings/:id` - Deletar

### Avaliações (`/reviews`)
- `POST /reviews` - Criar avaliação
- `GET /reviews` - Listar (com filtros)
- `GET /reviews/:id` - Buscar por ID
- `PUT /reviews/:id` - Atualizar
- `GET /reviews/barber/:barberId/average-rating` - Média de avaliações
- `DELETE /reviews/:id` - Deletar

## 🏗️ Estrutura do Projeto

```
src/
├── core/                    # Camada de domínio base
│   ├── entities/           # Entidades base
│   ├── errors/            # Erros customizados
│   └── repositories/      # Interfaces de repositórios
├── domain/barber/         # Domínio da barbearia
│   ├── entities/          # Entidades de negócio
│   ├── repositories/      # Interfaces dos repositórios
│   └── services/          # Lógica de negócio
└── infra/                 # Camada de infraestrutura
    ├── http/              # Controllers e DTOs
    ├── repositories/      # Implementações Prisma
    └── prisma/           # Configuração do banco
```

## 🕐 Novo: Sistema de Horários Disponíveis

### Como Funciona
O endpoint `POST /bookings/available-slots` retorna todos os horários possíveis para um barbeiro em uma data específica, considerando:

- **Duração do serviço** selecionado
- **Horários já agendados** pelo barbeiro
- **Horário de funcionamento** (8h às 18h)
- **Intervalos de 30 minutos** entre slots

### Exemplo de Resposta
```json
{
  "barberId": "barber-uuid",
  "serviceId": "service-uuid", 
  "date": "2024-12-15T00:00:00.000Z",
  "serviceDuration": 30,
  "availableSlots": [
    {
      "startTime": "08:00",
      "endTime": "08:30",
      "isAvailable": true
    },
    {
      "startTime": "08:30", 
      "endTime": "09:00",
      "isAvailable": false
    },
    {
      "startTime": "09:00",
      "endTime": "09:30", 
      "isAvailable": true
    }
  ]
}
```

### Vantagens
- ✅ **Interface amigável** - Cliente vê apenas horários disponíveis
- ✅ **Flexibilidade** - Diferentes durações de serviço
- ✅ **Eficiência** - Evita conflitos de agendamento
- ✅ **Transparência** - Mostra horários ocupados e disponíveis

## ✅ Validações Implementadas

- ✅ **Email único** para usuários
- ✅ **Validação de horários** (8h às 18h)
- ✅ **Verificação de disponibilidade** de barbeiros
- ✅ **Validação de conflitos** de agendamento
- ✅ **Horários disponíveis** baseados na duração do serviço
- ✅ **Rating de 1 a 5** estrelas
- ✅ **Senhas com hash** seguro
- ✅ **Validação de dados** com Zod

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run start:dev

# Compilar
npm run build

# Executar testes
npm run test

# Linting
npm run lint

# Formatar código
npm run format

# Prisma
npx prisma studio          # Interface visual do banco
npx prisma migrate dev     # Executar migrações
npx prisma generate        # Gerar cliente
```

## 📝 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar middleware de autorização
- [ ] Implementar notificações por email
- [ ] Adicionar testes unitários e de integração
- [ ] Implementar cache com Redis
- [ ] Adicionar documentação com Swagger
- [ ] Interface web com React/Vue

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
