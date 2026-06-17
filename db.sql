-- Opcional: limpiar si ya existen
DROP TABLE IF EXISTS "Outboxes";
DROP TABLE IF EXISTS "Clients";

-- Tabla Clients
CREATE TABLE "Clients" (
                           "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                           "codigo" UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
                           "retoolId" INTEGER NULL,
                           "nombres" VARCHAR(255),
                           "email" VARCHAR(255),
                           "telefono" VARCHAR(255),
                           "estado" INTEGER,
                           "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                           "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla Outboxes
CREATE TABLE "Outboxes" (
                            "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                            "aggregateType" VARCHAR(255),
                            "aggregateId" VARCHAR(255),
                            "type" VARCHAR(255),
                            "payload" JSON,
                            "processed" BOOLEAN NOT NULL DEFAULT FALSE,
                            "retries" INTEGER NOT NULL DEFAULT 0,
                            "lastError" TEXT NULL,
                            "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                            "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice útil para el worker de outbox
CREATE INDEX "idx_outboxes_processed_createdAt"
    ON "Outboxes" ("processed", "createdAt");