<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemReport extends Model
{
    protected $fillable = [
        'user_id', 'category_id', 'building_id', 'type', 'title', 
        'description', 'photo_path', 'latitude', 'longitude', 'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function building()
    {
        return $this->belongsTo(Building::class);
    }

    public function claims()
    {
        return $this->hasMany(Claim::class);
    }
}
