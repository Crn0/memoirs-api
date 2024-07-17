import Post from '../models/postSchema.mjs';
import APIError from '../helpers/errors/apiError.mjs';
import httpStatusCode from '../constants/httpStatusCode.mjs';

const isAdminOrPostAuthor = async (req, res, next) => {
    const { user } = req;
    const { postId } = req.params;

    if ('Admin' === user.membership) {
        next();

        return;
    }

    const post = await Post.findById(postId);

    if (post === null) {
        next(
            new APIError(
                'Post does not exist',
                'NOT FOUND',
                'RESOURCE ERROR',
                httpStatusCode.NOT_FOUND
            )
        );
        return;
    }

    if (post.author.toString() === user._id) {
        next();
        return;
    }

    const error = new APIError(
        'You are not the author; you are not authorized to access this protected resource',
        'Unauthorize Access',
        'AuthorizationError',
        httpStatusCode.UNAUTHORIZED
    );

    next(error);
};

export default isAdminOrPostAuthor;
