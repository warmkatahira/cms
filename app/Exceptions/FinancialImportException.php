<?php

namespace App\Exceptions;

use Exception;

class FinancialImportException extends Exception
{
    protected $import_original_file_name;
    protected $error_file_name;

    public function __construct($message, $import_original_file_name = null, $error_file_name = null, $code = 0, Exception $previous = null)
    {
        $this->message = $message;
        $this->import_original_file_name = $import_original_file_name;
        $this->error_file_name = $error_file_name;
    }

    public function getImportOriginalFileName()
    {
        return $this->import_original_file_name;
    }

    public function getErrorFileName()
    {
        return $this->error_file_name;
    }
}