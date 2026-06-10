module.exports = {
  test: {
    environment: 'node',
    globals: true,
    include: ['test/**/*.test.js'],
    testTimeout: 120000,
    setupFiles: ['./test/setupEnv.js'],
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
