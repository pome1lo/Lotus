const Router = require('koa-router');
const { USER} = require('../database/models/user');
const { POST } = require('../database/models/post');
const router = new Router();
const path = require('path');
const serve = require('koa-static');
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
    const users = await USER.findAll();

    if (users) {
        ctx.body = users;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'Users not found' };
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



module.exports = router;
