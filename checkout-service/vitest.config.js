module.exports = {
  test: {
    environment: 'node',
    globals: true,
    include: ['test/**/*.test.js'],
    testTimeout: 30000,
    deps: {
      inline: ['@pact-foundation/pact', 'https-proxy-agent', 'agent-base', 'axios'],
    },
    projects: [
			{
				extends: true,
				test: {
					name: "pact",
					include: ["./test/**/*.pact.test.ts"],
				},
			},
		],
  },
};
