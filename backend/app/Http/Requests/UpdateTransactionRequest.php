<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'transaction_category_id' => 'required|integer|exists:transaction_categories,id',
            'date' => 'sometimes|required|date',
            'amount' => 'required|numeric|min:0',
            'name' => 'required|string|max:255',
            'note' => 'nullable|string',
        ];
    }
}
