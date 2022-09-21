$(function () {
    // 调用getUserInfo()函数 获取用户信息
    getUserInfo()

    // 点击按钮 实现退出功能   
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出吗', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 具体要做一些什么事情 需要参考登陆成功之后我们做了哪些操作
            // 1.清空本地存储中的token
            localStorage.removeItem('token');
            // 2.重新跳转到登录的页面
            location.href = '/login.html';
            //这是关闭询问的弹出框
            layer.close(index);
        });
    })
})
//获取用户的基本信息
//问题:这个函数为什么一定要在入口函数的外面呢,入口函数的作用是什么

function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        //headers就是请求头配置对象
        // headers: {
        //     // 问题:这里的空字符串是用来干什么的?
        //     authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!')
            }
            // 如果获取信息成功 就调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        },
        // 发起有权限的请求时 需要携带一个回调函数 以保证如果请求失败 用户不可以直接访问首页
        // 不管请求成功还是失败,最终都会调用complete回调函数
        // complete: function (res) {
        //     console.log(res)
        //     // 在complete回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据(成功||失败)
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空token
        //         localStorage.removeItem('token');
        //         // 2.强制跳转到登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户的名称
    // 如果有昵称优先渲染昵称 没有昵称就显示登录的用户名
    var name = user.nickname || user.username
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像 优先
        $('.layui-nav-img').prop('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2当没有设置图片头像的情况下 显示文字图像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}