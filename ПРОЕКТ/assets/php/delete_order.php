<?php

require_once __DIR__.'/boot.php';

$stmt = pdo()->prepare("DELETE FROM orders WHERE `id` = :orderid;");
$stmt->execute([':orderid' => $_POST['orderid']]);

if($_POST['admin']!='none') {
    $stmt = pdo()->prepare('UPDATE `users` SET `balance` = `balance`+:sum WHERE `login` = :username');
    $stmt->execute([
    ':username' => $_POST['login'],
    ':sum' => $_POST['price'],
]);
}

?>