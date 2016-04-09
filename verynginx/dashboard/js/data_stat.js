var data_stat = new Object();

data_stat.url_table = null;

data_stat.search = function( s ){
    if( data_stat.url_table == null )
        return;

    data_stat.url_table.search( s ).draw();
}

data_stat.tab_switch = function ( item ) {
    // 标签切换文字变化
    if( $(item).attr('id') == 'summary_data_all' ){
        $("#def_btn").html("All<span class=\"caret\"></span>");
    }else{
        $("#def_btn").html("Temporary<span class=\"caret\"></span>");
    } 
    
    data_stat.get_data();
}

data_stat.make_sure_have_table = function(){

    if( data_stat.url_table == null ){
        data_stat.get_data();
    }
}


data_stat.get_data = function () {

    $('#url_details').html(""); // 动态生成表格前将表格清空

    var url_short = "./summary?type=short";
    var url_long  = "./summary?type=long";
    var data_url;

    // 判断数据量
    if ($("#def_btn").text() == 'All') {
        data_url = url_long;
        $("#summary_type_note").css("display", "none");
    } else {
        data_url = url_short;
        $("#summary_type_note").css("display", "inline-block");
    };

    $.ajax({
        type: "GET",
        url: data_url,
        // url: "/verynginx/summary?type=long",
        data_Type: "json",

        success: function (json_data) {

            if( data_stat.url_table != null ){
                data_stat.url_table.clear().destroy();
            }

            var url_index = 1;
            for (var key in json_data) {
                var data_group = json_data[key];

                // 计算访问成功率
                var success_count = 0;
                var total_count = 0;
                for( var status_code in data_group['status'] ){
                    var this_status_count = data_group['status'][status_code];
                    if( parseInt( status_code ) < 400 ){
                        success_count += this_status_count;
                    }
                    total_count += this_status_count;
                }
                
                var success_rate = (success_count / total_count) * 100;
                var count = parseInt(json_data[key].count);
                var size = parseFloat(json_data[key].size);
                var avg_size = size / count;
                var time = parseFloat(json_data[key].time);
                var avg_time = time / count;

                // 动态增加每一列关于各URL/URI的详细访问信息
                var dyn_tab =  "<tr><td >" + url_index + "</td>" +
                               "<td>" + util.html_encode(key) + "</td>" +
                               "<td>" + count + "</td>" +
                               "<td>" + size + "</td>" +
                               "<td>" + avg_size.toFixed(2) + "</td>" +
                               "<td>" + success_rate.toFixed(2) + "%</td>" +
                               "<td>" + time.toFixed(3) + "</td>" +
                               "<td>" + avg_time.toFixed(3) + "</td></tr>";

                $('#url_details').append(dyn_tab);

                url_index++; // 增加访问序列
        
            }

            // 添加表格排序
            data_stat.url_table = $('#url_table').DataTable( {
                                autoWidth: false, // 设置表格自动适配宽度
                                paging: false, // 去掉页头页脚信息
                                "stripeClasses": [], // 去掉斑马色
                                renderer: true,
                                searching: true, // 增加过滤功能
                                "order": [[ 0, "asc" ]] // 载入时默认使用index升序排列
                            } );

        }
    });   
}
