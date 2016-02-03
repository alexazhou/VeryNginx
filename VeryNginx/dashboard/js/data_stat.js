var data_stat = new Object();

data_stat.tab_switch = function () {
    // 标签切换文字变化
    $("#summary_data_all").on('click', function () {
        $("#def_btn").removeClass("url_short").addClass("url_long").html("All<span class=\"caret\"></span>");
    });
    $("#summary_data_temp").on('click', function () {
        $("#def_btn").removeClass("url_long").addClass("url_short").html("Temporary<span class=\"caret\"></span>");
    });
    data_stat.get_data();
}

data_stat.get_data = function () {

    $('#url_details').html(""); // 动态生成表格前将表格清空

    var url_short = "/verynginx/summary?type=short";
    var url_long  = "/verynginx/summary?type=long";
    var data_url;

    // 判断数据量
    if ($("#def_btn").hasClass("url_short") == true) {
        data_url = url_short;
        $(".summary_url_table .btn-group .note").css("display", "inline-block");
    } else {
        data_url = url_long;
        $(".summary_url_table .btn-group .note").css("display", "none");
    };


    $.ajax({
        type: "GET",
        url: data_url,
        // url: "/verynginx/summary?type=long",
        data_Type: "json",

        success: function (json_data) {

            var response = json_data;
            var url_index = 1;

            for (var key in response) {
                
                // 计算访问成功率
                if ("undefined" != typeof(json_data[key].status[200])) {
                    var success = json_data[key].status[200] / json_data[key].count * 100;
                } else { // 当200状态不存在的时候成功率为0
                    var success = 0;
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

            // 过滤器
            $('#url_table_filter .search-box').on('keyup', function () {
                url_table
                    .search(this.value)
                    .draw();
            });
            $("#url_table_filter input").attr("class","form-control").attr("placeholder","URI filter");

            // 切换json请求地址时destroy掉dataTable
            $("#summary_data_all, #summary_data_temp, #topnav_summary, #summary_data_refresh").on('click', function () {
                url_table
                    .clear()
                    .destroy();
            })
        }
    })   
}
