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