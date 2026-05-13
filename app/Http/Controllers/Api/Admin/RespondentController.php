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

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'institution' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'age_group' => 'nullable|string',
            'education' => 'nullable|string',
            'stakeholder_position' => 'nullable|string',
            'position_other' => 'nullable|string',
            'construction_experience' => 'nullable|string',
            'db_experience' => 'nullable|string',
            'most_involved_phase' => 'nullable|string',
            'sector' => 'nullable|string',
        ]);

        $respondent = Respondent::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Responden berhasil ditambahkan.',
            'data' => $respondent
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $respondent = Respondent::with(['scoredAnswers.section', 'scoredAnswers.indicator', 'openAnswers.openQuestion'])->find($id);

        if (!$respondent) {
            return response()->json(['message' => 'Responden tidak ditemukan'], 404);
        }

        return response()->json($respondent);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $respondent = Respondent::find($id);

        if (!$respondent) {
            return response()->json(['message' => 'Responden tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'institution' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|max:255',
        ]);

        $respondent->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data responden berhasil diperbarui.',
            'data' => $respondent
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $respondent = Respondent::find($id);

        if (!$respondent) {
            return response()->json(['message' => 'Responden tidak ditemukan'], 404);
        }

        $respondent->delete();

        return response()->json([
            'success' => true,
            'message' => 'Responden berhasil dihapus.'
        ]);
    }
}
