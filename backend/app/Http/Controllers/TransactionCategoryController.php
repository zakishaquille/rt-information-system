<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionCategoryRequest;
use App\Http\Requests\UpdateTransactionCategoryRequest;
use App\Models\TransactionCategory;
use App\Http\Resources\TransactionCategoryResource;

class TransactionCategoryController extends Controller
{
    public function index()
    {
        $categories = TransactionCategory::orderBy('type')->orderBy('name')->get();
        return TransactionCategoryResource::collection($categories);
    }

    public function store(StoreTransactionCategoryRequest $request)
    {
        $category = TransactionCategory::create($request->validated());
        return new TransactionCategoryResource($category);
    }

    public function show(TransactionCategory $transactionCategory)
    {
        return new TransactionCategoryResource($transactionCategory);
    }

    public function update(UpdateTransactionCategoryRequest $request, TransactionCategory $transactionCategory)
    {
        $transactionCategory->update($request->validated());
        return new TransactionCategoryResource($transactionCategory);
    }

    public function destroy(TransactionCategory $transactionCategory)
    {
        if ($transactionCategory->transactions()->exists()) {
            return response()->json(['message' => 'Kategori ini tidak dapat dihapus karena sedang digunakan dalam transaksi.'], 400);
        }

        $transactionCategory->delete();
        return response()->json(null, 204);
    }
}
