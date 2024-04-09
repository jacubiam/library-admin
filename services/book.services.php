<?php
class Book implements JsonSerializable
{
    private $id;
    private $title;
    private $author;
    private $pages;
    private $genre;
    private $year;
    private $status;

    public function __construct(...$args)
    {
        $fields = $args[0];
        if (!isset($fields['id'])) {
            $all_ids = array_column($this->get_all(), 'id');
            $repeated = false;
            do {
                $id = random_int(1, 9999);
                foreach ($all_ids as $value) {
                    if ($id === (int) $value) {
                        $repeated = true;
                        break;
                    }
                    $repeated = false;
                }
            } while ($repeated === true);
            $fields = array("id" => $id) + $fields;
        }

        /* print_r($fields); */
        $this->id = $fields['id'];
        $this->title = $fields['title'];
        $this->author = $fields['author'];
        $this->pages = $fields['pages'];
        $this->genre = $fields['genre'];
        $this->year = $fields['year'];
        $this->status = $fields['status'];
    }
 
    public function jsonSerialize() {
        return get_object_vars($this);
    }
    public function create_book()
    {
        $url = "../db/books.csv";
        $data = [
            $this->id,
            $this->title,
            $this->author,
            $this->pages,
            $this->genre,
            $this->year,
            $this->status,
        ];
        $handle = fopen($url, 'a');
        fputcsv($handle, $data);
        fclose($handle);
    }
    
    public static function get_all()
    {
        $url = "../db/books.csv";
        $header = null;
        $data = [];
        if (($handle = fopen($url, 'r')) !== false) {
            while (($row = fgetcsv($handle)) !== false) {
                if ($header === null) {
                    $header = $row;
                } else {
                    $data[] = array_combine($header, $row);
                }
            }
            fclose($handle);
        }
        return $data;
    }

    public static function get_all_indexed()
    {
        $url = "../db/books.csv";
        $data = [];
        if (($handle = fopen($url, 'r')) !== false) {
            while (($row = fgetcsv($handle)) !== false) {
                $data[] = $row;
            }
            fclose($handle);
        }
        return $data;
    }

    public static function get_book($id)
    {
        $data = Book::get_all();
        $book_filtered = array_filter($data, function ($item) use ($id) {
            return ($item['id'] === $id);
        });

        $book_filtered = array_slice($book_filtered, 0);
        $book_object = new Book($book_filtered[0]);
        return $book_object;
    }

    public function edit_book(...$args){
        $url = "../db/books.csv";
        $update = $args[0];
        $id = $update['id'];
        $data = Book::get_all_indexed();
        $book_filtered = array_filter($data, function ($item) use ($id) {
            return ($item[0] === $id);
        });
        $index = array_keys($book_filtered);

        $data[$index[0]] = $update;

        $handle = fopen($url, 'w');
        foreach ($data as $value) {
            fputcsv($handle, $value);
        }
        fclose($handle);
    }

    public function delete_book($id)
    {
        $url = "../db/books.csv";
        $data = Book::get_all_indexed();
        $book_filtered = array_filter($data, function ($item) use ($id) {
            return ($item[0] === $id);
        });
        $index = array_keys($book_filtered);
        
        unset($data[$index[0]]);

        $handle = fopen($url, 'w');
        foreach ($data as $value) {
            fputcsv($handle, $value);
        }
        fclose($handle);
    }
}
