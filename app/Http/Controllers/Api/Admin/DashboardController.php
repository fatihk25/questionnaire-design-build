<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Respondent;
use App\Models\QuestionSection;
use App\Models\ScoredAnswer;
use App\Models\RiskIndicator;
use App\Models\OpenAnswer;
use App\Models\OpenQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalRespondents = Respondent::count();
        $sections = QuestionSection::all();
        
        $perPhaseCounts = ScoredAnswer::select('section_id', DB::raw('count(distinct respondent_id) as count'))
            ->groupBy('section_id')
            ->get()
            ->pluck('count', 'section_id');

        $perPhase = [];
        foreach ($sections as $section) {
            $perPhase[$section->key] = $perPhaseCounts->get($section->id, 0);
        }

        return response()->json([
            'totalRespondents' => $totalRespondents,
            'perPhase' => $perPhase,
        ]);
    }

    public function riskMatrix(string $phase): JsonResponse
    {
        $section = QuestionSection::where('key', $phase)->first();
        if (!$section) {
            return response()->json(['message' => 'Phase not found'], 404);
        }

        // Menghitung jumlah entri (penilaian) untuk setiap kombinasi Probabilitas dan Dampak
        // Data ini digunakan untuk melihat sebaran nilai 1-5 di dalam matriks 5x5
        $cells = ScoredAnswer::where('section_id', $section->id)
            ->select('probability_score as probability', 'impact_score as impact', DB::raw('count(*) as count'))
            ->groupBy('probability_score', 'impact_score')
            ->get();

        // Kita juga tambahkan info total responden unik yang berkontribusi di fase ini
        $respondentCount = ScoredAnswer::where('section_id', $section->id)
            ->distinct('respondent_id')
            ->count('respondent_id');

        return response()->json([
            'phase' => $phase,
            'totalPhaseRespondents' => $respondentCount,
            'matrix' => $cells->map(function ($cell) {
                return [
                    'probability' => $cell->probability,
                    'impact' => $cell->impact,
                    'count' => (int) $cell->count,
                    'score' => $cell->probability * $cell->impact,
                ];
            })
        ]);
    }

    public function averageScores(string $phase): JsonResponse
    {
        $section = QuestionSection::where('key', $phase)->first();
        if (!$section) {
            return response()->json(['message' => 'Phase not found'], 404);
        }

        $stats = ScoredAnswer::where('section_id', $section->id)
            ->select(
                'indicator_id',
                DB::raw('AVG(probability_score) as avg_prob'),
                DB::raw('AVG(impact_score) as avg_impact')
            )
            ->groupBy('indicator_id')
            ->get()
            ->keyBy('indicator_id');

        $indicators = RiskIndicator::with('aspect')->orderBy('order')->get();
        
        $data = $indicators->map(function ($indicator) use ($stats) {
            $indicatorStats = $stats->get($indicator->id);
            $avgProb = (float)($indicatorStats->avg_prob ?? 0);
            $avgImpact = (float)($indicatorStats->avg_impact ?? 0);

            return [
                'id' => $indicator->id,
                'aspect' => $indicator->aspect->name,
                'indicator' => $indicator->indicator_text,
                'avgProbability' => round($avgProb, 2),
                'avgImpact' => round($avgImpact, 2),
                'avgScore' => round($avgProb * $avgImpact, 2),
            ];
        });

        return response()->json($data);
    }

    public function resetPhaseData(string $phase): JsonResponse
    {
        $section = QuestionSection::where('key', $phase)->first();
        if (!$section) {
            return response()->json(['message' => 'Phase not found'], 404);
        }

        ScoredAnswer::where('section_id', $section->id)->delete();

        return response()->json(['success' => true]);
    }

    public function exportScoredAnswers(string $phase): JsonResponse
    {
        $section = QuestionSection::where('key', $phase)->first();
        if (!$section) {
            return response()->json(['message' => 'Phase not found'], 404);
        }

        // --- Sheet 1 Data: Master Responden ---
        $respondents = Respondent::whereHas('scoredAnswers', function ($q) use ($section) {
            $q->where('section_id', $section->id);
        })->get();

        $respondentSheet = $respondents->map(function ($r) {
            return [
                'ID Responden' => $r->id,
                'Nama' => $r->name,
                'Instansi' => $r->institution,
                'Telepon' => $r->phone,
                'Email' => $r->email,
                'Posisi' => $r->stakeholder_position,
                'Pendidikan' => $r->education,
                'Pengalaman Konstruksi' => $r->construction_experience,
                'Pengalaman Proyek DB' => $r->db_experience,
                'Sektor' => $r->sector,
                'Waktu Submit' => $r->created_at->format('Y-m-d H:i:s'),
            ];
        });

        // --- Sheet 2 Data: Detail Penilaian (Long Format) ---
        $scoredAnswers = ScoredAnswer::where('section_id', $section->id)
            ->with(['respondent', 'indicator.aspect'])
            ->get();

        $scoreSheet = $scoredAnswers->map(function ($ans) {
            return [
                'ID Responden' => $ans->respondent_id,
                'Nama Responden' => $ans->respondent->name,
                'Aspek' => $ans->indicator->aspect->name,
                'Indikator Risiko' => $ans->indicator->indicator_text,
                'Probabilitas (P)' => $ans->probability_score,
                'Dampak (I)' => $ans->impact_score,
                'Skor Risiko (P x I)' => $ans->probability_score * $ans->impact_score,
            ];
        });

        return response()->json([
            'respondents' => $respondentSheet,
            'scores' => $scoreSheet
        ]);
    }

    public function exportOpenAnswers(): JsonResponse
    {
        // --- Sheet 1 Data: Master Responden ---
        $respondents = Respondent::whereHas('openAnswers')->get();

        $respondentSheet = $respondents->map(function ($r) {
            return [
                'ID Responden' => $r->id,
                'Nama' => $r->name,
                'Instansi' => $r->institution,
                'Telepon' => $r->phone,
                'Email' => $r->email,
                'Waktu Submit' => $r->created_at->format('Y-m-d H:i:s'),
            ];
        });

        // --- Sheet 2 Data: Detail Jawaban Terbuka (Long Format) ---
        $openAnswers = OpenAnswer::with(['respondent', 'openQuestion'])
            ->get();

        $answerSheet = $openAnswers->map(function ($ans) {
            return [
                'ID Responden' => $ans->respondent_id,
                'Nama Responden' => $ans->respondent->name,
                'Pertanyaan Terbuka' => $ans->openQuestion->question_text,
                'Jawaban' => $ans->answer_text,
            ];
        });

        return response()->json([
            'respondents' => $respondentSheet,
            'answers' => $answerSheet
        ]);
    }

    public function getIndicatorsMapping(): JsonResponse
    {
        $indicators = RiskIndicator::with('aspect')->orderBy('order')->get();
        
        $mapping = $indicators->map(function ($indicator, $index) {
            return [
                'id' => $indicator->id,
                'label' => 'R' . ($index + 1),
                'text' => $indicator->indicator_text,
                'aspect' => $indicator->aspect->name
            ];
        });

        return response()->json($mapping);
    }
}
