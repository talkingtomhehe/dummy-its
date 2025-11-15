<?php
namespace App\Models\Interfaces;

/**
 * IUserRepository Interface
 *
 * Defines persistence operations required by the user service.
 * Using an interface keeps the service decoupled from storage details (DIP).
 */
interface IUserRepository {
    public function findByUsername(string $username): ?array;

    public function findById(int $userId): ?array;

    public function create(array $data): int;

    public function getAllStudents(): array;

    public function getAllInstructors(): array;
}
