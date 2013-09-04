<?php
//аякс загруска списка напоминаний
//выдает записи в виде <a id_task={$id} href=\"ссылка на задачу\" class=res><name>название</name><time>время</time><desc>описание</desc></a> 

session_start();

$user_id = @$_SESSION['authenticated_user_id'];
if($user_id==null || trim($user_id)=="" || strlen($user_id)>36){
    //echo "ERROR: no auth";
    exit;
}

global $db;
if(empty($db)){
  require_once("include/database/DBManagerFactory.php");
  $db = &DBManagerFactory::getInstance();
}

global $sugar_config;
$site_url = $sugar_config['site_url'];

$exclude_task = $_REQUEST['exclude_task'];
if(strlen($exclude_task)>36 || strlen(trim($exclude_task))==0) $exclude_task = 0;

$sql = "
    SELECT t.id,t.name,t.description,DATE_FORMAT(t.date_start,'%H:%i') AS d_time,DATE_FORMAT(t.date_start,'%d.%m.%Y') AS d_date,t.assigned_user_id \n
    FROM tasks t
    WHERE t.assigned_user_id = '{$user_id}'
      AND t.status = 'Not Started'
      AND t.date_start <= NOW()
    ";

if($exclude_task){
    $sql .= "\n  AND t.id !='{$exclude_task}' ";
}
$sql .= "\nORDER BY t.date_start DESC";

$results = $db->query($sql);

$html = "";
$max_description_len = 400;
while( $row = $db->fetchByAssoc($results) ){
    $id = $row['id'];
    $name = $row['name'];
    $desc = $row['description'];
    if(strlen($desc)>$max_description_len) $desc = substr($desc,0,401)."...";
    
    //$time = $row['date_start'];
    $time = "<d_date>".$row['d_date']."</d_date><d_time>".$row['d_time']."</d_time>";
    
    $href = $sugar_config['site_url']."/index.php?module=Tasks&action=DetailView&record=".$id;
    
    $html .= "<a id_task={$id} href=\"{$href}\" target=_blank class=res><name>{$name}</name><time>{$time}</time><desc>{$desc}</desc></a>\n";
}

echo $html;

