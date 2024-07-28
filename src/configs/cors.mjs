const corsOptions = {
    origin: ['localhost:5173', 'https://test-deploy--test-blog-deploy-memoirs.netlify.app'],
    methods: 'GET,HEAD,PUT,POST,DELETE',
    optionsSuccessStatus: 200
}

export default corsOptions