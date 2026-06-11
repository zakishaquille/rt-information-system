<?php

namespace App\Http\Controllers;

use App\Services\PublicReportService;
use Illuminate\Http\Request;

class PublicReportController extends Controller
{
    public function __construct(private PublicReportService $reportService)
    {
    }

    public function index()
    {
        return response()->json([
            'data' => $this->reportService->getSummary(),
        ]);
    }

    public function breakdown(Request $request)
    {
        $month = $request->query('month', now()->format('Y-m'));
        
        return response()->json([
            'data' => $this->reportService->getMonthBreakdown($month),
        ]);
    }
}
