const corsOptions = {
    origin: ['http://localhost:5172', 'https://test-deploy--test-blog-deploy-memoirs.netlify.app'],
    methods: 'GET,HEAD,PUT,POST,DELETE',
    optionsSuccessStatus: 200
}

export default corsOptions