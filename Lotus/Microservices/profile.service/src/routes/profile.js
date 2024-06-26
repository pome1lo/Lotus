const Router = require('koa-router');
const { USER } = require('../database/models/user');
const { POST } = require('../database/models/post');
const { COMMENT } = require("../database/models/comment");
const path = require('path');
const multer = require("koa-multer");
const koaJwt = require("koa-jwt");
const {SUBSCRIPTION} = require("../database/models/subscription");
const {sendToQueue} = require("../services/RabbitMQ/sendToQueue");

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
    if (ctx.state.user.user_id !== parseInt(user_id)) {
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
            USER_ID: ctx.state.user.user_id,
            TITLE: title,
            CONTENT: content,
            IMAGE: ctx.req.file.filename
        });

        // Получаем всех подписчиков автора поста
        const author = await USER.findByPk(ctx.state.user.user_id, {
            include: {
                model: USER,
                as: 'Subscribers',
                through: { attributes: [] }  // исключаем данные о подписке
            }
        });

        // Отправляем сообщение в очередь для каждого подписчика
        author.Subscribers.forEach(subscriber => {
            sendToQueue('UserNotificationQueue', {
                AUTHOR: author.USERNAME,
                USER_ID: subscriber.ID,
                CONTENT: `New post from ${author.USERNAME}: ${title}`,
                IMAGE: author.PROFILE_PICTURE
            });
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
    const post_id = ctx.params.post_id;

    // if (ctx.state.user.user_id !== parseInt(user_id)) {
    //     ctx.status = 401;
    //     ctx.body = { error: 'Unauthorized: You can only update your own information' };
    //     return;
    // }

    if (!ctx.req.file || !title || !content) {
        ctx.status = 400;
        ctx.body = { message: 'No update data provided' };
        return;
    }

    try {
        const post = await POST.findByPk(post_id);

        if (!post) {
            ctx.status = 404;
            ctx.body = { message: 'Post not found' };
            return;
        }

        if (ctx.state.user.user_id !== post.USER_ID) {
            ctx.status = 401;
            ctx.body = { message: 'Unauthorized: You can only update your own information' };
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
        ctx.body = { message: 'Something went wrong' };
    }
}
async function getCurrentProfile(ctx) {
    const currentUserId = ctx.state.user.user_id;
    const username = ctx.state.user.username;
    const user = await USER.findOne({ where: { USERNAME: username }});

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
async function getProfile(ctx) {
    const currentUserId = ctx.state.user.user_id;
    const username = ctx.params.username;
    const user = await USER.findOne({ where: { USERNAME: username }});

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
        ctx.status = 200;
        ctx.body = {comments: comments};
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
    const { comment_text, picture, com_username } = ctx.request.body;
    const user_id = ctx.state.user.user_id;
    try {
        const comment = await COMMENT.create({
            USER_ID: user_id,
            USERNAME: com_username,
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
    try {
        const post_id = ctx.params.post_id;
        const post = await POST.findByPk(post_id);

        if (!post) {
            ctx.status = 404;
            ctx.body = { message: 'Post not found' };
            return;
        }

        if (ctx.state.user.user_id !== post.USER_ID) {
            ctx.status = 401;
            ctx.body = { message: 'Unauthorized: You can only delete your own posts' };
            return;
        }

        await COMMENT.destroy({ where: { POST_ID: post_id } });

        await post.destroy();

        ctx.status = 200;
        ctx.body = { message: 'Post and all related comments deleted successfully' };
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = { message: 'Something went wrong' };
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
            ctx.body = { message: 'Comment not found' };
            return;
        }

        // Находим пост, чтобы проверить, является ли текущий пользователь его создателем
        const post = await POST.findByPk(postId);
        if (!post) {
            ctx.status = 404;
            ctx.body = { message: 'Post not found' };
            return;
        }

        // Проверяем, что текущий пользователь является автором комментария или создателем поста
        if (comment.USER_ID !== currentUserId && post.USER_ID !== currentUserId) {
            ctx.status = 403;
            ctx.body = { message: 'You are not authorized to delete this comment' };
            return;
        }

        await comment.destroy();
        ctx.status = 200;
        ctx.body = { message: 'Comment deleted successfully' };
    } catch (error) {
        console.log(error.message);
        ctx.status = 500;
        ctx.body = { message: 'Something went wrong' };
    }
}

const PREFIX = "/api/profile/";

router.get(PREFIX + 'profiles', getProfiles);
router.get(PREFIX + ':username', koaJwt({ secret: SECRET_KEY }), getProfile);
router.get(PREFIX, '', koaJwt({ secret: SECRET_KEY }), getCurrentProfile);
router.get(PREFIX + ':username/posts', getPosts);
router.get(PREFIX + ':username/:post_id', getPost);
router.get(PREFIX + ':username/:post_id/comments', getComments);
router.post(PREFIX + ':username/:post_id/comment', koaJwt({ secret: SECRET_KEY }), createComment);
router.put(PREFIX + 'image', upload.single('image'), koaJwt({ secret: SECRET_KEY }), updateProfileImage);
router.delete(PREFIX + ':username/:post_id/comment/:comment_id', koaJwt({ secret: SECRET_KEY }), deleteComment);

router.post(PREFIX + 'post', upload.single('image'), koaJwt({ secret: SECRET_KEY }), createPost);
router.put(PREFIX + 'post/:post_id', upload.single('image'), koaJwt({ secret: SECRET_KEY }), updatePost);
router.delete(PREFIX + 'post/:post_id', koaJwt({ secret: SECRET_KEY }), deletePost);


module.exports = router;
