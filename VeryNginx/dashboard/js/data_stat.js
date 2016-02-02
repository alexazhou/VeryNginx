var data_stat = new Object();

data_stat.get_data = function () {

   $('#url_details').html(""); // 动态生成表格前将表格清空

    var url_short = "/verynginx/summary?type=short";
    var url_long  = "/verynginx/summary?type=long";
    var data_url;

    // 标签切换文字变化
    $("#all").on('click', function () {
        $("#def_btn").html("All<span class=\"caret\"></span>");
    });
    $("#temp").on('click', function () {
        $("#def_btn").html("Temporary<span class=\"caret\"></span>");
    });

    if ($("#def_btn").text() == "All") {
        data_url = url_long;
        $(".summary_url_table .btn-group .note").css("display", "none");
    } else if ($("#def_btn").text() == "Temporary") {
        data_url = url_short;
        $(".summary_url_table .btn-group .note").css("display", "inline-block");
    };


    $.ajax({
        type: "GET",
        url: data_url,
        // url: "/verynginx/summary?type=long",
        data_Type: "json",

        success: function (json_data) {

            // console.log("异步请求成功");
            // console.log(typeof json_data);

            var response = json_data;
            var url_index = 1;

            // console.log(response);

            for (var key in response) {
                //console.log(key);
                
                // 计算访问成功率
                if ("undefined" != typeof(json_data[key].status[200])) {
                    var success = json_data[key].status[200] / json_data[key].count * 100;
                    //console.log("not 0");
                } else { // 当200状态不存在的时候成功率为0
                    var success = 0;
                    //console.log("is 0")
                };

                var count = parseInt(json_data[key].count);
                var size = parseFloat(json_data[key].size);
                var avg_size = size / count;
                var time = parseFloat(json_data[key].time);
                var avg_time = time / count;
                

                // 动态增加每一列关于各URL/URI的详细访问信息
                var dyn_tab =  "<tr><th style = \"width: 5%\">" + url_index + "</th>" +
                               "<th style = \"width: 28%\">" + key + "</th>" +
                               "<th style = \"width: 10%\">" + count + "</th>" +
                               "<th style = \"width: 10%\">" + size.toFixed(2) + "</th>" +
                               "<th style = \"width: 15%\">" + avg_size.toFixed(2) + "</th>" +
                               "<th style = \"width: 10%\">" + success.toFixed(2) + "%</th>" +
                               "<th style = \"width: 10%\">" + time.toFixed(3) + "</th>" +
                               "<th style = \"width: 12%\">" + avg_time.toFixed(3) + "</th></tr>";

                $('#url_details').append(dyn_tab);

                url_index++; // 增加访问序列
        
            }

            // 添加表格排序
            var url_table = $('#url_table').DataTable( {
                                autoWidth: true, // 设置表格自动适配宽度
                                paging: false, // 去掉页头页脚信息
                                "stripeClasses": [], // 去掉斑马色
                                renderer: true,
                                searching: true, // 增加过滤功能
                                "order": [[ 0, "asc" ]] // 载入时默认使用index升序排列
                            } );
            $('#url_table_filter .search-box').on('keyup', function () {
                url_table
                    .search(this.value)
                    .draw();
            });

            // 过滤器
            $("#url_table_filter input").attr("class","form-control").attr("placeholder","Search...");

            // 切换json请求地址时destroy掉dataTable
            $("#all, #temp").on('click', function () {
                url_table
                    .clear()
                    .destroy();
            })
        }
    })   
}
