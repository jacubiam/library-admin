<?php
include_once "../services/adapter.php";
class Reservation extends Adapter implements JsonSerializable
{
    private $user_name;

    public function __construct($id, $user_name)
    {
        $this->url = "../db/reservations.csv";
        $this->id  = $id;
        $this->user_name = $user_name;
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

    public function get_id()
    {
        return $this->id;
    }

    public function get_user_name()
    {
        return $this->user_name;
    }
}
