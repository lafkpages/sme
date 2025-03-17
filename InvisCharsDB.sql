CREATE TABLE IF NOT EXISTS chars (
  testId INTEGER NOT NULL,
  charCode INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS tests (
  testId INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp INTEGER NOT NULL,
  browserName TEXT,
  cpuArchitecture TEXT,
  deviceModel TEXT,
  deviceVendor TEXT,
  engineName TEXT,
  osName TEXT,
  userAgent TEXT NOT NULL
);
CREATE VIEW IF NOT EXISTS character_availability AS
SELECT chars.charCode,
  COUNT(DISTINCT tests.browserName) AS browsersCount,
  COUNT(DISTINCT tests.osName) AS osCount,
  COUNT(DISTINCT tests.deviceModel) AS devicesCount,
  COUNT(DISTINCT tests.testId) AS totalTests
FROM chars
  INNER JOIN tests ON chars.testId = tests.testId
GROUP BY chars.charCode;