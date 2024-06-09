module.exports = {
    extension: ".ts",
    include: ["src/**/*"],
    exclude: ["coverage", "**/*.d.ts"],
    require: ["ts-node/register", "source-map-support/register"],
    instrument: true,
    all: false,
    reporter: ["text", "cobertura", "html", "json-summary"],
    tempDirectory: "node_modules/.cache/nyc_output",
    "report-dir": "coverage",
    "check-coverage": true,
    statements: 59,
    branches: 42,
    functions: 51,
    lines: 58,
};
