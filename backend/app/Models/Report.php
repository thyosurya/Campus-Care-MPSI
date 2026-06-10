<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'code',
    'title',
    'description',
    'location',
    'category',
    'status',
    'image_url',
    'reporter_name',
    'reporter_email',
    'technician_name',
    'facility_name',
    'reported_at',
    'resolved_at',
])]
class Report extends Model
{
    protected function casts(): array
    {
        return [
            'reported_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }
}
