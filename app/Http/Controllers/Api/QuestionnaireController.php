<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Respondent;
use App\Models\QuestionSection;
use App\Models\ScoredAnswer;
use App\Models\OpenAnswer;
use App\Models\OpenQuestion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class QuestionnaireController extends Controller
{
    public function submit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'identity' => 'required|array',
            'identity.nama' => 'required|string|max:255',
            'identity.perusahaan' => 'required|string|max:255',
            'identity.telepon' => 'required|string|max:20',
            'identity.email' => 'required|email|max:255',
            'answers' => 'required|array|min:1',
            'answers.*.*.probability' => 'required|integer|min:0|max:5',
            'answers.*.*.impact' => 'required|integer|min:0|max:5',
            'openQuestions' => 'present|array',
            'openQuestions.*' => 'nullable|string|max:1000',
        ], [
            'answers.min' => 'Anda harus mengisi setidaknya satu penilaian fase.',
            'answers.*.*.probability.min' => 'Skala probabilitas harus antara 0-5.',
            'answers.*.*.probability.max' => 'Skala probabilitas harus antara 0-5.',
            'answers.*.*.impact.min' => 'Skala dampak harus antara 0-5.',
            'answers.*.*.impact.max' => 'Skala dampak harus antara 0-5.',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $identity = $request->input('identity');
                
                $cacheKey = 'submission_' . md5($identity['email'] . $request->ip());
                if (cache()->has($cacheKey)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Anda sudah mengirimkan jawaban. Harap tunggu sebentar.',
                    ], 429);
                }
                cache()->put($cacheKey, true, 5);

                $respondent = Respondent::create([
                    'name' => $identity['nama'],
                    'institution' => $identity['perusahaan'],
                    'phone' => $identity['telepon'],
                    'email' => $identity['email'],
                    'age_group' => $identity['kelompokUmur'] ?? null,
                    'education' => $identity['pendidikan'] ?? null,
                    'stakeholder_position' => $identity['posisiStakeholder'] ?? null,
                    'position_other' => $identity['posisiLainnya'] ?? null,
                    'construction_experience' => $identity['pengalamanKonstruksi'] ?? null,
                    'db_experience' => $identity['pengalamanProyekDB'] ?? null,
                    'most_involved_phase' => $identity['fasePalingTerlibat'] ?? null,
                    'sector' => $identity['sektorProyek'] ?? null,
                ]);

                $answers = $request->input('answers');
                $scoredCount = 0;
                foreach ($answers as $phaseKey => $questions) {
                    $section = QuestionSection::where('key', $phaseKey)->first();
                    if (!$section) continue;

                    foreach ($questions as $indicatorId => $scores) {
                        if (!\App\Models\RiskIndicator::find($indicatorId)) continue;

                        ScoredAnswer::create([
                            'respondent_id' => $respondent->id,
                            'section_id' => $section->id,
                            'indicator_id' => $indicatorId,
                            'probability_score' => $scores['probability'],
                            'impact_score' => $scores['impact'],
                        ]);
                        $scoredCount++;
                    }
                }

                if ($scoredCount === 0) {
                    throw new \Exception('Data jawaban tidak valid atau indikator tidak ditemukan.');
                }

                $openQuestions = $request->input('openQuestions');
                foreach ($openQuestions as $questionId => $answerText) {
                    if (empty($answerText)) continue;
                    
                    if (!OpenQuestion::find($questionId)) continue;

                    OpenAnswer::create([
                        'respondent_id' => $respondent->id,
                        'open_question_id' => $questionId,
                        'answer_text' => $answerText,
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Jawaban berhasil disimpan. Terima kasih atas partisipasi Anda.',
                    'respondentId' => $respondent->id,
                ]);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
