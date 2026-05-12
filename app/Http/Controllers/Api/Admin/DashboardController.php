<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Respondent;
use App\Models\QuestionSection;
use App\Models\ScoredAnswer;
use App\Models\RiskIndicator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalRespondents = Respondent::count();
        $sections = QuestionSection::all();
        
        $perPhase = [];
        foreach ($sections as $section) {
            $perPhase[$section->key] = Respondent::whereHas('scoredAnswers', function ($q) use ($section) {
                $q->where('section_id', $section->id);
            })->count();
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

        $cells = ScoredAnswer::where('section_id', $section->id)
            ->select('probability_score as probability', 'impact_score as impact', DB::raw('count(*) as count'))
            ->groupBy('probability_score', 'impact_score')
            ->get();

        $data = $cells->map(function ($cell) {
            return [
                'probability' => $cell->probability,
                'impact' => $cell->impact,
                'count' => $cell->count,
                'score' => $cell->probability * $cell->impact,
            ];
        });

        return response()->json($data);
    }

    public function averageScores(string $phase): JsonResponse
    {
        $section = QuestionSection::where('key', $phase)->first();
        if (!$section) {
            return response()->json(['message' => 'Phase not found'], 404);
        }

        $indicators = RiskIndicator::with('aspect')->get();
        $data = [];

        foreach ($indicators as $indicator) {
            $stats = ScoredAnswer::where('section_id', $section->id)
                ->where('indicator_id', $indicator->id)
                ->select(
                    DB::raw('AVG(probability_score) as avg_prob'),
                    DB::raw('AVG(impact_score) as avg_impact')
                )->first();

            $avgProb = (float)($stats->avg_prob ?? 0);
            $avgImpact = (float)($stats->avg_impact ?? 0);

            $data[] = [
                'id' => $indicator->id,
                'aspect' => $indicator->aspect->name,
                'indicator' => $indicator->indicator_text,
                'avgProbability' => round($avgProb, 2),
                'avgImpact' => round($avgImpact, 2),
                'avgScore' => round($avgProb * $avgImpact, 2),
            ];
        }

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
}
