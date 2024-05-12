<?php
function validator($data, $context)
{
    $result = array("status" => true, "message" => "none");
    $model_keys = [];

    foreach ($data as $key => $value) {
        if (empty($value)) {
            $result['status'] = false;
            $result['message'] = "Empty or field with zero found ($key)";
            return $result;
        }
    }

    if ($context === "create") {
        if (count($data) !== 6) {
            $result['status'] = false;
            $result['message'] = "Unexpected amount of fields, sent " . count($data) . ", expected (6).";
            return $result;
        }

        //Match excpected keys to submitted data
        $model_keys = ["title", "author", "pages", "genre", "year", "status"];
    }

    if ($context === "edit") {
        if (count($data) !== 7) {
            $result['status'] = false;
            $result['message'] = "Unexpected amount of fields, sent " . count($data) . ", expected (7).";
            return $result;
        }

        //Match excpected keys to submitted data
        $model_keys = ["id", "title", "author", "pages", "genre", "year", "status"];
    }
    
    if ($context === "loan") {
        if (count($data) !== 2) {
            $result['status'] = false;
            $result['message'] = "Unexpected amount of fields, sent " . count($data) . ", expected (2).";
            return $result;
        }

        //Match excpected keys to submitted data
        $model_keys = ["id", "user_name"];
    }

    $data_keys = array_keys($data);
    $diff_keys = array_diff($data_keys, $model_keys);

    if (count($diff_keys) !== 0) {
        $result['status'] = false;
        $result['message'] = "Unexpected field: " . reset($diff_keys);
        return $result;
    }

    foreach ($data as $key => $value) {
        if ($key === "id") {
            if (!preg_match("/^(\d)+$/", $value)) {
                $result['status'] = false;
                $result['message'] = "$key only allows integers";
                return $result;
            }
        }

        if ($key === "title") {
            if (!preg_match("/^(\w'?\.?\s?)+$/", $value)) {
                $result['status'] = false;
                $result['message'] = "$key only allows alphanumeric chars";
                return $result;
            }
        }

        if ($key === "author") {
            if (!preg_match("/^([a-zA-Z]'?\.?\s?)+$/", $value)) {
                $result['status'] = false;
                $result['message'] = "$key only allows alphabetical chars";
                return $result;
            }
        }

        if ($key === "pages") {
            if (!preg_match("/^\d+$/", $value) || $value <= 0) {
                $result['status'] = false;
                $result['message'] = "$key only allows positive integers";
                return $result;
            }
        }

        if ($key === "genre") {
            if (!preg_match("/^([a-zA-Z]\s?)+$/", $value)) {
                $result['status'] = false;
                $result['message'] = "$key only allows alphabetical chars";
                return $result;
            }
        }

        if ($key === "year") {
            if (!preg_match("/^\-?\d+$/", $value)) {
                $result['status'] = false;
                $result['message'] = "$key only allows numeric chars";
                return $result;
            }
        }

        if ($key === "status") {
            if (!preg_match("/^(available|unavailable)$/", $value)) {
                $result['status'] = false;
                $result['message'] = "$key only allows 'available' or 'unavailable'";
                return $result;
            }
        }

        if ($key === "user_name") {
            if (!preg_match("/^([a-zA-Z]'?\.?\s?)+$/", $value)) {
                $result['status'] = false;
                $result['message'] = "$key only allows alphabetical chars";
                return $result;
            }
        }
    }

    return $result;
}