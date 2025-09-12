#!/usr/bin/env node

/**
 * Script para gerar documentação Swagger automaticamente
 * 
 * Uso: node scripts/generate-swagger-docs.js
 */

const fs = require('fs');
const path = require('path');

// Mapeamento de tipos TypeScript para Swagger
const typeMapping = {
  'string': 'string',
  'number': 'number',
  'boolean': 'boolean',
  'Date': 'string',
  'string[]': 'array',
  'number[]': 'array'
};

// Templates para documentação Swagger
const templates = {
  controller: `import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags('{{tag}}')
@Controller('{{route}}')
export class {{ControllerName}} {
  // ... métodos existentes ...
}`,

  method: `
  @{{method}}('{{route}}')
  @ApiOperation({ 
    summary: '{{summary}}',
    description: '{{description}}'
  })
  @ApiResponse({ status: {{status}}, description: '{{responseDescription}}' })
  async {{methodName}}(@{{paramType}}('{{paramName}}') {{paramName}}: {{paramTypeName}}) {
    // implementação existente
  }`,

  dto: `import { ApiProperty } from '@nestjs/swagger'

export class {{DtoName}}Swagger {
  @ApiProperty({
    description: '{{description}}',
    example: '{{example}}',
    type: '{{type}}',
    {{#required}}required: true{{/required}}
  })
  {{propertyName}}!: {{propertyType}}
}`
};

// Controllers que precisam ser documentados
const controllersToDocument = [
  {
    name: 'AuthController',
    file: 'src/infra/http/controllers/auth.controller.ts',
    tag: 'autenticação',
    route: '/auth',
    methods: [
      {
        name: 'login',
        method: 'Post',
        route: 'login',
        summary: 'Realizar login',
        description: 'Autentica usuário e retorna token de acesso',
        status: 200,
        responseDescription: 'Login realizado com sucesso'
      },
      {
        name: 'refresh',
        method: 'Post',
        route: 'refresh',
        summary: 'Renovar token',
        description: 'Renova o token de acesso usando refresh token',
        status: 200,
        responseDescription: 'Token renovado com sucesso'
      }
    ]
  },
  {
    name: 'BarberController',
    file: 'src/infra/http/controllers/barber.controller.ts',
    tag: 'barbeiros',
    route: '/barbers',
    methods: [
      {
        name: 'create',
        method: 'Post',
        route: '',
        summary: 'Criar novo barbeiro',
        description: 'Cadastra um novo barbeiro no sistema',
        status: 201,
        responseDescription: 'Barbeiro criado com sucesso'
      },
      {
        name: 'findMany',
        method: 'Get',
        route: '',
        summary: 'Listar barbeiros',
        description: 'Lista barbeiros com paginação e filtros',
        status: 200,
        responseDescription: 'Lista de barbeiros encontrados'
      },
      {
        name: 'findById',
        method: 'Get',
        route: ':id',
        summary: 'Buscar barbeiro por ID',
        description: 'Retorna dados completos do barbeiro',
        status: 200,
        responseDescription: 'Barbeiro encontrado com sucesso'
      }
    ]
  },
  {
    name: 'ClientController',
    file: 'src/infra/http/controllers/client.controller.ts',
    tag: 'clientes',
    route: '/clients',
    methods: [
      {
        name: 'create',
        method: 'Post',
        route: '',
        summary: 'Criar novo cliente',
        description: 'Cadastra um novo cliente no sistema',
        status: 201,
        responseDescription: 'Cliente criado com sucesso'
      },
      {
        name: 'findMany',
        method: 'Get',
        route: '',
        summary: 'Listar clientes',
        description: 'Lista clientes com paginação',
        status: 200,
        responseDescription: 'Lista de clientes encontrados'
      }
    ]
  },
  {
    name: 'ServiceController',
    file: 'src/infra/http/controllers/service.controller.ts',
    tag: 'serviços',
    route: '/services',
    methods: [
      {
        name: 'create',
        method: 'Post',
        route: '',
        summary: 'Criar novo serviço',
        description: 'Cadastra um novo serviço na barbearia',
        status: 201,
        responseDescription: 'Serviço criado com sucesso'
      },
      {
        name: 'findMany',
        method: 'Get',
        route: '',
        summary: 'Listar serviços',
        description: 'Lista todos os serviços disponíveis',
        status: 200,
        responseDescription: 'Lista de serviços encontrados'
      }
    ]
  },
  {
    name: 'ReviewController',
    file: 'src/infra/http/controllers/review.controller.ts',
    tag: 'avaliações',
    route: '/reviews',
    methods: [
      {
        name: 'create',
        method: 'Post',
        route: '',
        summary: 'Criar nova avaliação',
        description: 'Avalia um serviço prestado por um barbeiro',
        status: 201,
        responseDescription: 'Avaliação criada com sucesso'
      },
      {
        name: 'findMany',
        method: 'Get',
        route: '',
        summary: 'Listar avaliações',
        description: 'Lista avaliações com filtros',
        status: 200,
        responseDescription: 'Lista de avaliações encontradas'
      }
    ]
  }
];

