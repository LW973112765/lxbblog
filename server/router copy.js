const express = require('express')
const router = express.Router()
//导入数据库 db.query('sql',[],res=>{})
const db = require('./mysql')
//图片需要的模块
const multer = require('multer')
const fs = require('fs')
//导入模块 jsonwebtoken   密钥
const jwt = require('jsonwebtoken');
// config.jwtSecert
const config = require('./secert')
//导入mockjs
// const Mock = require('mockjs');

//登录接口
/**
 * 语法：
 * 如60，"2 days"，"10h"，"7d"，Expiration time，过期时间
 *  jwt.sign({},'秘钥','过期时间,{expiresIn:20*1,'1day''1h'}')
 */

/**
 * 登录 login
 * 接受的字段：username,password
 * 测试：postman  
 */


//前台
//用户登录
router.post('/login', (req, res) => {
    let { username, password } = req.body
    // console.log('登录..................', req.body)
    //请求数据库
    let sql = "select * from user where username=? and password=?";
    let arr = [username, password]
    db.query(sql, arr, (err, result) => {
        // console.log('result', result);
        if (result.length > 0) {
            let token = jwt.sign({
                username: result[0].username,
                id: result[0].id
            }, config.jwtSecert, {
                expiresIn: 20 * 1
            })
            res.send({
                status: 200,
                data: token,
                avatar: result[0].avatar,
                email: result[0].email,
                age: result[0].age,
                sex: result[0].sex,
                id: result[0].id,
            })
        } else {
            res.send({
                status: 404,
                msg: '信息错误'
            })
        }

    })
})
/**
 * 用户注册接口 /register
 */
router.post("/register", (req, res) => {
    const user = req.body
    // console.log('注册', req.body);
    const sqlStr = "select * from user where username = ?"
    db.query(sqlStr, user.username, (err, result) => {
        if (err) {
            return res.send({ message: err.message })
        } if (result.length > 0) {
            return res.send({ status: 304, message: "用户名被占用" })
        }
        const sql = 'insert into user set ?'
        db.query(sql, user, (err, result) => {
            if (err) {
                return res.send({ status: 500, message: err.message })
            } if (result.affectedRows > 0) {
                return res.send({ status: 200, message: "注册成功" })
            }
        })
    })
}),
    //根据用户名获取用户信息
    router.get("/userinfo", (req, res) => {
        const { username } = req.query
        // console.log(username);
        const sql = 'select * from user where username=?'
        db.query(sql, username, (err, result) => {
            if (err) {
                return res.send({ status: 500, message: "没有数据" })
            } if (result.length > 0) {
                return res.send({ status: 200, message: "查询成功", data: result[0] })
            }

        })


    })
