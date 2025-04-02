# tarefa_02_ESC
 
💡 Atividade: Sistema de Encurtador de URL com Redis
🎯 Objetivo:
Desenvolver um sistema de encurtamento de URLs, onde o Redis é usado como banco principal para armazenar as URLs originais e seus códigos encurtados, aproveitando a velocidade do Redis para redirecionamentos rápidos.

🧱 Descrição da Atividade:
Você deve criar uma aplicação web (ou CLI) que:

Receba uma URL original e gere um código encurtado.

Armazene no Redis o mapeamento codigo_encurtado => url_original.

Ao acessar a URL encurtada, o sistema consulta o Redis e redireciona o usuário para a URL original.

Armazene estatísticas como número de acessos por URL usando INCR.

🔧 Requisitos Técnicos:
Armazenamento com Redis:

Utilize comandos como SET, GET, EXISTS, INCR, EXPIRE, HSET, etc.

Expiração (opcional):

Permitir que o usuário defina por quanto tempo a URL encurtada ficará válida (EXPIRE).

Estatísticas (bônus):

Quantas vezes a URL encurtada foi acessada (INCR).

Quais os códigos mais acessados (ZINCRBY com Sorted Sets, opcional).

🔄 Fluxo Esperado:
POST /encurtar

Entrada: https://example.com/minha-url-longaaaa

Saída: https://seudominio.com/abc123

GET /abc123

Redis procura o código abc123

Redireciona para https://example.com/minha-url-longaaaa

GET /stats/abc123

Retorna: { "acessos": 12, "url": "https://example.com/minha-url-longaaaa" }

* Criar a documentação do que foi feito.
* Pode utilizar qualquer linguagem para facilitar a programação.
* Subir online a aplicação.