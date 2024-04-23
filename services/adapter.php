<?php

abstract class Adapter
{
    protected $url;
    protected $id;
    protected $title;

    public static function get_all($url)
    {
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

    public static function get_all_indexed($url)
    {
        $data = [];
        if (($handle = fopen($url, 'r')) !== false) {
            while (($row = fgetcsv($handle)) !== false) {
                $data[] = $row;
            }
            fclose($handle);
        }
        return $data;
    }

    public static function get_item($id, $url)
    {
        $data = self::get_all($url);
        $item_filtered = array_filter($data, function ($item) use ($id) {
            return ($item['id'] === $id);
        });

        $item_filtered = array_slice($item_filtered, 0);

        if (str_contains($url, "books")) {
            $item_object = new Book($item_filtered[0]);
            return $item_object;
        }

        if (str_contains($url, "reservations")) {
            $item = $item_filtered[0];
            $item_object = new Reservation($item['id'], $item['title'], $item['user_name']);
            return $item_object;
        }  
    }

    public function edit_item(...$args)
    {
        $url = $this->url;
        $update = $args[0];
        $id = $update['id'];
        $data = self::get_all_indexed($url);
        $item_filtered = array_filter($data, function ($item) use ($id) {
            return ($item[0] === $id);
        });
        $index = array_keys($item_filtered);

        $data[$index[0]] = $update;

        $handle = fopen($url, 'w');
        foreach ($data as $value) {
            fputcsv($handle, $value);
        }
        fclose($handle);
    }

    public function delete_item()
    {
        $url = $this->url;
        $id = $this->id;
        $data = self::get_all_indexed($url);
        $item_filtered = array_filter($data, function ($item) use ($id) {
            return ($item[0] === $id);
        });
        $index = array_keys($item_filtered);

        unset($data[$index[0]]);

        $handle = fopen($url, 'w');
        foreach ($data as $value) {
            fputcsv($handle, $value);
        }
        fclose($handle);
    }
}
