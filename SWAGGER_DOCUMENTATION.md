# 📚 Guia de Documentação Swagger - Sistema de Barbearia

## 🎯 Visão Geral

Este guia ensina como documentar completamente a API do sistema de barbearia usando Swagger/OpenAPI com NestJS.

## 📋 Status Atual da Documentação

### ✅ **Já Documentados:**
- **Usuários** (`user.controller.ts`) - Completo
- **Agendamentos** (`booking.controller.ts`) - Completo

### ❌ **Faltam Documentar:**
- **Autenticação** (`auth.controller.ts`)
- **Barbeiros** (`barber.controller.ts`)
- **Clientes** (`client.controller.ts`)
- **Serviços** (`service.controller.ts`)
- **Avaliações** (`review.controller.ts`)
- **Criação de Conta** (`create-account.controller.ts`)

---

## 🛠️ Como Documentar Cada Controller

### 1. **Estrutura Básica de um Controller Documentado**

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags('nome-do-recurso')
@Controller('/endpoint')
export class MeuController {
  
  @Post()
  @ApiOperation({ summary: 'Descrição do que faz' })
  @ApiBody({ type: MeuDtoSwagger })
  @ApiResponse({ status: 201, description: 'Sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Conflito' })
  async create(@Body() body: MeuDto) {
    // implementação
  }
}
```

### 2. **Estrutura de DTOs para Swagger**

```typescript
import { ApiProperty } from '@nestjs/swagger'

export class MeuDtoSwagger {
  @ApiProperty({
    description: 'Descrição do campo',
    example: 'exemplo@email.com',
    format: 'email',
    required: true
  })
  email!: string

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    minLength: 2,
    maxLength: 100
  })
  name!: string
}
```

---

## 📝 Documentação por Controller

### 🔐 **1. Auth Controller** (`auth.controller.ts`)

**Endpoints para documentar:**
- `POST /auth/login` - Login de usuário
- `POST /auth/refresh` - Renovar token

**Exemplo de implementação:**

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'

@ApiTags('autenticação')
@Controller('/auth')
export class AuthController {
  
  @Post('login')
  @ApiOperation({ 
    summary: 'Realizar login',
    description: 'Autentica usuário e retorna token de acesso'
  })
  @ApiBody({ type: LoginDtoSwagger })
  @ApiResponse({ 
    status: 200, 
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            name: { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao@email.com' },
            role: { type: 'string', example: 'CLIENT' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async login(@Body() body: LoginDto) {
    // implementação
  }
}
```

**DTO para Login:**
```typescript
export class LoginDtoSwagger {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@email.com',
    format: 'email'
  })
  email!: string

  @ApiProperty({
    description: 'Senha do usuário',
    example: '123456',
    minLength: 6
  })
  password!: string
}
```

### 👨‍💼 **2. Barber Controller** (`barber.controller.ts`)

**Endpoints para documentar:**
- `POST /barbers` - Criar barbeiro
- `GET /barbers` - Listar barbeiros
- `GET /barbers/:id` - Buscar barbeiro por ID
- `GET /barbers/user/:userId` - Buscar barbeiro por usuário
- `PUT /barbers/:id` - Atualizar barbeiro
- `POST /barbers/:id/specialties` - Adicionar especialidade
- `DELETE /barbers/:id/specialties` - Remover especialidade
- `DELETE /barbers/:id` - Deletar barbeiro

**Exemplo de implementação:**

```typescript
@ApiTags('barbeiros')
@Controller('/barbers')
export class BarberController {
  
  @Post()
  @ApiOperation({ 
    summary: 'Criar novo barbeiro',
    description: 'Cadastra um novo barbeiro no sistema'
  })
  @ApiBody({ type: CreateBarberDtoSwagger })
  @ApiResponse({ 
    status: 201, 
    description: 'Barbeiro criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        barber: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            userId: { type: 'string', example: 'uuid' },
            phone: { type: 'string', example: '11999999999' },
            specialties: { type: 'string', example: 'Corte, Barba' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Usuário já é barbeiro' })
  async create(@Body() body: CreateBarberDto) {
    // implementação
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar barbeiros',
    description: 'Lista barbeiros com paginação e filtros'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Número da página', 
    example: 1,
    type: Number
  })
  @ApiQuery({ 
    name: 'specialty', 
    required: false, 
    description: 'Filtrar por especialidade', 
    example: 'Corte'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de barbeiros',
    schema: {
      type: 'object',
      properties: {
        barbers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'uuid' },
              userId: { type: 'string', example: 'uuid' },
              phone: { type: 'string', example: '11999999999' },
              specialties: { type: 'string', example: 'Corte, Barba' },
              isActive: { type: 'boolean', example: true },
              createdAt: { type: 'string', format: 'date-time' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'uuid' },
                  name: { type: 'string', example: 'João Silva' },
                  email: { type: 'string', example: 'joao@email.com' },
                  avatar: { type: 'string', example: 'https://example.com/avatar.jpg' }
                }
              }
            }
          }
        }
      }
    }
  })
  async findMany(@Query('page') page?: string, @Query('specialty') specialty?: string) {
    // implementação
  }
}
```

### 👥 **3. Client Controller** (`client.controller.ts`)

**Endpoints para documentar:**
- `POST /clients` - Criar cliente
- `GET /clients` - Listar clientes
- `GET /clients/:id` - Buscar cliente por ID
- `GET /clients/user/:userId` - Buscar cliente por usuário
- `PUT /clients/:id` - Atualizar cliente
- `DELETE /clients/:id` - Deletar cliente

### 🛠️ **4. Service Controller** (`service.controller.ts`)

