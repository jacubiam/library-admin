<?php
spl_autoload_register(function ($class_name) {
    include "../services/" . strtolower($class_name) . '.services.php';
});
include_once "../services/utils.php";

$url = "../db/books.csv";
$urlReserv = "../db/reservations.csv";

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    header('Content-type: application/json');
    if (isset($_GET['query'])) {
        if ($_GET['query'] === "get_all") {
            $books = Book::get_all($url);
            sort($books);
            echo json_encode($books);
            exit();
        }

        if ($_GET['query'] === "get_book") {
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(array("res" => "Id param not found"));
                exit();
            }
            $get_book = Book::get_item($_GET['id'], $url);
            if (gettype($get_book) === "array") {
                http_response_code(404);
            }
            echo json_encode($get_book);
            exit();
        }

        //Keys used for searching
        $keys = ["title", "author", "genre", "year"];
        if (!(array_search(strtolower($_GET['query']), $keys) === false)) {
            if (isset($_GET['search'])) {
                $books = Book::get_all($url);
                $search = $_GET['search']; 
                $books_filtered = array_filter($books, function ($book) use ($search) {
                    return (strtolower($book[$_GET['query']]) === strtolower($search));
                });
                $books_filtered = array_slice($books_filtered, 0);
                sort($books_filtered);
    
                if (count($books_filtered) !== 0) {
                    echo json_encode($books_filtered);
                    exit();
                } else {
                    http_response_code(404);
                    echo json_encode(array("res" => "$search not found"));
                    exit();
                }
            } else {
                http_response_code(400);
                echo json_encode(array("res" => "Search parameter not found"));
                exit();
            }
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

    $verifier = validator($post_data, "create");
    if (!$verifier['status']) {
        http_response_code(400);
        echo json_encode(array("res" => $verifier['message']));
        exit();
    }

    $new_book = new Book($post_data);
    $new_book->create_item();

    echo json_encode($new_book);
}

if ($_SERVER['REQUEST_METHOD'] === "PUT") {
    header('Content-type: application/json');
    $raw_data = file_get_contents('php://input');
    $put_data = json_decode($raw_data, true);

    //If a json is not passed:
    if ($put_data === null) {
        http_response_code(400);
        echo json_encode(array("res" => "JSON Expected"));
        exit();
    }

    $verifier = validator($put_data, "edit");
    if (!$verifier['status']) {
        http_response_code(400);
        echo json_encode(array("res" => $verifier['message']));
        exit();
    }

    $get_book = Book::get_item($put_data['id'], $url);
    if (gettype($get_book) === "array") {
        http_response_code(404);
        echo json_encode($get_book);
        exit();
    }

    $get_reserv = Reservation::get_item($put_data['id'], $urlReserv);
    if (!(gettype($get_reserv) === "array")) {
        http_response_code(403);
        echo json_encode(array("res" => "A Borrowed book cannot be edited"));
        exit();
    }

    $get_book->edit_item($put_data);
    echo json_encode($get_book);
}

if ($_SERVER['REQUEST_METHOD'] === "DELETE") {
    $param = str_contains($_SERVER['REQUEST_URI'], '?id=');
    if ($param) {
        $uri = explode('?id=', $_SERVER['REQUEST_URI']);
        $id = end($uri);

        $del_book = Book::get_item($id, $url);
        if (gettype($del_book) === "array") {
            header('Content-type: application/json');
            http_response_code(404);
            echo json_encode($del_book);
            exit();
        }

        $get_reserv = Reservation::get_item($id, $urlReserv);
        if (!(gettype($get_reserv) === "array")) {
            header('Content-type: application/json');
            http_response_code(403);
            echo json_encode(array("res" => "A Borrowed book cannot be deleted"));
            exit();
        }

        $del_book->delete_item();
        http_response_code(204);
    } else {
        http_response_code(400);
        header('Content-type: application/json');
        echo json_encode(array("res" => "Bad Request"));
    }
}
