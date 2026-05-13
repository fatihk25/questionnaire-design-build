<?php

namespace Tests\Feature;

use App\Models\Aspect;
use App\Models\OpenQuestion;
use App\Models\QuestionSection;
use App\Models\RiskIndicator;
use App\Models\Respondent;
use App\Models\ScoredAnswer;
use App\Models\OpenAnswer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class QuestionnaireApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed necessary data for testing
        $this->seedSections();
        $this->seedAspectsAndIndicators();
        $this->seedOpenQuestions();
    }

    private function seedSections()
    {
        QuestionSection::create(['key' => 'inisiasi', 'name' => 'INITIATION', 'order' => 1]);
        QuestionSection::create(['key' => 'perencanaan', 'name' => 'PLANNING', 'order' => 2]);
    }

    private function seedAspectsAndIndicators()
    {
        $aspect = Aspect::create(['name' => 'Regulasi', 'order' => 1]);
        for ($i = 1; $i <= 38; $i++) {
            RiskIndicator::create([
                'id' => $i,
                'aspect_id' => $aspect->id,
                'indicator_text' => "Indicator $i",
                'order' => $i
            ]);
        }
    }

    private function seedOpenQuestions()
    {
        for ($i = 1; $i <= 3; $i++) {
            OpenQuestion::create([
                'id' => $i,
                'question_text' => "Open Question $i",
                'order' => $i
            ]);
        }
    }

    /**
     * Test successful questionnaire submission with full data.
     */
    public function test_successful_questionnaire_submission()
    {
        $payload = [
            'identity' => [
                'nama' => 'Testing User',
                'perusahaan' => 'Test Corp',
                'telepon' => '0812345678',
                'email' => 'test@example.com',
                'kelompokUmur' => '25-34',
                'pendidikan' => 'S1',
                'posisiStakeholder' => 'Kontraktor',
                'pengalamanKonstruksi' => '5-10 tahun',
                'pengalamanProyekDB' => '1-5 proyek',
                'fasePalingTerlibat' => 'Pelaksanaan',
                'sektorProyek' => 'Swasta'
            ],
            'answers' => [
                'inisiasi' => [
                    '1' => ['probability' => 3, 'impact' => 4],
                    '2' => ['probability' => 5, 'impact' => 2],
                ],
                'perencanaan' => [
                    '1' => ['probability' => 1, 'impact' => 1],
                ]
            ],
            'openQuestions' => [
                '1' => 'Jawaban terbuka nomor satu',
                '2' => 'Jawaban terbuka nomor dua'
            ]
        ];

        $response = $this->postJson('/api/questionnaire/submit', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Jawaban berhasil disimpan. Terima kasih atas partisipasi Anda.'
            ]);

        // Verify Database
        $this->assertDatabaseHas('respondents', [
            'email' => 'test@example.com',
            'name' => 'Testing User'
        ]);

        $respondent = Respondent::where('email', 'test@example.com')->first();

        // Verify Scored Answers (3 indicators sent)
        $this->assertEquals(3, ScoredAnswer::where('respondent_id', $respondent->id)->count());
        $this->assertDatabaseHas('scored_answers', [
            'respondent_id' => $respondent->id,
            'indicator_id' => 1,
            'probability_score' => 3,
            'impact_score' => 4
        ]);

        // Verify Open Answers (2 answers sent)
        $this->assertEquals(2, OpenAnswer::where('respondent_id', $respondent->id)->count());
        $this->assertDatabaseHas('open_answers', [
            'respondent_id' => $respondent->id,
            'open_question_id' => 1,
            'answer_text' => 'Jawaban terbuka nomor satu'
        ]);
    }

    /**
     * Test validation: missing required identity fields.
     */
    public function test_submission_fails_if_identity_incomplete()
    {
        $payload = [
            'identity' => [
                'nama' => 'Incomplete User'
                // missing other required fields
            ],
            'answers' => [
                'inisiasi' => ['1' => ['probability' => 3, 'impact' => 3]]
            ]
        ];

        $response = $this->postJson('/api/questionnaire/submit', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['identity.perusahaan', 'identity.telepon', 'identity.email']);
    }

    /**
     * Test validation: scores must be between 0 and 5.
     */
    public function test_submission_fails_if_scores_out_of_range()
    {
        $payload = [
            'identity' => [
                'nama' => 'Invalid Score User',
                'perusahaan' => 'Test Corp',
                'telepon' => '0812345678',
                'email' => 'invalid@example.com'
            ],
            'answers' => [
                'inisiasi' => [
                    '1' => ['probability' => 6, 'impact' => 2] // 6 is out of range
                ]
            ]
        ];

        $response = $this->postJson('/api/questionnaire/submit', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['answers.inisiasi.1.probability']);
    }

    /**
     * Test rate limiting (fake cache implementation in controller).
     */
    public function test_submission_rate_limiting()
    {
        $payload = [
            'identity' => [
                'nama' => 'Spam User',
                'perusahaan' => 'Test Corp',
                'telepon' => '0812345678',
                'email' => 'spam@example.com'
            ],
            'answers' => [
                'inisiasi' => ['1' => ['probability' => 3, 'impact' => 3]]
            ],
            'openQuestions' => []
        ];

        // First attempt
        $this->postJson('/api/questionnaire/submit', $payload)->assertStatus(200);

        // Second immediate attempt from same email (cache key exists)
        $response = $this->postJson('/api/questionnaire/submit', $payload);

        $response->assertStatus(429)
            ->assertJson([
                'success' => false,
                'message' => 'Anda sudah mengirimkan jawaban. Harap tunggu sebentar.'
            ]);
    }

    /**
     * Test transaction rollback on failure.
     */
    public function test_rollback_if_indicator_id_invalid()
    {
        $payload = [
            'identity' => [
                'nama' => 'Rollback User',
                'perusahaan' => 'Test Corp',
                'telepon' => '0812345678',
                'email' => 'rollback@example.com'
            ],
            'answers' => [
                'inisiasi' => [
                    '999' => ['probability' => 3, 'impact' => 3] // Non-existent indicator
                ]
            ],
            'openQuestions' => []
        ];

        $response = $this->postJson('/api/questionnaire/submit', $payload);

        // The controller throws an exception when indicator not found if scoredCount stays 0
        $response->assertStatus(500);

        // Verify respondent was NOT created due to rollback
        $this->assertDatabaseMissing('respondents', ['email' => 'rollback@example.com']);
    }
}
