<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
// モデル
use App\Models\User;
use App\Models\Base;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'                       => $this->faker->unique()->userName(),
            'employee_no'                   => $this->faker->unique()->numberBetween(1000, 9999),
            'user_name'                     => $this->faker->name('ja_JP'),
            'password'                      => bcrypt('password'),
            'is_active'                     => true,
            'role_id'                       => 'user',
            'base_id'                       => Base::inRandomOrder()->value('base_id'),
            'is_password_change_required'   => false,
            'hire_date'                     => $this->faker->dateTimeBetween('2024-01-10', 'now')->format('Y-m-d'),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
