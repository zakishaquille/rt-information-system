<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionCategoryRequest;
use App\Http\Requests\UpdateTransactionCategoryRequest;
use App\Models\TransactionCategory;

class TransactionCategoryController extends Controller
{
    public function index()
    {
        $categories = TransactionCategory::orderBy('type')->orderBy('name')->get();
        return response()->json(['data' => $categories]);
    }

    public function store(StoreTransactionCategoryRequest $request)
    {
        $category = TransactionCategory::create($request->validated());
        return response()->json(['data' => $category], 201);
    }

    public function show(TransactionCategory $transactionCategory)
    {
        return response()->json(['data' => $transactionCategory]);
    }

    public function update(UpdateTransactionCategoryRequest $request, TransactionCategory $transactionCategory)
    {
        $transactionCategory->update($request->validated());
        return response()->json(['data' => $transactionCategory]);
    }

    public function destroy(TransactionCategory $transactionCategory)
    {
        $transactionCategory->delete();
        return response()->json(null, 204);
    }
}
