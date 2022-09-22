// 实现基本的裁剪效果
$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比 实现裁剪区域的宽高比
        // 正方形的裁剪效果是圆形 长方形的裁剪效果是椭圆形
        aspectRatio: 1,
        // aspectRatio: 4/3,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域 将配置项传进去
    $image.cropper(options)

    // 未上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    // 因为上传文件之后 希望上传的图片代替原有的图片 所以为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        //获取用户选择的文件信息
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layui.layer.msg('请选择照片! ')
        }
        // 用户选择了照片后
        // 1.拿到用户选择的文件
        var file = e.target.files[0]
        // 2.将图片文件转化为路径
        var imgURL = URL.createObjectURL(file)
        // 3.重新初始化裁剪区域
        $image.cropper('destroy')// 销毁旧的裁剪区域文件
            .attr('src', imgURL)// 重新设置图片的路径
            .cropper(options)// 重新初始化裁剪区域
    })
    // 为确定按钮帮绑定点击事件

    $('#btnUpload').on('click', function () {
        // 1.拿到用户裁剪过后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2.调用接口 上传照片
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更换头像失败! ')
                }
                layui.layer.msg('更换头像成功! ')
                window.parent.getUserInfo()
            }

        })


    })
})