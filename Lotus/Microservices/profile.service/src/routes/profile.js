const Router = require('koa-router');
const { USER} = require('../database/models/user');
const { POST } = require('../database/models/post');
const { COMMENT} = require("../database/models/comment");
const router = new Router();
const path = require('path');
const multer = require("koa-multer");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/data/users/posts/images/');
    },
    filename: function (req, file, cb) {
        if (!file.fieldname || !file.originalname) {
            return cb(new Error('Fieldname or originalname is missing'));
        }
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.get('/api/profile/:username', async (ctx) => {
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
        ctx.body = {
            user: user,
            posts: postsWithImageUrls
        };
    } else {
        ctx.status = 404;
        ctx.body = { message: 'User not found' };
    }
});

router.get('/api/profiles', async (ctx) => {
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
});

router.get('/api/profile/:username/:post_id/comments', async (ctx) => {
    const post_id = ctx.params.post_id;
    let comments = await COMMENT.findAll({where: { POST_ID: post_id } });

    if (comments) {
        ctx.body = comments;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'Users not found' };
    }
});

router.get('/api/profile/:username/:post_id', async (ctx) => {
    const username =  ctx.params.username;
    const post_id =  ctx.params.post_id;
    console.log(username)
    console.log(post_id)
    const post = await POST.findByPk(post_id);
    if (post) {
        ctx.body = post;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'Posts not found' };
    }
});

router.get('/api/profile/:username/posts', async (ctx) => {
    const username =  ctx.params.username;
    const user = await USER.findOne({where: { USERNAME: username }});
    const posts = await POST.findAll({ where: { USER_ID: user.ID } });
    if (posts) {
        ctx.body = posts;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'Posts not found' };
    }
});



router.post('/api/profile/:username/:postid/comments/create', async (ctx) => {
    const username =  ctx.params.username;
    const post_id =  ctx.params.postid;
    const { user_id, comment_username, comment_text, picture } = ctx.request.body;


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
        console.log(error.message);
        ctx.status = 500;
        ctx.body = { message: 'Something went wrong' };
    }
});


router.post('/api/profile/posts/create', upload.single('image'), async (ctx) => {
    const { user_id, title, content } = ctx.req.body;

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
});


router.put('/api/profile/image', upload.single('image'), async (ctx) => {
    const { user_id } = ctx.req.body;

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
});

router.delete('/api/profile/posts/delete', async (ctx) => {
    const { id } = ctx.request.body;

    try {
        const post = await POST.findByPk(id);

        if (!post) {
            ctx.status = 404;
            ctx.body = { error: 'Post not found' };
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
});

router.delete('/api/profile/:username/:postid/comments/delete', async (ctx) => {
    const { id } = ctx.request.body;

    try {
        const comment = await COMMENT.findByPk(id);

        if (!comment) {
            ctx.status = 404;
            ctx.body = { error: 'Comment not found' };
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
});


module.exports = router;
