const Router = require('koa-router');
const { USER } = require('../database/models/user');
const { POST } = require('../database/models/post');
const { COMMENT } = require("../database/models/comment");
const path = require('path');
const multer = require("koa-multer");
const koaJwt = require("koa-jwt");
const {SUBSCRIPTION} = require("../database/models/subscription");

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

const storage = multer.diskStorage({
    destination: './src/data/users/posts/images/',
    filename: (req, file, cb) => {
        if (!file.fieldname || !file.originalname) {
            return cb(new Error('Fieldname or originalname is missing'));
        }
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

const router = new Router();

async function createPost(ctx) {
    const { user_id, title, content } = ctx.req.body;

    if (ctx.state.user.user_id !== user_id) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized: You can only update your own information' };
        return;
    }

    if (!ctx.req.file) {
        ctx.status = 400;
        ctx.body = { error: 'File not uploaded' };
        return;
    }

    try {
        const post = await POST.create({
            USER_ID: user_id,
            TITLE: title,
            CONTENT: content,
            IMAGE: ctx.req.file.filename
        });

        ctx.status = 201;
        ctx.body = { message: 'Post created successfully', post };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}
async function updateProfileImage(ctx) {
    const user_id = ctx.state.user.user_id;

    if (!ctx.req.file) {
        ctx.status = 400;
        ctx.body = { error: 'File not uploaded' };
        return;
    }
    const image = ctx.req.file.filename;
    try {
        const user = await USER.findByPk(user_id);
        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }
        user.PROFILE_PICTURE = image;
        await user.save();

        ctx.status = 200;
        ctx.body = { message: 'Profile picture updated successfully', user };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {error: 'Something went wrong'};
    }
}
async function updatePost(ctx) {
    const { title, content } = ctx.req.body;
    const { id } = ctx.params;

    if (!ctx.req.file && !title && !content) {
        ctx.status = 400;
        ctx.body = { error: 'No update data provided' };
        return;
    }

    try {
        const post = await POST.findByPk(id);

        if (!post) {
            ctx.status = 404;
            ctx.body = { error: 'Post not found' };
            return;
        }

        if (ctx.state.user.user_id !== post.USER_ID) {
            ctx.status = 401;
            ctx.body = { error: 'Unauthorized: You can only update your own information' };
            return;
        }

        const updatedData = {
            TITLE: title || post.TITLE,
            CONTENT: content || post.CONTENT,
            IMAGE: ctx.req.file ? ctx.req.file.filename : post.IMAGE
        };

        await post.update(updatedData);

        ctx.status = 200;
        ctx.body = { message: 'Post updated successfully', post: updatedData };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}
async function getProfile(ctx) {

    const currentUserId = ctx.state.user.user_id || null;
    const username = ctx.params.username;
    const user = await USER.findOne({ where: { USERNAME: username } });

    if (user) {
        const posts = await POST.findAll({ where: { USER_ID: user.ID } });
        const postsWithImageUrls = posts.map(post => {
            return {
                ...post.get({ plain: true }),
                IMAGE: post.IMAGE ? `https://localhost:31903/${post.IMAGE}` : null
            };
        });
        user.PROFILE_PICTURE = user.PROFILE_PICTURE ? `https://localhost:31903/${user.PROFILE_PICTURE}` : null;

            let isCurrentUserSubscribedToProfileUser = false;
        if (currentUserId !== "null") {
            const subscription = await SUBSCRIPTION.findOne({
                where: {
                    SUBSCRIBER_ID: currentUserId,
                    SUBSCRIBED_TO_ID: user.ID
                }
            });
            isCurrentUserSubscribedToProfileUser = subscription !== null;
        }

        ctx.body = {
            user: user,
            posts: postsWithImageUrls,
            isCurrentUserSubscribedToProfileUser: isCurrentUserSubscribedToProfileUser
        };
    } else {
        ctx.status = 404;
        ctx.body = { message: 'User not found' };
    }
}

async function getProfiles(ctx) {
    let users = await USER.findAll();

    if (users) {
        users = users.map(user => {
            return {
                ...user.get({ plain: true }),
                PROFILE_PICTURE: user.PROFILE_PICTURE ? `https://localhost:31903/${user.PROFILE_PICTURE}` : null
            };
        });
        ctx.body = users;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'Users not found' };
    }
}
async function getComments(ctx) {
    const post_id = ctx.params.post_id;
    let comments = await COMMENT.findAll({where: { POST_ID: post_id } });

    if (comments) {
        ctx.body = comments;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'Users not found' };
    }
}
async function getPost(ctx) {
    const username =  ctx.params.username;
    const post_id =  ctx.params.post_id;
    const post = await POST.findByPk(post_id);
    if (post) {
        ctx.body = post;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'Posts not found' };
    }
}
async function getPosts(ctx) {
    const username =  ctx.params.username;
    const user = await USER.findOne({where: { USERNAME: username }});
    const posts = await POST.findAll({ where: { USER_ID: user.ID } });
    if (posts) {
        ctx.body = posts;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'Posts not found' };
    }
}
async function createComment(ctx) {
    const username =  ctx.params.username;
    const post_id =  ctx.params.post_id;
    const { user_id, comment_username, comment_text, picture } = ctx.request.body;

    if (ctx.state.user.user_id !== user_id) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized: You can only update your own information' };
        return;
    }

    try {
        const comment = await COMMENT.create({
            USER_ID: user_id,
            USERNAME: comment_username,
            COMMENT: comment_text,
            POST_ID: post_id,
            USER_PICTURE: picture
        });

        ctx.status = 201;
        ctx.body = { message: 'Comment created successfully', comment };
    } catch (error) {
        console.error(error.message);
        ctx.status = 500;
        ctx.body = { message: 'Something went wrong' };
    }
}
async function deletePost(ctx) {
    const { id } = ctx.query.post_id;

    try {
        const post = await POST.findByPk(id);

        if (!post) {
            ctx.status = 404;
            ctx.body = { error: 'Post not found' };
            return;
        }

        if (ctx.state.user.user_id !== post.USER_ID) {
            ctx.status = 401;
            ctx.body = { error: 'Unauthorized: You can only update your own information' };
            return;
        }

        await post.destroy();

        ctx.status = 200;
        ctx.body = { message: 'Post deleted successfully' };
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}

async function deleteComment(ctx) {
    const postId = ctx.params.post_id;
    const commentId = ctx.params.comment_id;
    const currentUserId = ctx.state.user.user_id; // Идентификатор текущего пользователя из токена

    try {
        const comment = await COMMENT.findByPk(commentId);
        if (!comment) {
            ctx.status = 404;
            ctx.body = { error: 'Comment not found' };
            return;
        }

        // Находим пост, чтобы проверить, является ли текущий пользователь его создателем
        const post = await POST.findByPk(postId);
        if (!post) {
            ctx.status = 404;
            ctx.body = { error: 'Post not found' };
            return;
        }

        // Проверяем, что текущий пользователь является автором комментария или создателем поста
        if (comment.USER_ID !== currentUserId && post.USER_ID !== currentUserId) {
            ctx.status = 403;
            ctx.body = { error: 'You are not authorized to delete this comment' };
            return;
        }

        await comment.destroy();
        ctx.status = 200;
        ctx.body = { message: 'Comment deleted successfully' };
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = { error: 'Something went wrong' };
    }
}


router.get('/api/profiles', getProfiles);
router.get('/api/profile/:username', koaJwt({ secret: SECRET_KEY }), getProfile);
router.get('/api/profile/:username/posts', getPosts);
router.get('/api/profile/:username/:post_id', getPost);
router.get('/api/profile/:username/:post_id/comments', getComments);
router.post('/api/profile/:username/:post_id/comment', koaJwt({ secret: SECRET_KEY }), createComment);
router.post('/api/profile/post', upload.single('image'), koaJwt({ secret: SECRET_KEY }), createPost);
router.put('/api/profile/:username/:post_id', upload.single('image'), koaJwt({ secret: SECRET_KEY }), updatePost);
router.put('/api/profile/image', upload.single('image'), koaJwt({ secret: SECRET_KEY }), updateProfileImage);
router.delete('/api/profile/:username/:post_id', koaJwt({ secret: SECRET_KEY }), deletePost);
router.delete('/api/profile/:username/:post_id/comment/:comment_id', koaJwt({ secret: SECRET_KEY }), deleteComment);

module.exports = router;
