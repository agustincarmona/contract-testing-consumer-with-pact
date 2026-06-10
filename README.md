# Consumer Driven Testing — PoC con Pact

Prueba de concepto de **Consumer Driven Contract Testing** con Pact: un API REST proveedor (`orders-api`) y dos consumidores (`checkout-service`, `shipping-service`) que definen contratos mínimos, publican en un Pact Broker local y el proveedor los verifica.

## Requisitos

- Node.js 20+
- Docker y Docker Compose

## Quick start

```bash
# 1. Levantar Pact Broker
npm run pact:docker:up

# 2. Copiar variables de entorno
cp .env.example .env
# Edita .env: PACT_USE_BROKER=true para verificar contra el broker
#                PACT_USE_BROKER=false para verificar contra pacts locales

# 3. Instalar dependencias con workspaces
npm i

# 4. Generar y publicar contratos (consumidores)
npm run pact:publish

# 5. Verificar contratos (proveedor; usa PACT_USE_BROKER del .env)
npm run pact:test

# 6. Apagar el pact broker
npm run pact:docker:down
```

### Verificación local (sin broker)

Si el broker no está disponible, pon `PACT_USE_BROKER=false` en `.env` y ejecuta:

```bash
npm test
```

Abre [http://localhost:9292](http://localhost:9292) para ver contratos y resultados de verificación en el broker (usuario/contraseña: `pact` / `pact`).

El broker local usa la imagen Docker del [Pact Broker](https://github.com/pact-foundation/pact_broker) oficial.

## Documentación

- [Documentación completa](docs/consumer-driven-testing.md) — metodología, arquitectura, flujo de trabajo y criterios de éxito
- [Pact Broker (GitHub)](https://github.com/pact-foundation/pact_broker) — repositorio oficial del broker
- [orders-api/README.md](orders-api/README.md) — proveedor REST
- [checkout-service/README.md](checkout-service/README.md) — consumidor de checkout
- [shipping-service/README.md](shipping-service/README.md) — consumidor de envíos

## Participantes

| Servicio           | Rol          | Puerto |
| ------------------ | ------------ | ------ |
| `orders-api`       | Proveedor    | 3000   |
| `checkout-service` | Consumidor   | —      |
| `shipping-service` | Consumidor   | —      |
| Pact Broker        | Broker local | 9292   |
