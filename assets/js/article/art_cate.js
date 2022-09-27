$(function () {
    var form = layui.form;
    // 调用函数
    initArtCateList()
    // 定义函数
    function initArtCateList() {
        // 获取文章的分类列表
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 这里获取失败的代码就不写了
                // 获取文章类别信息成功之后 直接调用template函数
                // template函数需要传递两个参数 第一个参数的模版的id(注意不需要加#),第二个是传进模版里面的数据
                var tplStr = template('tpl-table', res)
                // 将模版字符串渲染到页面上面
                $('tbody').html(tplStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var addIndex = null;// 这个变量一定要定义在函数外面,不然下面关闭弹出层的时候这个变量就成了未定义的变量了(作用域)
    $('#btnAddCate').on('click', function () {
        addIndex = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 因为在js脚本中直接书写html代码比较的麻烦 所以直接写在了html页面中,类似于模版
            // 然后通过html()将绘制的弹出获取过来
            content: $('#dialog-add').html(),
        });

    })

    // 为弹出框中的form表单添加submit事件
    // 注意:因为form表单是动态生成的,没有办法直接添加submit事件,所以只能采用代理的形式
    $('body').on('submit', '#form-add', function (e) {
        // 阻止默认的提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // 这里的$(this)指向的是具体触发事件的元素的$('#form-add'),这是jquery的写写法，不要和原生js混在一起
            // 而this指向的是#form-add的DOM元素
            // e.target 是通过点击谁触发的事件 就指向谁 这里指向的也是#form-add的DOM元素
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('新增分类失败! ')
                }
                initArtCateList()
                layui.layer.msg('新增分类成功! ')
                // 当想关闭当前页的某个层时,例如:
                // var index = layer.open();
                // var index = layer.alert();
                // var index = layer.load();
                // 每一种弹层调用方式，都会返回一个index
                // layer.close(index); //此时你只需要把获得的index，轻轻地赋予layer.close即可
                layer.close(addIndex)
            }
        })
    })
    var editIndex = null;//需要重新声明,添加和编辑的弹出层的变量名不一致,互不冲突
    // 给编辑按钮添加点击事件(动态生成=>事件委托)
    $('tbody').on('click', '#btnedit', function () {
        // 弹出一个修改信息的层  
        editIndex = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        });
        // 弹框跳出之后 把当前行的信息渲染到弹出框上面 涉及到自定义id属性
        var id = $(this).attr('data-id')// 获取自定义属性一定要用attr,属性名要加引号
        // 发起请求获取对应的数据
        $.ajax({
            method: 'GET',
            // 这里的:id是动态拼接路径'/my/article/cates/:id'
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res)
                // 定义form对象 在函数的外部定义
                // 第一个参数是将数据渲染到哪一个表单的表单名 第二个参数是渲染的数据对象
                form.val('form-edit', res.data)// 不要写成{res.data}  res.data本身就是一个对象
                // 因为渲染数据里面有一个ID 而且后续的接口也需要id值, 但是又不需要用户看见 所以需要在html里面添加一个隐藏域
            }
        })
    })

    // 上传修改后的数据 通过代理的形式,为修改分类的表单绑定submit事件(与添加分类操作类似)
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新分类数据失败! ')
                }
                initArtCateList()
                layui.layer.msg('更新分类数据成功! ')
                layer.close(editIndex)
            }
        })
    })

    // 给删除按钮btnDel绑定事件(事件委托)
    $('tbody').on('click', '#btnDel', function () {
        var id = $(this).attr('data-id') // 这个变量一定要放在弹出框的外面 如果放在弹出框的函数里面 那$(this)的指向就变了 
        // 点击删除按钮 弹出提示框
        layer.confirm('确定删除吗', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 获取当前的数据信息
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除分类数据失败! ')
                    }
                    layui.layer.msg('删除分类数据成功! ')
                    //这是关闭询问的弹出框 可以放在这里 删除成功之后删除数据
                    layer.close(index);
                    initArtCateList()
                }
            })
            //这是关闭询问的弹出框
            // layer.close(index);
        });

    })
})