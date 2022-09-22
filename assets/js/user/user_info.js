$(function () {
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })
    // 调用函数 初始化用户信息
    initUserInfo()
    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'Get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.meg('获取用户信息失败! ')
                }
                // console.log(res)
                // 调用form.val()快速为表单赋值
                // 这个方法的第一个参数要是字符串,第二个属性必须是对象
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新用户信息失败! ')
                }
                layui.layer.msg('更新用户信息成功! ')
                //调用父页面中的方法,重新渲染用户的头像和信息
                window.parent.getUserInfo()
            }
        })
    })
})