<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CampusController extends Controller
{
    public function health(): JsonResponse
    {
        return response()->json([
            'ok' => true,
            'service' => 'Campus Care API',
            'time' => now()->toDateTimeString(),
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'role' => ['nullable', 'in:student,technician,admin'],
        ]);

        $user = User::query()
            ->where('email', $data['email'])
            ->first();

        if (! $user || $user->password !== $data['password']) {
            return response()->json([
                'message' => 'Email atau kata sandi salah.',
            ], 422);
        }

        if (! empty($data['role']) && $user->role !== $data['role']) {
            return response()->json([
                'message' => 'Role tidak cocok dengan akun.',
            ], 422);
        }

        $token = $this->tokenForUser($user);

        return response()->json([
            'message' => 'Login berhasil.',
            'user' => $this->userPayload($user),
            'token' => $token,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $this->userFromRequest($request);

        if (! $user) {
            return response()->json([
                'message' => 'Belum login.',
            ], 401);
        }

        return response()->json([
            'user' => $this->userPayload($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }

    public function dashboard(Request $request, string $role): JsonResponse
    {
        $reports = $this->reportQuery()->get();
        $stats = [
            'pending' => $reports->where('status', 'Pending')->count(),
            'verified' => $reports->where('status', 'Verified')->count(),
            'assigned' => $reports->where('status', 'Assigned')->count(),
            'repairing' => $reports->where('status', 'Repairing')->count(),
            'completed' => $reports->where('status', 'Completed')->count(),
            'total' => $reports->count(),
        ];

        return response()->json([
            'role' => $role,
            'stats' => $stats,
            'recent_reports' => $reports->take(5)->values(),
            'notifications' => $this->notificationsData($role),
        ]);
    }

    public function reports(Request $request): JsonResponse
    {
        if ($request->isMethod('post')) {
            return $this->storeReport($request);
        }

        $query = $this->reportQuery();

        if ($search = $request->string('q')->trim()->toString()) {
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($status = $request->string('status')->trim()->toString()) {
            $query->where('status', $status);
        }

        return response()->json([
            'data' => $query->orderByDesc('reported_at')->get(),
        ]);
    }

    public function report(Request $request, string $code): JsonResponse
    {
        $report = Report::query()->where('code', $code)->first();

        if (! $report) {
            return response()->json([
                'message' => 'Laporan tidak ditemukan.',
            ], 404);
        }

        if ($request->isMethod('patch') || $request->isMethod('put')) {
            $data = $request->validate([
                'title' => ['nullable', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
                'location' => ['nullable', 'string', 'max:255'],
                'category' => ['nullable', 'string', 'max:255'],
                'status' => ['nullable', 'in:Pending,Verified,Assigned,Repairing,Completed,Cancelled'],
                'technician_name' => ['nullable', 'string', 'max:255'],
                'facility_name' => ['nullable', 'string', 'max:255'],
                'image_url' => ['nullable', 'string'],
            ]);

            $report->fill($data);

            if (($data['status'] ?? null) === 'Completed' && ! $report->resolved_at) {
                $report->resolved_at = now();
            }

            $report->save();
        }

        return response()->json([
            'data' => $this->reportDetail($report),
        ]);
    }

    public function technicians(): JsonResponse
    {
        return response()->json([
            'data' => $this->technicianData(),
        ]);
    }

    public function facilities(): JsonResponse
    {
        return response()->json([
            'data' => $this->facilityData(),
        ]);
    }

    public function notifications(Request $request): JsonResponse
    {
        $role = $request->string('role')->toString() ?: 'student';

        return response()->json([
            'data' => $this->notificationsData($role),
        ]);
    }

    public function analytics(): JsonResponse
    {
        $reports = $this->reportQuery()->get();

        return response()->json([
            'overview' => [
                'total_reports' => $reports->count(),
                'completion_rate' => $reports->count() > 0
                    ? round(($reports->where('status', 'Completed')->count() / $reports->count()) * 100, 1)
                    : 0,
                'active_technicians' => collect($this->technicianData())->whereIn('status', ['Active', 'On Duty'])->count(),
                'facilities_needing_attention' => collect($this->facilityData())->whereIn('status', ['Warning', 'Critical'])->count(),
            ],
            'by_status' => [
                'Pending' => $reports->where('status', 'Pending')->count(),
                'Verified' => $reports->where('status', 'Verified')->count(),
                'Assigned' => $reports->where('status', 'Assigned')->count(),
                'Repairing' => $reports->where('status', 'Repairing')->count(),
                'Completed' => $reports->where('status', 'Completed')->count(),
            ],
            'by_category' => $reports->groupBy('category')->map->count()->sortDesc()->values(),
            'recent_trend' => $reports
                ->sortBy('reported_at')
                ->values()
                ->map(fn (Report $report) => [
                    'date' => optional($report->reported_at)->format('d M'),
                    'count' => 1,
                ]),
        ]);
    }

    public function settings(): JsonResponse
    {
        return response()->json([
            'data' => [
                'app_name' => 'Campus Care',
                'notification_email' => 'support@campus-care.test',
                'auto_assign' => true,
                'maintenance_mode' => false,
            ],
        ]);
    }

    private function storeReport(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'image_url' => ['nullable', 'string'],
            'reporter_name' => ['nullable', 'string', 'max:255'],
            'reporter_email' => ['nullable', 'email'],
        ]);

        $report = Report::create([
            ...$data,
            'code' => $this->nextReportCode(),
            'status' => 'Pending',
            'reporter_name' => $data['reporter_name'] ?? 'Anonim',
            'reporter_email' => $data['reporter_email'] ?? null,
            'reported_at' => now(),
        ]);

        return response()->json([
            'message' => 'Laporan berhasil dibuat.',
            'data' => $this->reportDetail($report),
        ], 201);
    }

    private function currentUser(Request $request): ?User
    {
        $token = $this->extractToken($request);

        if (! $token) {
            return null;
        }

        return $this->userFromToken($token);
    }

    private function userFromRequest(Request $request): ?User
    {
        return $this->currentUser($request);
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ];
    }

    private function reportQuery()
    {
        return Report::query()->orderByDesc('reported_at')->orderByDesc('id');
    }

    private function reportDetail(Report $report): array
    {
        return [
            ...$report->toArray(),
            'timeline' => $this->timelineData($report->status),
            'comments' => $this->commentData($report->code),
        ];
    }

    private function nextReportCode(): string
    {
        $lastNumber = Report::query()
            ->pluck('code')
            ->map(function (string $code): int {
                return (int) Str::after($code, 'REP-');
            })
            ->sortDesc()
            ->first() ?? 0;

        $nextNumber = max($lastNumber + 1, Report::query()->count() + 1);

        return sprintf('REP-%03d', $nextNumber);
    }

    private function timelineData(string $status): array
    {
        $steps = [
            ['status' => 'Submitted', 'label' => 'Laporan Terkirim', 'date' => '8 Juni, 09:00'],
            ['status' => 'Verified', 'label' => 'Laporan Terverifikasi', 'date' => '8 Juni, 10:30'],
            ['status' => 'Assigned', 'label' => 'Teknisi Ditugaskan', 'date' => '8 Juni, 11:15'],
            ['status' => 'Repairing', 'label' => 'Sedang Diperbaiki', 'date' => '8 Juni, 13:00'],
            ['status' => 'Completed', 'label' => 'Selesai', 'date' => '-'],
        ];

        $statusOrder = ['Submitted', 'Verified', 'Assigned', 'Repairing', 'Completed'];
        $currentIndex = array_search($status, $statusOrder, true);
        $currentIndex = $currentIndex === false ? 0 : $currentIndex;

        $timeline = [];

        foreach ($steps as $index => $step) {
            $timeline[] = [
                ...$step,
                'active' => $index <= $currentIndex,
                'done' => $index < $currentIndex,
            ];
        }

        return $timeline;
    }

    private function commentData(string $code): array
    {
        return [
            [
                'author' => 'Ahmad Subarjo',
                'role' => 'technician',
                'message' => "Saya sedang menuju lokasi untuk pengecekan laporan {$code}.",
                'time' => '13:15',
            ],
            [
                'author' => 'Anda',
                'role' => 'reporter',
                'message' => 'Siap pak, saya masih di sekitar gedung A.',
                'time' => '13:20',
            ],
        ];
    }

    private function technicianData(): array
    {
        return [
            ['id' => 1, 'name' => 'Ahmad Subarjo', 'specialty' => 'Kelistrikan', 'status' => 'Active', 'rating' => 4.8, 'tasks' => 5],
            ['id' => 2, 'name' => 'Siti Aminah', 'specialty' => 'Pendingin Ruangan', 'status' => 'On Duty', 'rating' => 4.9, 'tasks' => 2],
            ['id' => 3, 'name' => 'Bambang Pamungkas', 'specialty' => 'IT & Jaringan', 'status' => 'Active', 'rating' => 4.7, 'tasks' => 8],
            ['id' => 4, 'name' => 'Rina Wijaya', 'specialty' => 'Fasilitas Umum', 'status' => 'Away', 'rating' => 4.6, 'tasks' => 0],
        ];
    }

    private function facilityData(): array
    {
        return [
            ['id' => 1, 'name' => 'Gedung A (Rektorat)', 'type' => 'Administrasi', 'rooms' => 45, 'status' => 'Good', 'maintenance' => '12 Mei 2026'],
            ['id' => 2, 'name' => 'Gedung B (Teknik)', 'type' => 'Akademik', 'rooms' => 32, 'status' => 'Warning', 'maintenance' => '8 Juni 2026'],
            ['id' => 3, 'name' => 'Gedung C (Sains)', 'type' => 'Laboratorium', 'rooms' => 28, 'status' => 'Good', 'maintenance' => '1 Juni 2026'],
            ['id' => 4, 'name' => 'Gedung D (Ekonomi)', 'type' => 'Akademik', 'rooms' => 40, 'status' => 'Critical', 'maintenance' => '5 Juni 2026'],
            ['id' => 5, 'name' => 'Perpustakaan Pusat', 'type' => 'Publik', 'rooms' => 12, 'status' => 'Good', 'maintenance' => '20 Mei 2026'],
            ['id' => 6, 'name' => 'Auditorium Utama', 'type' => 'Publik', 'rooms' => 4, 'status' => 'Good', 'maintenance' => '15 Mei 2026'],
        ];
    }

    private function notificationsData(string $role): array
    {
        $base = [
            ['id' => 1, 'title' => 'Laporan diverifikasi', 'body' => 'Laporan AC Tidak Dingin sudah diverifikasi.', 'read' => false, 'time' => '5 menit lalu'],
            ['id' => 2, 'title' => 'Teknisi ditugaskan', 'body' => 'Ahmad Subarjo ditugaskan ke laporan REP-001.', 'read' => true, 'time' => '1 jam lalu'],
            ['id' => 3, 'title' => 'Update selesai', 'body' => 'Beberapa fasilitas mendapat pembaruan status.', 'read' => true, 'time' => 'Kemarin'],
        ];

        if ($role === 'technician') {
            $base[0]['body'] = 'Ada tugas baru untuk teknisi.';
        }

        if ($role === 'admin') {
            $base[] = [
                'id' => 4,
                'title' => 'Laporan mingguan siap',
                'body' => 'Ringkasan analitik mingguan sudah tersedia.',
                'read' => false,
                'time' => 'Kemarin',
            ];
        }

        return $base;
    }

    private function tokenForUser(User $user): string
    {
        return base64_encode(implode('|', [$user->id, $user->email, $user->role]));
    }

    private function extractToken(Request $request): ?string
    {
        $token = $request->bearerToken()
            ?: $request->header('X-Auth-Token')
            ?: $request->query('token');

        return is_string($token) && $token !== '' ? $token : null;
    }

    private function userFromToken(string $token): ?User
    {
        $decoded = base64_decode($token, true);

        if (! $decoded) {
            return null;
        }

        [$id] = array_pad(explode('|', $decoded), 3, null);

        if (! $id) {
            return null;
        }

        return User::query()->find((int) $id);
    }
}
