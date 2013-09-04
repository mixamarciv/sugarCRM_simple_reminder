<?php
//файл проверки и вывода блока для ajax загрузки списка напоминаний
 
$load_reminder = 1; //flag for load & show reminder

$user_id = @$_SESSION['authenticated_user_id'];
if($user_id==null || trim($user_id)==""){
    $load_reminder = 0;
}

//проверяем можно ли отображать на странице напоминание
if(isset($_REQUEST['ajax_load']) ||
   isset($_REQUEST['sugar_body_only']) ||
   isset($_REQUEST['to_pdf']) ||
   $_REQUEST['action']=='Popup' ||
   ($_REQUEST['module']=='Users' && $_REQUEST['action']=='Login')
  ){
    $load_reminder = 0;
}


//исключаем из напоминаний записи которые уже редактируем на странице
$exclude_task = "";
$this_url = $_SERVER['REQUEST_URI'];
if(preg_match("#module.{1,3}Tasks#i",$this_url) && preg_match("#action.{1,3}DetailView#i",$this_url)){
  $matches = null;
  if(preg_match("#[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}#", $this_url, $matches)){
      //примеры id:
      //    41f958d2-98b2-f450-311d-5227281640f1
      //    2b2d947f-c57d-f22e-c4a0-52272ad357c9
      $exclude_task = $matches[0];
  }
}


if($load_reminder){
    //выводим блок для загрузки ajax напоминаний
    //global $current_user;
    global $sugar_config;

    $sr_config = array();
    $sr_config['send_query_interval'] = 60*1000; //время(мс) через которое посылается следующий запрос
    
   
    $xtpl=new XTemplate(dirname(__FILE__)."/simple_reminder.html");

    $include_jquery = '<script type="text/javascript" src="modules/simple_reminder/inc/jquery-min.js" />';
    if($GLOBALS['sugar_version']>=6.5){
	$include_jquery= '';
    }
    $xtpl->assign("INCLUDE_JQUERY", $include_jquery);
    
    $xtpl->assign("USER_ID", $user_id);
    $xtpl->assign("SITE_URL", $sugar_config['site_url']);
    $xtpl->assign("SEND_QUERY_INTERVAL", $sr_config['send_query_interval']);
    $xtpl->assign("EXCLUDE_TASK", $exclude_task);
    
    $xtpl->parse('main');
    //$xtpl->out('main');
    echo $xtpl->text();

}


?>