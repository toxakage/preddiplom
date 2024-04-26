<?php

require_once __DIR__.'/boot.php';

$stmt = pdo()->prepare("INSERT INTO products (title, description, price) VALUES (:title, :desc, :price)");
$stmt->execute([':title' => $_POST['title'],':desc' => $_POST['desc'],':price' => $_POST['price']]);
$id = pdo()->lastInsertId();
echo $id;
?>