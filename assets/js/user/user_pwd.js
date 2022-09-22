$(function () {
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],//注意正则表达书里面的位数是用花括号括起来的

        // 新旧密码不能相同
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同! '
            }
        },

        // 确认密码必须要与新密码相同
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致! '
            }
        }
    })

    // 修改密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败! ')
                }
                layui.layer.msg('更新密码成功! ')

                // 更新密码成功之后需要重置一下表单值为空
                // form表单元素有一个原生的reset()方法(必须使用原声对象才可以调用)
                $('.layui-form')[0].reset()
            }
        })
    })
})