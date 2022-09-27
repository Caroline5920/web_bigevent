$(function () {
    // 定义:
    var layer = layui.layer;
    var form = layui.form;
    // 获取文章分类的数据
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败! ')
                }
                // 获取数据成功 把成功的数据用模版引擎动态渲染到下拉选择框里面
                var htmlStr = template('pub_list', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 切记:这个文章分类的下拉选择框里面的选项是通过模版引擎动态添加的 
                // 所以一定要调用form.render()方法 让layui.js重新监听,不然页面渲染不出来
                form.render();
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮,绑定点击事件处理函数
    $('#btnChooseImg').on('click', function () {
        $('#coverFile').click()
    })
    // 监听coverFile的change事件,获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return // return出去之后 后面的代码就不会执行了
        }
        // 根据文件 创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置照片 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态 让他的默认状态为已发布
    var art_state = '已发布';
    // 为存为草稿按钮,绑定点击事件,当点击存为草稿的按钮之后改变art_state的状态值
    $('#btnsave').on('click', function () {
        art_state = '草稿';
    })
    // 为表单绑定submit提交事件
    $('#form_pub').on('submit', function (e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault()
        // 2.基于form表单 快速创建一个FormData对象
        // 注意将JQuery对象转化为DOM对象
        var fd = new FormData($(this)[0])
        // 3.将文章的发布状态 添加到fd中
        fd.append('state', art_state)

        // 可以用forEach()查询遍历的对象 注意 value是在value之前的
        // fd.forEach(function (v, k) {
        //     console.log(k, v);
        // })
        // 4.将封面裁剪过后的图片,输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象存储到fd中
                fd.append('cover_img', blob)
                // 6.发起ajax数据请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意:如果向服务器提交的是FormData格式的数据,必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败! ')
                }
                layer.msg('发布文章成功! ')
                // 文章发布成功之后,跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})