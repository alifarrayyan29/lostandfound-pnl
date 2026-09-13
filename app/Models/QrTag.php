<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QrTag extends Model
{
    use HasFactory;

    protected $fillable = ['item_report_id', 'code', 'status'];

    public function itemReport()
    {
        return $this->belongsTo(ItemReport::class);
    }
}
