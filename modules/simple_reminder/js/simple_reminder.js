/*********************************************************************************
* js scripts for simple_reminder sugarCRM
********************************************************************************/


//������� ����� �������
function clone(o) {
    if(!o || typeof o!=='object'){
      return o;
    }
    var c = 'function' === typeof o.pop ? [] : {};
    var p, v;
    for(p in o){
        if(o.hasOwnProperty(p)){
            v = o[p];
            if(v && typeof v==='object'){
                c[p] = clone(v);
            }else{
                c[p] = v;
            }
        }
   }
   return c;
}

//send_ajax_query_timeout - ������� ��� �������� ���� ������� � �������� � ������ ����������� ����������,
//����� �������� �������, � ������ ���� ������ � ��� �� id_user_query ��� ����������� � ������� ������ �� ����� �������� � �������
//���� � �������� ���������� ������� � ������� ���� ���������� ����� ������ ������� �� �� ������� ���������� ������ ���������!!
// id_user_query - ���������� id ajax �������
// options - ajax ��������� �������
// timeout - ����� �������� ����� ��������� ������� ������� � ����. ������� �� ������� ����� ��������� ���������� �� �������
/**************************
example:
  var ajax_options = {
        type: "GET",
        url: "index.php",
        data: data,
	onSend: function(){ //����������� ��� ������ ������ ���������� �� ���� ��� ������� ��������� �� �������� ������� ��� ���
	    if(typeof window['query_data'][id_user_query]['send_count'] == 'undefined'){window['query_data'][id_user_query]['send_count']=0;}
	    window['query_data'][id_user_query]['send_count']++;
	    log.msg("��������� "+window['query_data'][id_user_query]['send_count']+" ������");
	},
	onWait: function(){ //����������� ������ ��� ����������� ������ ������� � �������
	    log.msg("�����.., ��� ������ ��������� � �������");
	},
        beforeSend: function(html){
	  if(window['query_data'][id_user_query]['query_status']['load_count']>1) set_cur_size_input_items(id_user_query);
        },
        success: function(html,textStatus,jqXHR){ // ����� ��������� ����������� ������� ������
	    if(typeof window['query_data'][id_user_query]['result_count'] == 'undefined'){window['query_data'][id_user_query]['result_count']=0;}
	    window['query_data'][id_user_query]['result_count']++;
	    log.msg("������� ��������� "+window['query_data'][id_user_query]['result_count']+" ������� (�� "+window['query_data'][id_user_query]['send_count']+")");
	    
	    $("#test").html(html);
        },
	test: 0
  };
  send_ajax_query_timeout("test_11",ajax_options,500);
***************************/
function send_ajax_query_timeout(id_user_query,options,timeout){
  if(typeof timeout == 'undefined' || timeout <= 10 ){
    timeout = 100;
  }
  
  if(typeof options == 'undefined'){
    alert("������� �������� 'options' ��� 'send_ajax_query_timeout(id_user_query,options,timeout)' !");
    return 0;
  }
  
  if(typeof options.onSend !== 'undefined'){
    options.onSend();
  }

  if(typeof window['ajax_query'] == 'undefined'){
    window['ajax_query'] = {};
  }
  if(typeof window['ajax_query'][id_user_query] == 'undefined'){
    window['ajax_query'][id_user_query] = {};
  }
  
  window['ajax_query'][id_user_query]['options'] = options;
  
  if(typeof window['ajax_query'][id_user_query]['status'] == 'undefined'){
    window['ajax_query'][id_user_query]['status'] = {result_wait: 0, restart_query: 0, last_params: null, load_count: 0};
  }
  
  var s = window['ajax_query'][id_user_query];
  if( s['status']['result_wait'] == 1){
    if(s['status']['restart_query'] == 0){
        s['status']['restart_query'] = 1;
    }
    if(typeof options.onWait !== 'undefined'){
      options.onWait();
    }
    return 0;
  }
  
  s['status']['result_wait'] = 1;

  setTimeout(function(){
    var options_new = clone(window['ajax_query'][id_user_query]['options']);
    if(typeof options_new['complete'] !== 'undefined'){ // && jQuery.isFunction(options['complete'])
        //alert("��������: AJAX �������� options['complete'] ����� ��������������!");
	window['ajax_query'][id_user_query]['options']['my_ajax_on_complete'] = options_new['complete'];

	options['complete'] = null;
        delete options['complete'];
    }
    options_new.complete = function(jqXHR,status){
	    if(typeof window['ajax_query'][id_user_query]['options']['my_ajax_on_complete'] !== 'undefined'){
		window['ajax_query'][id_user_query]['options']['my_ajax_on_complete'](jqXHR,status);
	    }
	    if(status!="success"){
		var msg = status+" : ["+jqXHR['status']+"] "+jqXHR['statusText'];
		if(is_object(window['log'])){
		    log.show();
		    log.msg("������ AJAX ��������:<br>"+msg+"<br>url:"+options_new['url']+"<br>data:"+var_dump(options_new['data'],null,null,"<br>"));//������� ���������� � ��������� �������� ������
		}else{
		    alert("������ AJAX ��������: \n"+msg+"\nurl:"+options_new['url']+"\ndata:"+var_dump(options_new['data']));
		}
	    }
	    var s = window['ajax_query'][id_user_query];
	    window['ajax_query'][id_user_query]['status']['result_wait']=0;
	    if(window['ajax_query'][id_user_query]['status']['restart_query']==1){
		window['ajax_query'][id_user_query]['status']['restart_query']=0;
		setTimeout(function(){
		  window['send_ajax_query_timeout'](id_user_query,window['ajax_query'][id_user_query]['options'],timeout);
		},timeout);
	    }
	};
    
    $.ajax(options_new);
    
  },100);
  return 1;
}

//������ �����������
//���������:
// options.ajax_url - ���� � ������� index_ajax.php
// options.user_id - id �������� ������������
// options.delay - ����� ����������
function start_simple_reminder(options){
  var data = {};
  data.user_id = options.user_id;
  data.loaded = 0;
  data.exclude_task = options.exclude_task;
  
  if(options.delay===undefined) options.delay = 60*1000; //60 ���
  
  var ajax_options = {
        type: "GET",
        url: options.ajax_url,
        data: data,
        success: function(html,textStatus,jqXHR){ // ����� ��������� ����������� ������� ������ (����� ������, � ������� ������)
            data.loaded = 1;
            var obj = $("#simple_reminder");
	    obj.html(html);
            obj.find(".res").each(function(){
                $(this).fadeIn(1000);
                $(this).click(function(){  $(this).fadeOut(500); });
            });
        },
	test: 0
  };

  send_ajax_query_timeout("sr1",ajax_options,options.delay);

  setInterval(function(){
      send_ajax_query_timeout("sr1",ajax_options,options.delay);
  },options.delay);
}