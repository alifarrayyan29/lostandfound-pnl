<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Claim extends Model
{
    protected $fillable = [
        'item_report_id', 'claimant_id', 'proof_description', 
        'proof_photo_path', 'status', 'reviewed_by', 'reviewed_at'
    ];

    public function itemReport()
    {
        return $this->belongsTo(ItemReport::class);
    }

    public function claimant()
    {
        return $this->belongsTo(User::class, 'claimant_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
