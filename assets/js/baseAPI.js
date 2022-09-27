// 注意:每次调用$.get(),$.post(),$.ajax()的时候会先调用ajaxPrefilter这个函数
// 在这个函数中,可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的Ajax请求之前,统一拼接请求的根路径
    // http://api-breakingnews-web.itheima.net
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // console.log(options.url)

    // 统一为有权限的接口设置headers请求头
    // 查看一下路径中my的索引,如果不等于-1,说明路径中含有/my的路径,则需要权限
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            // 问题:这里的空字符串是用来干什么的?
            authorization: localStorage.getItem('token') || ''
        }
    }

    // 因为每次请求有权限的接口 都需要调用complete回调函数 来验证我们的请求是否成功
    // 全局挂载complete回调函数 
    // 问题:为什么不挂在在有权限的接口下面,就像请求头那样?--
    options.complete = function (res) {
        // console.log(res)
        // 在complete回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据(成功||失败)
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token
            localStorage.removeItem('token');
            // 2.强制跳转到登录页面
            location.href = '/login.html';
        }
    }
})