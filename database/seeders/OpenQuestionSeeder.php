<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\OpenQuestion;

class OpenQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            'Apa risiko paling signifikan yang Anda temui dalam proyek Design and Build?',
            'Apa saran Anda untuk mitigasi risiko tersebut?',
            'Apakah ada risiko lain yang belum tercakup dalam kuesioner ini?',
        ];

        foreach ($questions as $index => $text) {
            OpenQuestion::create([
                'question_text' => $text,
                'order' => $index + 1,
            ]);
        }
    }
}
