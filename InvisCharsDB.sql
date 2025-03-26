CREATE TABLE IF NOT EXISTS zeroWidthChars (
  testId INTEGER NOT NULL,
  charCode INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS invisibleChars (
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
CREATE VIEW IF NOT EXISTS zeroWidthCharsStats AS
SELECT zeroWidthChars.charCode,
  COUNT(DISTINCT tests.browserName) AS browserNameCount,
  COUNT(DISTINCT tests.cpuArchitecture) AS cpuArchitectureCount,
  COUNT(DISTINCT tests.deviceModel) AS deviceModelCount,
  COUNT(DISTINCT tests.deviceVendor) AS deviceVendorCount,
  COUNT(DISTINCT tests.engineName) AS engineNameCount,
  COUNT(DISTINCT tests.osName) AS osNameCount,
  COUNT(DISTINCT tests.testId) AS testCount
FROM zeroWidthChars
  INNER JOIN tests ON zeroWidthChars.testId = tests.testId
GROUP BY zeroWidthChars.charCode;
CREATE VIEW IF NOT EXISTS invisibleCharsStats AS
SELECT invisibleChars.charCode,
  COUNT(DISTINCT tests.browserName) AS browserNameCount,
  COUNT(DISTINCT tests.cpuArchitecture) AS cpuArchitectureCount,
  COUNT(DISTINCT tests.deviceModel) AS deviceModelCount,
  COUNT(DISTINCT tests.deviceVendor) AS deviceVendorCount,
  COUNT(DISTINCT tests.engineName) AS engineNameCount,
  COUNT(DISTINCT tests.osName) AS osNameCount,
  COUNT(DISTINCT tests.testId) AS testCount
FROM invisibleChars
  INNER JOIN tests ON invisibleChars.testId = tests.testId
GROUP BY invisibleChars.charCode;