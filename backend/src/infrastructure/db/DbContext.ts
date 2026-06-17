import { Sequelize, DataTypes } from 'sequelize';

export const DbContext = new Sequelize('sqlite::memory:'); // Usa Postgres/MySQL en prod

export const ClientModel = DbContext.define('Client', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    codigo: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
    },
    retoolId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nombres: DataTypes.STRING,
    email: DataTypes.STRING,
    telefono: DataTypes.STRING,
    estado: DataTypes.INTEGER
});

export const OutboxModel = DbContext.define('Outbox', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    aggregateType: DataTypes.STRING,
    aggregateId: DataTypes.STRING,
    type: DataTypes.STRING,
    payload: DataTypes.JSON,
    processed: { type: DataTypes.BOOLEAN, defaultValue: false },
    retries: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastError: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});