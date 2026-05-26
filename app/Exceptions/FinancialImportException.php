<?php

namespace App\Exceptions;

use Exception;

class FinancialImportException extends Exception
{
    protected $importOriginalFileName;
    protected $errorFileName;

    public function __construct($message, $importOriginalFileName = null, $errorFileName = null, $code = 0, Exception $previous = null)
    {
        $this->message = $message;
        $this->importOriginalFileName = $importOriginalFileName;
        $this->errorFileName = $errorFileName;
    }

    public function getImportOriginalFileName()
    {
        return $this->importOriginalFileName;
    }

    public function getErrorFileName()
    {
        return $this->errorFileName;
    }
}