//更改用户信息
router.post("/edituser", (req, res) => {
    const { id,
        username,
        password,
        email,
        sex,
        age,
        avatar,
        nickname,
        introduction,
        updated_at } = req.body
    // console.log('gggg', req.body);
    //id<>?排除当前要更新的id
    const sqlStr = "select * from user where id<>? and username=?"
    db.query(sqlStr, [id, username], (err, result) => {
        if (err) {
            return res.send({ message: err.message })
        } if (result.length > 0) {
            return res.send({ status: 304, message: "用户名被占用" })
        }

        // if (result.length = 0) {
        //     return res.send({ status: 300, message: "用户名被占用" })
        // }
        // const sql = 'update user set ? where id=?'
        const sql = 'update user set username=?,password=?, email=?, sex=?, age=?,  avatar=?, nickname=?, introduction=?,  updated_at=? where id=?'
        const arr = [username, password, email, sex, age, avatar, nickname, introduction, updated_at, id]
        db.query(sql, arr, (err, result) => {
            if (err) {
                return res.send({ status: 500, message: err.message })
            } if (result.affectedRows > 0 && result.changedRows > 0) {
                return res.send({ status: 200, message: " 编辑成功" })
            }
            if (result.affectedRows > 0 && result.changedRows === 0) {
                return res.send({ status: 520, message: " 未进行任意修改" })
            }
        })
    })

})
//获取图片列表
router.get('/photo', (req, res) => {
    const page = req.query.page || 1;
    console.log(req.query);
    const sqlStr = 'select * from  photo'
    db.query(sqlStr, null, (err, result) => {
        const total = result.length
        const pagesize = 6
        const n = (page - 1) * pagesize
        const sql = `select * from photo order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, null, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                // setTimeout(() => {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
                // }, 2000)
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })
})
//添加文章
router.post('/addarticle', (req, res) => {
    console.log('添加文章', req.body);
    const article = req.body
    console.log(article);
    const sql = 'insert into article set ?'
    db.query(sql, req.body, (err, result) => {
        console.log(result);
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '添加成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "添加失败"
            })
        }
    })
})
//删除文章
router.get("/deletearticle", (req, res) => {
    const id = req.query.id;
    const sql = "delete from article where id=?"
    db.query(sql, id, (err, result) => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: "删除成功"
            })
        } else {
            res.send({
                status: 500,
                msg: "删除失败"
            })
        }
    })
})
//获取文章分类
router.get('/getcategory', (req, res) => {
    const sql = "select * from  category "
    db.query(sql, null, (err, result) => {
        // console.log('结果', result.length);
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })

})
//修改分类
router.post('/updatecategory', (req, res) => {
    // console.log('添加文章', req.body);
    const sqlstr = 'select * from category where name=?'
    db.query(sqlstr, req.body.name, (err, result) => {
        if (err) {
            res.send({ message: err.message })
        }
        if (result.length > 0) {
            return res.send({
                status: 304,
                msg: '类别名已存在'
            })
        }
        const sql = 'update category set ? where id=?'
        db.query(sql, [req.body, req.body.id], (err, result) => {
            console.log(result);
            if (result.affectedRows > 0) {
                res.send({
                    status: 200,
                    msg: '修改成功'
                })
            } else {
                res.send({
                    status: 500,
                    msg: "修改失败"
                })
            }
        })
    })
})
//删除分类
router.post('/deletecategory', (req, res) => {
    const sql = 'delete from category where id=?'
    db.query(sql, req.body.id, (err, result) => {
        console.log(result);
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '删除成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "删除失败"
            })
        }
    })


})
//新增分类
router.post('/addcategory', (req, res) => {
    console.log('新增分类', req.body);
    const sqlstr = 'select * from category where name=?'
    db.query(sqlstr, req.body.name, (err, result) => {
        if (result.length > 0) {
            return res.send({
                status: 304,
                msg: '类别名已存在'
            })
        }
        const sql = 'insert into category set?'
        db.query(sql, req.body, (err, result) => {
            console.log(result);
            if (result.affectedRows > 0) {
                res.send({
                    status: 200,
                    msg: '添加成功'
                })
            } else {
                res.send({
                    status: 500,
                    msg: "添加失败"
                })
            }
        })
    })

})
//获取分类名
router.get('/getcategoryname', (req, res) => {
    const tag = req.query.tag
    // console.log('后台收到', tag);
    const sql = `select name from  category  where id in (${tag})`
    db.query(sql, tag, (err, result) => {
        // console.log('结果', result.length);
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })

})
//根据id获取文章分类
router.get('/getcategoryid', (req, res) => {
    const sql = "select * from  category where id =? "
    console.log(req.query);
    db.query(sql, req.query.id, (err, result) => {
        // console.log('结果', result.length);
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })

})
//获取所有文章浏览量
router.get('/getarticletotal', (req, res) => {
    const page = req.query.page || 1;
    const status = req.query.status
    const sql = 'select * from article where status=?'
    db.query(sql, status, (err, result) => {

        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })

})
//获取所有文章
router.get('/getarticle', (req, res) => {
    const page = req.query.page || 1;
    const status = req.query.status
    // console.log('用户', page);
    const sqlStr = 'select * from article where status=?'
    db.query(sqlStr, status, (err, result) => {
        const total = result.length
        const pagesize = 8
        const n = (page - 1) * pagesize
        const sql = `select * from article where status =? order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, status, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })
})
//获取热门文章
router.get('/gethotlist', (req, res) => {
    const sql = 'select * from article where is_del = 0 and status = 0 and total>300 order by total desc limit 10 '
    db.query(sql, null, (err, result) => {
        // console.log('结果', result.length);
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })

})
//获取上架的文章
router.get('/getarticlehave', (req, res) => {
    const page = req.query.page || 1;
    // console.log('用户', page);
    const sqlStr = 'select * from article where is_del=0 and status=0'
    db.query(sqlStr, null, (err, result) => {
        const total = result.length
        const pagesize = 10
        const n = (page - 1) * pagesize
        const sql = `select * from article where is_del = 0 and status = 0 order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, null, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })
})
//上架下架文章
// router.post('/hiddenarticle', (req, res) => {
//     console.log(req.body);
//     const { id, is_del } = req.body
//     const arr = [is_del, id]
//     const sql = 'update article set is_del=? where id =?'
//     db.query(sql, arr, (err, result) => {
//         if (result.affectedRows > 0) {
//             return res.send({ status: 200, message: " 成功" })
//         }
//         else {
//             return res.send({ status: 500, message: " 失败" })
//         }
//     })
// })
//更新文章
router.post('/updatearticle', (req, res) => {
    console.log(req.body);
    const sql = 'update article set ? where id =?'
    db.query(sql, [req.body, req.body.id], (err, result) => {
        if (result.affectedRows > 0) {
            return res.send({ status: 200, message: " 成功" })
        }
        else {
            return res.send({ status: 500, message: " 失败" })
        }
    })
})
//根据id获取文章
router.get('/getarticleinfo', (req, res) => {
    // console.log(req.query);
    const id = req.query.id
    const sql = "select * from article where id=?"
    db.query(sql, id, (err, result) => {
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })

})
//用户留言
router.post('/postmessage', (req, res) => {
    console.log('发表留言', req.body);
    // const { content, username, avatar, created_at, email } = req.body
    const arr = req.body
    // let arr = [content, username, avatar, created_at, email]
    const sql = 'insert into message set ?'
    db.query(sql, arr, (err, result) => {
        console.log(result);
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '添加成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "添加失败"
            })
        }
    })
})
//修改留言
router.post('/updatemessage', (req, res) => {
    const id = req.body.id
    const sql = 'update message set iscallback = 1 where id =?'
    db.query(sql, id, (err, result) => {
        console.log(result);
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '修改成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "修改失败"
            })
        }
    })
})
//根据用户名获取留言
router.get('/getusermessage', (req, res) => {
    // console.log(req);
    const page = req.query.page || 1;
    const username = req.query.username
    const sqlStr = 'select * from message where username=?'
    db.query(sqlStr, username, (err, result) => {
        // console.log(result);
        const total = result.length
        const pagesize = 7
        const n = (page - 1) * pagesize
        const sql = `select * from message where username=? order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, username, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })


})
//获取留言（分页）
router.get('/getmessage', (req, res) => {
    const page = req.query.page || 1;
    const sqlstr = 'select * from message where pid= "0"'
    db.query(sqlstr, null, (err, result) => {
        const total = result.length
        const pagesize = 10
        const n = (page - 1) * pagesize
        const sql = `select * from message where pid= "0"  order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, null, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                // setTimeout(() => {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
                // }, 2000)
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })



})
//前台获取留言回复
router.get('/getmessageanswer', (req, res) => {
    const page = req.query.page || 1;
    const id = req.query.id
    // console.log('前台获取评论回复', id);
    const pagesize = 6
    const n = (page - 1) * pagesize
    const sql = `SELECT * FROM message WHERE pid in (${id}) limit ${pagesize} offset ${n}`
    db.query(sql, id, (err, result) => {
        // console.log('结果', result.length);
        if (result.length > 0) {
            // setTimeout(() => {
            res.send({
                status: 200,
                data: result,
                pageSize: pagesize,
                total: result.length
            })
            // }, 2000)
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })

})
//删除留言
router.get("/deletemessage", (req, res) => {
    const id = req.query.id;
    const sql = "delete from message where id=? or pid=?"
    db.query(sql, [id, id], (err, result) => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: "删除成功"
            })
        } else {
            res.send({
                status: 500,
                msg: "删除失败"
            })
        }
    })
})
//发表评论
router.post('/postcomment', (req, res) => {
    console.log('发表评论', req.body);
    // const { content, username, avatar, created_at, email } = req.body
    const arr = req.body
    // let arr = [content, username, avatar, created_at, email]
    const sql = 'insert into articlecomment set ?'
    db.query(sql, arr, (err, result) => {
        console.log(result);
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '添加成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "添加失败"
            })
        }
    })
})
//获取所有评论(评论总数)
router.get('/getallcomment', (req, res) => {
    const page = req.query.page || 1;
    const sqlstr = `select * from articlecomment `
    db.query(sqlstr, null, (err, result) => {
        const total = result.length
        const pagesize = 10
        const n = (page - 1) * pagesize
        const sql = `select * from articlecomment  order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, null, (err, result) => {
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })
})

//根据用户名获取评论
router.get('/getusercomment', (req, res) => {
    // console.log(req);
    const page = req.query.page || 1;
    const username = req.query.username
    const sqlStr = 'select * from articlecomment where username=?'
    db.query(sqlStr, username, (err, result) => {
        // console.log(result);
        const total = result.length
        const pagesize = 7
        const n = (page - 1) * pagesize
        const sql = `select * from articlecomment where username=? order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, username, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })


})
//前台获取父级评论
router.get('/getcomment', (req, res) => {
    const page = req.query.page || 1;
    const articleid = req.query.articleid
    const pagesize = 6
    const n = (page - 1) * pagesize
    const sql = `select * from articlecomment where come= "0" and articleid=? and status=1 order by id desc limit ${pagesize} offset ${n} `
    db.query(sql, articleid, (err, result) => {
        // console.log('结果', result.length);
        if (result.length > 0) {
            // setTimeout(() => {
            res.send({
                status: 200,
                data: result,
                pageSize: pagesize,
                total: result.length
            })
            // }, 2000)
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })

})//获取文章评论总数（包括子级评论）
router.get('/getcommenttotal', (req, res) => {
    const articleid = req.query.articleid
    const sql = 'select * from articlecomment where  articleid=? and status=1  '
    db.query(sql, articleid, (err, result) => {
        // console.log('结果', result.length);
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
                total: result.length
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })

})
//前台获取评论回复
router.get('/getcommentanswer', (req, res) => {
    const page = req.query.page || 1;
    const id = req.query.id
    // console.log('前台获取评论回复', id);
    const pagesize = 6
    const n = (page - 1) * pagesize
    const sql = `SELECT * FROM articlecomment WHERE come in (${id}) and status=1 ORDER BY id asc limit ${pagesize} offset ${n}`
    db.query(sql, id, (err, result) => {
        // console.log('结果', result.length);
        if (result.length > 0) {
            // setTimeout(() => {
            res.send({
                status: 200,
                data: result,
                pageSize: pagesize,
                total: result.length
            })
            // }, 2000)
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })

})
//后台获取文章评论
router.get('/getarticlecomment', (req, res) => {
    const page = req.query.page || 1;
    const articleid = req.query.articleid
    const sqlstr = "select * from articlecomment where articleid=?"
    db.query(sqlstr, articleid, (err, result) => {
        const total = result.length
        const pagesize = 10
        const n = (page - 1) * pagesize
        const sql = `select * from articlecomment where articleid=? order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, articleid, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })


})

//修改评论状态
router.post('/editcomment', (req, res) => {
    console.log('修改评论', req.body);
    const sql = 'update articlecomment set ? where id=?'
    db.query(sql, [req.body, req.body.id], (err, result) => {
        console.log(result);
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '修改成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "修改失败"
            })
        }
    })
})
//删除评论
router.get("/deletecomment", (req, res) => {
    const id = req.query.id;
    const sql = "delete from articlecomment where id=? or come =?"
    db.query(sql, [id, id], (err, result) => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: "删除成功"
            })
        } else {
            res.send({
                status: 500,
                msg: "删除失败"
            })
        }
    })
})
//后台
//管理员登录
router.post('/adminlogin', (req, res) => {
    let { adminname, password } = req.body
    console.log(req.body);
    const sql = 'select * from admin where adminname=? and password=?'
    const arr = [adminname, password]
    db.query(sql, arr, (err, result) => {
        if (result.length > 0) {
            let token = jwt.sign({ adminname: result[0].adminname, id: result[0].id },
                config.jwtSecert, {
                expiresIn: 20 * 1
            })
            res.send({
                status: 200,
                data: token,
                avatar: result[0].avatar,
                email: result[0].email,
                id: result[0].id

            })
            console.log(token);
        } else {
            res.send({
                status: 404,
                msg: '信息错误'
            })
        }
    })
})
//管理员修改密码
router.post("/editadminpass", (req, res) => {
    const admin = req.body
    console.log('', req.body);
    const sqlStr = "select password from admin where adminname = ? "
    db.query(sqlStr, admin.adminname, (err, result) => {
        if (result[0].password !== admin.pass) {
            return res.send({ status: 304, message: "原密码错误" })
        }
        if (result[0].password === admin.password) {
            return res.send({ status: 305, message: "新密码不能和原密码一样哦" })
        }
        const sql = 'update admin set password = ? where adminname = ?'
        db.query(sql, [req.body.password, req.body.adminname], (err, result) => {
            console.log(result);
            if (result.affectedRows > 0) {
                return res.send({ status: 200, message: "修改成功" })
            }
            if (err) {
                return res.send({ status: 500, message: err.message })
            }
        })
    })
}),
    /**
     * 分页用户列表：获取分页 {total:'',arr:[{},{},{}],pagesize:8,}
     */
    router.get('/userlist', (req, res) => {
        const page = req.query.page || 1;
        // console.log('用户', page);
        const sqlStr = 'select * from user'
        db.query(sqlStr, null, (err, result) => {
            const total = result.length
            const n = (page - 1) * 8
            const sql = `select * from user order by id desc limit 8 offset ${n} `
            db.query(sql, null, (err, result) => {
                // console.log('结果', result.length);
                if (result.length > 0) {
                    res.send({
                        status: 200,
                        data: result,
                        pageSize: 8,
                        total: total
                    })
                } else {
                    res.send({
                        status: 500,
                        msg: "暂无数据"
                    })
                }
            })
        })


    })

