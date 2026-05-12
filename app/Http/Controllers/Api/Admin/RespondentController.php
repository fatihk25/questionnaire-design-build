<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Respondent;
use App\Models\QuestionSection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RespondentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $phaseKey = $request->query('phase');
        
        $query = Respondent::query();

        if ($phaseKey) {
            $section = QuestionSection::where('key', $phaseKey)->first();
            if ($section) {
                $query->whereHas('scoredAnswers', function ($q) use ($section) {
                    $q->where('section_id', $section->id);
                });
            }
        }

        $respondents = $query->orderBy('created_at', 'desc')->get();

        $data = $respondents->map(function ($r) {
            return [
                'id' => $r->id,
                'nama' => $r->name,
                'instansi' => $r->institution,
                'posisi' => $r->stakeholder_position,
                'pendidikan' => $r->education,
                'pengalaman' => $r->db_experience,
                'sektor' => $r->sector,
                'createdAt' => $r->created_at->toIso8601String(),
            ];
        });

        return response()->json($data);
    }
}
