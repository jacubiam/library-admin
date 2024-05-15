<?php
spl_autoload_register(function ($class_name) {
    include "../services/" . strtolower($class_name) . '.services.php';
});
include_once "../services/utils.php";

$urlReserv = "../db/reservations.csv";
$urlBook = "../db/books.csv";

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    header('Content-type: application/json');
    if (isset($_GET['query'])) {
        if ($_GET['query'] === "get_all") {
            $reservs = Reservation::get_all($urlReserv);
            sort($reservs);
            echo json_encode($reservs);
            exit();
        }

        if ($_GET['query'] === "get_reserv") {
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(array("res" => "Id param not found"));
                exit();
            }
            $reserv = Reservation::get_item($_GET['id'], $urlReserv);
            if (gettype($reserv) === "array") {
                http_response_code(404);
            }
            echo json_encode($reserv);
            exit();
        }

        http_response_code(404);
        echo json_encode(array("res" => "Query not found"));
        exit();
    } else {
        http_response_code(400);
        echo json_encode(array("res" => "GET request needs a query parameter"));
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    header('Content-type: application/json');
    $raw_data = file_get_contents('php://input');
    $post_data = json_decode($raw_data, true);

    //If a json is not passed:
    if ($post_data === null) {
        http_response_code(400);
        echo json_encode(array("res" => "JSON Expected"));
        exit();
    }

    $verifier = validator($post_data, "loan");
    if (!$verifier['status']) {
        http_response_code(400);
        echo json_encode(array("res" => $verifier['message']));
        exit();
    }

    $id_book = $post_data['id'];
    $user_name = $post_data['user_name'];

    $book = Book::get_item($id_book, $urlBook);
    if (gettype($book) === "array") {
        http_response_code(404);
        echo json_encode($book);
        exit();
    }

    if ($book->get_status() === "available") {
        $new_reserv = new Reservation($id_book, $book->get_title(), $user_name);
        $new_reserv->create_item();
        $book->set_status("unavailable");
        $book->set_on_loan(true);
        $book->edit_item($book->get_all_vars());

        echo json_encode(array("res" => "($id_book) lent!"));
    } else {
        http_response_code(403);
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

        $del_reserv = Reservation::get_item($id, $urlReserv);
        if (gettype($del_reserv) === "array") {
            http_response_code(404);
            echo json_encode($del_reserv);
            exit();
        }

        if ($del_reserv->get_id() == $id && $del_reserv->get_user_name() == $user_name) {
            $del_reserv->delete_item();
            $retrieve = Book::get_item($id, $urlBook);

            //Double check, just to make sure that the book exist
            if (gettype($retrieve) === "array") {
                http_response_code(404);
                echo json_encode($retrieve);
                exit();
            }

            $retrieve->set_status("available");
            $retrieve->set_on_loan(false);
            $retrieve->edit_item($retrieve->get_all_vars());

            http_response_code(202);
            echo json_encode(array("res" => "Returned it"));
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
