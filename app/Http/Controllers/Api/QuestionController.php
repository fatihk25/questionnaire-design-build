<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuestionSection;
use App\Models\Aspect;
use Illuminate\Http\JsonResponse;

class QuestionController extends Controller
{
    public function getByPhase(string $phase): JsonResponse
    {
        $section = QuestionSection::where('key', $phase)->first();

        if (!$section) {
            return response()->json(['message' => 'Phase not found'], 404);
        }

        $aspects = Aspect::with(['riskIndicators' => function ($query) {
            $query->orderBy('order');
        }])->orderBy('order')->get();

        $questions = [];
        foreach ($aspects as $aspect) {
            foreach ($aspect->riskIndicators as $indicator) {
                $questions[] = [
                    'id' => $indicator->id,
                    'phase' => $phase,
                    'aspect' => $aspect->name,
                    'indicator' => $indicator->indicator_text,
                    'order' => $indicator->order,
                ];
            }
        }

        return response()->json([
            'phase' => $phase,
            'questions' => $questions,
        ]);
    }

    public function getOpenQuestions(): JsonResponse
    {
        $questions = \App\Models\OpenQuestion::orderBy('order')->get();
        return response()->json($questions);
    }
}
