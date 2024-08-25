import 'dotenv/config'

const corsOptions = {
    origin: ['http://localhost:5173', process.env.FRONTEND_VIEWER, process.env.FRONTEND_CMS],
    methods: 'GET,HEAD,PUT,POST,DELETE',
    optionsSuccessStatus: 200
}

export default corsOptions