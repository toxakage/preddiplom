<?php

require_once __DIR__.'/boot.php';

foreach(explode(",", $_POST['ids']) as $id) {
    $stmt = pdo()->prepare("UPDATE `orders` SET `status` = 'Оплачен', `adress` = :adres,`phone` = :phone WHERE `login` = :username AND `id` = :order;");
    $stmt->execute([':adres' => $_POST['adres'],':phone' => $_POST['phone'],':username' => $_POST['login'],':order' => $id]);
}

$stmt = pdo()->prepare('UPDATE `users` SET `balance` = `balance`-:price WHERE `login` = :username');
$stmt->execute([
    ':username' => $_POST['login'],
    ':price' => $_POST['money'],
]);

?>