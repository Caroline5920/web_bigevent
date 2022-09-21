$(function () {
    //给登录页面的'去注册账号'绑定事件
    $('#link-reg').on('click', function () {
        //点击'#link-reg'让登录的div隐藏.注册的div显示
        $('.loginBox').hide()
        $('.regBox').show()
    })
    //给登录页面的'去登录'绑定事件
    $('#link-login').on('click', function () {
        //点击'#link-reg'让登录的div隐藏.注册的div显示
        $('.loginBox').show()
        $('.regBox').hide()
    })

    //从layui中获取form对象 
    var form = layui.form;
    var layer = layui.layer;
    //通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],//注意正则表达书里面的位数是用花括号括起来的

        //校验注册页面两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行是否等于的判断
            // 如果判断失败则return一个提示消息即可
            var pwd = $('.regBox [name=password]').val();
            if (pwd !== value) { return '两次密码不一致' }
        }
    })

    //监听注册表单的提交事件

    $('#form_reg').on('submit', function (e) {
        //阻止form表单的默认行为
        e.preventDefault();
        //发起ajax请求
        var data = {
            //这了的表单值用的是
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
        }
        $.post('/api/reguser', data,
            function (res) {
                if (res.status !== 0) {
                    //这个方法也需要先先把layer从layui里面导出,与layui.form一样
                    return layer.msg(res.message);
                }
                layer.msg('注册成功,请登录');
                //模拟点击行为
                $('#link-login').click();
            })
    })

    // 监听登录表单的提交事件
    // 监听注册事件用的是on(),登录时间这里换成submit()
    $('#form_login').submit(function (e) {
        //阻止默认行为
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            type: 'POST',//用method:'post'也行
            url: '/api/login',
            // 注册的时候,表单里面的值是手动拼接的,这里用serialize(),快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                // 跳转到后台
                // console.log(res.token)
                //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODkyLCJ1c2VybmFtZSI6IlIiLCJwYXNzd29yZCI6IiIsIm5pY2tuYW1lIjoiIiwiZW1haWwiOiIiLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTY2MzY2MDE0NywiZXhwIjoxNjYzNjk2MTQ3fQ.LfeYUz3zN0IuyXBvCIQszurqyYYCTaw5qw0le6NOcKQ
                localStorage.setItem('token', res.token)
                location.href = '/index.html';
            }
        })
    })
})