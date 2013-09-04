<?php

$manifest = array(
    'acceptable_sugar_versions' => array( 'regex_matches' => array('6\.*')  ),
    'acceptable_sugar_flavors' => array( 'CE', 'PRO','ENT' ),
    'readme'=>'thanks for install this module',
    'key'=>'simple',
    'author' => 'mixa_sgCRM_maker',
    'description' => 'simple_reminder - simple reminder for tasks',
    'icon' => '',
    'is_uninstallable' => true,
    'name' => 'reminder',
    'published_date' => '2013-09-02',
    'type' => 'module',
    'version' => '0.1',
    'remove_tables' => 'prompt'
);


$installdefs = array(
    'id' => 'mixa_sgCRM_maker',
    'layoutdefs' => array(),
    'relationships' => array(),
    'copy' => array(
        array(
            'from' => '<basepath>/modules/simple_reminder',
            'to' => 'modules/simple_reminder',
        )
    ),

    'logic_hooks' => array(
        /**
        ��������! ���� ��������� ����������� ��������� �����:
        ���� ����� �����-���� ������ ������������ ��� � ���������� ���� "custom/modules/logic_hooks.php"
        �� ����������� ������ �������� � ���� ���� ���� ����(� ������� $installdefs['logic_hooks']) ��� �� ������!
        � ���� ������ ����� ����������� �������� ��������� ������ � ���� "custom/modules/logic_hooks.php" :
        $hook_array['after_ui_footer'][] = Array(1, '', 'modules/simple_reminder/show_reminder.php','simple_reminder', 'show'); 
        **/
	array(
            'module' => '',
            'hook' => 'after_ui_footer',
            'order' => 1,
            'description' => '',
            'file' => 'modules/simple_reminder/show_reminder.php',
            'class' => 'simple_reminder',
            'function' => 'show'
            )
    )

);