/**
 * 所有用户列表
 */
router.get('/usertotal', (req, res) => {
    const sql = 'select * from user'
    db.query(sql, null, (err, result) => {
        // console.log('结果', result.length);
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
                total: result.length
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })
})
// 删除用户

router.get("/deleteuser", (req, res) => {
    const id = req.query.id;
    const sql = "delete from user where id=?"
    db.query(sql, id, (err, result) => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: "删除成功"
            })
        } else {
            res.send({
                status: 500,
                msg: "删除失败"
            })
        }
    })
})

//删除图片
router.get('/deletephoto', (req, res) => {
    const id = req.query.id
    console.log(id);
    const sql = 'delete from photo where id=?'
    db.query(sql, id, (err, result) => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '删除成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "删除失败"
            })
        }
    })
})
//上传图片
router.post('/addphoto', (req, res) => {
    const photo = req.body
    console.log(photo);
    const sql = 'insert into photo set ?'
    db.query(sql, photo, (err, result) => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '添加成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "添加失败"
            })
        }
    })
})
//上传视频
router.post('/postvideo', (req, res) => {
    const video = req.body
    console.log(video);
    const sql = 'insert into video set ?'
    db.query(sql, video, (err, result) => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '添加成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "添加失败"
            })
        }
    })
})
//获取视频列表
router.get('/getvideo', (req, res) => {
    const page = req.query.page || 1;
    console.log(req.query);
    const sqlStr = 'select * from  video'
    db.query(sqlStr, null, (err, result) => {
        const total = result.length
        const pagesize = 6
        const n = (page - 1) * pagesize
        const sql = `select * from video order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, null, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                // setTimeout(() => {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
                // }, 5000)
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })
})
//删除视频
router.get("/deletevideo", (req, res) => {
    const id = req.query.id;
    const sql = "delete from video where id=?"
    db.query(sql, id, (err, result) => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: "删除成功"
            })
        } else {
            res.send({
                status: 500,
                msg: "删除失败"
            })
        }
    })
})
//用户搜索查询

router.get('/usersearch', (req, res) => {
    const page = req.query.page || 1;
    const search = req.query.search;
    const sqlStr = `select * from user where concat (username,nickname) like '%${search}%'`;
    db.query(sqlStr, null, (err, result) => {
        const total = result.length
        const pagesize = 6
        const n = (page - 1) * pagesize
        const sql = `select * from user where concat (username,nickname) like '%${search}%' order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, null, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })


})
//留言搜索
router.get('/messageSearch', (req, res) => {
    const page = req.query.page || 1;
    const search = req.query.search;
    const sqlStr = `select * from message where concat (username,content) like '%${search}%'`;
    db.query(sqlStr, null, (err, result) => {
        const total = result.length
        const pagesize = 8
        const n = (page - 1) * pagesize
        const sql = `select * from message where concat (username,content) like '%${search}%' order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, null, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })


})
//文章搜索查询
router.get('/articlesearch', (req, res) => {
    const page = req.query.page || 1;
    const search = req.query.search;
    const sqlStr = `select * from article where concat (author,content,introduction,title) like '%${search}%'`;
    db.query(sqlStr, null, (err, result) => {
        const total = result.length
        const pagesize = 8
        const n = (page - 1) * pagesize
        const sql = `select * from article where concat (author,content,introduction,title) like '%${search}%' order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, null, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })


})
//搜索
router.get('/getsearch', (req, res) => {
    const page = req.query.page || 1;
    const search = req.query.search;
    const sqlStr = `select * from article where title like '%${search}%'  and status = 0 and is_del = 0`;
    db.query(sqlStr, null, (err, result) => {
        const total = result.length
        const pagesize = 6
        const n = (page - 1) * pagesize
        const sql = `select * from article where title like '%${search}%'  and status = 0 and is_del = 0 order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, null, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })


})

//收藏文章
router.post('/getcollect', (req, res) => {
    const arr = req.body
    console.log(req.body);
    const sql = 'insert into collection set ?'
    db.query(sql, arr, (err, result) => {
        console.log(result);
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '收藏成功'
            })
        } else {
            res.send({
                status: 500,
                msg: '收藏失败'
            })
        }
    })
})
//取消收藏文章
router.post('/deletecollect', (req, res) => {
    console.log(req.body);
    const sql = 'delete from collection where article_id=? and username=?'
    db.query(sql, [req.body.article_id, req.body.username], (err, result) => {
        console.log(result);
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '取消收藏成功',
                iscollect: false,
            })
        } else {
            res.send({
                status: 500,
                msg: '取消收藏失败',
                iscollect: true,
            })
        }
    })
})
//查看当前文章是否已经被收藏
router.get('/iscollect', (req, res) => {
    console.log(req.query);
    const sql = 'select * from collection where article_id=? and username=?'
    db.query(sql, [req.query.article_id, req.query.username], (err, result) => {
        if (result.length > 0) {
            res.send({
                status: 200,
                msg: '该文章已被收藏',
                iscollect: true
            })
        }
        else {
            res.send({
                status: 500,
                msg: '该文章未被收藏',
                iscollect: false,
            })
        }
    })
})

//获取收藏的文章
router.get('/getcollectarticle', (req, res) => {
    const page = req.query.page || 1;
    const username = req.query.username
    console.log('获取收藏的文章', req.query);
    const sqlStr = 'select * from article where id in (select article_id from collection where username =?) and status =0 and is_del=0'
    db.query(sqlStr, username, (err, result) => {
        console.log('获取收藏的文章', result);
        const total = result.length
        const pagesize = 8
        const n = (page - 1) * pagesize
        const sql = `select * from article where id in (select article_id from collection where username =?) and status =0 and is_del=0 order by id desc limit ${pagesize} offset ${n} `
        db.query(sql, username, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: pagesize,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })


})

//后台获取所有问卷
router.get('/getquestionlist', (req, res) => {
    const page = req.query.page || 1;
    console.log('用户', page);
    const sqlStr = 'select * from question'
    db.query(sqlStr, null, (err, result) => {
        const total = result.length
        const n = (page - 1) * 8
        const sql = `select * from question order by endtime desc limit 8 offset ${n} `
        db.query(sql, null, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: 8,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })


})
//前台获取未提交问卷
router.get('/getquestionlistlw', (req, res) => {
    const username = req.query.username
    console.log(username, 'langwei');
    const sql = 'select * from question where questionid not in (select questionid from questionanswer where username = ?) order by endtime desc'
    db.query(sql, username, (err, result) => {
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
                pageSize: 8,
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })



})
//判断用户是否提交该问卷
router.get('/getquestionstatus', (req, res) => {
    console.log(req.query);
    const sql = 'select * from questionanswer where questionid=? and username=?'
    db.query(sql, [req.query.questionid, req.query.username], (err, result) => {
        if (result.length > 0) {
            res.send({
                status: 200,
                msg: '已提交',
                isanswer: true
            })
        }
        else {
            res.send({
                status: 500,
                msg: '未提交',
                iscollect: false,
            })
        }
    })
})
//提交问卷
router.post('/sendquestion', (req, res) => {
    const question = req.body
    console.log(question);
    const sql = 'insert into questionanswer set ?'
    db.query(sql, question, (err, result) => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '添加成功'
            })
            const sqlstr = 'update question set people = people + 1 where questionid = ?'
            db.query(sqlstr, req.body.questionid, (err, result) => {

            })
        } else {
            res.send({
                status: 500,
                msg: "添加失败"
            })
        }
    })
})
//查看当前问卷提交详情
router.get('/getquestionanswer', (req, res) => {
    const page = req.query.page || 1;
    console.log('用户', req.query);
    const sqlStr = 'select * from questionanswer where questionid = ?'
    db.query(sqlStr, req.query.questionid, (err, result) => {
        const total = result.length
        const n = (page - 1) * 8
        const sql = `select * from questionanswer where questionid = ? order by id desc limit 8 offset ${n} `
        db.query(sql, req.query.questionid, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: 8,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })


})
//添加问卷
router.post('/addquestion', (req, res) => {
    const question = req.body
    console.log(question, '添加问卷');
    const sql = 'insert into question set ?'
    db.query(sql, question, (err, result) => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '添加成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "添加失败"
            })
        }
    })
})

//获取病历
router.get('/getrecord', (req, res) => {
    const page = req.query.page || 1;
    // console.log('用户', page);
    const sqlStr = 'select * from medical_records'
    db.query(sqlStr, null, (err, result) => {
        const total = result.length
        const n = (page - 1) * 8
        const sql = `select * from medical_records order by id desc limit 8 offset ${n} `
        db.query(sql, null, (err, result) => {
            // console.log('结果', result.length);
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: 8,
                    total: total
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })


})

//编辑病历
router.post('/editrecord', (req, res) => {
    console.log('编辑病历', req.body);
    const sql = 'update medical_records set ? where id=?'
    db.query(sql, [req.body, req.body.id], (err, result) => {
        console.log(result);
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '修改成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "修改失败"
            })
        }
    })
})
//添加病历
router.post('/addrecord', (req, res) => {
    const record = req.body
    console.log(record, '添加病历');
    const sql = 'insert into medical_records set ?'
    db.query(sql, record, (err, result) => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '添加成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "添加失败"
            })
        }
    })
})
//获取个人病历
router.get('/getmyrecord', (req, res) => {
    console.log('获取个人病历', req.query.username);
    const sql = 'select * from medical_records where username = ? order by sendtime desc limit 1'
    db.query(sql, req.query.username, (err, result) => {
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })



})

//用户获取聊天列表(已改)
router.get('/getchatlist', (req, res) => {
    // console.log('获取聊天列表', req.query.username);
    const sql = 'select distinct a.answername ,b.avatar as avatar  from chat a join admin b on a.answername=b.adminname where sendname =? group by answername'
    db.query(sql, req.query.sendname, (err, result) => {
        const data = result
        const total = result.length
        if (result.length > 0) {
            res.send({
                status: 200,
                data: data,
                total: total
            })
        }



    })



})
//管理员获取聊天列表
router.get('/admingetchatlist', (req, res) => {
    // console.log('获取聊天列表', req.query.username);
    const sql = 'select distinct a.sendname ,b.id,b.avatar as avatar from chat  a join user b on a.sendname = b.username  COLLATE utf8mb4_unicode_ci where answername = ? group by sendname'
    db.query(sql, req.query.sendname, (err, result) => {
        const data = result
        if (result.length > 0) {
            res.send({
                status: 200,
                data: data,
            })
        }



    })



})
//获取聊天记录
router.get('/getchat', (req, res) => {
    // console.log('获取聊天记录', req.query);
    const sql = 'select * from chat where (sendname = ? and answername = ?) or(sendname = ? and answername = ?) order by sendtime asc'
    db.query(sql, [req.query.sendname, req.query.answername, req.query.answername, req.query.sendname], (err, result) => {
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })



})

//获取管理员id
router.get('/getadminid', (req, res) => {
    console.log('获取管理员id', req.query);
    const sql = 'select id from admin where adminname = ?'
    db.query(sql, req.query.adminname, (err, result) => {
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })



})
//发送聊天
router.post('/sendchat', (req, res) => {
    const chat = req.body
    console.log(chat, '添加聊天');
    const sql = 'insert into chat set ?'
    db.query(sql, chat, (err, result) => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '添加成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "添加失败"
            })
        }
    })
})

//获取未读信息 
router.get('/getchatno', (req, res) => {
    const sql = 'select sendname, count(*) total from chat where answername = ? and status = 0  group by sendname order by sendname'
    db.query(sql, req.query.sendname, (err, result) => {
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })



})
//获取未读信息总数
router.get('/getchatnototal', (req, res) => {
    const sql = 'select sendname, count(*) total from chat where answername = ? and status = 0 '
    db.query(sql, req.query.sendname, (err, result) => {
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })



})
//设置信息已读 
router.post('/setchathave', (req, res) => {
    console.log('设置信息已读 ', req.body);
    const sql = 'update  chat set status=1 where answername = ? and sendname = ?'
    db.query(sql, [req.body.answername, req.body.sendname], (err, result) => {
        console.log(result);
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: '修改成功'
            })
        } else {
            res.send({
                status: 500,
                msg: "修改失败"
            })
        }
    })
})
//获取聊天里最后一条信息
router.get('/getlastchat', (req, res) => {
    console.log('获取聊天里最后一条信息', req.query);
    const sql = 'SELECT answername, content,sendtime FROM (SELECT answername ,content ,sendtime FROM chat WHERE (sendname = ?) AND (answername <> ?) UNION SELECT sendname ,content,sendtime FROM chat WHERE (sendname <> ?) AND (answername = ?) ORDER BY sendtime DESC) as newTable GROUP BY answername ORDER BY sendtime DESC'
    db.query(sql, [req.query.sendname, req.query.sendname, req.query.sendname, req.query.sendname], (err, result) => {
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result,
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })



})







var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./upload/")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

var createFolder = function (folder) {
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
    }
}

var uploadFolder = './upload/';
createFolder(uploadFolder);
var upload = multer({
    storage: storage
});

router.post('/upload', upload.single('file'), function (req, res, next) {
    var file = req.file;
    console.log('文件类型：%s', file.mimetype);
    console.log('原始文件名：%s', file.originalname);
    console.log('文件大小：%s', file.size);
    console.log('文件保存路径：%s', file.path);
    res.json({
        res_code: '0',
        name: file.originalname,
        url: file.path
    });
});

module.exports = router