import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { useExpressServer } from 'routing-controllers';
import { ProblemDetailsMiddleware, ClientController } from './presentation';
import { DbContext, startOutboxWorker } from './infrastructure';
import { swaggerSchemas } from "./presentation/swagger/schemas";
import cors from 'cors';

const app = express();

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'AJE Clients API', version: '1.0.0' },
        components: {
            schemas: swaggerSchemas
        }
    },
    apis: ['./src/**/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(cors({
    origin: 'http://localhost:4000'
}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

useExpressServer(app, {
    controllers: [ClientController],
    defaultErrorHandler: false
});

app.use(ProblemDetailsMiddleware);

const PORT = process.env.PORT || 3000;

DbContext.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Backend corriendo en puerto ${PORT}`);
        console.log(`Swagger en http://localhost:${PORT}/api-docs`);
        startOutboxWorker();
    });
}).catch((error) => {
    console.error('Error inicializando la app:', error);
    process.exit(1);
});