<?php

namespace Database\Seeders;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'student@campus.test'],
            ['name' => 'Budi Santoso', 'role' => 'student', 'password' => 'password']
        );

        User::query()->updateOrCreate(
            ['email' => 'technician@campus.test'],
            ['name' => 'Ahmad Subarjo', 'role' => 'technician', 'password' => 'password']
        );

        User::query()->updateOrCreate(
            ['email' => 'admin@campus.test'],
            ['name' => 'Nina Wijaya', 'role' => 'admin', 'password' => 'password']
        );

        Report::query()->updateOrCreate(
            ['code' => 'REP-001'],
            [
                'title' => 'AC Tidak Dingin',
                'description' => 'AC di ruang 302 mengeluarkan bunyi keras dan tidak mengeluarkan udara dingin.',
                'location' => 'Gedung A, Ruang 302',
                'category' => 'Air Conditioner',
                'status' => 'Repairing',
                'image_url' => 'https://images.unsplash.com/photo-1718203862467-c33159fdc504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhaXIlMjBjb25kaXRpb25lciUyMHVuaXR8ZW58MXx8fHwxNzgwODkyMzg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
                'reporter_name' => 'Budi Santoso',
                'reporter_email' => 'student@campus.test',
                'technician_name' => 'Ahmad Subarjo',
                'facility_name' => 'Gedung A (Rektorat)',
                'reported_at' => now()->subDay(),
            ]
        );

        Report::query()->updateOrCreate(
            ['code' => 'REP-002'],
            [
                'title' => 'Proyektor Berkedip',
                'description' => 'Proyektor di Lab Komputer 1 berkedip saat dinyalakan.',
                'location' => 'Gedung B, Lab Komputer 1',
                'category' => 'Projector',
                'status' => 'Pending',
                'image_url' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWx0aW1lZGlhJTIwcHJvamVjdG9yJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc4MDg5MjM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
                'reporter_name' => 'Budi Santoso',
                'reporter_email' => 'student@campus.test',
                'facility_name' => 'Gedung B (Teknik)',
                'reported_at' => now()->subDays(2),
            ]
        );

        Report::query()->updateOrCreate(
            ['code' => 'REP-003'],
            [
                'title' => 'Kursi Patah',
                'description' => 'Beberapa kursi di ruang kuliah patah dan perlu diganti.',
                'location' => 'Gedung C, Ruang 204',
                'category' => 'Furniture',
                'status' => 'Completed',
                'image_url' => 'https://images.unsplash.com/photo-1770827693775-5458df828bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmclMjBjbGVhbiUyMG1vZGVybnxlbnwxfHx8fDE3ODA4OTIzODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
                'reporter_name' => 'Budi Santoso',
                'reporter_email' => 'student@campus.test',
                'technician_name' => 'Rina Wijaya',
                'facility_name' => 'Gedung C (Sains)',
                'reported_at' => now()->subDays(4),
                'resolved_at' => now()->subDays(1),
            ]
        );
    }
}