**Endpoints para documentar:**
- `POST /services` - Criar serviço
- `GET /services` - Listar serviços
- `GET /services/:id` - Buscar serviço por ID
- `PUT /services/:id` - Atualizar serviço
- `DELETE /services/:id` - Deletar serviço

### ⭐ **5. Review Controller** (`review.controller.ts`)

**Endpoints para documentar:**
- `POST /reviews` - Criar avaliação
- `GET /reviews` - Listar avaliações
- `GET /reviews/:id` - Buscar avaliação por ID
- `PUT /reviews/:id` - Atualizar avaliação
- `GET /reviews/barber/:barberId/average-rating` - Média de avaliações
- `DELETE /reviews/:id` - Deletar avaliação

### 📝 **6. Create Account Controller** (`create-account.controller.ts`)

**Endpoints para documentar:**
- `POST /create-account` - Criar conta (usuário + cliente/barbeiro)

---

## 🎨 **Padrões de Documentação**

### **1. Tags (@ApiTags)**
```typescript
@ApiTags('nome-do-recurso') // Use nomes em português, minúsculo, com hífen
```

### **2. Operações (@ApiOperation)**
```typescript
@ApiOperation({ 
  summary: 'Ação principal',
  description: 'Descrição detalhada do que o endpoint faz'
})
```

### **3. Respostas (@ApiResponse)**
```typescript
@ApiResponse({ status: 200, description: 'Sucesso' })
@ApiResponse({ status: 201, description: 'Criado com sucesso' })
@ApiResponse({ status: 400, description: 'Dados inválidos' })
@ApiResponse({ status: 401, description: 'Não autorizado' })
@ApiResponse({ status: 403, description: 'Acesso negado' })
@ApiResponse({ status: 404, description: 'Não encontrado' })
@ApiResponse({ status: 409, description: 'Conflito' })
@ApiResponse({ status: 500, description: 'Erro interno' })
```

### **4. Parâmetros (@ApiParam)**
```typescript
@ApiParam({ 
  name: 'id', 
  description: 'ID único do recurso', 
  example: 'uuid',
  type: String
})
```

### **5. Query Parameters (@ApiQuery)**
```typescript
@ApiQuery({ 
  name: 'page', 
  required: false, 
  description: 'Número da página', 
  example: 1,
  type: Number
})
```

### **6. Body (@ApiBody)**
```typescript
@ApiBody({ type: MeuDtoSwagger })
```

### **7. Autenticação (@ApiBearerAuth)**
```typescript
@ApiBearerAuth() // Para endpoints que requerem autenticação
```

---

## 📊 **Exemplos de Schemas Complexos**

### **Resposta de Lista Paginada:**
```typescript
@ApiResponse({ 
  status: 200, 
  description: 'Lista de recursos',
  schema: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: { $ref: '#/components/schemas/MeuRecurso' }
      },
      pagination: {
        type: 'object',
        properties: {
          page: { type: 'number', example: 1 },
          limit: { type: 'number', example: 20 },
          total: { type: 'number', example: 100 },
          totalPages: { type: 'number', example: 5 }
        }
      }
    }
  }
})
```

### **Resposta de Erro:**
```typescript
@ApiResponse({ 
  status: 400, 
  description: 'Dados inválidos',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Dados inválidos' },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: { type: 'string', example: 'email' },
            message: { type: 'string', example: 'Email inválido' }
          }
        }
      }
    }
  }
})
```

---

## 🚀 **Como Implementar**

### **Passo 1: Instalar Dependências**
```bash
npm install @nestjs/swagger swagger-ui-express
```

### **Passo 2: Configurar no main.ts**
```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Sistema de Gestão de Barbearia')
  .setDescription('API completa para gestão de barbearia')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### **Passo 3: Documentar Controller por Controller**
1. Adicione `@ApiTags` no controller
2. Adicione `@ApiOperation` em cada método
3. Adicione `@ApiResponse` para cada status HTTP
4. Crie DTOs Swagger para request/response
5. Adicione `@ApiBearerAuth` se necessário

### **Passo 4: Testar a Documentação**
1. Execute o servidor: `npm run start:dev`
2. Acesse: `http://localhost:3000/api/docs`
3. Teste os endpoints diretamente no Swagger UI

---

## 📋 **Checklist de Documentação**

### **Para cada Controller:**
- [ ] Adicionar `@ApiTags`
- [ ] Documentar todos os endpoints com `@ApiOperation`
- [ ] Adicionar `@ApiResponse` para todos os status HTTP possíveis
- [ ] Criar DTOs Swagger para request/response
- [ ] Adicionar `@ApiBearerAuth` em endpoints protegidos
- [ ] Adicionar `@ApiQuery` para parâmetros de query
- [ ] Adicionar `@ApiParam` para parâmetros de rota
- [ ] Adicionar `@ApiBody` para corpo da requisição

### **Para cada DTO:**
- [ ] Criar classe `MeuDtoSwagger`
- [ ] Adicionar `@ApiProperty` em cada campo
- [ ] Incluir `description`, `example`, `type`, `format`
- [ ] Adicionar validações como `minLength`, `maxLength`, `required`

---

## 🎯 **Próximos Passos**

1. **Comece pelo Auth Controller** - é o mais importante
2. **Documente Barber Controller** - tem muitos endpoints
3. **Continue com os demais** em ordem de prioridade
4. **Teste cada documentação** no Swagger UI
5. **Revise e melhore** conforme necessário

---

## 📚 **Recursos Úteis**

- [Documentação Oficial NestJS Swagger](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

---

**💡 Dica:** Sempre teste a documentação no Swagger UI após implementar para garantir que está funcionando corretamente!
