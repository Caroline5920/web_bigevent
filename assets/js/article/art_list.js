$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个美化时间的过滤器
    // 只要引进了template的js脚本 就可以调用以下的方法
    template.defaults.imports.dateformat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义一个补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询参数对象,将来请求数据的时候,需要将请求参数对象提交到服务器
    var q = {
        pagenum: 2, // 页码值 默认请求第一页数据
        pagesize: 2, // 条数值 每页显示的数据条数,默认每页显示两条
        cate_id: '', // 文章分类的id
        state: '' // 文章发布的状态
    }

    initTable();// 初始化表格
    initCate();// 初始化表格之后初始化所有分类的列表
    // 定义一个获取文章数据的方法 然后渲染表格的数据
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败! ')
                }
                // console.log(res);
                // 获取数据成功 不需要提示用户 因为获取数据的最终目的在于渲染页面
                // 使用模板引擎 渲染列表数据
                var strHtml = template('tableList', res);
                $('tbody').html(strHtml);
                // 在此之前表格数据渲染完毕 下一步就是调用分页的函数来渲染分页区域
                // 因为分页功能是根据数据条数渲染的 所以需要一个参数(数据的总条数)
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的数据 渲染所有分类里面的选择项
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败! ')
                }
                // 获取数据成功 把成功的数据用模版引擎动态渲染到所有分类里面
                var htmlStr = template('cate-list', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单区的ui结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#serch').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选项的值 用val() 不用html()
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 未查询参数对象q中对应的属性重新赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件,重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    // 思考一下在哪里调用这个方法:因为在获取数据成功之后 就开始渲染表格 那表格渲染完毕之后 就是开始渲染分页区域
    function renderPage(total) {
        // console.log(total);
        //执行一个laypage实例 调用laypage.render()方法 来渲染分页的结构
        laypage.render({
            elem: 'test1', // 分页容器的ID 注意，这里的 test1 是 ID，但不用加 # 号
            count: total, // 数据总条数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 到目前的步骤还没有实现分页区与表格区域的联动,要实现点击哪一个页码就渲染哪个页码的数据 需要以下步骤:
            // 1.拿到点击后的页码值
            // 分页发生切换的时候,触发jump回调函数 一共有两个参数
            // 触发jump回调函数的方式有两种:
            // 1.点击页码的时候(页码值发生切换),会触发jump回调函数(first打印出来的是undefined)
            // 2.只要调用了laypage.render()方法,就会触发jump回调函数(first打印出来的是true)
            jump: function (obj, first) {
                // console.log(first);
                // console.log(obj.curr);
                // 1.1把拿到后的页码值赋值给q.pagenum 重新配置查询参数对象,以渲染对应的页面
                q.pagenum = obj.curr;
                // 把最新的条目数,赋值到q这个查询参数对象的pagesize属性中
                // 原理:在切换条目的时候 本质上也会触发jump回调,然后通过obj.limit这个属性 拿到切换后的条目数,最后赋值给q.pagesize 重新渲染表格数据即可
                q.pagesize = obj.limit;
                // 2.根据最新的页码值(  q.pagenum = obj.curr;)重新调用数据渲染表格(注意死循环的问题)
                // 为了避免死循环 这时候需要第二个参数(first)进行判断
                // 1.当通过laypage.render触发jump函数时,返回值是true
                // 所以这种情况下就不要重新调用 initTable()函数来重新渲染表格了 以免造成死循环
                // 2.当通过点击页码值触发jump函数时,返回值是undefined
                // 所以只有当通过页码值变化而触发的jump函数时,才需要重新调用 initTable()渲染表格
                if (!first) {
                    initTable()
                }
            }


        });
    }
    // 通过代理的形式,为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数 
        var len = $('.btn-delete').length;
        // console.log(len)
        // console.log('ok');
        // 获取文章的id
        var id = $(this).attr('data-id')
        // 弹出框 询问用户是否删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败! ')
                    }
                    layer.msg('删除文章成功! ')
                    // 当数据删除完成后 需要判断当前这一页中 是否还有剩余数据
                    // 如果没有剩余的数据 则让页码值减1之后,再重新调用 initTable()
                    if (len === 1) {
                        // 如果len的值等于1,证明删除完毕之后,页面上就没有任何数据了
                        // 注意:页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })

})