<?php
spl_autoload_register(function ($class_name) {
    include "../services/" . strtolower($class_name) . '.services.php';
});

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    if (isset($_GET['query'])) {
        if ($_GET['query'] === "get_all") {
            $books = Book::get_all();
            sort($books);
            header('Content-type: application/json');
            echo json_encode($books);
        }

        if ($_GET['query'] === "get_book") {
            $get_book = Book::get_book($_GET['id']);
            header('Content-type: application/json');
            echo json_encode($get_book);
        }

        if (isset($_GET['search'])) {
            $books = Book::get_all();
            $search = $_GET['search'];
            $books_filtered = array_filter($books, function ($book) use ($search) {
                return (strtolower($book[$_GET['query']]) === strtolower($search));
            });
            $books_filtered = array_slice($books_filtered, 0);
            sort($books_filtered);
            if (count($books_filtered) !== 0) {
                header('Content-type: application/json');
                echo json_encode($books_filtered);
            } else {
                header('Content-type: application/json');
                http_response_code(404);
                echo json_encode(array("res" => "$search not found"));
            }
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $raw_data = file_get_contents('php://input');
    $post_data = json_decode($raw_data, true);

    $new_book = new Book($post_data);
    $new_book->create_book();

    header('Content-type: application/json');
    echo json_encode($post_data);
}

if ($_SERVER['REQUEST_METHOD'] === "PUT") {
    $raw_data = file_get_contents('php://input');
    $put_data = json_decode($raw_data, true);

    $get_book = Book::get_book($put_data['id']);
    $get_book->edit_book($put_data);
    header('Content-type: application/json');
    echo json_encode($put_data);
}

if ($_SERVER['REQUEST_METHOD'] === "DELETE") {
    $param = str_contains($_SERVER['REQUEST_URI'], '?id=');
    if ($param) {
        $url = explode('?id=', $_SERVER['REQUEST_URI']);
        $id = end($url);

        $del_book = Book::get_book($id);
        $del_book->delete_book($id);
        http_response_code(204);
    } else {
        http_response_code(400);
        header('Content-type: application/json');
        echo json_encode(array("res" => "Bad Request"));
    }
}
