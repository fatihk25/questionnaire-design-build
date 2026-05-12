<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\QuestionSection;

class QuestionSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sections = [
            ['key' => 'inisiasi', 'name' => 'INITIATION (IDEA)', 'order' => 1],
            ['key' => 'perencanaan', 'name' => 'PLANNING', 'order' => 2],
            ['key' => 'perancangan', 'name' => 'DESIGN DEVELOPMENT', 'order' => 3],
            ['key' => 'pelaksanaan', 'name' => 'EXECUTION', 'order' => 4],
            ['key' => 'penggunaan', 'name' => 'O&M', 'order' => 5],
        ];

        foreach ($sections as $section) {
            QuestionSection::create($section);
        }
    }
}
