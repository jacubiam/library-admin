<?php
spl_autoload_register(function ($class_name) {
    include "../services/" . strtolower($class_name) . '.services.php';
});

$urlReserv = "../db/reservations.csv";
$urlBook = "../db/books.csv";

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    if ($_GET['query'] === "get_all") {
        $reservs = Reservation::get_all($urlReserv);
        sort($reservs);
        header('Content-type: application/json');
        echo json_encode($reservs);
    }
}

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $raw_data = file_get_contents('php://input');
    $post_data = json_decode($raw_data, true);
    $id_book = $post_data['id'];
    $user_name = $post_data['user_name'];

    $book = Book::get_item($id_book, $urlBook);

    if ($book->get_status() === "available") {
        $new_reserv = new Reservation($id_book, $book->get_title(), $user_name);
        $new_reserv->create_item();
        $book->set_status("unavailable");
        header('Content-type: application/json');
        echo json_encode(array("res" => "($id_book) lent!"));
    } else {
        http_response_code(403);
        header('Content-type: application/json');
        echo json_encode(array("res" => "Book Unavaliable"));
    }
}

if ($_SERVER['REQUEST_METHOD'] === "DELETE") {
    $param_id = str_contains($_SERVER['REQUEST_URI'], '?id=');
    $param_user = str_contains($_SERVER['REQUEST_URI'], '&user_name=');

    if ($param_id && $param_user) {
        $filtered_uri = urldecode($_SERVER['REQUEST_URI']);
        $query_uri = explode('?', $filtered_uri);
        $query_uri = end($query_uri);
        $query = explode('&user_name=', $query_uri);
        $user_name = end($query);
        $query_id = $query[0];
        $query_id = explode("=", $query_id);
        $id = end($query_id);
        //Try
        $del_reserv = Reservation::get_item($id, $urlReserv);
        
        if ($del_reserv->get_id() == $id && $del_reserv->get_user_name() == $user_name) {
            $del_reserv->delete_item();
            $retrieve = Book::get_item($id, $urlBook);
            $retrieve->set_status("available");
            http_response_code(204);
        } else {
            http_response_code(403);
            header('Content-type: application/json');
            echo json_encode(array("res" => "Incorrect ID or username"));
        }
    } else {
        http_response_code(400);
        header('Content-type: application/json');
        echo json_encode(array("res" => "Bad Request"));
    }
}
