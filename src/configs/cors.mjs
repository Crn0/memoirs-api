const corsOptions = {
    origin: ['http://localhost:5173', 'https://test-blog-deploy-memoirs.netlify.app'],
    methods: 'GET,HEAD,PUT,POST,DELETE',
    optionsSuccessStatus: 200
}

export default corsOptions