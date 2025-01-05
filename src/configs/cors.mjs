import 'dotenv/config'

const origins = ['http://localhost:5173', process.env.FRONTEND_VIEWER, process.env.FRONTEND_CMS];

if (process.env.NODE_ENV !== 'development') {
    origins.shift();
}

const corsOptions = {
    origin: origins,
    methods: 'GET,HEAD,PUT,POST,DELETE',
    optionsSuccessStatus: 200
}

export default corsOptions