<?php
include_once "../services/adapter.php";
class Book extends Adapter implements JsonSerializable
{
    private $title;
    private $author;
    private $pages;
    private $genre;
    private $year;
    private $status;

    public function __construct(...$args)
    {
        $this->url = "../db/books.csv";
        $fields = $args[0];
        if (!isset($fields['id'])) {
            $all_ids = array_column($this->get_all($this->url), 'id');
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

    public function jsonSerialize()
    {
        $data = get_object_vars($this);
        unset($data['url']);
        return $data;
    }

    public function create_item()
    {
        $url = $this->url;
        $data = $data = get_object_vars($this);
        unset($data['url']);
        $data = array_values($data);
        $handle = fopen($url, 'a');
        fputcsv($handle, $data);
        fclose($handle);
    }

    public function get_status(){
        return $this->status;
    }

    public function set_status($status){
        $this->status = $status;
        $data = get_object_vars($this);
        unset($data['url']);
        $this->edit_item($data);
    }
}
