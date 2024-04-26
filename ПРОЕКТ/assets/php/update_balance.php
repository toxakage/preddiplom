<?php

require_once __DIR__.'/boot.php';

$stmt = pdo()->prepare('UPDATE `users` SET `balance` = `balance`+:sum WHERE `login` = :username');
$stmt->execute([
    ':username' => $_POST['login'],
    ':sum' => $_POST['sum'],
]);

?>