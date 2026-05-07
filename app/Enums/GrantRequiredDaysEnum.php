<?php

namespace App\Enums;

enum GrantRequiredDaysEnum
{
    case JANUARY;
    case FEBRUARY;
    case MARCH;
    case APRIL;
    case MAY;
    case JUNE;
    case JULY;
    case AUGUST;
    case SEPTEMBER;
    case OCTOBER;
    case NOVEMBER;
    case DECEMBER;

    public function days(): int
    {
        return match($this) {
            self::JANUARY, self::FEBRUARY               => 9,
            self::MARCH, self::APRIL                    => 8,
            self::MAY, self::JUNE, self::JULY           => 7,
            self::AUGUST, self::SEPTEMBER               => 6,
            self::OCTOBER                               => 0,
            self::NOVEMBER, self::DECEMBER              => 10,
        };
    }

    public static function fromMonth(int $month): self
    {
        return match($month) {
            1  => self::JANUARY,
            2  => self::FEBRUARY,
            3  => self::MARCH,
            4  => self::APRIL,
            5  => self::MAY,
            6  => self::JUNE,
            7  => self::JULY,
            8  => self::AUGUST,
            9  => self::SEPTEMBER,
            10 => self::OCTOBER,
            11 => self::NOVEMBER,
            12 => self::DECEMBER,
        };
    }
}