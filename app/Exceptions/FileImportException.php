<?php

namespace App\Exceptions;

use Exception;

class FileImportException extends Exception
{
    protected $import_employee_original_file_name;
    protected $import_paid_leave_original_file_name;
    protected $error_file_name;

    public function __construct($message, $import_employee_original_file_name = null, $import_paid_leave_original_file_name = null, $error_file_name = null, $code = 0, Exception $previous = null)
    {
        $this->message = $message;
        $this->import_employee_original_file_name = $import_employee_original_file_name;
        $this->import_paid_leave_original_file_name = $import_paid_leave_original_file_name;
        $this->error_file_name = $error_file_name;
    }

    public function getImportEmployeeOriginalFileName()
    {
        return $this->import_employee_original_file_name;
    }

    public function getImportPaidLeaveOriginalFileName()
    {
        return $this->import_paid_leave_original_file_name;
    }

    public function getErrorFileName()
    {
        return $this->error_file_name;
    }
}