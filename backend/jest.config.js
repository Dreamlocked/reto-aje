const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true, // Esto es lo que SonarQube necesita
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'], // 'lcov' es el formato que lee SonarQube
};