const path = require('path');
const { Verifier } = require('@pact-foundation/pact');
const { createApp } = require('../src/app');
const store = require('../src/store');
const { version: providerVersion } = require('../package.json');

const PORT = 3000;
const PROVIDER = 'orders-api';

const stateHandlers = {
  'an order with id 1 exists': async () => {
    store.reset();
    store.seedOrder();
  },
  'order 1 does not exist': async () => {
    store.reset();
  },
};

function buildVerifierOptions() {
  const baseOptions = {
    provider: PROVIDER,
    providerBaseUrl: `http://localhost:${PORT}`,
    providerStatesSetupUrl: `http://localhost:${PORT}/setup`,
    stateHandlers,
  };

  if (process.env.PACT_USE_BROKER === 'true') {
    return {
      ...baseOptions,
      pactBrokerUrl: process.env.PACT_BROKER_BASE_URL || 'http://localhost:9292',
      pactBrokerUsername: process.env.PACT_BROKER_USERNAME || 'pact',
      pactBrokerPassword: process.env.PACT_BROKER_PASSWORD || 'pact',
      consumerVersionSelectors: [
        { consumer: 'checkout-service', latest: true },
        { consumer: 'shipping-service', latest: true },
      ],
      publishVerificationResult: true,
      providerVersion,
      providerVersionBranch: 'main',
    };
  }

  return {
    ...baseOptions,
    pactUrls: [
      path.resolve(__dirname, '../../checkout-service/pacts/checkout-service-orders-api.json'),
      path.resolve(__dirname, '../../shipping-service/pacts/shipping-service-orders-api.json'),
    ],
  };
}

describe('Orders API Provider Verification', () => {
  let server;

  beforeAll(async () => {
    store.reset();
    store.seedOrder();
    await new Promise((resolve, reject) => {
      server = createApp().listen(PORT, (err) => (err ? reject(err) : resolve()));
    });
  });

  afterAll(async () => {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('validates contracts from all consumers', () =>
    new Verifier(buildVerifierOptions()).verifyProvider());
});
