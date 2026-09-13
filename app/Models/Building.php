<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    protected $fillable = ['name', 'description', 'latitude', 'longitude'];

    public function itemReports()
    {
        return $this->hasMany(ItemReport::class);
    }
}
