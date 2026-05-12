<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Aspect;

class AspectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aspects = [
            'Regulasi dan Kelembagaan',
            'Kualitas Persiapan dan Data Dasar Proyek',
            'Tender dan Kontrak',
            'Basic Design dan KAK',
            'Kompetensi',
            'Desain dan Teknologi',
            'Perubahan',
            'Finansial',
        ];

        foreach ($aspects as $index => $name) {
            Aspect::create([
                'name' => $name,
                'order' => $index + 1,
            ]);
        }
    }
}
