import { Sequelize, DataTypes } from 'sequelize';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_NAME = process.env.DB_NAME || 'reto_db';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_SSL = process.env.DB_SSL === 'true';

export const DbContext = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: DB_SSL
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
        : undefined
});

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