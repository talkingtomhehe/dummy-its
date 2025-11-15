<?php
namespace App\Models\Interfaces;

/**
 * IContentRepository Interface
 * 
 * SOLID: Dependency Inversion Principle (DIP)
 * High-level modules depend on this abstraction, not concrete implementation
 */
interface IContentRepository extends IContentReader, IContentWriter {
    // Combines both read and write operations for full content management
}