// Função para gerar documentação de um controller
function generateControllerDocumentation(controller) {
  console.log(`\n📝 Gerando documentação para ${controller.name}...`);
  
  let documentation = `// Documentação Swagger para ${controller.name}\n\n`;
  
  // Adicionar imports
  documentation += `import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'\n\n`;
  
  // Adicionar tag da classe
  documentation += `@ApiTags('${controller.tag}')\n`;
  documentation += `@Controller('${controller.route}')\n`;
  documentation += `export class ${controller.name} {\n\n`;
  
  // Adicionar documentação dos métodos
  controller.methods.forEach(method => {
    documentation += `  @${method.method}('${method.route}')\n`;
    documentation += `  @ApiOperation({ \n`;
    documentation += `    summary: '${method.summary}',\n`;
    documentation += `    description: '${method.description}'\n`;
    documentation += `  })\n`;
    documentation += `  @ApiResponse({ status: ${method.status}, description: '${method.responseDescription}' })\n`;
    
    // Adicionar respostas de erro comuns
    if (method.status === 201) {
      documentation += `  @ApiResponse({ status: 400, description: 'Dados inválidos' })\n`;
      documentation += `  @ApiResponse({ status: 409, description: 'Conflito' }\n`;
    } else if (method.status === 200) {
      documentation += `  @ApiResponse({ status: 404, description: 'Não encontrado' }\n`;
    }
    
    documentation += `  async ${method.name}() {\n`;
    documentation += `    // implementação existente\n`;
    documentation += `  }\n\n`;
  });
  
  documentation += `}\n`;
  
  return documentation;
}

// Função para gerar DTOs Swagger
function generateDtoDocumentation(dtoName, properties) {
  console.log(`\n📝 Gerando DTO Swagger para ${dtoName}...`);
  
  let dto = `import { ApiProperty } from '@nestjs/swagger'\n\n`;
  dto += `export class ${dtoName}Swagger {\n`;
  
  properties.forEach(prop => {
    dto += `  @ApiProperty({\n`;
    dto += `    description: '${prop.description}',\n`;
    dto += `    example: '${prop.example}',\n`;
    dto += `    type: '${prop.type}'`;
    if (prop.required) {
      dto += `,\n    required: true`;
    }
    dto += `\n  })\n`;
    dto += `  ${prop.name}!: ${prop.type}\n\n`;
  });
  
  dto += `}\n`;
  
  return dto;
}

// Função principal
function main() {
  console.log('🚀 Gerando documentação Swagger...\n');
  
  // Gerar documentação para cada controller
  controllersToDocument.forEach(controller => {
    const documentation = generateControllerDocumentation(controller);
    
    // Salvar em arquivo
    const outputPath = path.join(__dirname, '..', `swagger-${controller.name.toLowerCase()}.md`);
    fs.writeFileSync(outputPath, documentation);
    
    console.log(`✅ Documentação salva em: ${outputPath}`);
  });
  
  // Gerar DTOs comuns
  const commonDtos = [
    {
      name: 'LoginDto',
      properties: [
        { name: 'email', type: 'string', description: 'Email do usuário', example: 'joao@email.com', required: true },
        { name: 'password', type: 'string', description: 'Senha do usuário', example: '123456', required: true }
      ]
    },
    {
      name: 'CreateBarberDto',
      properties: [
        { name: 'userId', type: 'string', description: 'ID do usuário', example: 'uuid', required: true },
        { name: 'phone', type: 'string', description: 'Telefone', example: '11999999999', required: true },
        { name: 'specialties', type: 'string', description: 'Especialidades', example: 'Corte, Barba', required: true },
        { name: 'isActive', type: 'boolean', description: 'Status ativo', example: true, required: false }
      ]
    }
  ];
  
  commonDtos.forEach(dto => {
    const dtoDoc = generateDtoDocumentation(dto.name, dto.properties);
    const outputPath = path.join(__dirname, '..', `swagger-${dto.name.toLowerCase()}.ts`);
    fs.writeFileSync(outputPath, dtoDoc);
    
    console.log(`✅ DTO salvo em: ${outputPath}`);
  });
  
  console.log('\n🎉 Documentação Swagger gerada com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Revise os arquivos gerados');
  console.log('2. Copie as anotações para os controllers reais');
  console.log('3. Teste no Swagger UI: http://localhost:3000/api/docs');
}

// Executar script
if (require.main === module) {
  main();
}

module.exports = {
  generateControllerDocumentation,
  generateDtoDocumentation,
  controllersToDocument
};
