<?php
//класс для запуска модуля по хуку
class simple_reminder {
    function show($event, $arguments){
        require_once('modules/simple_reminder/simple_reminder.php');
    }
}


