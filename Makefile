SERVICE_NAME=postgres

# Substitua docker-compose por docker compose se estiver usando a versão mais nova do Docker
DC=docker compose

up:
	$(DC) up -d

down:
	$(DC) down

restart:
	$(DC) down
	$(DC) up -d

logs:
	$(DC) logs -f

build:
	$(DC) build

ps:
	$(DC) ps

exec:
	$(DC) exec $(SERVICE_NAME) sh

shell:
	$(DC) exec $(SERVICE_NAME) /bin/sh

prune:
	docker system prune -f